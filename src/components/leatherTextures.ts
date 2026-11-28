import * as THREE from "three";
import type { JournalEdition } from "./editions";

// Original procedural leather texture. Broad tonal variation and small grain
// are separate scales; wear is concentrated along edges and the hinge.
export function leatherTextures(spec: JournalEdition) {
  const size=768;
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
    const low=noise(u*5,v*6), mid=noise(u*25,v*31);
    // Warped cellular ridges and pores, rather than uniform white noise.
    const cells=spec.id==="noir"?170:spec.id==="patina"?72:105;
    const gx=u*cells+noise(u*23,v*24)*1.6;
    const gy=v*cells*1.18+noise(u*25+10,v*23)*1.6;
    let first=10,second=10;
    const cx=Math.floor(gx),cy=Math.floor(gy);
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const ax=cx+dx,ay=cy+dy;
      const d=(gx-ax-hash(ax,ay)*.8)**2+(gy-ay-hash(ax+77,ay+19)*.8)**2;
      if(d<first){second=first;first=d;}else if(d<second){second=d;}
    }
    const crease=Math.exp(-Math.abs(second-first)*10);
    const pore=Math.exp(-first*22);
    const grain=.53-.36*crease-.15*pore+.12*(hash(x,y)-.5);
    const edgeDistance=Math.min(u,1-u,v,1-v);
    const edgeBreakup=.55+.45*noise(u*47,v*51);
    const corner=Math.exp(-Math.hypot(Math.min(u,1-u)*7,Math.min(v,1-v)*7)*2);
    const worn=(Math.exp(-edgeDistance*35)*edgeBreakup+corner*.4)*spec.wear;
    const hinge=Math.exp(-u*19)*spec.wear*(.35+.65*Math.sin(v*38+mid*7)**2);
    const wrinkle=spec.id==="patina"
      ? Math.exp(-Math.abs(Math.sin(v*24+noise(u*6,v*8)*4))*27)*Math.exp(-u*9)*.23
      : 0;
    const tonal=(low-.5)*spec.variation*2.1+(mid-.5)*spec.variation*.8;
    rgb.copy(base).multiplyScalar(1+tonal+(grain-.5)*.2);
    if(spec.id==="patina"){
      rgb.lerp(edge,Math.min(.55,worn*.65+hinge*.5+wrinkle*.6));
      rgb.lerp(new THREE.Color("#b29b6b"),Math.min(.5,worn*.7+corner*spec.wear*.35));
    }else{
      rgb.lerp(edge,Math.min(.35,worn*.8+hinge*.35));
    }
    // THREE.Color stores linear RGB; colour map bytes are encoded as sRGB.
    rgb.convertLinearToSRGB();
    const k=(y*size+x)*4;
    colour[k]=byte(rgb.r);colour[k+1]=byte(rgb.g);colour[k+2]=byte(rgb.b);colour[k+3]=255;
    const h=byte(grain-wrinkle-hinge*.13);
    height[k]=height[k+1]=height[k+2]=h;height[k+3]=255;
    const r=byte(spec.roughness+(mid-.5)*.18+(crease-.5)*.09+worn*(spec.id==="patina"?.22:-.2));
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
