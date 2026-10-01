# Cinquefoglie Fatture API

Servizio di fatturazione di **Cinquefoglie Pagamenti S.r.l.** (azienda fittizia, progetto dimostrativo).

## Avvio

```bash
npm install
npm run build
DATABASE_URL=postgres://... npm start
```

## Struttura

- `src/routes/` endpoint per clienti e fatture
- `src/db.ts` unico accesso al database, solo query parametrizzate
- `src/logger.ts` logger JSON e helper `maschera()` per codice fiscale, IBAN ed email
- `src/money.ts` importi come interi in centesimi
- `config/processori-approvati.json` elenco dei servizi esterni approvati dal DPO

## Regole

Il codice segue la Politica di Sviluppo Sicuro v1.3 dell'azienda.

## Contribuire

- Apri una Pull Request verso `main`: ogni modifica passa dalla revisione del codice prevista dalla Politica di Sviluppo Sicuro (sezione 6).
- Descrivi nella Pull Request cosa cambia e perché, e collega il ticket di riferimento.
- Non usare dati personali reali in test, esempi o descrizioni.
- Negli esempi gli importi si scrivono in centesimi: `1250` corrisponde a 12,50 €.
