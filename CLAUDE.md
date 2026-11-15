# Guida al progetto — WAB Studio

Sito bilingue (italiano / tedesco) dello studio WAB, con pannello di amministrazione.
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP · Lenis · React Bits.

Per mettere online il sito su un server: **leggi [DEPLOY.md](DEPLOY.md)**, che contiene la
procedura passo per passo. Per capire come è fatto il sito: [README.md](README.md).

---

## Come è organizzato

Due radici separate, ognuna con il proprio `<html>` e il proprio foglio di stile:

| | Sito pubblico | Pannello |
|---|---|---|
| Rotte | `app/[locale]/` | `app/admin/` |
| Stile | `app/globals.css` | `app/admin/admin.css` |
| Indirizzi | `/it/...`, `/de/...` | solo tramite il percorso segreto in `ADMIN_PATH` |

Il pannello **non** importa `globals.css`: ha un suo `@import 'tailwindcss'` limitato alla
propria cartella. È voluto — le due interfacce non devono condividere né colori né regole
di base.

## Il flusso dei contenuti

```
content/it.ts + de.ts          dati iniziali, solo al primissimo avvio
        ↓  (lib/data/seed.ts)
data/site.json                 la verità: tutto ciò che il pannello modifica
        ↓  (lib/data/resolve.ts)
SiteDict                       stessa forma che i componenti già si aspettano
        ↓
componenti del sito
```

**Conseguenza pratica:** per cambiare un testo del sito non si tocca il codice, si usa il
pannello. I file in `content/` restano per le etichette fisse dell'interfaccia (voci del
menù, campi del modulo, messaggi di errore) e come punto di partenza.

- I componenti server leggono con `getDict(locale)` da `@/lib/data/content` (è `async`).
- Ogni campo modificabile è bilingue: `{ it: string; de?: string }`. Il tedesco vuoto
  ricade sull'italiano — vedi `pick()` in `lib/data/types.ts`.
- Ogni salvataggio passa da `updateSite()` e chiama `revalidatePath('/', 'layout')`.

## Cose che è facile sbagliare

Imparate costruendo questo progetto. Valgono tutte.

1. **Non lanciare `next build` mentre il dev server è acceso.** Condividono `.next` e si
   rompono a vicenda con errori incomprensibili (`__webpack_modules__[moduleId] is not a
   function`). Ferma il server, `rm -rf .next`, poi costruisci.

2. **Niente `$` nei valori dentro `.env`.** Vengono letti come variabili ed espansi a
   vuoto. Per questo l'impronta della password usa `:` come separatore.

3. **L'archivio è risolto da `process.cwd()`.** Se il processo parte da un'altra cartella,
   i contenuti finiscono nel posto sbagliato. Per questo esiste `scripts/dev.mjs`, e in
   produzione `WorkingDirectory` del servizio systemd deve essere la radice del progetto.
   In alternativa si impostano `DATA_DIR` e `UPLOADS_DIR`.

4. **GSAP: `from()` legge lo stato attuale come punto di arrivo.** Se un elemento è
   nascosto via CSS quando la tween viene creata, animerà da invisibile a invisibile.
   Prima `gsap.set(..., { autoAlpha: 1 })`, poi la timeline.

5. **Lenis non ha un suo loop**: è mosso dal ticker di GSAP in `components/SmoothScroll.tsx`.
   Il riferimento va letto a ogni frame, non catturato una volta sola, altrimenti la pagina
   non scorre affatto.

6. **Le rotte del pannello devono restare dinamiche.** `export const dynamic =
   'force-dynamic'` sta in `app/admin/layout.tsx` e vale per tutte: senza, Next
   prerenderizza la redirect al login e nessuno entra più.

## Convenzioni

- **Lingua del codice:** commenti, nomi di rotta e testi dell'interfaccia in italiano.
  I commenti spiegano *perché*, non *cosa*.
- **Colori:** nei componenti del sito si usano le variabili (`var(--fg)`, `var(--bg)`,
  `var(--line)`), mai valori fissi: ogni sezione cambia tema con `data-theme`.
- **Animazioni:** sempre `useGSAP` con uno `scope`, e `prefersReducedMotion()` rispettato.
  Importare GSAP da `@/lib/gsap`, mai direttamente da `gsap`.
- **Nuova pagina:** una voce in `routes` di `lib/routes.ts`, i testi nei due file di
  contenuto, un caso nello `switch` di `app/[locale]/[...slug]/page.tsx`.

## Prima di dire che è fatto

```bash
npx tsc --noEmit     # nessun errore di tipo
npm run build        # con il dev server spento
```

Il sito ha pagine statiche: se cambia qualcosa nei dati, controlla che la pagina pubblica
lo mostri davvero, non solo che il file sia stato scritto.

## Cosa non committare

`data/` e `public/uploads/` sono i contenuti veri del sito, vivono sul server e sono fuori
da git. Stessa cosa per `.env*.local`. Il backup del sito sono quelle due cartelle.
