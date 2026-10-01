// Gli importi sono sempre interi in centesimi di euro.

export function euroAStringa(centesimi: number): string {
  if (!Number.isInteger(centesimi)) {
    throw new Error("L'importo deve essere un intero in centesimi");
  }
  const segno = centesimi < 0 ? "-" : "";
  const assoluto = Math.abs(centesimi);
  const euro = Math.floor(assoluto / 100);
  const resto = String(assoluto % 100).padStart(2, "0");
  return `${segno}${euro},${resto} EUR`;
}

// Applica un'aliquota in punti base (2200 = 22%) usando solo aritmetica intera.
export function conIva(centesimi: number, aliquotaPuntiBase: number): number {
  return centesimi + Math.round((centesimi * aliquotaPuntiBase) / 10000);
}
