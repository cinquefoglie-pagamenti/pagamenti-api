// Logger strutturato in formato JSON.
// Per i dati personali (codice fiscale, IBAN, email) usare sempre maschera() prima di loggare.

export function maschera(valore: string): string {
  if (valore.length <= 8) return "***";
  return valore.slice(0, 3) + "*".repeat(valore.length - 4) + valore.slice(-1);
}

type Livello = "debug" | "info" | "warn" | "error";

function scrivi(livello: Livello, messaggio: string, contesto?: Record<string, unknown>): void {
  const CHIAVI_SENSIBILI = /codice_?fiscale|iban|email/i;
  const contestoSicuro = contesto && Object.fromEntries(
    Object.entries(contesto).map(([chiave, valore]) => {
      if (valore instanceof Error) return [chiave, { nome: valore.name, messaggio: valore.message }];
      if (CHIAVI_SENSIBILI.test(chiave)) {
        return [chiave, typeof valore === "string" && valore.includes("*") ? valore : "[REDATTO]"];
      }
      return [chiave, valore];
    })
  );
  console.log(JSON.stringify({ ts: new Date().toISOString(), livello, messaggio, contesto: contestoSicuro }));
}

export const logger = {
  debug: (m: string, c?: Record<string, unknown>) => scrivi("debug", m, c),
  info: (m: string, c?: Record<string, unknown>) => scrivi("info", m, c),
  warn: (m: string, c?: Record<string, unknown>) => scrivi("warn", m, c),
  error: (m: string, c?: Record<string, unknown>) => scrivi("error", m, c),
};
