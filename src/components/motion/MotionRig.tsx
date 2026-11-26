"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { ComponentRegistry, applyTimeline, type StudioController, type MotionProfile } from "./core";
export default function MotionRig({controller,profile,children}:{controller:StudioController;profile:MotionProfile;children:ReactNode}) {
  const root=useRef<Group>(null);
  const registry=useRef<ComponentRegistry|null>(null);
  const invalidate=useThree(s=>s.invalidate);
  useLayoutEffect(()=>{
    if(!root.current) return;
    const r=new ComponentRegistry(root.current,profile);
    registry.current=r;
    const apply=()=>{applyTimeline(r,profile,controller.getSnapshot()); invalidate();};
    apply();
    const unsubscribe=controller.subscribe(apply);
    return ()=>{unsubscribe();r.restore();registry.current=null;};
  },[controller,profile,invalidate]);
  useFrame((_,dt)=>{if(controller.getSnapshot().direction) {controller.tick(dt);invalidate();}});
  return <group ref={root}>{children}</group>;
}
