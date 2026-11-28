import * as THREE from "three";
import type { CameraEdition } from "./editions";

export function cameraTextures(spec: CameraEdition) {
  const size=256;
  const colour=new Uint8Array(size*size*4), rough=new Uint8Array(colour.length);
  const metal=new Uint8Array(colour.length), grain=new Uint8Array(colour.length), grip=new Uint8Array(colour.length);
  const hash=(x:number,y:number)=>{
    let n=Math.imul(x,374761393)+Math.imul(y,668265263);
    n=Math.imul(n^(n>>>13),1274126177);
    return ((n^(n>>>16))>>>0)/4294967295;
  };
  const noise=(x:number,y:number)=>{
    const i=Math.floor(x),j=Math.floor(y);
    let u=x-i,v=y-j;u=u*u*(3-2*u);v=v*v*(3-2*v);
    return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(i,j),hash(i+1,j),u),THREE.MathUtils.lerp(hash(i,j+1),hash(i+1,j+1),u),v);
  };
  const byte=(n:number)=>Math.round(THREE.MathUtils.clamp(n,0,1)*255);
  const base=new THREE.Color(spec.plate), brass=new THREE.Color("#b29861"), rgb=new THREE.Color();
  const gray=(a:Uint8Array,i:number,n:number)=>{a[i]=a[i+1]=a[i+2]=byte(n);a[i+3]=255;};
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const u=x/(size-1),v=y/(size-1),i=(y*size+x)*4;
    const fine=hash(x,y), brush=hash(0,y), broad=noise(u*12,v*12);
    const edge=Math.min(u,1-u,v,1-v);
    const contact=Math.max(noise(u*7+8,v*7),noise(u*15,v*15)*.8);
    const worn=spec.id==="brass"?THREE.MathUtils.smoothstep(contact,.48,.78)*Math.exp(-edge*35)*spec.wear:0;
    const exposure=THREE.MathUtils.smoothstep(worn,.12,.35);
    rgb.copy(base).multiplyScalar(1+(broad-.5)*.08).lerp(brass,exposure);
    rgb.convertLinearToSRGB();
    colour[i]=byte(rgb.r);colour[i+1]=byte(rgb.g);colour[i+2]=byte(rgb.b);colour[i+3]=255;
    gray(rough,i,THREE.MathUtils.lerp(spec.plateRoughness,.43,exposure)+(fine-.5)*.06);
    gray(metal,i,spec.id==="brass"?exposure:spec.plateMetalness);
    gray(grain,i,.5+(spec.id==="chrome"?(brush-.5)*.45+(fine-.5)*.07:(fine-.5)*.24));
    const gx=u*55,gy=v*55,cx=Math.floor(gx),cy=Math.floor(gy);
    let d1=10,d2=10;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const a=cx+dx,b=cy+dy;
      const d=(gx-a-hash(a,b)*.8)**2+(gy-b-hash(a+17,b+31)*.8)**2;
      if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;
    }
    gray(grip,i,.63-.36*Math.exp(-Math.abs(d2-d1)*7)+(fine-.5)*.10);
  }
  const make=(data:Uint8Array,srgb=false)=>{
    const t=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
    t.colorSpace=srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;
    t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;
    t.generateMipmaps=true;t.anisotropy=4;t.needsUpdate=true;return t;
  };
  const gripMap=make(grip);gripMap.wrapS=gripMap.wrapT=THREE.RepeatWrapping;gripMap.repeat.set(3,2);
  return {colour:make(colour,true),roughness:make(rough),metalness:make(metal),grain:make(grain),grip:gripMap};
}
