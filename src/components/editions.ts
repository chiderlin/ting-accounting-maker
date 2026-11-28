export type EditionChoice<Id extends string = string> = {
  id: Id;
  name: string;
  label: string;
  swatch: string;
};
export type MakerEditionId = "frosted" | "aluminium" | "graphite";
type MakerEdition = EditionChoice<MakerEditionId> & {
  shell: string;
  roughness: number;
  metalness: number;
  anisotropy: number;
  radius: number;
  key: string;
  legend: string;
  shellLegend: string;
};
export const defaultMakerEdition: MakerEditionId = "frosted";
export const makerEditions: readonly MakerEdition[] = [
  { id: "frosted", name: "Frosted Polycarbonate", label: "Frosted", swatch: "#e4dfd0", shell: "#eee8d8", roughness: .34, metalness: 0, anisotropy: 0, radius: .35, key: "#e1dac6", legend: "#30382d", shellLegend: "#354035" },
  { id: "aluminium", name: "Brushed Aluminium", label: "Aluminium", swatch: "#b9bfc2", shell: "#c3c8ca", roughness: .32, metalness: 1, anisotropy: .75, radius: .19, key: "#363d3f", legend: "#f3f0e5", shellLegend: "#26302e" },
  { id: "graphite", name: "Anodised Graphite", label: "Graphite", swatch: "#363c3f", shell: "#343a3d", roughness: .43, metalness: .9, anisotropy: .15, radius: .24, key: "#c8c9bd", legend: "#29322f", shellLegend: "#e0dfd2" },
];
export function makerEdition(id: MakerEditionId) {
  return makerEditions.find(edition => edition.id === id)!;
}

export type GameBoyEditionId = "classic" | "transparent" | "machined";
type GameBoyEdition = EditionChoice<GameBoyEditionId> & {
  shell:string; radius:number; roughness:number; metalness:number;
  anisotropy:number; transmission:number; button:string; dpad:string;
  bezel:string; legend:string; seam:string;
};
export const defaultGameBoyEdition: GameBoyEditionId = "classic";
export const gameBoyEditions: readonly GameBoyEdition[] = [
  {id:"classic",name:"Classic ABS",label:"Classic",swatch:"#d7d2c6",shell:"#d7d2c6",radius:.24,roughness:.57,metalness:0,anisotropy:0,transmission:0,button:"#822d50",dpad:"#383b3b",bezel:"#66696b",legend:"#494353",seam:"#b0aca2"},
  {id:"transparent",name:"Atomic Purple",label:"Transparent",swatch:"#9279c3",shell:"#b3a0e0",radius:.24,roughness:.16,metalness:0,anisotropy:0,transmission:.82,button:"#40364d",dpad:"#36323e",bezel:"#514b65",legend:"#332745",seam:"#8873ad"},
  {id:"machined",name:"CNC Machined Aluminium",label:"Machined",swatch:"#bfc4c8",shell:"#c5cbd0",radius:.14,roughness:.32,metalness:1,anisotropy:.78,transmission:0,button:"#333638",dpad:"#292d2e",bezel:"#343a3b",legend:"#272c30",seam:"#747d81"},
];
export function gameBoyEdition(id:GameBoyEditionId) {
  return gameBoyEditions.find(edition=>edition.id===id)!;
}
