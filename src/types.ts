export interface Cliente {
  id: number;
  ragioneSociale: string;
  codiceFiscale: string;
  email: string;
}

export interface Fattura {
  id: number;
  clienteId: number;
  // Importo in centesimi di euro (intero)
  importoCentesimi: number;
  scadenza: string; // YYYY-MM-DD
  pagata: boolean;
}
