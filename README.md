# WAB Studio — sito web

Sito bilingue (italiano / tedesco) per WAB Studio.
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP · Lenis · React Bits.

---

## Avvio

```bash
npm install
npm run dev
```

Poi apri http://localhost:3000 — verrai mandato su `/it` o `/de` in base alla lingua del browser.

Altri comandi:

```bash
npm run build   # build di produzione
npm start       # serve la build
```

---

## Pannello di amministrazione

Progetti, testi, immagini, contatti e SEO si cambiano da un'interfaccia web, senza toccare il codice.

### Entrare

Il pannello non ha un link da nessuna parte: risponde solo sull'indirizzo scelto in `ADMIN_PATH`.

```bash
npm run admin:password -- "una-password-lunga-e-tua"
```

Il comando stampa quattro righe da incollare in `.env.local` e l'indirizzo generato, del tipo `/pannello-7fa23c`. Riavvia il server e vai lì.

Come funziona la protezione:

- **La password non è salvata.** In `.env.local` c'è solo un'impronta scrypt, che non si può riportare indietro alla password.
- **La sessione** è un cookie `httpOnly` firmato con HMAC-SHA256, valido 12 ore. Non è modificabile senza conoscere `ADMIN_SESSION_SECRET`.
- **Sei tentativi sbagliati** dallo stesso indirizzo bloccano l'accesso per quindici minuti.
- **`/admin` a mano dà 404.** Il percorso interno esiste ma è servito solo attraverso l'indirizzo segreto, riscritto dal middleware.
- Le pagine del pannello hanno `noindex` e non entrano nella sitemap.

L'indirizzo nascosto riduce il rumore dei robot, ma **la sicurezza vera è la password**: scegline una lunga.

### Cosa si gestisce

| Schermata | Cosa fa |
|---|---|
| **Riepilogo** | Stato del sito e cosa manca: dati di esempio rimasti, progetti senza foto, titoli SEO troppo lunghi, immagini senza testo alternativo |
| **Progetti** | Crea, modifica, duplica, elimina, riordina. Pubblica o nascondi, scegli quali finiscono nella galleria della home |
| **Contenuti** | Tutti i testi, divisi per sezione. Si possono anche spegnere intere sezioni della home |
| **Immagini** | Caricamento (anche trascinando), testo alternativo, controllo di dove è usata ogni foto |
| **SEO** | Titolo e descrizione per pagina, con anteprima di come appare su Google e contatore dei caratteri |
| **Impostazioni** | Contatti, sede, partita IVA, orari, profili social |

### Le due lingue

Ogni campo ha due caselle, italiano e tedesco. **Il tedesco è facoltativo**: dove lo lasci vuoto il sito mostra l'italiano al suo posto, invece di una pagina a metà. Nel pannello la sigla `DE` diventa arancione quando manca, e l'elenco progetti segnala quali non sono ancora tradotti.

### Dove finiscono i dati

Tutto in `data/site.json`, scritto in modo atomico: si crea un file temporaneo e lo si rinomina, così un'interruzione non lascia mai un file rotto. Ogni salvataggio tiene una copia in `data/backups` (le ultime venti).

Al primo avvio il file non esiste e viene creato dai testi in `content/it.ts` e `content/de.ts`: quei file restano il punto di partenza, ma da lì in poi comanda il JSON.

**Il backup del sito sono due cartelle**: `data/` e `public/uploads/`. Niente database da esportare.

Si possono spostare altrove con due variabili d'ambiente, utile per tenere i contenuti su un disco che gli aggiornamenti del codice non toccano:

```bash
DATA_DIR=/var/lib/wab-studio/data
UPLOADS_DIR=/var/lib/wab-studio/uploads
```

---

## Le prime cose da cambiare

### 1. I tuoi dati — dal pannello, in *Impostazioni*

Email, telefono, indirizzo, partita IVA, orari e social partono con valori di esempio. Il *Riepilogo* te li segnala in rosso finché non li sostituisci.

L'indirizzo del sito (`url`) serve per canonici, sitemap e anteprime social: mettilo appena hai il dominio.

