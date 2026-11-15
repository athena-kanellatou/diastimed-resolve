/** Deterministic authored fixtures, not humans or medical validation. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {DEFAULT_POLICY,configuredPolicy,assess,evidence,plan,packet,reviewSummary,recordCheck,eligibility,taskIssue,type Policy,type State,type Metric,type TaskSession} from '../src/domain.ts';
import {comparator,reference} from './evaluation.ts';
const clock='2026-11-15T12:00:00.000Z',fixtureVersion='resolve-sensitivity-fixtures-v1';
const ranges={sleep:[12,24,36],fatigue:[3,6,12],context:[3,6,12],vigilance:[2,4,8]};
const budgets=[0,24,25,59,60,69,70,179,180,194,195,204,205,249,250,264,265,360];
const metrics=DEFAULT_POLICY.requirements.map(r=>r.id);
const profiles:Record<string,number[]>={fresh:[0,0,0,0],lower:[12,3,3,2],betweenLowerDefault:[18,4.5,4.5,3],default:[24,6,6,4],aboveDefault:[24+1/3600,6+1/3600,6+1/3600,4+1/3600],betweenDefaultUpper:[30,9,9,6],upper:[36,12,12,8],expired:[37,13,13,9]};
const policies:Policy[]=[];
for(const sleep of ranges.sleep)for(const fatigue of ranges.fatigue)for(const context of ranges.context)for(const vigilance of ranges.vigilance)policies.push(configuredPolicy({version:`freshness-${sleep}-${fatigue}-${context}-${vigilance}`,freshnessHours:{sleep,fatigue,context,vigilance}}));
const costPolicies=[DEFAULT_POLICY,
 configuredPolicy({version:'cost-no-bundle-discount',allocations:{'check-in':90}}),
 configuredPolicy({version:'cost-self-report-80pct',allocations:{'check-in':56,'sleep-report':28,'fatigue-report':24,'context-report':20}}),
 configuredPolicy({version:'cost-self-report-120pct',allocations:{'check-in':84,'sleep-report':42,'fatigue-report':36,'context-report':30}}),
 ...[0,30,60].map(overhead=>configuredPolicy({version:`tablet-overhead-${overhead}`,allocations:{'tablet-task':180+overhead}}))];
function state(ages:number[]=profiles.fresh,mask=15,devices=3,budget=360,spent=0):State{
 return {now:clock,observations:DEFAULT_POLICY.requirements.flatMap((r,i)=>mask&(1<<i)?[{id:`fixture-${r.id}`,metric:r.id,value:r.id==='context'?'Synthetic routine shift; no interruptions.':r.id==='sleep'?5.2:r.id==='fatigue'?7:300,unit:r.unit,method:r.method,recordedAt:new Date(Date.parse(clock)-ages[i]*3600000).toISOString(),quality:'usable' as const,source:'synthetic' as const}]:[]),resources:{workstation:!!(devices&1),tablet:!!(devices&2)},budget,spentSeconds:spent,urgent:false,qualityDecisions:[],events:[]};
}
const referenceCache=new Map<string,ReturnType<typeof reference>>();
function oracle(s:State,p:Policy){const key=JSON.stringify([p.checks.map(c=>[c.seconds,c.prerequisites]),evidence(s,p).map(r=>r.accepted),s.resources,s.budget-(s.spentSeconds??0),s.urgent]);let result=referenceCache.get(key);if(!result){result=reference(s,p);referenceCache.set(key,result);}return result;}
const inputs:Record<string,State>={},lines:string[]=[],counts:Record<string,number>={},summaryByPolicy:Record<string,{cases:number;acceptanceFlips:number;nextActionChanges:number;feasibilityTransitions:number;declaredCostChanges:number}>={};
let baselineCount=0,acceptanceFlips=0,nextChanges=0,feasibilityTransitions=0,costChanges=0,oracleChecks=0,replayChecks=0,boundaryChecks=0,monotonicChecks=0,gateCases=0;
const fingerprint=(s:State,p:Policy)=>{const v=evidence(s,p),r=plan(s,p);return {accepted:v.filter(x=>x.accepted).map(x=>x.requirement.id),next:r.actions[0]?.id??null,status:r.status,unresolved:r.unresolved,seconds:r.seconds};};
function emit(family:string,inputId:string,s:State,p:Policy){
 inputs[inputId]??=s;
 const rows=evidence(s,p),actual=plan(s,p),expected=oracle(s,p),base=fingerprint(s,DEFAULT_POLICY),current=fingerprint(s,p);
 assert.equal(4-actual.unresolved.length,expected.coverage);assert.equal(actual.seconds,expected.seconds);oracleChecks++;
 assert.ok(actual.seconds<=Math.max(0,s.budget-(s.spentSeconds??0)));
 const have=new Set(actual.reused);for(const c of actual.actions){assert.ok(!c.capability||s.resources[c.capability]);assert.ok(c.prerequisites.every(m=>have.has(m)));c.supplies.forEach(m=>have.add(m));}
 const delta={acceptanceFlips:metrics.filter(m=>base.accepted.includes(m)!==current.accepted.includes(m)).length,nextActionChanged:base.next!==current.next,feasibilityChanged:['ready','complete'].includes(base.status)!==['ready','complete'].includes(current.status),declaredCostDelta:current.seconds-base.seconds};
 const per=summaryByPolicy[p.version]??={cases:0,acceptanceFlips:0,nextActionChanges:0,feasibilityTransitions:0,declaredCostChanges:0};per.cases++;per.acceptanceFlips+=delta.acceptanceFlips;per.nextActionChanges+=Number(delta.nextActionChanged);per.feasibilityTransitions+=Number(delta.feasibilityChanged);per.declaredCostChanges+=Number(delta.declaredCostDelta!==0);
 acceptanceFlips+=delta.acceptanceFlips;nextChanges+=Number(delta.nextActionChanged);feasibilityTransitions+=Number(delta.feasibilityChanged);costChanges+=Number(delta.declaredCostDelta!==0);baselineCount+=Number(p.version===DEFAULT_POLICY.version);
 counts[family]=(counts[family]??0)+1;
 const record={case_id:`${family}/${p.version}/${inputId}`,fixture:fixtureVersion,input_id:inputId,policy_id:p.version,observation_ages:Object.fromEntries(s.observations.map(o=>[o.metric,(Date.parse(clock)-Date.parse(o.recordedAt))/3600000])),devices:s.resources,total_allowance:s.budget,spent_allowance:s.spentSeconds??0,remaining_allowance:Math.max(0,s.budget-(s.spentSeconds??0)),accepted_evidence:current.accepted,rejection_reasons:rows.filter(r=>!r.accepted).map(r=>({metric:r.requirement.id,reason:r.reason})),next_action:current.next,plan_status:current.status,unresolved_requirements:actual.unresolved,declared_cost:actual.seconds,comparators:{fixed:comparator(s,p),greedy:comparator(s,p,true)},reference:expected,change_from_baseline:delta};
 lines.push(JSON.stringify(record));
 // Replay one packet for each policy + family; no wall-clock/export timestamp assertions.
 if(per.cases===1){const x=JSON.parse(JSON.stringify(packet(s,p)));const replay:State={now:x.scenarioClock,observations:x.observations,resources:x.resources,budget:x.session.budgetSeconds,spentSeconds:x.session.spentSeconds,urgent:x.session.urgent,events:x.events,qualityDecisions:x.qualityDecisions,reviewQuestion:x.reviewQuestion};assert.deepEqual(plan(replay,x.policySnapshot),x.plan);assert.deepEqual(evidence(replay,x.policySnapshot),x.evidence);assert.deepEqual(reviewSummary(replay,x.policySnapshot),x.reviewSummary);replayChecks++;}
}
for(const p of policies){
 for(const [name,ages] of Object.entries(profiles))for(let d=0;d<4;d++)for(const b of [60,205,360])for(const spent of [0,25]){
 const s=state(ages,15,d,b,spent);emit('freshness',`${name}-d${d}-b${b}-s${spent}`,s,p);
 const short=configuredPolicy({version:'strict-check',freshnessHours:{sleep:12,fatigue:3,context:3,vigilance:2}});const a=evidence(s,short),z=evidence(s,p);assert.ok(a.every((r,i)=>!r.accepted||z[i].accepted));monotonicChecks++;
 }
 // Exact one-millisecond cutoffs for every metric at every configuration, plus incompatible data.
 for(const r of p.requirements)for(const offset of [-1,0,1]){
 const s=state(),o=s.observations.find(o=>o.metric===r.id)!;o.recordedAt=new Date(Date.parse(clock)-r.maxAgeHours*3600000-offset).toISOString();assert.equal(assess(o,clock,p).accepted,offset<=0);boundaryChecks++;
 for(const bad of [{quality:'unknown' as const},{quality:'unusable' as const},{unit:'wrong'},{method:'wrong'},{recordedAt:'invalid'},{recordedAt:'2026-11-15T12:00:00.001Z'}]){assert.equal(assess({...o,...bad},clock,p).accepted,false);boundaryChecks++;}
 }
}
for(const p of costPolicies)for(let mask=0;mask<16;mask++)for(let d=0;d<4;d++)for(const spent of [0,25,70]){
 let previous=-1;
 for(const b of budgets){const s=state(profiles.fresh,mask,d,b,spent),a=plan(s,p);emit('cost',`mask${mask}-d${d}-b${b}-s${spent}`,s,p);const coverage=4-a.unresolved.length;assert.ok(coverage>=previous);previous=coverage;monotonicChecks++;
 if(a.status==='ready'){assert.ok(plan({...s,resources:{workstation:true,tablet:true}},p).seconds<=a.seconds);monotonicChecks++;}
 }
}
// A small explicit urgent family; restoring devices or budget cannot override urgent routing.
for(const p of [DEFAULT_POLICY,...policies.slice(0,1),...costPolicies.slice(1,2)])for(const d of [0,3]){const s=state(profiles.expired,15,d,360,25);s.urgent=true;emit('urgent',`urgent-d${d}`,s,p);assert.equal(plan(s,p).status,'urgent');assert.deepEqual(plan(s,p).actions,[]);}
// Counterfactual gates on authored records; never replay an alternative stimulus schedule.
const gateOutputs=[];
for(const minimumResponses of [10,20,30])for(const n of [9,10,19,20,23,29,30])for(const missed of [0,16])for(const premature of [0,5]){
 const p=configuredPolicy({version:`minimum-responses-${minimumResponses}`,minimumResponses}),t:TaskSession={device:'workstation',durationSeconds:180,responseMs:Array(n).fill(300),missed,premature,completedAt:clock};
 const s=state(profiles.fresh,7),c=p.checks.find(c=>c.id==='workstation-task')!;const reason=taskIssue(t,300,clock,p);assert.equal(reason===null,n>=minimumResponses);assert.equal(eligibility(s,c,p),null);
 if(!reason){const after=recordCheck(s,c,[{metric:'vigilance',value:300}],t,p);assert.equal(plan(after,p).status,'complete');assert.match(reviewSummary(after,p).limits.join(' '),new RegExp(`${missed} timed-out`));}
 gateOutputs.push({policy_id:p.version,response_count:n,missed,premature,duration_seconds:180,capture_accepted:!reason,reason});gateCases++;
}
const configuration={fixtureVersion,clock,randomSeed:null,selection:'Fully enumerated authored fixtures; no random sampling.',baseline:DEFAULT_POLICY,freshnessRanges:ranges,freshnessPolicies:policies.map(p=>({version:p.version,freshnessHours:Object.fromEntries(p.requirements.map(r=>[r.id,r.maxAgeHours]))})),costPolicies:costPolicies.map(p=>({version:p.version,allocations:Object.fromEntries(p.checks.map(c=>[c.id,c.seconds]))})),profiles,budgets,spent:[0,25,70],taskGateMinimums:[10,20,30],taskGateResponseCounts:[9,10,19,20,23,29,30],classification:'Synthetic software sensitivity analysis only. Parameter values are not medical recommendations.'};
const raw=Buffer.from(lines.join('\n')+'\n'),compressed=gzipSync(raw,{level:9});
const summary={fixtureVersion,baselinePolicy:DEFAULT_POLICY.version,cases:lines.length,families:counts,baselineCases:baselineCount,acceptanceFlips,nextActionChanges:nextChanges,feasibilityTransitions,declaredCostChanges:costChanges,comparisonDenominator:lines.length,checks:{permutationReference:oracleChecks,uniqueReferenceStates:referenceCache.size,packetReplay:replayChecks,boundaryAndInvalidData:boundaryChecks,monotonicity:monotonicChecks,taskGateCases:gateCases},rawSha256:createHash('sha256').update(raw).digest('hex'),byPolicy:summaryByPolicy,limitations:['Authored scenarios and equal-weight grids are not population frequencies.','Acceptance flip count counts fields, not cases.','Delta costs can reflect different coverage; they are not measured savings.','Comparators and oracle share evidence assessment; boundary tests check it separately.','No altered cue schedule replay, clinical threshold selection, or human evidence.']};
const report=`# Policy sensitivity — reproducible synthetic analysis\n\nBaseline: **${DEFAULT_POLICY.version}**. Fixed clock: ${clock}. Fixture set: ${fixtureVersion}. No participants or clinical outcomes.\n\n| Analysis | Cases |\n|---|---:|\n${Object.entries(counts).map(([k,v])=>`| ${k} | ${v} |`).join('\n')}\n| Counterfactual task gates (separate) | ${gateCases} |\n\nAcross **${lines.length} planning cases**, relative to the unchanged default numeric policy on the same inputs: **${acceptanceFlips} field acceptance flips**, **${nextChanges} next-action changes**, **${feasibilityTransitions} complete/incomplete feasibility transitions**, and **${costChanges} declared-cost changes**. These deliberately selected grid frequencies do not estimate real-world risk or benefit. Cost differences may compare different coverage and must not be called time savings.\n\nThe 81 freshness configurations use sleep 12/24/36h, fatigue and context 3/6/12h, and vigilance 2/4/8h. Eight observation-age profiles include exact cutoffs and one-second-above-default ages. Each is crossed with four device states, three budgets and zero/25 spent seconds. Cost analysis crosses seven catalogues, 16 evidence masks, four device states, 18 near-boundary allowances and zero/25/70 spent seconds. Task duration stays 180s; tablet overhead alone varies to 0/30/60s, alongside the default 15s. Self-report allocations vary ±20%; the no-discount bundle uses 90s.\n\nAll ${oracleChecks} planning cases agree with a separate ordered-permutation reference on maximum achievable coverage and minimum declared cost, including incomplete plans. ${boundaryChecks} assertions check exact cutoffs (±1ms), timestamps, methods, units and quality. ${monotonicChecks} assertions check tightening freshness, increasing remaining allowance and restoring equipment. ${replayChecks} exported policy/input packets replay evidence, plan and brief. These are assertions and enumerated cases, not separate human trials or individual test functions.\n\nTask gates: ${gateCases} counterfactual authored records cross minimum 10/20/30 with 9/10/19/20/23/29/30 responses, zero/16 misses and zero/five early responses. Misses and early responses remain visible; they do not determine capture validity. The accepted 23-response/16-miss fixture demonstrates why capture acceptance cannot be called normal alertness. No alternative cue timing was reconstructed.\n\n## Reproduce and inspect\n\nRun \`npm run sensitivity\`, or \`npm run sensitivity:check\` to regenerate in memory and compare every saved byte. No timestamp noise or random seed is used. \`public/sensitivity/config.json\` contains the exact baseline policy, explicit per-configuration overrides, profiles, bounds and fixed clock. \`inputs.json.gz\` holds compressed authored input states, separate from calculated output. \`cases.ndjson.gz\` holds one JSON record per planning case and joins input_id to inputs and policy_id to config. \`task-gates.json\` holds the separate gate cases. \`summary.json\` includes per-policy counts and the uncompressed case SHA-256. Use Python gzip or Node zlib to read the cases. Original 256-case benchmark is preserved separately.\n\n## Boundaries\n\nThe model is sensitive to deliberately varied assumptions; this analysis identifies that dependence, not medically correct values. No domain reviewer has endorsed the windows or capture rules. The reference shares the evidence assessor and action catalogue, so agreement cannot validate their scientific appropriateness. Device/input latency, physical hardware and real workload remain unvalidated. Read POLICY_REGISTER.md for source scope and DOMAIN_REVIEW_PACK.md for unresolved questions.\n`;
// Authored examples for review; never counted as human records.
const examples=new Map<string,Buffer>();
for(const kind of ['complete','equipment-loss','many-misses']){
 const s=state();if(kind==='equipment-loss'){s.observations=s.observations.filter(o=>o.metric!=='vigilance');s.resources={workstation:false,tablet:false};}
 if(kind==='many-misses'){const o=s.observations.find(o=>o.metric==='vigilance')!;o.task={device:'workstation',durationSeconds:180,responseMs:Array(23).fill(300),premature:0,missed:16,completedAt:clock};}
 const x=packet(s);x.exportedAt=clock;examples.set(`docs/validation/examples/${kind}.json`,Buffer.from(JSON.stringify({exampleClassification:'Authored synthetic software fixture. Not a participant or clinician finding.',...x},null,2)+'\n'));
}
const artifacts=new Map<string,Buffer>([
 ['public/sensitivity/config.json',Buffer.from(JSON.stringify(configuration,null,2)+'\n')],
 ['public/sensitivity/inputs.json.gz',gzipSync(Buffer.from(JSON.stringify(inputs)+'\n'),{level:9})],
 ['public/sensitivity/cases.ndjson.gz',compressed],
 ['public/sensitivity/task-gates.json',Buffer.from(JSON.stringify(gateOutputs,null,2)+'\n')],
 ['public/sensitivity/summary.json',Buffer.from(JSON.stringify(summary,null,2)+'\n')],
 ['docs/SENSITIVITY.md',Buffer.from(report)],...examples
]);
for(const [file,data] of artifacts){if(process.argv.includes('--check'))assert.ok(fs.readFileSync(file).equals(data),`Saved sensitivity artifact differs: ${file}`);else{fs.mkdirSync(file.slice(0,file.lastIndexOf('/')),{recursive:true});fs.writeFileSync(file,data);}}
console.log(JSON.stringify({...summary,byPolicy:undefined},null,2));
