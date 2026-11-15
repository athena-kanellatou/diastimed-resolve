import {publicUrl} from './urls';
import {useEffect,useRef,useState} from 'react';

// A decorative sphere projection of a NASA texture. Geometry, lighting and
// latitude are precomputed; rotation only changes longitude during playback.
// The renderer is independent of the medical review and task clock.
export default function Globe({paused,phase=1}:{paused:boolean;phase?:number}){
 const canvas=useRef<HTMLCanvasElement>(null),controls=useRef({paused,phase});
 const [fallback,setFallback]=useState(false);controls.current={paused,phase};
 useEffect(()=>{
  const el=canvas.current,context=el?.getContext('2d',{alpha:true});
  if(!el||!context){setFallback(true);return;}
  const size=matchMedia('(max-width:700px)').matches?480:640;
  el.width=size;el.height=size;
  let disposed=false,raf=0,visible=true,last=0,angle=0,dirty=true,loaded=false,lastPhase=phase,lastPaused=paused;
  let texture:Uint8ClampedArray,width=0,height=0;
  const frame=context.createImageData(size,size),data=frame.data;
  const count=size*size,u=new Float32Array(count),row=new Uint32Array(count),light=new Float32Array(count),rim=new Float32Array(count),spec=new Float32Array(count),inside=new Uint8Array(count);
  const tilt=-.16,c=Math.cos(tilt),s=Math.sin(tilt),ln=Math.hypot(-.45,.65,1.2),lx=-.45/ln,ly=.65/ln,lz=1.2/ln;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const i=y*size+x,j=i*4,nx=((x+.5)/size*2-1)*1.07,ny=(1-(y+.5)/size*2)*1.07,r2=nx*nx+ny*ny;
   if(r2>1){const a=Math.exp(-(Math.sqrt(r2)-1)*65)*.5;data[j]=40;data[j+1]=128;data[j+2]=255;data[j+3]=Math.round(a*255);continue;}
   inside[i]=1;const nz=Math.sqrt(1-r2),ty=ny*c-nz*s,tz=ny*s+nz*c;
   u[i]=Math.atan2(tz,nx)/(2*Math.PI)+.5;light[i]=.12+.94*Math.max(0,nx*lx+ny*ly+nz*lz);rim[i]=Math.pow(1-nz,3.5)*.7;
   const d=nx*lx+ny*ly+nz*lz;spec[i]=Math.pow(Math.max(0,2*d*nz-lz),45)*.6;
   // Latitude is independent of the rotation around Earth's axis.
   row[i]=Math.round((.5-Math.asin(Math.max(-1,Math.min(1,ty)))/Math.PI)*65535);
   data[j+3]=Math.round(Math.min(1,(1-Math.sqrt(r2))/.004)*255);
  }
  const draw=(now:number)=>{
   if(disposed)return;
   const options=controls.current;if(options.phase!==lastPhase||options.paused!==lastPaused){dirty=true;lastPhase=options.phase;lastPaused=options.paused;}
   if(loaded&&visible&&!document.hidden&&(dirty||!options.paused&&now-last>=65)){
    if(!options.paused&&last)angle+=Math.min(.1,(now-last)/1000)*.035;
    const offset=(angle+options.phase*.95)/(2*Math.PI);
    for(let i=0;i<count;i++)if(inside[i]){
     const longitude=((u[i]+offset)%1+1)%1,source=(Math.min(height-1,row[i])*width+Math.min(width-1,Math.floor(longitude*width)))*4,j=i*4;
     const red=texture[source],green=texture[source+1],blue=texture[source+2],ocean=Math.max(0,Math.min(1,(blue-Math.max(red,green)-10)/36)),glint=spec[i]*ocean;
     data[j]=red*light[i]+23*rim[i]+41*glint;data[j+1]=green*light[i]+89*rim[i]+92*glint;data[j+2]=blue*light[i]+204*rim[i]+161*glint;
    }
    context.putImageData(frame,0,0);dirty=false;last=now;
   }
   raf=requestAnimationFrame(draw);
  };
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;dirty=true;});observer.observe(el);
  const img=new Image();img.onload=()=>{
   if(disposed)return;
   try{const map=document.createElement('canvas');map.width=img.naturalWidth;map.height=img.naturalHeight;const ctx=map.getContext('2d')!;ctx.drawImage(img,0,0);texture=ctx.getImageData(0,0,map.width,map.height).data;width=map.width;height=map.height;for(let i=0;i<count;i++)row[i]=Math.min(height-1,Math.floor(row[i]/65535*height));loaded=true;dirty=true;}catch{setFallback(true);}
  };img.onerror=()=>{if(!disposed)setFallback(true);};img.src=publicUrl('assets/blue-marble.jpg');raf=requestAnimationFrame(draw);
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();img.onload=null;img.onerror=null;};
 },[]);
 return <div className={'mission-globe '+(fallback?'has-fallback':'')} aria-hidden="true"><div className="mission-globe-fallback"/><canvas ref={canvas}/></div>;
}
