/** Analyst-facing configuration. Values are engineering assumptions, not medical settings. */
export type Metric = 'sleep' | 'fatigue' | 'context' | 'vigilance';
export type Capability = 'workstation' | 'tablet';
export type Requirement = {id:Metric;label:string;short:string;maxAgeHours:number;method:string;unit:string;sourceIds:string[]};
export type Check = {id:string;title:string;supplies:Metric[];seconds:number;capability?:Capability;prerequisites:Metric[];why:string;sourceIds:string[]};
export type Policy = {
 version:string; classification:string; requirements:Requirement[]; checks:Check[];
 task:{durationSeconds:number;minimumResponses:number;cueTimeoutMs:number;cueDelayMinMs:number;cueDelayMaxMs:number;pollIntervalMs:number;summary:'rounded-median';hiddenTab:'interrupt';heldSpace:'ignore-repeat';performanceInterpretation:'none'};
 evidenceRules:{cutoff:'inclusive';quality:'usable-with-last-appended-amendment';selection:'newest-accepted-later-append-on-tie';userTask:'metadata-required';taskTimestamp:'earlier-of-recorded-and-completed';valueRules:{sleep:[0,24];fatigue:[0,10];context:'trimmed-nonempty';vigilance:'finite-positive'}};
 completeness:'all-four-fields';partialObjective:'maximum-covered-then-minimum-seconds';
};
export const POLICY_VERSION='resolve-evidence-v0.4';
export const DEFAULT_POLICY:Policy={
 version:POLICY_VERSION,classification:'Unvalidated engineering assumptions; collection completeness is not medical clearance.',
 requirements:[
 {id:'sleep',label:'Recent sleep record',short:'Sleep',maxAgeHours:24,method:'self-report-v1',unit:'hours',sourceIds:['sleep','standard']},
 {id:'fatigue',label:'Current fatigue report',short:'Fatigue',maxAgeHours:6,method:'self-report-v1',unit:'/10',sourceIds:['sleep','reaction']},
 {id:'context',label:'Workload & measurement context',short:'Context',maxAgeHours:6,method:'self-report-v1',unit:'note',sourceIds:['standard']},
 {id:'vigilance',label:'Vigilance task observation',short:'Vigilance',maxAgeHours:4,method:'pvt-inspired-v1',unit:'ms',sourceIds:['reaction','pvt']}
 ],
 checks:[
 {id:'check-in',title:'Complete a guided check-in',supplies:['sleep','fatigue','context'],seconds:70,prerequisites:[],why:'Collect the three missing self-report fields together, with a timestamp and clear scale anchors.',sourceIds:['sleep','standard']},
 {id:'sleep-report',title:'Record recent sleep',supplies:['sleep'],seconds:35,prerequisites:[],why:'Refresh the sleep record without repeating other usable observations.',sourceIds:['sleep']},
 {id:'fatigue-report',title:'Record current fatigue',supplies:['fatigue'],seconds:30,prerequisites:[],why:'Add a current self-report. This custom 0–10 scale is descriptive, not a validated instrument.',sourceIds:['reaction']},
 {id:'context-report',title:'Record workload & context',supplies:['context'],seconds:25,prerequisites:[],why:'Keep work demands and measurement circumstances alongside the observations.',sourceIds:['standard']},
 {id:'workstation-task',title:'Run the workstation vigilance task',supplies:['vigilance'],seconds:180,capability:'workstation',prerequisites:['context'],why:'Collect an objective task observation after recording its context. Requires an uninterrupted three-minute session.',sourceIds:['reaction','pvt']},
 {id:'tablet-task',title:'Run the tablet vigilance task',supplies:['vigilance'],seconds:195,capability:'tablet',prerequisites:['context'],why:'Use the available tablet when the workstation is unavailable. Device differences limit direct comparison.',sourceIds:['reaction','pvt']}
 ],
 task:{durationSeconds:180,minimumResponses:20,cueTimeoutMs:4000,cueDelayMinMs:1000,cueDelayMaxMs:4000,pollIntervalMs:25,summary:'rounded-median',hiddenTab:'interrupt',heldSpace:'ignore-repeat',performanceInterpretation:'none'},
 evidenceRules:{cutoff:'inclusive',quality:'usable-with-last-appended-amendment',selection:'newest-accepted-later-append-on-tie',userTask:'metadata-required',taskTimestamp:'earlier-of-recorded-and-completed',valueRules:{sleep:[0,24],fatigue:[0,10],context:'trimmed-nonempty',vigilance:'finite-positive'}},
 completeness:'all-four-fields',partialObjective:'maximum-covered-then-minimum-seconds'
};
export type PolicyOverrides={version:string;freshnessHours?:Partial<Record<Metric,number>>;allocations?:Record<string,number>;minimumResponses?:number;contextRequired?:boolean};
export function configuredPolicy(overrides:PolicyOverrides):Policy{
 const p:Policy=structuredClone(DEFAULT_POLICY);p.version=overrides.version;
 if(Object.keys(overrides.allocations??{}).some(id=>!p.checks.some(c=>c.id===id)))throw Error('Unknown allocation ID');
 for(const r of p.requirements)r.maxAgeHours=overrides.freshnessHours?.[r.id]??r.maxAgeHours;
 for(const c of p.checks){c.seconds=overrides.allocations?.[c.id]??c.seconds;if(c.capability&&overrides.contextRequired===false)c.prerequisites=[];}
 p.task.minimumResponses=overrides.minimumResponses??p.task.minimumResponses;
 validatePolicy(p);return p;
}
export function validatePolicy(p:Policy){
 const positive=(v:number)=>Number.isFinite(v)&&v>0;
 if(!p.version.trim()||p.requirements.length!==4||new Set(p.requirements.map(r=>r.id)).size!==4||p.requirements.some(r=>!DEFAULT_POLICY.requirements.some(d=>d.id===r.id&&d.method===r.method&&d.unit===r.unit)||!positive(r.maxAgeHours)))throw Error('Invalid evidence policy');
 if(p.checks.length!==6||new Set(p.checks.map(c=>c.id)).size!==6||p.checks.some(c=>!positive(c.seconds)||!DEFAULT_POLICY.checks.some(d=>d.id===c.id&&d.capability===c.capability&&JSON.stringify(d.supplies)===JSON.stringify(c.supplies))||c.prerequisites.some(m=>!p.requirements.some(r=>r.id===m))))throw Error('Invalid action policy');
 if(JSON.stringify(p.evidenceRules)!==JSON.stringify(DEFAULT_POLICY.evidenceRules))throw Error('Unsupported evidence semantics');
 const t=p.task;
 if(!positive(t.durationSeconds)||!Number.isInteger(t.minimumResponses)||t.minimumResponses<1||!positive(t.cueTimeoutMs)||!positive(t.cueDelayMinMs)||t.cueDelayMaxMs<t.cueDelayMinMs||!positive(t.cueDelayMaxMs)||!positive(t.pollIntervalMs)||t.summary!=='rounded-median'||t.hiddenTab!=='interrupt'||t.heldSpace!=='ignore-repeat'||t.performanceInterpretation!=='none'||p.completeness!=='all-four-fields'||p.partialObjective!=='maximum-covered-then-minimum-seconds'||p.checks.some(c=>c.capability&&c.seconds<t.durationSeconds))throw Error('Invalid task policy');
}
