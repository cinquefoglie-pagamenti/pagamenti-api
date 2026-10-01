import { Router } from "express";
import { query } from "../db";
import { logger, maschera } from "../logger";
import { Cliente } from "../types";
import { codiceFiscaleValido, emailValida, testoValido } from "../validation";

export const clienti = Router();

clienti.get("/", async (_req, res) => {
  const righe = await query<Cliente>(
    'SELECT id, ragione_sociale AS "ragioneSociale", codice_fiscale AS "codiceFiscale", email FROM clienti ORDER BY id'
  );
  res.json(righe);
});

clienti.post("/", async (req, res) => {
  const { ragioneSociale, codiceFiscale, email } = req.body ?? {};
  if (!testoValido(ragioneSociale) || !codiceFiscaleValido(codiceFiscale) || !emailValida(email)) {
    res.status(400).json({ errore: "Dati cliente non validi" });
    return;
  }
  const righe = await query<Cliente>(
    "INSERT INTO clienti (ragione_sociale, codice_fiscale, email) VALUES ($1, $2, $3) RETURNING id",
    [ragioneSociale, codiceFiscale.toUpperCase(), email]
  );
  logger.info("Cliente creato", { id: righe[0].id, codiceFiscale: maschera(codiceFiscale) });
  res.status(201).json(righe[0]);
});
