/** Optional real-duration scripted software check. Not a human test or timing calibration.
 * Start a production preview first. Requires Playwright + Chromium separately.
 * RESOLVE_URL defaults to http://127.0.0.1:4173/diastimed-resolve/.
 * Optional RESOLVE_PLAYWRIGHT_MODULE and RESOLVE_CHROMIUM supply local installations.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.RESOLVE_PLAYWRIGHT_MODULE??'playwright');
const base=process.env.RESOLVE_URL??'http://127.0.0.1:4173/diastimed-resolve/';
const out=process.env.RESOLVE_BROWSER_OUTPUT??'artifacts/browser-verification';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.RESOLVE_CHROMIUM?{executablePath:process.env.RESOLVE_CHROMIUM}:{})});
const context=await browser.newContext({viewport:{width:1440,height:1100},acceptDownloads:true});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
const results={classification:'Scripted software verification using synthetic records. Not human performance, clinical evidence or device calibration.',url:base,browser:browser.version(),checks:[],task:null};
const check=(label)=>{results.checks.push(label);console.log(label);};
const stored=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('diastimed-resolve-v2')));
async function load(name){await page.getByRole('button',{name:'Load scenario',exact:true}).click();await page.getByRole('button',{name:new RegExp(name)}).click();}
try{
 await page.goto(base+'#workspace');await page.getByRole('button',{name:'Start check',exact:true}).waitFor();
 assert.equal((await stored()).observations.length,2);
 await page.screenshot({path:out+'/workspace.png',fullPage:true});
 await page.getByRole('button',{name:'Start check',exact:true}).click();
 await page.getByRole('textbox').fill('End of a routine shift; task devices initially available; no interruptions reported.');
 await page.getByRole('button',{name:'Save & update plan'}).click();
 assert.equal((await stored()).spentSeconds,25);check('Context capture and allocation');
 await page.getByRole('switch',{name:'Workstation available'}).click();assert.equal(await page.getByText('+15s estimated allocation',{exact:true}).count(),1);check('Tablet fallback with 15s declared overhead');
 await page.getByRole('switch',{name:'Tablet available'}).click();assert.equal(await page.getByText('Evidence remains unresolved',{exact:true}).count(),1);
 await page.getByRole('button',{name:'Open review brief',exact:true}).first().click();await page.getByText('No usable objective task observation is available; the self-reports alone cannot establish alertness.',{exact:true}).waitFor();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export review',exact:true}).first().click();const download=await downloadPromise;const downloadPath=await download.path();const packet=JSON.parse(await fs.readFile(downloadPath,'utf8'));
 assert.equal(packet.schemaVersion,4);assert.equal(packet.policySnapshot.task.minimumResponses,20);assert.deepEqual(packet.plan.unresolved,['vigilance']);assert.equal(packet.reviewSummary.status,'incomplete');
 await fs.writeFile(out+'/equipment-loss-export.json',JSON.stringify(packet,null,2));await page.screenshot({path:out+'/review-gap.png',fullPage:true});check('Equipment-loss brief and schema-4 manual export');
 await page.getByRole('button',{name:'Research & policy',exact:true}).click();await page.getByRole('heading',{name:'What changes when assumptions change?'}).waitFor();await page.screenshot({path:out+'/research.png',fullPage:true});check('Data-bound sensitivity summary renders');
 await page.getByRole('button',{name:'Review workspace',exact:true}).click();await load('Expired vigilance observation');
 await page.getByRole('button',{name:'Start check',exact:true}).click();const close=page.getByRole('button',{name:'Close dialog'});await page.keyboard.press('Shift+Tab');assert.equal(await close.evaluate(el=>el===document.activeElement),false);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);check('Modal Escape closure and reverse-Tab containment');
 if(!process.env.RESOLVE_BROWSER_QUICK){
 // Verify actual hidden-document interruption with a second browser tab.
 await page.getByRole('button',{name:'Start check',exact:true}).click();await page.getByRole('button',{name:'Start three-minute task'}).click();await page.waitForTimeout(1500);const other=await context.newPage();await other.goto('about:blank');await other.bringToFront();
 // Headless Chromium may leave the document visible: do not dispatch a synthetic visibility event and call it genuine.
 const hidden=await page.evaluate(()=>document.hidden);if(hidden){await page.waitForTimeout(100);const interrupted=await stored();assert.equal(interrupted.pendingTask,null);assert.equal(interrupted.observations.filter(o=>o.source==='user'&&o.metric==='vigilance').length,0);check('Genuine hidden-tab interruption with no vigilance result');}else check('Hidden-tab test unavailable: headless page remained visible');
 await other.close();await page.bringToFront();await page.keyboard.press('Escape');
 // Reload recovery: start a task, then reload while it is genuinely in progress.
 await page.getByRole('button',{name:'Start check',exact:true}).click();await page.getByRole('button',{name:'Start three-minute task'}).click();await page.waitForTimeout(1500);await page.reload();await page.getByText('Interrupted session recovered',{exact:true}).waitFor();assert.equal((await stored()).pendingTask,null);check('Real browser reload recovers pending task without result');
 // Fresh reset followed by actual wall-clock duration and scripted positive responses.
 await load('Expired vigilance observation');await page.getByRole('button',{name:'Start check',exact:true}).click();await page.getByRole('button',{name:'Start three-minute task'}).click();
 const started=Date.now();let lastProgress=0;
 while(Date.now()-started<195000){
 if(await page.getByRole('button',{name:'Respond to cue',exact:true}).count())await page.getByRole('button',{name:'Respond to cue',exact:true}).click({timeout:1000}).catch(()=>{});
 if(!(await stored()).pendingTask)break;
 if(Date.now()-started-lastProgress>30000){lastProgress=Date.now()-started;console.log(`Actual-duration task: ${Math.round(lastProgress/1000)} seconds elapsed`);}
 await page.waitForTimeout(80);
 }
 const after=await stored(),observation=after.observations.filter(o=>o.source==='user'&&o.metric==='vigilance').at(-1);assert.ok(observation);assert.equal(observation.task.durationSeconds,180);assert.ok(observation.task.responseMs.length>=20);assert.ok(Date.now()-started>=179000);assert.equal(after.spentSeconds,180);
 results.task={wallClockSeconds:(Date.now()-started)/1000,responses:observation.task.responseMs.length,missed:observation.task.missed,premature:observation.task.premature,medianMs:observation.value};check('Actual 180-second task saves technically consistent observation');
 await page.getByRole('button',{name:'Open review brief',exact:true}).first().click();await page.getByText(new RegExp(`${observation.task.missed} timed-out cues`)).waitFor();await page.screenshot({path:out+'/task-brief.png',fullPage:true});check('Task limitations remain in human-review brief');
 }
 // Exercise cached production shell and workflow in a browser offline context.
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.getByRole('button',{name:'Review workspace',exact:true}).click();await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
 await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'Review workspace',exact:true}).waitFor();
 await load('Fatigue review');await page.getByRole('button',{name:'Start check',exact:true}).click();await page.getByRole('textbox').fill('Synthetic offline routine shift.');await page.getByRole('button',{name:'Save & update plan'}).click();await page.getByRole('switch',{name:'Workstation available'}).click();await page.getByRole('switch',{name:'Tablet available'}).click();assert.equal((await stored()).observations.length,3);check('Cached production shell reload and synthetic context/equipment workflow offline');await context.setOffline(false);
 for(const width of [390,768,1440]){await page.setViewportSize({width,height:1000});await page.getByRole('button',{name:'Review workspace',exact:true}).waitFor();const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));assert.ok(size.scroll<=size.viewport,JSON.stringify({width,...size}));await page.screenshot({path:`${out}/workspace-${width}.png`,fullPage:true});}check('No document overflow at 390/768/1440 CSS pixels (emulation only)');
 assert.deepEqual(errors,[]);check('No uncaught browser errors');
}finally{console.log(JSON.stringify(results));await fs.writeFile(out+'/results.json',JSON.stringify(results,null,2));await browser.close();}