### 2. I contenuti — dal pannello, in *Contenuti* e *Progetti*

I sei progetti, i numeri e le testimonianze sono esempi realistici ma inventati. Sostituiscili con i tuoi.

I file `content/it.ts` e `content/de.ts` restano come dati iniziali e come vocabolario fisso dell'interfaccia (voci del menù, etichette del modulo, messaggi di errore): quelli si cambiano ancora nel codice.

### 3. I colori — `app/globals.css`

In cima al file, nel blocco `@theme`:

```css
--color-ink: #050507;     /* fondo scuro */
--color-paper: #f4f4f6;   /* fondo chiaro */
--color-accent: #2f6bff;  /* accento */
```

Cambiando l'accento cambia tutto il sito: pulsanti, dettagli, aurora dello sfondo, barre di avanzamento.

---

## Come è fatto

### Temi di sezione

Il sito alterna blocchi scuri e blocchi chiari mentre si scorre, in stile Apple. Ogni sezione dichiara il proprio tema e porta con sé i colori:

```tsx
<Section theme="dark">…</Section>    // fondo nero
<Section theme="light">…</Section>   // fondo grigio chiarissimo
<Section theme="paper">…</Section>   // fondo bianco
```

`Section` imposta due attributi: `data-theme` (che riassegna le variabili `--bg`, `--fg`, `--line`…) e `data-nav`, che dice alla barra in alto se schiarirsi o scurirsi quando le passa sopra. Dentro una sezione si scrive `text-[var(--fg)]`, mai un colore fisso: così lo stesso componente funziona su fondo chiaro e su fondo scuro.

### Animazioni

- **GSAP** per tutto il movimento. I plugin si registrano una volta sola in `lib/gsap.ts`: importa sempre da lì (`@/lib/gsap`), mai direttamente da `gsap`.
- **`useGSAP`** di `@gsap/react` al posto di `useEffect`, sempre con uno `scope`: ripulisce da solo tween e ScrollTrigger quando il componente esce di scena.
- **Lenis** per lo scorrimento morbido, in `components/SmoothScroll.tsx`. Non ha un proprio loop: viene fatto avanzare dal ticker di GSAP, e a ogni passo avvisa ScrollTrigger. Un solo loop di animazione per tutto il sito.
- **`prefers-reduced-motion`** è rispettato ovunque: chi ha chiesto meno animazioni al sistema operativo vede il sito fermo e completo, non vuoto.

Tutti i plugin GSAP usati (ScrollTrigger, SplitText, ScrollTo) sono gratuiti anche per uso commerciale: dopo l'acquisizione di GSAP da parte di Webflow non serve nessuna licenza.

### Componenti React Bits

