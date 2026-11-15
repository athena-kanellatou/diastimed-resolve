import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(await fs.readFile(path.join(root,'docs/judging-assets.json'),'utf8'));
// Public authored presentation assets only. Never fetch code, user records or credentials.
const results=await Promise.all(manifest.files.map(async entry=>{
 if(!/^public\/(?:judging\/slide-[1-7]\.webp|DiastiMed_RESOLVE_judging\.(?:pdf|pptx))$/.test(entry.path))throw Error('Unexpected artifact path');
 const url=new URL(entry.url);
 if(url.origin!=='https://diastimed-resolve.appealingholly1.chatgpt.site')throw Error('Unexpected artifact origin');
 const response=await fetch(url,{signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw Error('Artifact download failed: '+entry.path+' '+response.status);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(createHash('sha256').update(bytes).digest('hex')!==entry.sha256)throw Error('Artifact integrity mismatch: '+entry.path);
 return {entry,bytes};
}));
for(const {entry,bytes}of results){const file=path.join(root,entry.path);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,bytes);}
console.log('Restored '+results.length+' hash-verified judging assets from public presentation version '+manifest.sourceVersion);
