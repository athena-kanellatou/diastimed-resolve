import {DEFAULT_POLICY, POLICY_VERSION, type Policy, type Metric, type Capability, type Check} from './policy.ts';
export {DEFAULT_POLICY, POLICY_VERSION, configuredPolicy, validatePolicy} from './policy.ts';
export type {Policy, Metric, Capability, Check} from './policy.ts';
export const requirements=DEFAULT_POLICY.requirements;
export const checks=DEFAULT_POLICY.checks;
export type TaskSession = {device:Capability; durationSeconds:number; responseMs:number[]; premature:number; missed:number; completedAt:string};
export type Observation = { id:string; metric:Metric; value:number|string; unit:string; recordedAt:string; quality:'usable'|'unusable'|'unknown'; method:string; source:'synthetic'|'user'; note?:string; task?:TaskSession };
export type State = { observations:Observation[]; resources:Record<Capability,boolean>; budget:number; urgent:boolean; now:string; spentSeconds?:number; pendingTask?:{checkId:string;startedAt:string}|null; reviewQuestion?:string; qualityDecisions?:{observationId:string; quality:Observation['quality']; at:string}[]; events:{at:string;message:string; kind?:string; details?:unknown}[] };
export const sources=[
 {id:'sleep',name:'Sleep & irregular schedules',org:'NASA Human Research Program',url:'https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/',supports:'Sleep disruption and workload matter during spaceflight.',limit:'Does not establish our freshness windows or diagnose fatigue.'},
 {id:'standard',name:'Spaceflight Standard Measures',org:'NASA',url:'https://www.nasa.gov/reference/standard-measures/',supports:'Combining physiological, psychological and contextual observations.',limit:'Does not validate our evidence-completeness policy.'},
 {id:'reaction',name:'Reaction Self Test on ISS',org:'NASA Technical Reports Server',url:'https://ntrs.nasa.gov/citations/20090029851',supports:'Brief objective observations of alertness with low crew burden.',limit:'Does not validate this browser task or establish fitness for duty.'},
 {id:'pvt',name:'Brief vigilance task research',org:'Basner, Mollicone & Dinges · 2011',url:'https://pubmed.ncbi.nlm.nih.gov/22025811/',supports:'A published three-minute vigilance paradigm studied under sleep loss.',limit:'Our task is PVT-inspired and has not been clinically or device validated.'},
 {id:'exmc',name:'Exploration medical architecture',org:'NASA · ExMC',url:'https://ntrs.nasa.gov/citations/20220017869',supports:'Earth-independent medical support under resource and communication constraints.',limit:'Does not establish medical optimality of our planner.'}
];
export function roundedMedian(values:number[]){const sorted=[...values].sort((a,b)=>a-b),mid=Math.floor(sorted.length/2);return Math.round(sorted.length%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2);}
export function taskIssue(task:TaskSession|undefined,value:number,now:string,policy:Policy=DEFAULT_POLICY):string|null{
 const t=policy.task;
 const base=`A complete three-minute task with at least ${t.minimumResponses} valid responses is required.`;
 if(!task||!['workstation','tablet'].includes(task.device)||!Number.isFinite(task.durationSeconds)||task.durationSeconds<t.durationSeconds||!Array.isArray(task.responseMs)||task.responseMs.length<t.minimumResponses||task.responseMs.some(x=>!Number.isFinite(x)||x<=0)||!Number.isInteger(task.premature)||task.premature<0||!Number.isInteger(task.missed)||task.missed<0)return base;
 if(!Number.isFinite(Date.parse(task.completedAt))||Date.parse(task.completedAt)>Date.parse(now))return 'Task completion timestamp is invalid or in the future.';
 if(value!==roundedMedian(task.responseMs))return 'Task summary does not match its rounded median response time.';
 return null;
}
export function assess(observation:Observation,now:string,policy:Policy=DEFAULT_POLICY){
 const req=policy.requirements.find(r=>r.id===observation.metric);
 if(!req)return {accepted:false,reason:'Unknown metric'};
 const recorded=Date.parse(observation.recordedAt);
 if(!Number.isFinite(recorded)||recorded>Date.parse(now))return {accepted:false,reason:'Invalid or future timestamp'};
 if(observation.task&&Date.parse(observation.task.completedAt)>recorded)return {accepted:false,reason:'Task completion is after its observation timestamp'};
 const captured=observation.task?Math.min(recorded,Date.parse(observation.task.completedAt)):recorded;
 const age=(Date.parse(now)-captured)/3600000;
 if(!Number.isFinite(age)||age<0)return {accepted:false,reason:'Invalid or future timestamp'};
 if(observation.quality!=='usable')return {accepted:false,reason:observation.quality==='unknown'?'Quality is unknown':'Marked unusable'};
 if(observation.method!==req.method||observation.unit!==req.unit)return {accepted:false,reason:'Incompatible method or units'};
 if(age>req.maxAgeHours)return {accepted:false,reason:`Older than the assumed ${req.maxAgeHours}-hour window`};
 const v=observation.value;
 if(req.id==='sleep'&&(typeof v!=='number'||!Number.isFinite(v)||v<0||v>24))return {accepted:false,reason:'Sleep must be 0–24 hours'};
 if(req.id==='fatigue'&&(typeof v!=='number'||!Number.isFinite(v)||v<0||v>10))return {accepted:false,reason:'Fatigue must be 0–10'};
 if(req.id==='vigilance'&&(typeof v!=='number'||!Number.isFinite(v)||v<=0))return {accepted:false,reason:'Task result must be a positive number'};
 if(req.id==='vigilance'&&(observation.source==='user'||observation.task)){const reason=taskIssue(observation.task,Number(v),now,policy);if(reason)return {accepted:false,reason};}
 if(req.id==='context'&&(typeof v!=='string'||!v.trim()))return {accepted:false,reason:'Context is empty'};
 return {accepted:true,reason:`Usable within the assumed ${req.maxAgeHours}-hour window`};
}
export function evidence(state:State,policy:Policy=DEFAULT_POLICY){return policy.requirements.map(req=>{
 const entries=state.observations.filter(o=>o.metric===req.id).reverse().sort((a,b)=>Date.parse(b.recordedAt)-Date.parse(a.recordedAt));
 const effective=(o:Observation)=>({...o,quality:[...(state.qualityDecisions??[])].reverse().find(d=>d.observationId===o.id)?.quality??o.quality});
 const usable=entries.find(o=>assess(effective(o),state.now,policy).accepted);
 return {requirement:req,observation:usable??entries[0]??null,accepted:!!usable,reason:usable?assess(effective(usable),state.now,policy).reason:entries[0]?assess(effective(entries[0]),state.now,policy).reason:'No observation recorded'};
});}
export type Plan={status:'complete'|'ready'|'incomplete'|'urgent';actions:Check[];seconds:number;missing:Metric[];unresolved:Metric[];reused:Metric[]};
export function plan(state:State,policy:Policy=DEFAULT_POLICY):Plan{
 const rows=evidence(state,policy),reused=rows.filter(r=>r.accepted).map(r=>r.requirement.id),missing=rows.filter(r=>!r.accepted).map(r=>r.requirement.id);
 if(state.urgent)return {status:'urgent',actions:[],seconds:0,missing,unresolved:missing,reused};
 if(!missing.length)return {status:'complete',actions:[],seconds:0,missing,unresolved:[],reused};
 let best:Check[]|null=null,bestTime=Infinity,partial:Check[]=[],partialCovered=new Set(reused),partialTime=0;
 function search(covered:Set<Metric>,path:Check[],seconds:number){
  if(covered.size>partialCovered.size||(covered.size===partialCovered.size&&seconds<partialTime)){partial=path;partialCovered=covered;partialTime=seconds;}
  if(covered.size===policy.requirements.length){if(seconds<bestTime||(seconds===bestTime&&path.map(x=>x.id).join(',')<(best??[]).map(x=>x.id).join(','))){best=path;bestTime=seconds;}return;}
  for(const check of policy.checks){
   if(path.some(x=>x.id===check.id)||check.capability&&!state.resources[check.capability]||check.prerequisites.some(x=>!covered.has(x))||check.supplies.every(x=>covered.has(x)))continue;
   if(seconds+check.seconds>remainingBudget(state)||seconds+check.seconds>bestTime)continue;
   search(new Set([...covered,...check.supplies]),[...path,check],seconds+check.seconds);
  }
 }
 search(new Set(reused),[],0);
 if(best)return {status:'ready',actions:best,seconds:bestTime,missing,unresolved:[],reused};
 return {status:'incomplete',actions:partial,seconds:partialTime,missing,unresolved:policy.requirements.filter(r=>!partialCovered.has(r.id)).map(r=>r.id),reused};
}
const obs=(metric:Metric,value:number|string,now:string,age=0):Observation=>({id:metric+'-'+age,metric,value,unit:requirements.find(r=>r.id===metric)!.unit,recordedAt:new Date(Date.parse(now)-age*3600000).toISOString(),quality:'usable',method:metric==='vigilance'?'pvt-inspired-v1':'self-report-v1',source:'synthetic'});
export const scenarioList=[{id:'review',name:'Fatigue review',subtitle:'Sleep and fatigue available · context and vigilance needed'},{id:'fresh',name:'All observations available',subtitle:'Fresh evidence · no repeated checks'},{id:'stale',name:'Expired vigilance observation',subtitle:'Stale task · quality gate'},{id:'missing',name:'Start a new review',subtitle:'No observations · plan every step'},{id:'limited',name:'Equipment unavailable',subtitle:'No task device · unresolved evidence'}];
export function scenario(id:string):State{
 const now=new Date().toISOString();
 let observations=[obs('sleep',5.2,now),obs('fatigue',7,now)];let resources={workstation:true,tablet:true};
 if(id==='fresh')observations.push(obs('context','Routine shift; same device as previous check.',now),obs('vigilance',285,now));
 if(id==='stale')observations.push(obs('context','After a demanding shift.',now),obs('vigilance',285,now,8));
 if(id==='missing')observations=[];
 if(id==='limited'){resources={workstation:false,tablet:false};observations.push(obs('context','Task devices unavailable.',now));}
 return {observations,resources,budget:360,spentSeconds:0,qualityDecisions:[],urgent:false,now,events:[{at:now,message:'Loaded a synthetic mission scenario.'}]};
}
export function remainingBudget(state:State){return Math.max(0,state.budget-(state.spentSeconds??0));}
export function eligibility(state:State,requested:Check,policy:Policy=DEFAULT_POLICY):string|null{
 const check=policy.checks.find(c=>c.id===requested.id);if(!check)return 'Unknown collection check.';
 if(state.urgent)return 'Routine collection is paused for urgent-help routing.';
 if(check.capability&&!state.resources[check.capability])return 'The required device is unavailable.';
 const have=new Set(evidence(state,policy).filter(r=>r.accepted).map(r=>r.requirement.id));
 const missing=check.prerequisites.filter(m=>!have.has(m));
 if(missing.length)return 'Record usable '+missing.map(m=>policy.requirements.find(r=>r.id===m)!.short.toLowerCase()).join(', ')+' before this check.';
 if(check.seconds>remainingBudget(state))return 'This check exceeds the remaining session allowance.';
 return null;
}
export function recordCheck(state:State,requested:Check,values:{metric:Metric;value:number|string}[],task?:TaskSession,policy:Policy=DEFAULT_POLICY):State{
 const check=policy.checks.find(c=>c.id===requested.id);if(!check)throw Error('Unknown collection check.');
 const reason=eligibility(state,check,policy);if(reason)throw new Error(reason);
 if(values.length!==check.supplies.length||new Set(values.map(v=>v.metric)).size!==check.supplies.length||check.supplies.some(m=>!values.some(v=>v.metric===m)))throw new Error('The observation set does not match this check.');
 if(check.supplies.includes('vigilance')){const issue=taskIssue(task,Number(values[0]?.value),state.now,policy);if(issue)throw Error(issue);if(task!.device!==check.capability)throw Error('Task device does not match the collection check.');}
 else if(task)throw Error('Task metadata is only allowed for a vigilance check.');
 const observations:Observation[]=values.map(v=>({id:crypto.randomUUID(),...v,unit:policy.requirements.find(r=>r.id===v.metric)!.unit,recordedAt:state.now,quality:'usable',method:v.metric==='vigilance'?'pvt-inspired-v1':'self-report-v1',source:'user',...(task?{task}:{} )}));
 for(const o of observations){const decision=assess(o,state.now,policy);if(!decision.accepted)throw new Error(decision.reason);}
 return {...state,pendingTask:null,observations:[...state.observations,...observations],spentSeconds:(state.spentSeconds??0)+check.seconds,events:[...state.events,{at:state.now,kind:'check-recorded',message:check.title+' completed; '+check.seconds+' estimated seconds allocated.',details:{checkId:check.id,observationIds:observations.map(o=>o.id),allocatedSeconds:check.seconds}}]};
}
export function packet(state:State,policy:Policy=DEFAULT_POLICY){return {schemaVersion:4,developmentProvenance:{tools:['OpenAI ChatGPT','OpenAI Codex'],code:'SI-assisted',syntheticScenarioData:'SI-assisted authored demonstration records; not astronaut or patient data',userEnteredObservations:'User-entered; not represented as SI-generated',runtimeModelUsed:false,disclosure:'https://github.com/athena-kanellatou/diastimed-resolve/blob/main/AI_USE.md'},project:'DiastiMed RESOLVE',policy:policy.version,exportedAt:new Date().toISOString(),scenarioClock:state.now,reviewQuestion:state.reviewQuestion??'',reviewSummary:reviewSummary(state,policy),classification:'Research prototype; evidence completeness is not medical clearance.',assumptions:{freshnessHours:Object.fromEntries(policy.requirements.map(r=>[r.id,r.maxAgeHours])),costs:'Estimated action allocations, not observed crew performance. Completed checks consume their declared cost; interrupted tasks consume elapsed seconds.',taskQuality:`At least ${policy.task.durationSeconds} seconds and ${policy.task.minimumResponses} valid responses; unvalidated engineering rule.`},policySnapshot:structuredClone(policy),session:{budgetSeconds:state.budget,spentSeconds:state.spentSeconds??0,remainingSeconds:remainingBudget(state),urgent:state.urgent,pendingTask:state.pendingTask??null},observations:state.observations,qualityDecisions:state.qualityDecisions??[],evidence:evidence(state,policy),plan:plan(state,policy),resources:state.resources,events:state.events,sources};}


