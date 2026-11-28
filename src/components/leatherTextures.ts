import * as THREE from "three";
import type { JournalEdition } from "./editions";

// Original procedural leather texture. Broad tonal variation and small grain
// are separate scales; wear is concentrated along edges and the hinge.
export function leatherTextures(spec: JournalEdition) {
  const size=512;
  const colour=new Uint8Array(size*size*4);
  const height=new Uint8Array(size*size*4);
  const rough=new Uint8Array(size*size*4);
  const base=new THREE.Color(spec.leather);
  const edge=new THREE.Color(spec.edge);
  const rgb=new THREE.Color();
  const hash=(x:number,y:number)=>{
    let n=Math.imul(x,374761393)+Math.imul(y,668265263);
    n=Math.imul(n^(n>>>13),1274126177);
    return ((n^(n>>>16))>>>0)/4294967295;
  };
  const noise=(x:number,y:number)=>{
    const ix=Math.floor(x),iy=Math.floor(y);
    let u=x-ix,v=y-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);
    return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix,iy),hash(ix+1,iy),u),THREE.MathUtils.lerp(hash(ix,iy+1),hash(ix+1,iy+1),u),v);
  };
  const byte=(n:number)=>Math.round(THREE.MathUtils.clamp(n,0,1)*255);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const u=x/(size-1),v=y/(size-1);
    const low=noise(u*7,v*8), mid=noise(u*32,v*39);
    // Warped cellular ridges and pores, rather than uniform white noise.
    const gx=u*94+noise(u*23,v*24)*1.2, gy=v*115+noise(u*25+10,v*23)*1.2;
    let first=10,second=10;
    const cx=Math.floor(gx),cy=Math.floor(gy);
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const ax=cx+dx,ay=cy+dy;
      const d=(gx-ax-hash(ax,ay)*.8)**2+(gy-ay-hash(ax+77,ay+19)*.8)**2;
      if(d<first){second=first;first=d;}else if(d<second){second=d;}
    }
    const crease=Math.exp(-Math.abs(second-first)*7);
    const grain=.58-.31*crease+.10*(hash(x,y)-.5);
    const edgeDistance=Math.min(u,1-u,v,1-v);
    const worn=Math.exp(-edgeDistance*20)*spec.wear*(.45+.55*mid);
    const hinge=Math.exp(-u*30)*spec.wear*(.5+.5*Math.sin(v*42+mid*3)**2);
    const tonal=(low-.5)*spec.variation*1.6+(mid-.5)*spec.variation*.55;
    rgb.copy(base).multiplyScalar(1+tonal+grain*.05).lerp(edge,Math.min(.65,worn+hinge*.45));
    if(spec.id==="patina")rgb.lerp(new THREE.Color("#a49468"),worn*.65);
    // THREE.Color stores linear RGB; colour map bytes are encoded as sRGB.
    rgb.convertLinearToSRGB();
    const k=(y*size+x)*4;
    colour[k]=byte(rgb.r);colour[k+1]=byte(rgb.g);colour[k+2]=byte(rgb.b);colour[k+3]=255;
    const h=byte(grain-hinge*.19);
    height[k]=height[k+1]=height[k+2]=h;height[k+3]=255;
    const r=byte(spec.roughness+(mid-.5)*.13-worn*.25);
    rough[k]=rough[k+1]=rough[k+2]=r;rough[k+3]=255;
  }
  const make=(data:Uint8Array,srgb:boolean)=>{
    const t=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
    t.colorSpace=srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;
    t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;
    t.generateMipmaps=true;t.anisotropy=4;t.needsUpdate=true;return t;
  };
  return {colour:make(colour,true),height:make(height,false),roughness:make(rough,false)};
}
