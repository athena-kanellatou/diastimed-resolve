const initial={completed:13,tested:25};
const revised=[{label:'Returning participants',completed:8,tested:9},{label:'New participants',completed:4,tested:6}];
const percent=(completed:number,tested:number)=>`${Math.round(100*completed/tested)}%`;

export default function UsabilitySummary(){
 const completed=revised.reduce((total,group)=>total+group.completed,0),tested=revised.reduce((total,group)=>total+group.tested,0);
 return <section className="policy-section usability-study" aria-labelledby="usability-title">
  <span className="eyebrow">FORMATIVE USABILITY / TEAM-REPORTED RESULTS</span>
  <h2 id="usability-title">Test. Revise. Test again.</h2>
  <p>Participants attempted the equipment-loss scenario. The team reports revising the prototype after observing difficulties in the first round.</p>
  <div className="usability-rounds">
   <div><span>INITIAL VERSION</span><strong>{percent(initial.completed,initial.tested)}</strong><p>{initial.completed} of {initial.tested} completed the scenario</p></div>
   <div><span>REVISED VERSION</span><strong>{percent(completed,tested)}</strong><p>{completed} of {tested} completed the scenario</p></div>
  </div>
  <div className="usability-table-wrap"><table className="policy-table"><caption>Revised-version results by participant experience</caption><thead><tr><th scope="col">Participant group</th><th scope="col">Completed / tested</th><th scope="col">Completion</th></tr></thead><tbody>{revised.map(group=><tr key={group.label}><th scope="row">{group.label}</th><td>{group.completed} / {group.tested}</td><td>{percent(group.completed,group.tested)}</td></tr>)}</tbody></table></div>
  <p className="usability-limits">The rounds differ by 28 percentage points. Nine returning participants had prior exposure; six were new. Small groups and familiarity limit conclusions about the redesign's effect. These aggregate results were supplied by the team; participant-level records and assistance criteria were not available for review.</p>
  <p className="usability-limits">The team additionally reports testing with 30 LinkedIn-recruited volunteers: 18 first-time and 12 returning. Completion and assistance outcomes for that reported round are not established in the available records; those participants are not included in the rates above.</p>
  <a className="text-button" href="https://github.com/athena-kanellatou/diastimed-resolve/blob/main/docs/USABILITY.md" target="_blank" rel="noreferrer">Read the evaluation record ↗</a>
 </section>;
}
