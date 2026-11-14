import {test} from 'node:test';
import assert from 'node:assert/strict';
import{scenario,plan,evidence,assess,checks,requirements,packet,type State,type Metric}from'../src/domain.ts';
test('fresh observations are reused without extra checks',()=>{const s=scenario('fresh'),p=plan(s);assert.equal(p.status,'complete');assert.equal(p.seconds,0);assert.equal(p.reused.length,4)});
test('a stale task cannot supply current evidence',()=>{const s=scenario('stale');assert.equal(evidence(s).find(r=>r.requirement.id==='vigilance')?.accepted,false);assert.deepEqual(plan(s).missing,['vigilance']);assert.equal(plan(s).seconds,180)});
test('device loss changes the check, not its evidence requirement',()=>{const s=scenario('stale');s.resources.workstation=false;const p=plan(s);assert.equal(p.status,'ready');assert.equal(p.actions[0].id,'tablet-task');assert.equal(p.seconds,195);s.resources.tablet=false;assert.equal(plan(s).status,'incomplete');assert.deepEqual(plan(s).unresolved,['vigilance'])});
test('insufficient budget never returns a complete plan',()=>{const s=scenario('missing');s.budget=60;const p=plan(s);assert.equal(p.status,'incomplete');assert.ok(p.unresolved.length);assert.ok(p.seconds<=60)});
test('urgent routing overrides collection and budget',()=>{const s=scenario('missing');s.urgent=true;s.budget=0;const p=plan(s);assert.equal(p.status,'urgent');assert.equal(p.seconds,0);assert.deepEqual(p.actions,[])});
test('future timestamps, incompatible units and unknown quality are rejected',()=>{const s=scenario('fresh'),o=s.observations[0];assert.equal(assess({...o,recordedAt:new Date(Date.parse(s.now)+1000).toISOString()},s.now).accepted,false);assert.equal(assess({...o,unit:'minutes'},s.now).accepted,false);assert.equal(assess({...o,quality:'unknown'},s.now).accepted,false);assert.equal(assess({...o,value:NaN},s.now).accepted,false)});
test('planner respects prerequisites even when their direct check is slower than a combined check',()=>{const s=scenario('missing'),p=plan(s);let have=new Set<Metric>();for(const c of p.actions){assert.ok(c.prerequisites.every(x=>have.has(x)));c.supplies.forEach(x=>have.add(x))}assert.equal(have.size,4);assert.equal(p.seconds,250)});
test('an invalid new observation does not erase an older usable one',()=>{const s=scenario('fresh');s.observations.push({...s.observations[0],id:'invalid-new',quality:'unusable'});assert.equal(plan(s).status,'complete')});
test('export faithfully contains the same plan, evidence and policy assumptions',()=>{const s=scenario('limited');const x=packet(s);assert.deepEqual(x.plan,plan(s));assert.deepEqual(x.evidence,evidence(s));assert.ok(x.classification.includes('not medical clearance'));assert.equal(x.observations.length,s.observations.length)});
// Independent reference enumerates ordered permutations before checking validity.
function oracle(s:State){if(s.urgent)return 0;const initial=evidence(s).filter(r=>r.accepted).map(r=>r.requirement.id);let best=Infinity;function enumerate(path:number[],remaining:number[]){let have=new Set(initial),cost=0,valid=true;for(const i of path){const c=checks[i];if(c.capability&&!s.resources[c.capability]||c.prerequisites.some(m=>!have.has(m)))valid=false;cost+=c.seconds;c.supplies.forEach(m=>have.add(m));}if(valid&&have.size===4&&cost<=s.budget)best=Math.min(best,cost);if(path.length>=checks.length||cost>best)return;for(const i of remaining)enumerate([...path,i],remaining.filter(n=>n!==i));}enumerate([],checks.map((_,i)=>i));return best;}
test('all 16 evidence states × 4 device states × 4 budgets agree with an independent feasibility/cost oracle',()=>{for(let mask=0;mask<16;mask++)for(let devices=0;devices<4;devices++)for(const budget of [60,180,260,600]){const s=scenario('fresh');s.observations=s.observations.filter(o=>(mask&(1<<requirements.findIndex(r=>r.id===o.metric)))!==0);s.resources={workstation:!!(devices&1),tablet:!!(devices&2)};s.budget=budget;const expected=oracle(s),actual=plan(s);assert.equal(actual.status==='complete'||actual.status==='ready',Number.isFinite(expected),JSON.stringify({mask,devices,budget}));if(Number.isFinite(expected))assert.equal(actual.seconds,expected);assert.ok(actual.seconds<=budget);if(actual.status==='incomplete')assert.ok(actual.unresolved.length)}});