In `components/reactbits/` ci sono i componenti presi da [reactbits.dev](https://reactbits.dev) (licenza MIT), nella variante TypeScript + Tailwind:

| Componente | Dove si vede |
|---|---|
| `Aurora` | sfondo animato della home e delle testate interne |
| `SplitText` | titoli di sezione che entrano parola per parola |
| `ScrollReveal` | il manifesto e il testo dello studio, che si accendono scorrendo |
| `ShinyText` | occhiello della home |
| `Magnet` | i pulsanti che si avvicinano al cursore |
| `ScrollStack` | le schede del metodo che si impilano |
| `SpotlightCard` | schede servizi e testimonianze |
| `AnimatedContent` | ingresso delle schede nella pagina Servizi |
| `GradualBlur` | disponibile, non ancora usato |

Sono copie locali, non un pacchetto npm: puoi modificarle liberamente. Per aggiungerne altri, copia il file da `ts-tailwind/` del repository di React Bits dentro `components/reactbits/`.

### Lingue e indirizzi

Le due lingue hanno slug diversi, gestiti in `lib/routes.ts`:

| | Italiano | Tedesco |
|---|---|---|
| Servizi | `/it/servizi` | `/de/leistungen` |
| Lavori | `/it/lavori` | `/de/arbeiten` |
| Studio | `/it/studio` | `/de/studio` |
| Contatti | `/it/contatti` | `/de/kontakt` |

Tutte le pagine interne passano da un'unica rotta (`app/[locale]/[...slug]/page.tsx`) che ritraduce lo slug nella pagina giusta. Gli indirizzi incrociati non esistono: `/it/leistungen` risponde 404, quindi niente contenuti duplicati agli occhi di Google. Il selettore di lingua in alto porta sempre alla **stessa** pagina nell'altra lingua, non alla home.

Per aggiungere una pagina: una voce in `routes` di `lib/routes.ts`, i testi nei due file di contenuti, un caso nello `switch` della rotta catch-all.

### Form contatti

`components/ContactForm.tsx` invia a `app/api/contact/route.ts`, che spedisce l'email con **Resend**.

Copia `.env.example` in `.env.local` e compila:

```bash
RESEND_API_KEY=re_xxxxxxxx      # da https://resend.com/api-keys
CONTACT_TO_EMAIL=info@wabstudio.it
CONTACT_FROM_EMAIL=onboarding@resend.dev
```

Il mittente deve essere un dominio verificato su Resend; `onboarding@resend.dev` funziona per le prove. **Senza chiave il sito non va in errore**: la richiesta viene scritta nel terminale, così puoi provare il modulo subito.

Il modulo valida i campi lato client e lato server, ha un campo trappola antispam invisibile e risponde con un messaggio di conferma animato.

### SEO

Già incluso: metadati e Open Graph per lingua, `hreflang` fra italiano e tedesco su ogni pagina, URL canonici, sitemap automatica con le alternative di lingua, `robots.txt`, dati strutturati `ProfessionalService` e intestazioni semantiche.

Restano da fare, quando il dominio è deciso:

1. metti il dominio vero in `lib/site.ts` (`url`);
2. aggiungi un'immagine di anteprima social in `public/og.jpg` e dichiarala in `app/[locale]/layout.tsx`;
3. collega Search Console e invia la sitemap.

### Font

Inter e JetBrains Mono sono **ospitati sul tuo server** (`public/fonts/`), non caricati da Google. Nessuna richiesta a terzi, una cosa in meno nel cookie banner e caricamento più rapido. Entrambi hanno licenza aperta SIL OFL.

### Immagini dei progetti

Si caricano dal pannello, in *Immagini*, e si assegnano aprendo il progetto. Finché un progetto non ha una copertina, il sito ne disegna una costruita sul colore scelto per quel progetto: non resta mai un buco.

Formati ammessi: JPG, PNG, WebP, AVIF, GIF, fino a 8 MB. L'SVG è escluso di proposito — può contenere script, e servirlo dallo stesso dominio aprirebbe una porta che non vale la pena aprire. Il tipo di file viene riconosciuto leggendo i primi byte, non fidandosi dell'estensione.

Le immagini passano dall'ottimizzatore di Next: vengono servite in WebP o AVIF nella misura giusta per lo schermo di chi guarda.

---

## Struttura

```
app/
  [locale]/
    layout.tsx          radice del sito: font, metadati, dati strutturati
    page.tsx            home
    [...slug]/page.tsx  servizi, lavori, studio, contatti e schede progetto
    not-found.tsx
  admin/                pannello (servito solo sull'indirizzo segreto)
    layout.tsx          radice separata: niente stili né animazioni del sito
    admin.css           foglio di stile indipendente
    accedi/             login
    (panel)/            riepilogo, progetti, contenuti, immagini, seo, impostazioni
    _actions/           azioni server: salvataggi, caricamenti, sessione
    _components/        campi bilingui, barra di salvataggio, scelta immagini
  api/contact/route.ts  invio email con Resend
  og/route.tsx          anteprime social disegnate al volo
  globals.css           design system del sito: colori, tipografia, temi
  sitemap.ts robots.ts
components/
  Nav.tsx Footer.tsx SmoothScroll.tsx ContactForm.tsx
  sections/             blocchi della home e testate di pagina
  pages/                corpo delle pagine interne
  ui/                   pulsanti, titoli, rivelazioni, contatori, nastri
  reactbits/            componenti presi da reactbits.dev
content/
  it.ts de.ts index.ts  dati iniziali e etichette fisse dell'interfaccia
lib/
  data/                 archivio: tipi, lettura/scrittura, dati iniziali
  admin/auth.ts         password, sessione, freno ai tentativi
  routes.ts             lingue, slug e traduzione dei percorsi
  seo.ts                metadati e dati strutturati
  site.ts               valori iniziali dello studio
  gsap.ts               registrazione plugin GSAP
data/                   contenuti modificati dal pannello (+ backups/)
public/
  fonts/                Inter e JetBrains Mono
  uploads/              immagini caricate dal pannello
scripts/
  admin-password.mjs    genera le credenziali
  dev.mjs               avvia il server con la cartella di lavoro giusta
```

---

## Messa online su un server (VPS)

Il sito scrive su disco — contenuti in `data/`, immagini in `public/uploads/` — quindi vuole un server vero, non una piattaforma serverless. Serve Node 20 o superiore.

### 1. Portare il codice sul server

```bash
git clone <il-tuo-repo> /var/www/wab-studio && cd /var/www/wab-studio
npm ci
```

`data/` e `public/uploads/` non sono nel repository: nascono al primo avvio.

### 2. Variabili d'ambiente

Crea `/var/www/wab-studio/.env.production.local` partendo da `.env.example`, con le credenziali del pannello generate **sul server**:

```bash
npm run admin:password -- "una-password-lunga-e-tua"
```

Niente credenziali dentro git: quel file resta solo sul server, leggibile dal solo utente che fa girare il sito.

```bash
chmod 600 .env.production.local
```

### 3. Build e avvio

```bash
npm run build
npm start
```

`npm start` ascolta sulla porta 3000. Per tenerlo acceso e farlo ripartire dopo un riavvio, un servizio systemd:

```ini
# /etc/systemd/system/wab-studio.service
[Unit]
Description=WAB Studio
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/wab-studio
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now wab-studio
```

**`WorkingDirectory` conta**: `data/` e `public/uploads/` sono risolte da lì. Se preferisci tenerle altrove, usa `DATA_DIR` e `UPLOADS_DIR`.

L'utente del servizio deve poter scrivere in quelle due cartelle:

```bash
sudo chown -R www-data:www-data /var/www/wab-studio/data /var/www/wab-studio/public/uploads
```

### 4. Nginx e HTTPS

```nginx
server {
    server_name www.wabstudio.it wabstudio.it;

    # Il pannello accetta immagini fino a 8 MB: senza questa riga
    # nginx le rifiuta con un 413 prima ancora di passarle a Node.
    client_max_body_size 12M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`X-Forwarded-For` serve anche al freno sui tentativi di accesso: senza, tutti i tentativi sembrano venire dallo stesso indirizzo.

Poi il certificato:

```bash
sudo certbot --nginx -d wabstudio.it -d www.wabstudio.it
```

In produzione il cookie di sessione viaggia solo su HTTPS (`secure`), quindi il certificato non è opzionale: senza, il login non funziona.

### 5. Dopo il primo avvio

1. entra nel pannello e compila *Impostazioni* (contatti, sede, partita IVA) — il *Riepilogo* ti dice cosa manca;
2. in *SEO* metti il dominio vero e il codice di verifica di Search Console;
3. invia la sitemap: `https://www.wabstudio.it/sitemap.xml`;
4. per far partire le email del modulo contatti, aggiungi `RESEND_API_KEY` e verifica il dominio su Resend.

### Aggiornare il sito

```bash
cd /var/www/wab-studio
git pull
npm ci
npm run build
sudo systemctl restart wab-studio
```

I contenuti non vengono toccati: vivono in `data/`, che non è nel repository.

### Backup

```bash
tar czf wab-backup-$(date +%F).tar.gz data public/uploads
```

Due cartelle, nient'altro. Per tornare indietro di un salvataggio c'è anche `data/backups`, con le ultime venti versioni dei contenuti.
