import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_POLICY,configuredPolicy,validatePolicy,scenario,evidence,assess,plan,recordCheck,eligibility,packet,reviewSummary,taskIssue,type State,type Metric} from '../src/domain.ts';
import {validState,readReview,STORE} from '../src/storage.ts';
import {reference,comparator} from '../scripts/evaluation.ts';
const now='2026-11-15T12:00:00.000Z';
const fixed=():State=>{const s=scenario('fresh');s.now=now;s.observations.forEach(o=>o.recordedAt=now);return s;};
const task=()=>({device:'workstation' as const,durationSeconds:180,responseMs:Array(23).fill(300),premature:0,missed:16,completedAt:now});
test('freshness accepts exact cutoffs, rejects adjacent expired records and preserves unit/method/quality gates',()=>{
 for(const hours of [0.5,1,2]){const p=configuredPolicy({version:'boundary-'+hours,freshnessHours:{sleep:hours,fatigue:hours,context:hours,vigilance:hours}});
 for(const o of fixed().observations){for(const delta of [-1,0,1]){const candidate={...o,recordedAt:new Date(Date.parse(now)-hours*3600000-delta).toISOString()};assert.equal(assess(candidate,now,p).accepted,delta<=0);}
 for(const bad of [{recordedAt:'invalid'},{recordedAt:new Date(Date.parse(now)+1).toISOString()},{unit:'wrong'},{method:'wrong'},{quality:'unknown' as const},{quality:'unusable' as const}])assert.equal(assess({...o,...bad},now,p).accepted,false);}}
});
test('a tighter window cannot gain evidence, including newer invalid records and quality amendments',()=>{
 const s=fixed();s.observations.forEach(o=>o.recordedAt=new Date(Date.parse(now)-4*3600000).toISOString());s.observations.push({...s.observations[0],id:'bad-new',recordedAt:now,quality:'unusable'});
 const tight=configuredPolicy({version:'tight',freshnessHours:{sleep:3,fatigue:3,context:3,vigilance:3}}),wide=configuredPolicy({version:'wide',freshnessHours:{sleep:12,fatigue:12,context:12,vigilance:12}});
 assert.equal(evidence(s,tight).filter(r=>r.accepted).length,0);assert.equal(evidence(s,wide).filter(r=>r.accepted).length,4);
 s.qualityDecisions=[{observationId:s.observations[0].id,quality:'unusable',at:now}];assert.equal(evidence(s,wide)[0].accepted,false);
});
test('technical task gate is shared by recording, loaded evidence and exports; missed cues do not automatically invalidate capture',()=>{
 const s=fixed(),c=DEFAULT_POLICY.checks.find(c=>c.id==='workstation-task')!,t=task();
 const after=recordCheck(s,c,[{metric:'vigilance',value:300}],t);assert.match(reviewSummary(after).limits.join(' '),/16 timed-out/);assert.equal(plan(after).status,'complete');
 const o=after.observations.at(-1)!;
 for(const bad of [{durationSeconds:NaN},{durationSeconds:179},{premature:Infinity},{missed:NaN},{missed:0.5},{completedAt:'bad'},{completedAt:'2027-01-01'},{responseMs:Array(19).fill(300)}]){
 const broken={...t,...bad};assert.ok(taskIssue(broken,300,now));assert.throws(()=>recordCheck(s,c,[{metric:'vigilance',value:300}],broken));assert.equal(assess({...o,task:broken},now).accepted,false);}
 assert.equal(assess({...o,value:301},now).accepted,false);assert.throws(()=>recordCheck(s,c,[{metric:'vigilance',value:301}],t),/median/);
 assert.equal(assess({...o,task:undefined},now).accepted,false);
 const loaded=readReview({getItem:k=>k===STORE?JSON.stringify(after):null,setItem:()=>{}},now);assert.equal(loaded.blocked,false);assert.equal(plan(loaded.state).status,'complete');
 assert.equal(validState({...after,observations:[{...o,task:{...t,missed:0.5}}]}),false);
 const invalid={...after,observations:[{...o,value:301}]};assert.equal(packet(invalid).evidence.find(r=>r.requirement.id==='vigilance')!.accepted,false);
});
test('collection minimum changes gate without deleting poor performance or changing the task duration',()=>{
 for(const n of [10,20,30]){const p=configuredPolicy({version:'responses-'+n,minimumResponses:n});assert.equal(taskIssue(task(),300,now,p)===null,n<=23);assert.equal(p.task.durationSeconds,180);}
});
test('caller-supplied checks cannot bypass the canonical policy cost and prerequisites',()=>{
 const s=fixed();s.observations=s.observations.filter(o=>o.metric!=='context');const c=DEFAULT_POLICY.checks.find(c=>c.id==='workstation-task')!;
 assert.match(eligibility(s,{...c,seconds:0,prerequisites:[]})!,/context/);assert.throws(()=>recordCheck(s,{...c,seconds:0,prerequisites:[]},[{metric:'vigilance',value:300}],task()),/context/);
});
test('exported custom policy replays plan, evidence and summary with nonzero spent allowance',()=>{
 const p=configuredPolicy({version:'analyst-fixture',freshnessHours:{sleep:12},allocations:{'tablet-task':210},minimumResponses:30}),s=fixed();s.resources.workstation=false;s.observations=s.observations.filter(o=>o.metric!=='vigilance');s.spentSeconds=80;
 const x=JSON.parse(JSON.stringify(packet(s,p)));validatePolicy(x.policySnapshot);
 const replay:State={now:x.scenarioClock,observations:x.observations,resources:x.resources,budget:x.session.budgetSeconds,spentSeconds:x.session.spentSeconds,urgent:x.session.urgent,pendingTask:x.session.pendingTask,qualityDecisions:x.qualityDecisions,events:x.events,reviewQuestion:x.reviewQuestion};
 assert.equal(x.schemaVersion,4);assert.deepEqual(plan(replay,x.policySnapshot),x.plan);assert.deepEqual(evidence(replay,x.policySnapshot),x.evidence);assert.deepEqual(reviewSummary(replay,x.policySnapshot),x.reviewSummary);assert.deepEqual(x.policySnapshot.task,p.task);
});
test('permutation oracle covers partial plans, spent allowance and cost variants; resources and budget are monotone',()=>{
 for(const cost of [70,95]){const p=configuredPolicy({version:'cost-'+cost,allocations:{'check-in':cost}});
 for(let mask=0;mask<16;mask++)for(let devices=0;devices<4;devices++){let lastCoverage=-1;
 for(const budget of [0,24,25,69,70,179,180,195,250,600]){const s=fixed();s.observations=s.observations.filter(o=>mask&(1<<DEFAULT_POLICY.requirements.findIndex(r=>r.id===o.metric)));s.resources={workstation:!!(devices&1),tablet:!!(devices&2)};s.budget=budget;s.spentSeconds=25;
 const actual=plan(s,p),expected=reference(s,p),coverage=4-actual.unresolved.length;
 assert.equal(coverage,expected.coverage);assert.equal(actual.seconds,expected.seconds);assert.ok(coverage>=lastCoverage);lastCoverage=coverage;
 for(const g of [false,true])assert.ok(comparator(s,p,g).seconds<=Math.max(0,budget-25));
 if(actual.status==='ready'){const restored=plan({...s,resources:{workstation:true,tablet:true}},p);assert.ok(restored.seconds<=actual.seconds);}
 s.urgent=true;assert.deepEqual(plan(s,p).actions,[]);}}
 }
});
test('invalid analyst settings are rejected',()=>{
 for(const overrides of [{freshnessHours:{sleep:NaN}},{minimumResponses:0},{allocations:{'workstation-task':100}},{allocations:{'check-in':-1}}])assert.throws(()=>configuredPolicy({version:'bad',...overrides}));
});

