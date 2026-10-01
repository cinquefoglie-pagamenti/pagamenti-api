import { Router } from "express";
import { query } from "../db";
import { logger } from "../logger";
import { euroAStringa } from "../money";
import { Fattura } from "../types";
import { interoPositivo } from "../validation";

export const fatture = Router();

fatture.get("/", async (_req, res) => {
  const righe = await query<Fattura>(
    'SELECT id, cliente_id AS "clienteId", importo_centesimi AS "importoCentesimi", scadenza::text AS scadenza, pagata FROM fatture ORDER BY id'
  );
  res.json(righe.map((f) => ({ ...f, importo: euroAStringa(f.importoCentesimi) })));
});

fatture.post("/", async (req, res) => {
  const { clienteId, importoCentesimi, scadenza } = req.body ?? {};
  if (!interoPositivo(clienteId) || !interoPositivo(importoCentesimi) || !/^\d{4}-\d{2}-\d{2}$/.test(String(scadenza))) {
    res.status(400).json({ errore: "Dati fattura non validi" });
    return;
  }
  const righe = await query<Fattura>(
    "INSERT INTO fatture (cliente_id, importo_centesimi, scadenza, pagata) VALUES ($1, $2, $3, false) RETURNING id",
    [clienteId, importoCentesimi, scadenza]
  );
  logger.info("Fattura creata", { id: righe[0].id, clienteId });
  res.status(201).json(righe[0]);
});