import {eligibility,recordCheck,remainingBudget} from '../src/domain.ts';
test('direct recording cannot bypass context, equipment, urgent routing or allowance',()=>{
 const s=scenario('review'),task=checks.find(c=>c.id==='workstation-task')!;
 assert.match(eligibility(s,task)!,/context/);assert.throws(()=>recordCheck(s,task,[{metric:'vigilance',value:280}]),/context/);
 const fresh=scenario('fresh');fresh.resources.workstation=false;assert.match(eligibility(fresh,task)!,/device/);
 fresh.resources.workstation=true;fresh.urgent=true;assert.match(eligibility(fresh,task)!,/paused/);
 fresh.urgent=false;fresh.spentSeconds=200;assert.match(eligibility(fresh,task)!,/allowance/);
});
test('completed checks consume their declared session allocation across replans',()=>{
 const s=scenario('review');s.budget=200;const context=checks.find(c=>c.id==='context-report')!;
 const after=recordCheck(s,context,[{metric:'context',value:'Routine shift, no interruptions.'}]);
 assert.equal(after.spentSeconds,25);assert.equal(remainingBudget(after),175);assert.equal(plan(after).status,'incomplete');
 assert.deepEqual(plan(after).unresolved,['vigilance']);assert.equal(s.observations.length,2);
});
test('quality amendments retain original records and are applied to acceptance',()=>{
 const s=scenario('fresh'),o=s.observations.find(o=>o.metric==='vigilance')!;
 s.qualityDecisions=[{observationId:o.id,quality:'unusable',at:s.now}];
 assert.equal(evidence(s).find(r=>r.requirement.id==='vigilance')!.accepted,false);assert.equal(o.quality,'usable');
 s.qualityDecisions.push({observationId:o.id,quality:'usable',at:s.now});assert.equal(plan(s).status,'complete');
});
test('task records require full duration and valid response data',()=>{
 const s=scenario('stale'),c=checks.find(c=>c.id==='workstation-task')!,task={device:'workstation' as const,durationSeconds:180,responseMs:Array(20).fill(280),premature:0,missed:1,completedAt:s.now};
 assert.throws(()=>recordCheck(s,c,[{metric:'vigilance',value:280}]),/three-minute/);
 assert.throws(()=>recordCheck(s,c,[{metric:'vigilance',value:280}],{...task,durationSeconds:3}),/three-minute/);
 assert.throws(()=>recordCheck(s,c,[{metric:'vigilance',value:280}],{...task,responseMs:[NaN,...Array(19).fill(280)]}),/three-minute/);
 const after=recordCheck(s,c,[{metric:'vigilance',value:280}],task);assert.equal(plan(after).status,'complete');assert.deepEqual(after.observations.at(-1)!.task,task);
});
test('export includes enough inputs to reproduce the planner decision',()=>{
 const s=scenario('limited');s.spentSeconds=25;s.urgent=true;const exported=packet(s);
 const reconstructed:State={observations:exported.observations,resources:exported.resources,budget:exported.session.budgetSeconds,spentSeconds:exported.session.spentSeconds,urgent:exported.session.urgent,now:exported.scenarioClock,qualityDecisions:exported.qualityDecisions,events:exported.events};
 assert.deepEqual(plan(reconstructed),exported.plan);assert.deepEqual(exported.policySnapshot.checks,checks);assert.deepEqual(exported.policySnapshot.requirements,requirements);
});
