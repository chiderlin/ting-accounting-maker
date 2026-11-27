import type { MotionProfile } from "./core";
export const makerProfile: MotionProfile = {
  durations:{explode:4,reassemble:4,turntable:8,keyPress:.4,rotary:1.2,lcdBoot:2.4},
  root:"Maker Console 01", rotary:"rotary-cap",
  keys:["ACC","AI","RPA","DATA","FLOW","RUN"].map(k=>"keycap-"+k),
  lcd:["lcd-test","lcd-start","lcd-ready"],keyTravel:.045,
  // Uppermost obstructing components lead; PCB and electronics travel together.
  assembly:[
    {id:"Bottom Case",offset:0,order:1},
    {id:"PCB",offset:.85,order:1},
    {id:"Electronic Components",offset:.85,order:1},
    {id:"Top Case",offset:3.05,order:.5},
    {id:"LCD",offset:1.9,order:.8},
    {id:"Mechanical Switches",offset:1.65,order:.8},
    {id:"Keycaps",offset:4.25,order:.1},
    {id:"Rotary Encoder",offset:4.25,order:.1},
    {id:"Screws",offset:4.9,order:0},
  ],
};
