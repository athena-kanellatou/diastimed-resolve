const url=process.env.RESOLVE_URL??'http://127.0.0.1:4173/';
const deadline=Date.now()+30000;let ready=false;
while(Date.now()<deadline){try{if((await fetch(url)).ok){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,200));}
if(!ready)throw Error('Production preview did not start');
