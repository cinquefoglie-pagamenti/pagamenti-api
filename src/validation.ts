const CODICE_FISCALE = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function codiceFiscaleValido(v: unknown): v is string {
  return typeof v === "string" && CODICE_FISCALE.test(v);
}

export function emailValida(v: unknown): v is string {
  return typeof v === "string" && v.length <= 254 && EMAIL.test(v);
}

export function testoValido(v: unknown, max = 200): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

export function interoPositivo(v: unknown): v is number {
  return typeof v === "number" && Number.isSafeInteger(v) && v > 0 && v <= 2147483647;
}
