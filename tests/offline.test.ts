import{test}from'node:test';import assert from'node:assert/strict';import vm from'node:vm';import{readFileSync}from'node:fs';
// Exercise the shipped service worker with network/cache doubles. This is not a production-browser offline test.
test('service worker caches the shell and hashed assets and returns cached navigation offline',async()=>{
 const handlers:Record<string,(event:any)=>void>={},entries=new Map<string,Response>();let offline=false;
 const cache={addAll:async(paths:string[])=>{for(const p of paths)entries.set(new URL(p,'https://demo.test/').href,new Response(p));},put:async(request:Request,response:Response)=>{entries.set(request.url,response);}};
 const caches={open:async()=>cache,keys:async()=>[],delete:async()=>true,match:async(request:string|Request)=>entries.get(typeof request==='string'?new URL(request,'https://demo.test/').href:request.url)};
 const self={location:{origin:'https://demo.test'},addEventListener:(name:string,fn:any)=>handlers[name]=fn,skipWaiting:()=>{},clients:{claim:()=>{}}};
 vm.runInNewContext(readFileSync(new URL('../public/sw.js',import.meta.url),'utf8'),{self,caches,URL,Response,fetch:async()=>{if(offline)throw new Error('offline');return new Response('<script src="/assets/app.js"></script><link href="/assets/app.css">');}});
 let installation:Promise<unknown>|undefined;handlers.install({waitUntil:(p:Promise<unknown>)=>installation=p});await installation;
 assert.ok(entries.has('https://demo.test/assets/app.js'));assert.ok(entries.has('https://demo.test/assets/app.css'));offline=true;
 let response:Promise<Response>|undefined;handlers.fetch({request:{method:'GET',url:'https://demo.test/deep-review',mode:'navigate'},respondWith:(p:Promise<Response>)=>response=p});assert.ok(response);assert.ok(await response);
 response=undefined;handlers.fetch({request:{method:'GET',url:'https://demo.test/private-data',mode:'cors'},respondWith:(p:Promise<Response>)=>response=p});assert.equal(response,undefined);
});