// A factual review aid. No normal ranges, diagnostic inference or clearance.
export function reviewSummary(state:State,policy:Policy=DEFAULT_POLICY){
 const rows=evidence(state,policy),p=plan(state,policy);
 const facts=rows.filter(r=>r.accepted).map(r=>({metric:r.requirement.id,label:r.requirement.short,value:r.observation!.value,unit:r.observation!.unit,at:r.observation!.recordedAt,source:r.observation!.source}));
 const limits:string[]=[];
 const task=rows.find(r=>r.requirement.id==='vigilance'&&r.accepted)?.observation?.task;
 if(task){limits.push(`Browser task: ${task.responseMs.length} captured responses, ${task.missed} timed-out cues and ${task.premature} early responses. Meeting the collection rule does not validate performance.`);}
 else if(rows.some(r=>r.requirement.id==='vigilance'&&r.accepted))limits.push('Vigilance is a synthetic scenario value without a recorded task session.');
 if(!rows.some(r=>r.requirement.id==='vigilance'&&r.accepted))limits.push('No usable objective task observation is available; the self-reports alone cannot establish alertness.');
 const rejected=rows.filter(r=>!r.accepted&&r.observation);
 rejected.forEach(r=>limits.push(`${r.requirement.short}: ${r.reason}. The displayed value is excluded from this review.`));
 limits.push('No personal baseline or validated health thresholds are applied. Device/input latency and self-report recall limit interpretation.');
 const next=state.urgent?'Contact the crew medical officer and follow the mission-approved emergency procedure. Routine collection remains paused.':p.status==='complete'?'Review the observations, task limitations and concern with the designated human reviewer. Export the brief for manual handoff. Collection completeness does not clear anyone for duty.':p.status==='incomplete'?'Keep this review open as incomplete. Record the unresolved requirements for the human reviewer; restore suitable equipment or revise the routine allowance before attempting the missing checks.':`Continue with “${p.actions[0]?.title}”, then review the updated evidence. Do not interpret missing measurements as reassuring results.`;
 return {status:state.urgent?'urgent':p.status==='complete'?'collected':'incomplete',facts,limits,next,missing:rows.filter(r=>!r.accepted).map(r=>r.requirement.short),sourceIds:['sleep','reaction','exmc']};
}
export function recoverInterrupted(state:State,now=new Date().toISOString(),policy:Policy=DEFAULT_POLICY):State{
 if(!state.pendingTask)return {...state,now};
 const elapsed=Math.max(0,Math.min(policy.task.durationSeconds,Math.ceil((Date.parse(now)-Date.parse(state.pendingTask.startedAt))/1000)));
 return {...state,now,pendingTask:null,spentSeconds:(state.spentSeconds??0)+elapsed,events:[...state.events,{at:now,kind:'task-recovered',message:`Interrupted task recovered after reload. No task result saved; ${elapsed} elapsed seconds allocated.`,details:{elapsedSeconds:elapsed,checkId:state.pendingTask.checkId}}]};
}
