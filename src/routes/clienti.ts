import { Router } from "express";
import { query } from "../db";
import { logger, maschera } from "../logger";
import { Cliente } from "../types";
import { codiceFiscaleValido, emailValida, testoValido } from "../validation";

export const clienti = Router();

clienti.get("/", async (req, res) => {
  const limite = Math.min(Math.max(Number.parseInt(String(req.query.limite), 10) || 50, 1), 100);
  const offset = Math.max(Number.parseInt(String(req.query.offset), 10) || 0, 0);
  const righe = await query<Cliente>(
    'SELECT id, ragione_sociale AS "ragioneSociale", codice_fiscale AS "codiceFiscale", email FROM clienti ORDER BY id LIMIT $1 OFFSET $2',
    [limite, offset]
  );
  res.json(righe.map((c) => ({ ...c, codiceFiscale: maschera(c.codiceFiscale) })));
});

clienti.post("/", async (req, res) => {
  const { ragioneSociale, codiceFiscale, email } = req.body ?? {};
  if (!testoValido(ragioneSociale) || !codiceFiscaleValido(codiceFiscale) || !emailValida(email)) {
    res.status(400).json({ errore: "Dati cliente non validi" });
    return;
  }
  try {
    const righe = await query<Pick<Cliente, "id">>(
      "INSERT INTO clienti (ragione_sociale, codice_fiscale, email) VALUES ($1, $2, $3) RETURNING id",
      [ragioneSociale, codiceFiscale.toUpperCase(), email]
    );
    logger.info("Cliente creato", { id: righe[0].id, codiceFiscale: maschera(codiceFiscale) });
    res.status(201).json(righe[0]);
  } catch (err) {
    logger.error("Creazione cliente fallita", { errore: err instanceof Error ? err.message : "sconosciuto" });
    res.status(500).json({ errore: "Errore interno" });
  }
});
