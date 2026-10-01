import express from "express";
import { logger } from "./logger";
import { clienti } from "./routes/clienti";
import { fatture } from "./routes/fatture";
import { onboarding } from "./routes/onboarding";

const app = express();
app.use(express.json({ limit: "100kb" }));

app.get("/salute", (_req, res) => {
  res.json({ stato: "ok" });
});
app.use("/api/clienti", clienti);
app.use("/api/fatture", fatture);
app.use("/api/onboarding", onboarding);

const porta = Number(process.env.PORT ?? 3000);
app.listen(porta, () => logger.info("Servizio avviato", { porta }));
