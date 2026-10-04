import { Pool, QueryResultRow } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on("error", (err) => {
  console.error(JSON.stringify({ ts: new Date().toISOString(), livello: "error", messaggio: "Errore sul client idle del pool", errore: err.message }));
});

// Unico punto di accesso al database: accetta solo query con parametri ($1, $2, ...).
export async function query<T extends QueryResultRow>(
  testo: string,
  parametri: unknown[] = []
): Promise<T[]> {
  const risultato = await pool.query<T>(testo, parametri);
  return risultato.rows;
}
