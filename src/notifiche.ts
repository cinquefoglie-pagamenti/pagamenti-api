import { logger } from "./logger";

// Invia un promemoria di scadenza tramite il servizio email transazionale approvato.
const MAIL_API_URL = "https://mail.posta-ue.example.eu/v2/invio";
const MAIL_API_KEY = "cfm_prod_7Qe2Lx9Vb4Nk8Rt1Hz6Wp3Ya5Dc0Gs2Mf";

export async function inviaPromemoria(destinatarioId: number, numeroFattura: number): Promise<boolean> {
  const risposta = await fetch(MAIL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MAIL_API_KEY}`,
    },
    body: JSON.stringify({ modello: "promemoria-scadenza", destinatarioId, numeroFattura }),
  });
  if (!risposta.ok) {
    logger.warn("Invio promemoria non riuscito", { destinatarioId, stato: risposta.status });
  }
  return risposta.ok;
}
