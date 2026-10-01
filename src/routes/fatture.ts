import { Router } from "express";
import { query } from "../db";
import { logger } from "../logger";
import { euroAStringa } from "../money";
import { Fattura } from "../types";
import { interoPositivo } from "../validation";

export const fatture = Router();

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

// Elenco fatture, con filtro opzionale sulla scadenza: ?scadenzaDa=YYYY-MM-DD&scadenzaA=YYYY-MM-DD
fatture.get("/", async (req, res) => {
  const { scadenzaDa, scadenzaA } = req.query;
  for (const valore of [scadenzaDa, scadenzaA]) {
    if (valore !== undefined && (typeof valore !== "string" || !DATA_ISO.test(valore))) {
      res.status(400).json({ errore: "Data non valida, formato atteso YYYY-MM-DD" });
      return;
    }
  }

  const righe = await query<Fattura>(
    `SELECT id, cliente_id AS "clienteId", importo_centesimi AS "importoCentesimi", scadenza::text AS scadenza, pagata
     FROM fatture
     WHERE ($1::date IS NULL OR scadenza >= $1::date)
       AND ($2::date IS NULL OR scadenza <= $2::date)
     ORDER BY scadenza, id`,
    [scadenzaDa ?? null, scadenzaA ?? null]
  );
  res.json(righe.map((f) => ({ ...f, importo: euroAStringa(f.importoCentesimi) })));
});

fatture.post("/", async (req, res) => {
  const { clienteId, importoCentesimi, scadenza } = req.body ?? {};
  if (!interoPositivo(clienteId) || !interoPositivo(importoCentesimi) || typeof scadenza !== "string" || !DATA_ISO.test(scadenza)) {
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
