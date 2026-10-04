import { Router } from "express";
import { query } from "../db";
import { logger } from "../logger";
import { euroAStringa } from "../money";
import { Fattura } from "../types";
import { interoPositivo } from "../validation";

export const fatture = Router();

fatture.get("/", async (_req, res) => {
  try {
    const righe = await query<Pick<Fattura, "id">>(
      "INSERT INTO fatture (cliente_id, importo_centesimi, scadenza, pagata) VALUES ($1, $2, $3, false) RETURNING id",
      [clienteId, importoCentesimi, scadenza]
    );
    logger.info("Fattura creata", { id: righe[0].id, clienteId });
    res.status(201).json(righe[0]);
  } catch (err) {
    logger.error("Creazione fattura fallita", { errore: err instanceof Error ? err.message : "sconosciuto" });
    res.status(500).json({ errore: "Errore interno" });
  }
  } catch (err) {
    logger.error("Creazione fattura fallita", { errore: err instanceof Error ? err.message : "sconosciuto" });
    const codice = typeof err === "object" && err !== null && "code" in err ? (err as { code?: string }).code : undefined;
    if (codice === "23503") {
      res.status(422).json({ errore: "Cliente inesistente" });
      return;
    }
    res.status(500).json({ errore: "Errore interno" });
  }
});
