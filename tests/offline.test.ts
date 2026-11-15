import{test}from'node:test';import assert from'node:assert/strict';import vm from'node:vm';import{readFileSync}from'node:fs';
// Exercise the shipped worker with network/cache doubles; production-browser offline use is separate.
for(const base of ['/', '/diastimed-resolve/'])test(`service worker caches assets and offline navigation within ${base}`,async()=>{
 const scope=`https://demo.test${base}`,handlers:Record<string,(event:any)=>void>={},entries=new Map<string,Response>();let offline=false;
 const cache={addAll:async(paths:string[])=>{for(const p of paths)entries.set(new URL(p,scope).href,new Response(p));},put:async(request:Request,response:Response)=>{entries.set(request.url,response);}};
 const caches={open:async()=>cache,keys:async()=>[],delete:async()=>true,match:async(request:string|Request)=>entries.get(typeof request==='string'?new URL(request,scope).href:request.url)};
 const self={registration:{scope},location:{origin:'https://demo.test'},addEventListener:(name:string,fn:any)=>handlers[name]=fn,skipWaiting:()=>{},clients:{claim:()=>{}}};
 vm.runInNewContext(readFileSync(new URL('../public/sw.js',import.meta.url),'utf8'),{self,caches,URL,Response,fetch:async()=>{if(offline)throw new Error('offline');return new Response(`<script src="${base}assets/app.js"></script><link href="${base}assets/app.css">`);}});
 let installation:Promise<unknown>|undefined;handlers.install({waitUntil:(p:Promise<unknown>)=>installation=p});await installation;
 assert.ok(entries.has(`${scope}assets/app.js`));assert.ok(entries.has(`${scope}assets/app.css`));offline=true;
 let response:Promise<Response>|undefined;const request=(path:string,mode:string)=>handlers.fetch({request:{method:'GET',url:new URL(path,scope).href,mode},respondWith:(p:Promise<Response>)=>response=p});
 request('deep-review','navigate');assert.ok(response);assert.equal(await(await response).text(),`${scope}index.html`);
 response=undefined;request('private-data','cors');assert.equal(response,undefined);
 if(base!=='/'){request('/another-project/','navigate');assert.equal(response,undefined);}
});
