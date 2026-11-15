/** Comparators and a separate permutation reference, shared by benchmark and sensitivity. */
import {DEFAULT_POLICY,evidence,remainingBudget,type Policy,type State,type Metric} from '../src/domain.ts';
const fixed=['sleep-report','fatigue-report','context-report','workstation-task','tablet-task','check-in'];
export function comparator(s:State,policy:Policy=DEFAULT_POLICY,greedy=false){
 const covered=new Set<Metric>(evidence(s,policy).filter(r=>r.accepted).map(r=>r.requirement.id)),used=new Set<string>(),actions:string[]=[];let seconds=0;
 if(s.urgent)return {complete:false,seconds:0,coverage:covered.size,actions};
 while(covered.size<policy.requirements.length){
 const eligible=policy.checks.filter(c=>!used.has(c.id)&&(!c.capability||s.resources[c.capability])&&c.prerequisites.every(m=>covered.has(m))&&c.supplies.some(m=>!covered.has(m))&&c.seconds+seconds<=remainingBudget(s));
 eligible.sort((a,b)=>greedy?(b.supplies.filter(m=>!covered.has(m)).length/b.seconds-a.supplies.filter(m=>!covered.has(m)).length/a.seconds)||a.id.localeCompare(b.id):fixed.indexOf(a.id)-fixed.indexOf(b.id));
 const c=eligible[0];if(!c)break;used.add(c.id);actions.push(c.id);seconds+=c.seconds;c.supplies.forEach(m=>covered.add(m));
 }return {complete:covered.size===policy.requirements.length,seconds,coverage:covered.size,actions};
}
// Generate every ordered subset first, independently of plan's search and pruning.
const permutations:number[][]=[];
function permute(path:number[],rest:number[]){permutations.push(path);for(const i of rest)permute([...path,i],rest.filter(j=>i!==j));}
permute([],[0,1,2,3,4,5]);
export function reference(s:State,policy:Policy=DEFAULT_POLICY){
 const initial=evidence(s,policy).filter(r=>r.accepted).map(r=>r.requirement.id);
 if(s.urgent)return {coverage:initial.length,seconds:0,complete:false};
 let coverage=initial.length,seconds=0;
 for(const path of permutations){
 const have=new Set(initial);let cost=0,valid=true;
 for(const i of path){const c=policy.checks[i];if((c.capability&&!s.resources[c.capability])||c.prerequisites.some(m=>!have.has(m))){valid=false;break;}cost+=c.seconds;c.supplies.forEach(m=>have.add(m));}
 if(!valid||cost>remainingBudget(s))continue;
 if(have.size>coverage||(have.size===coverage&&cost<seconds)){coverage=have.size;seconds=cost;}
 }return {coverage,seconds,complete:coverage===policy.requirements.length};
}
