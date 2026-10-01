// Logger strutturato in formato JSON.
// Per i dati personali (codice fiscale, IBAN, email) usare sempre maschera() prima di loggare.

export function maschera(valore: string): string {
  if (valore.length <= 4) return "***";
  return valore.slice(0, 3) + "*".repeat(valore.length - 4) + valore.slice(-1);
}

type Livello = "debug" | "info" | "warn" | "error";

function scrivi(livello: Livello, messaggio: string, contesto?: Record<string, unknown>): void {
  console.log(JSON.stringify({ ts: new Date().toISOString(), livello, messaggio, contesto }));
}

export const logger = {
  debug: (m: string, c?: Record<string, unknown>) => scrivi("debug", m, c),
  info: (m: string, c?: Record<string, unknown>) => scrivi("info", m, c),
  warn: (m: string, c?: Record<string, unknown>) => scrivi("warn", m, c),
  error: (m: string, c?: Record<string, unknown>) => scrivi("error", m, c),
};