test('equal timestamps prefer the later usable append and retain older usable fallback',()=>{
 const s=fixed(),original=s.observations[0];s.observations.push({...original,id:'later',value:6});assert.equal(evidence(s)[0].observation!.id,'later');s.observations.push({...original,id:'invalid-latest',quality:'unusable'});assert.equal(evidence(s)[0].observation!.id,'later');
 s.observations=[{...original,id:'newest'},{...original,id:'invalid-date',recordedAt:'invalid'},{...original,id:'older',recordedAt:new Date(Date.parse(now)-3600000).toISOString()}];assert.equal(evidence(s)[0].observation!.id,'newest');
});
test('legacy reviews remain loadable; stale or missing task metadata cannot become fresh accepted vigilance',()=>{
 const s=fixed(),t=task();const o=s.observations.find(o=>o.metric==='vigilance')!;o.source='user';
 assert.equal(validState(s),true);assert.equal(evidence(s).find(r=>r.requirement.id==='vigilance')!.accepted,false);
 o.task={...t,completedAt:'2026-11-14T12:00:00.000Z'};assert.equal(evidence(s).find(r=>r.requirement.id==='vigilance')!.accepted,false);
 o.task=t;assert.equal(assess({...o,recordedAt:'2026-11-15T12:00:00.001Z'},now).accepted,false);
 o.task={...t,completedAt:'2026-11-15T12:00:00.001Z'};assert.equal(assess(o,now).accepted,false);
 const legacy={...s};delete legacy.spentSeconds;delete legacy.qualityDecisions;const loaded=readReview({getItem:k=>k===STORE?JSON.stringify(legacy):null,setItem:()=>{}},now);assert.equal(loaded.blocked,false);assert.equal(loaded.state.spentSeconds,0);assert.equal(loaded.state.observations.length,s.observations.length);
});
