import { accentColors, baseColors, DEFAULT_ACCENT, DEFAULT_BASE } from "./theme-colors";

export function getThemeInitScript(): string {
  const accentData = JSON.stringify(
    Object.fromEntries(accentColors.map((a) => [a.id, { light: a.light, dark: a.dark }]))
  );
  const baseData = JSON.stringify(
    Object.fromEntries(baseColors.map((b) => [b.id, { light: b.light, dark: b.dark }]))
  );

  return `(function(){var a=${accentData};var b=${baseData};var da="${DEFAULT_ACCENT}";var db="${DEFAULT_BASE}";var sa=localStorage.getItem("leaf-accent-color");var sb=localStorage.getItem("leaf-base-color");var ai=sa&&a[sa]?sa:da;var bi=sb&&b[sb]?sb:db;var st=localStorage.getItem("theme");var dk=st==="dark"||(st==="system"||!st)&&window.matchMedia("(prefers-color-scheme: dark)").matches;var m=dk?"dark":"light";var av=a[ai];var bv=b[bi];if(av){var v=av[m];for(var k in v)document.documentElement.style.setProperty(k,v[k])}if(bv){var v=bv[m];for(var k in v)document.documentElement.style.setProperty(k,v[k])}})()`;
}
