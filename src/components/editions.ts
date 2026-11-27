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
