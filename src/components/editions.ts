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

export type JournalEditionId = "cognac" | "noir" | "patina";
export type JournalEdition = EditionChoice<JournalEditionId> & {
  leather:string; edge:string; lining:string; thread:string; hole:string;
  hardware:string; hardwareRoughness:number; paper:string; pageEdge:string;
  ribbon:string; legend:string; roughness:number; grain:number; variation:number; wear:number;
};
export const defaultJournalEdition: JournalEditionId = "cognac";
export const journalEditions: readonly JournalEdition[] = [
  {id:"cognac",name:"Cognac — Vegetable-tanned Leather",label:"Cognac",swatch:"#a5653a",leather:"#a36438",edge:"#704125",lining:"#c38e61",thread:"#e3bd8c",hole:"#58331e",hardware:"#b79958",hardwareRoughness:.31,paper:"#f0e5cc",pageEdge:"#c9b798",ribbon:"#68724e",legend:"#deb789",roughness:.66,grain:.055,variation:.19,wear:.15},
  {id:"noir",name:"Noir — Fine-grain Black Leather",label:"Noir",swatch:"#28292b",leather:"#303135",edge:"#171719",lining:"#49474a",thread:"#777477",hole:"#171719",hardware:"#53575a",hardwareRoughness:.36,paper:"#f4f0e7",pageEdge:"#c9c5b9",ribbon:"#46464c",legend:"#aaa5a0",roughness:.45,grain:.035,variation:.105,wear:.025},
  {id:"patina",name:"Vintage Patina — Aged Olive Leather",label:"Patina",swatch:"#62684b",leather:"#626449",edge:"#51432d",lining:"#9a8860",thread:"#b7a27b",hole:"#393727",hardware:"#92713e",hardwareRoughness:.54,paper:"#e9dbb8",pageEdge:"#b9a17e",ribbon:"#926448",legend:"#c5b283",roughness:.82,grain:.075,variation:.4,wear:.62},
];
export function journalEdition(id:JournalEditionId) {
  return journalEditions.find(edition=>edition.id===id)!;
}

export type CameraEditionId = "chrome" | "matte" | "brass";
export type CameraEdition = EditionChoice<CameraEditionId> & {
  plate:string; plateRoughness:number; plateMetalness:number; trim:string;
  barrel:string; dial:string; grip:string; legend:string; wear:number;
};
export const defaultCameraEdition: CameraEditionId = "chrome";
export const cameraEditions: readonly CameraEdition[] = [
  {id:"chrome",name:"Silver Chrome",label:"Chrome",swatch:"#c4c7c7",plate:"#c4c7c7",plateRoughness:.29,plateMetalness:1,trim:"#c9cccb",barrel:"#303333",dial:"#a5a9a9",grip:"#282b29",legend:"#e1dfd3",wear:0},
  {id:"matte",name:"Matte Black",label:"Matte",swatch:"#303437",plate:"#292d30",plateRoughness:.69,plateMetalness:0,trim:"#555b5d",barrel:"#292d30",dial:"#43484a",grip:"#202324",legend:"#e9e7dc",wear:0},
  {id:"brass",name:"Heritage Brass",label:"Heritage",swatch:"#806b45",plate:"#302c28",plateRoughness:.45,plateMetalness:0,trim:"#a58a54",barrel:"#302e29",dial:"#64563d",grip:"#37342e",legend:"#dfcba6",wear:.72},
];
export function cameraEdition(id:CameraEditionId) {
  return cameraEditions.find(edition=>edition.id===id)!;
}
