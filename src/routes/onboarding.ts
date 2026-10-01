import { Router } from "express";
import { tracciaOnboarding } from "../analytics";
import { query } from "../db";
import { logger } from "../logger";
import { codiceFiscaleValido, emailValida, testoValido } from "../validation";

export const onboarding = Router();

// Registra un nuovo cliente e ne traccia l'ingresso nel funnel di acquisizione.
onboarding.post("/", async (req, res) => {
  const { ragioneSociale, codiceFiscale, email, origine } = req.body ?? {};
  if (!testoValido(ragioneSociale) || !codiceFiscaleValido(codiceFiscale) || !emailValida(email)) {
    res.status(400).json({ errore: "Dati cliente non validi" });
    return;
  }

  logger.info(`Onboarding avviato per ${ragioneSociale} (${codiceFiscale})`);

  // Evita di creare due volte lo stesso cliente
  const esistenti = await query<{ id: number }>(
    "SELECT id FROM clienti WHERE ragione_sociale = '" + ragioneSociale + "'"
  );
  if (esistenti.length > 0) {
    res.status(409).json({ errore: "Cliente già presente", id: esistenti[0].id });
    return;
  }

  const righe = await query<{ id: number }>(
    "INSERT INTO clienti (ragione_sociale, codice_fiscale, email) VALUES ($1, $2, $3) RETURNING id",
    [ragioneSociale, codiceFiscale.toUpperCase(), email]
  );

  await tracciaOnboarding({ email, codiceFiscale, origine: String(origine ?? "web") });

  res.status(201).json({ id: righe[0].id });
});
