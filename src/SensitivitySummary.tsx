import {publicUrl} from './urls';
import results from '../public/sensitivity/summary.json';
export default function SensitivitySummary(){
 return <section className="policy-section" aria-labelledby="sensitivity-title">
  <span className="eyebrow">SYNTHETIC POLICY ANALYSIS</span>
  <h2 id="sensitivity-title">What changes when assumptions change?</h2>
  <p>We varied 81 freshness configurations, declared collection costs and remaining allowances. Every input is authored and reproducible. These settings are stress tests, not medical recommendations.</p>
  <table className="policy-table"><thead><tr><th scope="col">Analysis</th><th scope="col">Planning cases</th></tr></thead><tbody>
   <tr><th scope="row">Freshness windows</th><td>{results.families.freshness.toLocaleString('en-US')}</td></tr>
   <tr><th scope="row">Costs, devices &amp; remaining allowance</th><td>{results.families.cost.toLocaleString('en-US')}</td></tr>
   <tr><th scope="row">Urgent-routing checks</th><td>{results.families.urgent}</td></tr>
  </tbody></table>
  <p>Across {results.cases.toLocaleString('en-US')} planning cases, {results.nextActionChanges.toLocaleString('en-US')} next actions and {results.feasibilityTransitions.toLocaleString('en-US')} complete/incomplete feasibility decisions changed from the default policy on the same inputs. All tested plans matched the permutation reference on achievable coverage and declared cost. This checks the software model; it does not establish medically correct rules or real crew-time savings.</p>
  <p>Expert review and the new prospective participant round are pending. The historical team-reported usability counts above remain separate.</p>
  <div className="source-links"><a href={publicUrl('sensitivity/summary.json')} download>Analysis summary JSON ↗</a><a href={publicUrl('sensitivity/cases.ndjson.gz')} download>All calculated cases ↗</a><a href="https://github.com/athena-kanellatou/diastimed-resolve/blob/main/docs/SENSITIVITY.md" target="_blank" rel="noreferrer">Methods &amp; reproducibility ↗</a></div>
 </section>;
}
