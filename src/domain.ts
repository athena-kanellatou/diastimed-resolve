export type Metric = 'sleep' | 'fatigue' | 'context' | 'vigilance';
export type Capability = 'workstation' | 'tablet';
export type TaskSession = {device:Capability; durationSeconds:number; responseMs:number[]; premature:number; missed:number; completedAt:string};
export type Observation = { id:string; metric:Metric; value:number|string; unit:string; recordedAt:string; quality:'usable'|'unusable'|'unknown'; method:string; source:'synthetic'|'user'; note?:string; task?:TaskSession };
export type State = { observations:Observation[]; resources:Record<Capability,boolean>; budget:number; urgent:boolean; now:string; spentSeconds?:number; qualityDecisions?:{observationId:string; quality:Observation['quality']; at:string}[]; events:{at:string;message:string; kind?:string; details?:unknown}[] };
export type Check = {id:string; title:string; supplies:Metric[]; seconds:number; capability?:Capability; prerequisites:Metric[]; why:string; sourceIds:string[]};
export const POLICY_VERSION='resolve-evidence-v0.2';
export const requirements:{id:Metric;label:string;short:string;maxAgeHours:number;method:string;unit:string;sourceIds:string[]}[]=[
 {id:'sleep',label:'Recent sleep record',short:'Sleep',maxAgeHours:24,method:'self-report-v1',unit:'hours',sourceIds:['sleep','standard']},
 {id:'fatigue',label:'Current fatigue report',short:'Fatigue',maxAgeHours:6,method:'self-report-v1',unit:'/10',sourceIds:['sleep','reaction']},
 {id:'context',label:'Workload & measurement context',short:'Context',maxAgeHours:6,method:'self-report-v1',unit:'note',sourceIds:['standard']},
 {id:'vigilance',label:'Vigilance task observation',short:'Vigilance',maxAgeHours:4,method:'pvt-inspired-v1',unit:'ms',sourceIds:['reaction','pvt']}
];
export const sources=[
 {id:'sleep',name:'Sleep & irregular schedules',org:'NASA Human Research Program',url:'https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/',supports:'Sleep disruption and workload matter during spaceflight.',limit:'Does not establish our freshness windows or diagnose fatigue.'},
 {id:'standard',name:'Spaceflight Standard Measures',org:'NASA',url:'https://www.nasa.gov/reference/standard-measures/',supports:'Combining physiological, psychological and contextual observations.',limit:'Does not validate our evidence-completeness policy.'},
 {id:'reaction',name:'Reaction Self Test on ISS',org:'NASA Technical Reports Server',url:'https://ntrs.nasa.gov/citations/20090029851',supports:'Brief objective observations of alertness with low crew burden.',limit:'Does not validate this browser task or establish fitness for duty.'},
 {id:'pvt',name:'Brief vigilance task research',org:'Basner, Mollicone & Dinges · 2011',url:'https://pubmed.ncbi.nlm.nih.gov/22025811/',supports:'A published three-minute vigilance paradigm studied under sleep loss.',limit:'Our task is PVT-inspired and has not been clinically or device validated.'},
 {id:'exmc',name:'Exploration medical architecture',org:'NASA · ExMC',url:'https://ntrs.nasa.gov/citations/20220017869',supports:'Earth-independent medical support under resource and communication constraints.',limit:'Does not establish medical optimality of our planner.'}
];
export const checks:Check[]=[
 {id:'check-in',title:'Complete a guided check-in',supplies:['sleep','fatigue','context'],seconds:70,prerequisites:[],why:'Collect the three missing self-report fields together, with a timestamp and clear scale anchors.',sourceIds:['sleep','standard']},
 {id:'sleep-report',title:'Record recent sleep',supplies:['sleep'],seconds:35,prerequisites:[],why:'Refresh the sleep record without repeating other usable observations.',sourceIds:['sleep']},
 {id:'fatigue-report',title:'Record current fatigue',supplies:['fatigue'],seconds:30,prerequisites:[],why:'Add a current self-report. This custom 0–10 scale is descriptive, not a validated instrument.',sourceIds:['reaction']},
 {id:'context-report',title:'Record workload & context',supplies:['context'],seconds:25,prerequisites:[],why:'Keep work demands and measurement circumstances alongside the observations.',sourceIds:['standard']},
 {id:'workstation-task',title:'Run the workstation vigilance task',supplies:['vigilance'],seconds:180,capability:'workstation',prerequisites:['context'],why:'Collect an objective task observation after recording its context. Requires an uninterrupted three-minute session.',sourceIds:['reaction','pvt']},
 {id:'tablet-task',title:'Run the tablet vigilance task',supplies:['vigilance'],seconds:195,capability:'tablet',prerequisites:['context'],why:'Use the available tablet when the workstation is unavailable. Device differences limit direct comparison.',sourceIds:['reaction','pvt']}
];
export function assess(observation:Observation,now:string){
 const req=requirements.find(r=>r.id===observation.metric);
 if(!req)return {accepted:false,reason:'Unknown metric'};
 const age=(Date.parse(now)-Date.parse(observation.recordedAt))/3600000;
 if(!Number.isFinite(age)||age<0)return {accepted:false,reason:'Invalid or future timestamp'};
 if(observation.quality!=='usable')return {accepted:false,reason:observation.quality==='unknown'?'Quality is unknown':'Marked unusable'};
 if(observation.method!==req.method||observation.unit!==req.unit)return {accepted:false,reason:'Incompatible method or units'};
 if(age>req.maxAgeHours)return {accepted:false,reason:`Older than the assumed ${req.maxAgeHours}-hour window`};
 const v=observation.value;
 if(req.id==='sleep'&&(typeof v!=='number'||!Number.isFinite(v)||v<0||v>24))return {accepted:false,reason:'Sleep must be 0–24 hours'};
 if(req.id==='fatigue'&&(typeof v!=='number'||!Number.isFinite(v)||v<0||v>10))return {accepted:false,reason:'Fatigue must be 0–10'};
 if(req.id==='vigilance'&&(typeof v!=='number'||!Number.isFinite(v)||v<=0))return {accepted:false,reason:'Task result must be a positive number'};
 if(req.id==='context'&&(typeof v!=='string'||!v.trim()))return {accepted:false,reason:'Context is empty'};
 return {accepted:true,reason:`Usable within the assumed ${req.maxAgeHours}-hour window`};
}
export function evidence(state:State){return requirements.map(req=>{
 const entries=state.observations.filter(o=>o.metric===req.id).sort((a,b)=>Date.parse(b.recordedAt)-Date.parse(a.recordedAt));
 const effective=(o:Observation)=>({...o,quality:[...(state.qualityDecisions??[])].reverse().find(d=>d.observationId===o.id)?.quality??o.quality});
 const usable=entries.find(o=>assess(effective(o),state.now).accepted);
 return {requirement:req,observation:usable??entries[0],accepted:!!usable,reason:usable?assess(effective(usable),state.now).reason:entries[0]?assess(effective(entries[0]),state.now).reason:'No observation recorded'};
});}
export type Plan={status:'complete'|'ready'|'incomplete'|'urgent';actions:Check[];seconds:number;missing:Metric[];unresolved:Metric[];reused:Metric[]};
export function plan(state:State):Plan{
 const rows=evidence(state),reused=rows.filter(r=>r.accepted).map(r=>r.requirement.id),missing=rows.filter(r=>!r.accepted).map(r=>r.requirement.id);
 if(state.urgent)return {status:'urgent',actions:[],seconds:0,missing,unresolved:missing,reused};
 if(!missing.length)return {status:'complete',actions:[],seconds:0,missing,unresolved:[],reused};
 let best:Check[]|null=null,bestTime=Infinity,partial:Check[]=[],partialCovered=new Set(reused),partialTime=0;
 function search(covered:Set<Metric>,path:Check[],seconds:number){
  if(covered.size>partialCovered.size||(covered.size===partialCovered.size&&seconds<partialTime)){partial=path;partialCovered=covered;partialTime=seconds;}
  if(covered.size===requirements.length){if(seconds<bestTime||(seconds===bestTime&&path.map(x=>x.id).join(',')<(best??[]).map(x=>x.id).join(','))){best=path;bestTime=seconds;}return;}
  for(const check of checks){
   if(path.some(x=>x.id===check.id)||check.capability&&!state.resources[check.capability]||check.prerequisites.some(x=>!covered.has(x))||check.supplies.every(x=>covered.has(x)))continue;
   if(seconds+check.seconds>remainingBudget(state)||seconds+check.seconds>bestTime)continue;
   search(new Set([...covered,...check.supplies]),[...path,check],seconds+check.seconds);
  }
 }
 search(new Set(reused),[],0);
 if(best)return {status:'ready',actions:best,seconds:bestTime,missing,unresolved:[],reused};
 return {status:'incomplete',actions:partial,seconds:partialTime,missing,unresolved:requirements.filter(r=>!partialCovered.has(r.id)).map(r=>r.id),reused};
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
export function eligibility(state:State,check:Check):string|null{
 if(state.urgent)return 'Routine collection is paused for urgent-help routing.';
 if(check.capability&&!state.resources[check.capability])return 'The required device is unavailable.';
 const have=new Set(evidence(state).filter(r=>r.accepted).map(r=>r.requirement.id));
 const missing=check.prerequisites.filter(m=>!have.has(m));
 if(missing.length)return 'Record usable '+missing.map(m=>requirements.find(r=>r.id===m)!.short.toLowerCase()).join(', ')+' before this check.';
 if(check.seconds>remainingBudget(state))return 'This check exceeds the remaining session allowance.';
 return null;
}
export function recordCheck(state:State,check:Check,values:{metric:Metric;value:number|string}[],task?:TaskSession):State{
 const reason=eligibility(state,check);if(reason)throw new Error(reason);
 if(values.length!==check.supplies.length||new Set(values.map(v=>v.metric)).size!==check.supplies.length||check.supplies.some(m=>!values.some(v=>v.metric===m)))throw new Error('The observation set does not match this check.');
 if(check.supplies.includes('vigilance')&&(!task||task.device!==check.capability||task.durationSeconds<180||task.responseMs.length<20||task.responseMs.some(x=>!Number.isFinite(x)||x<=0)||task.premature<0||task.missed<0))throw new Error('A complete three-minute task with at least 20 valid responses is required.');
 const observations:Observation[]=values.map(v=>({id:crypto.randomUUID(),...v,unit:requirements.find(r=>r.id===v.metric)!.unit,recordedAt:state.now,quality:'usable',method:v.metric==='vigilance'?'pvt-inspired-v1':'self-report-v1',source:'user',...(task?{task}:{} )}));
 for(const o of observations){const decision=assess(o,state.now);if(!decision.accepted)throw new Error(decision.reason);}
 return {...state,observations:[...state.observations,...observations],spentSeconds:(state.spentSeconds??0)+check.seconds,events:[...state.events,{at:state.now,kind:'check-recorded',message:check.title+' completed; '+check.seconds+' estimated seconds allocated.',details:{checkId:check.id,observationIds:observations.map(o=>o.id),allocatedSeconds:check.seconds}}]};
}
export function packet(state:State){return {schemaVersion:2,project:'DiastiMed RESOLVE',policy:POLICY_VERSION,exportedAt:new Date().toISOString(),scenarioClock:state.now,classification:'Research prototype; evidence completeness is not medical clearance.',assumptions:{freshnessHours:Object.fromEntries(requirements.map(r=>[r.id,r.maxAgeHours])),costs:'Estimated action allocations, not observed crew performance. Completed checks consume their declared cost; interrupted tasks consume elapsed seconds.',taskQuality:'At least 180 seconds and 20 valid responses; unvalidated engineering rule.'},policySnapshot:{requirements,checks},session:{budgetSeconds:state.budget,spentSeconds:state.spentSeconds??0,remainingSeconds:remainingBudget(state),urgent:state.urgent},observations:state.observations,qualityDecisions:state.qualityDecisions??[],evidence:evidence(state),plan:plan(state),resources:state.resources,events:state.events,sources};}
