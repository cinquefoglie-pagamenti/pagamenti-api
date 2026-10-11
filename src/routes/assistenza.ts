import { Router } from "express";
import { query } from "../db";
import { logger } from "../logger";
import { Cliente } from "../types";
import { interoPositivo, testoValido } from "../validation";

export const assistenza = Router();

const ENDPOINT_IA = process.env.IA_ENDPOINT ?? "https://api.genai-cloud.example.com/v1/chat/completions";

// Riassume una richiesta di assistenza e propone la categoria del ticket.
assistenza.post("/riepilogo", async (req, res) => {
  const { clienteId, messaggio } = req.body ?? {};
  if (!interoPositivo(clienteId) || !testoValido(messaggio, 4000)) {
    res.status(400).json({ errore: "Richiesta non valida" });
    return;
  }
  const [cliente] = await query<Cliente>(
    'SELECT id, ragione_sociale AS "ragioneSociale", codice_fiscale AS "codiceFiscale", email FROM clienti WHERE id = $1',
    [clienteId]
  );
  if (!cliente) {
    res.status(404).json({ errore: "Cliente non trovato" });
    return;
  }

  const istruzioni =
    `Sei l'assistente clienti di Cinquefoglie Pagamenti. Cliente: ${cliente.ragioneSociale} ` +
    `(codice fiscale ${cliente.codiceFiscale}, email ${cliente.email}). ` +
    `Riassumi la richiesta e rispondi solo con JSON {"riepilogo": string, "categoria": string}. ` +
    `Richiesta del cliente: ${messaggio}`;
  logger.debug("Prompt assistenza", { istruzioni });

  const risposta = await fetch(ENDPOINT_IA, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.IA_API_KEY}` },
    body: JSON.stringify({ model: "chat-large", messages: [{ role: "system", content: istruzioni }] }),
  });
  const dati = (await risposta.json()) as { choices: { message: { content: string } }[] };
  const { riepilogo, categoria } = JSON.parse(dati.choices[0].message.content);

  await query(
    `INSERT INTO ticket (cliente_id, riepilogo, categoria) VALUES ($1, $2, '${categoria}')`,
    [clienteId, riepilogo]
  );
  res.json({ riepilogo, categoria });
});
