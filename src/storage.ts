import{scenario,recoverInterrupted,type State}from'./domain.ts';
export const STORE='diastimed-resolve-v2';
type StorageLike=Pick<Storage,'getItem'|'setItem'>;
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const finite=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
const date=(v:unknown)=>typeof v==='string'&&Number.isFinite(Date.parse(v));
export function validState(v:unknown):v is State{
 if(!object(v)||!Array.isArray(v.observations)||!Array.isArray(v.events)||!object(v.resources)||typeof v.resources.workstation!=='boolean'||typeof v.resources.tablet!=='boolean'||!finite(v.budget)||typeof v.urgent!=='boolean'||!date(v.now))return false;
 if(v.spentSeconds!==undefined&&!finite(v.spentSeconds))return false;
 if(v.reviewQuestion!==undefined&&(typeof v.reviewQuestion!=='string'||v.reviewQuestion.length>2000))return false;
 if(v.pendingTask!=null&&(!object(v.pendingTask)||!['workstation-task','tablet-task'].includes(String(v.pendingTask.checkId))||!date(v.pendingTask.startedAt)))return false;
 if(!v.observations.every(o=>object(o)&&typeof o.id==='string'&&['sleep','fatigue','context','vigilance'].includes(String(o.metric))&&(typeof o.value==='string'||typeof o.value==='number')&&typeof o.unit==='string'&&typeof o.method==='string'&&typeof o.recordedAt==='string'&&['usable','unusable','unknown'].includes(String(o.quality))&&['synthetic','user'].includes(String(o.source))&& (o.task===undefined||(object(o.task)&&['tablet','workstation'].includes(String(o.task.device))&&finite(o.task.durationSeconds)&&Array.isArray(o.task.responseMs)&&o.task.responseMs.every(x=>typeof x==='number'&&Number.isFinite(x)&&x>0)&&finite(o.task.premature)&&finite(o.task.missed)&&date(o.task.completedAt)))))return false;
 if(!v.events.every(e=>object(e)&&date(e.at)&&typeof e.message==='string'))return false;
 if(v.qualityDecisions!==undefined&&(!Array.isArray(v.qualityDecisions)||!v.qualityDecisions.every(d=>object(d)&&typeof d.observationId==='string'&&['usable','unusable','unknown'].includes(String(d.quality))&&date(d.at))))return false;
 return true;
}
export function readReview(storage:StorageLike,now=new Date().toISOString()){
 try{
 const raw=storage.getItem(STORE)||storage.getItem('diastimed-resolve-v1');
 const scenarioId=storage.getItem(STORE+'-scenario')||'review';
 if(!raw)return {state:scenario('review'),scenarioId:'review',warning:'',blocked:false};
 const value:unknown=JSON.parse(raw);
 if(!validState(value))throw new Error('Saved review has an unsupported structure.');
 return {state:recoverInterrupted({...value,spentSeconds:value.spentSeconds??0,qualityDecisions:value.qualityDecisions??[]},now),scenarioId,warning:value.pendingTask?'An unfinished task was interrupted by reload. No vigilance result was saved; elapsed time was allocated.':'',blocked:false};
 }catch{return {state:scenario('review'),scenarioId:'review',warning:'The saved review could not be read. Its stored contents have been left unchanged. A temporary simulation is open; export it or explicitly load a scenario to begin a new saved review.',blocked:true};}
}
export function writeReview(storage:StorageLike,state:State){try{storage.setItem(STORE,JSON.stringify(state));return true;}catch{return false;}}
