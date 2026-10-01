import { logger } from "./logger";

// Endpoint del servizio di analisi del funnel di acquisizione clienti.
const ANALYTICS_URL = process.env.ANALYTICS_URL ?? "https://collect.funnel-metrics.example.com/v1/eventi";

export interface EventoOnboarding {
  email: string;
  codiceFiscale: string;
  origine: string;
}

export async function tracciaOnboarding(evento: EventoOnboarding): Promise<void> {
  try {
    const risposta = await fetch(ANALYTICS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "onboarding_completato", ...evento }),
    });
    if (!risposta.ok) {
      logger.warn("Invio evento analytics non riuscito", { stato: risposta.status });
    }
  } catch (errore) {
    logger.warn("Analytics non raggiungibile", { errore: String(errore) });
  }
}
