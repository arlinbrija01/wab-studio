# Mettere online il sito su un VPS

Procedura completa, da eseguire **sul server**. Il sito scrive su disco (contenuti e
immagini caricate dal pannello), quindi vuole un server vero: non funziona su piattaforme
serverless senza modifiche.

**Serve:** un VPS con Linux, accesso root o sudo, un dominio che punta al suo indirizzo IP,
Node 20 o superiore.

Valori usati negli esempi, da adattare:

| | |
|---|---|
| Dominio | `wabstudio.it` |
| Cartella | `/var/www/wab-studio` |
| Utente di sistema | `www-data` |
| Porta interna | `3000` |

---

## 1. Preparare il server

```bash
# Node 20 (se non c'è già)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
node -v
```

## 2. Dare al server l'accesso al repository

Se il repository è **privato** — ed è giusto che lo sia — il server non può clonarlo senza
credenziali. Il modo pulito è una **chiave di distribuzione**: una chiave SSH valida solo
per questo repository e in sola lettura. Se un domani il server viene compromesso, chi
entra non può né toccare il codice né raggiungere gli altri tuoi repository.

Sul server:

```bash
sudo -u www-data ssh-keygen -t ed25519 -C "vps-wabstudio" -f /var/www/.ssh/id_ed25519 -N ""
sudo cat /var/www/.ssh/id_ed25519.pub
```

Copia la riga stampata e su GitHub vai in:
**Settings del repository → Deploy keys → Add deploy key**. Incollala, dalle un nome
(`VPS produzione`) e **lascia "Allow write access" spento**.

Verifica:

```bash
sudo -u www-data ssh -T git@github.com
```

Deve rispondere `Hi <utente>/<repo>! You've successfully authenticated`.

> Se il repository è pubblico, salta tutto questo e usa direttamente l'indirizzo `https://`.

## 3. Prendere il codice

```bash
sudo mkdir -p /var/www && cd /var/www
sudo -u www-data git clone git@github.com:TUO-UTENTE/wab-studio.git
cd wab-studio
sudo -u www-data npm ci
```

`data/` e `public/uploads/` non sono nel repository: nascono al primo avvio.

## 4. Credenziali e variabili

Genera le credenziali del pannello **qui sul server**, non riusare quelle di sviluppo:

```bash
npm run admin:password -- "UNA-PASSWORD-LUNGA-E-DIFFICILE"
```

Stampa quattro righe e l'indirizzo segreto del pannello. Mettile in un file nuovo:

```bash
sudo nano /var/www/wab-studio/.env.production.local
```

```bash
# Pannello — incolla qui le quattro righe stampate dal comando sopra
ADMIN_EMAIL=info@wabstudio.it
ADMIN_PASSWORD_HASH=scrypt:...
ADMIN_SESSION_SECRET=...
ADMIN_PATH=pannello-xxxxxxxx

# Modulo contatti (https://resend.com/api-keys)
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=info@wabstudio.it
CONTACT_FROM_EMAIL=info@wabstudio.it
```

Il file non deve essere leggibile da altri utenti del server:

```bash
sudo chmod 600 .env.production.local
sudo chown www-data:www-data .env.production.local
```

> **Annota l'indirizzo del pannello.** Non è linkato da nessuna parte e non c'è modo di
> recuperarlo se non leggendo `ADMIN_PATH`.

## 5. Costruire

```bash
sudo -u www-data npm run build
```

Il primo avvio crea `data/site.json` dai contenuti iniziali.

Permessi di scrittura sulle due cartelle che il pannello modifica:

```bash
sudo mkdir -p data public/uploads
sudo chown -R www-data:www-data /var/www/wab-studio/data /var/www/wab-studio/public/uploads
```

## 6. Tenerlo acceso

```bash
sudo nano /etc/systemd/system/wab-studio.service
```

```ini
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
sudo systemctl daemon-reload
sudo systemctl enable --now wab-studio
sudo systemctl status wab-studio
curl -I http://127.0.0.1:3000/it
```

> `WorkingDirectory` deve essere la radice del progetto: l'archivio dei contenuti è
> risolto a partire da lì.

## 7. Nginx

```bash
sudo nano /etc/nginx/sites-available/wab-studio
```

```nginx
server {
    listen 80;
    server_name wabstudio.it www.wabstudio.it;

    # Il pannello accetta immagini fino a 8 MB. Senza questa riga nginx le
    # rifiuta con un 413 prima ancora di passarle a Node.
    client_max_body_size 12M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/wab-studio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

`X-Forwarded-For` serve anche al freno sui tentativi di accesso al pannello: senza, tutti
i tentativi sembrano arrivare dallo stesso indirizzo.

## 8. HTTPS

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d wabstudio.it -d www.wabstudio.it
```

**Non è opzionale:** in produzione il cookie di sessione del pannello viaggia solo su
HTTPS. Senza certificato il login non funziona.

## 9. Portare i contenuti già inseriti in locale

Se il sito è già stato riempito dal pannello sul computer di sviluppo, quei contenuti
**non sono nel repository**. Si copiano a parte, dal computer locale:

```bash
# dal computer locale, dentro la cartella del progetto
tar czf contenuti.tar.gz data public/uploads
scp contenuti.tar.gz utente@IP-DEL-SERVER:/tmp/
```

```bash
# sul server
cd /var/www/wab-studio
sudo tar xzf /tmp/contenuti.tar.gz
sudo chown -R www-data:www-data data public/uploads
sudo systemctl restart wab-studio
```

Se invece si parte da zero, salta questo passo e riempi tutto dal pannello online.

## 10. Ultimi passi

1. Apri `https://wabstudio.it` e controlla che il sito risponda in italiano e in tedesco.
2. Entra nel pannello sull'indirizzo segreto e guarda il **Riepilogo**: elenca cosa manca.
3. In **Impostazioni** metti l'indirizzo vero del sito (`https://www.wabstudio.it`):
   serve per indirizzi canonici, sitemap e anteprime social.
4. In **SEO** incolla il codice di verifica di Google Search Console.
5. Invia la sitemap a Search Console: `https://www.wabstudio.it/sitemap.xml`.
6. Prova il modulo contatti e controlla che l'email arrivi davvero.

---

## Aggiornare il sito in seguito

```bash
cd /var/www/wab-studio
sudo git pull
sudo npm ci
sudo -u www-data npm run build
sudo systemctl restart wab-studio
```

I contenuti non vengono toccati: vivono in `data/`, fuori da git.

## Backup

```bash
cd /var/www/wab-studio
sudo tar czf ~/wab-backup-$(date +%F).tar.gz data public/uploads
```

Due cartelle, nient'altro: non c'è nessun database da esportare. Per tornare indietro di
un singolo salvataggio ci sono anche le ultime venti versioni in `data/backups`.

Vale la pena metterlo in cron, una volta al giorno:

```bash
0 3 * * * cd /var/www/wab-studio && tar czf /var/backups/wab-$(date +\%F).tar.gz data public/uploads
```

## Se qualcosa non va

| Sintomo | Dove guardare |
|---|---|
| Il sito non risponde | `sudo journalctl -u wab-studio -n 50` |
| 502 da nginx | Il servizio è spento o su un'altra porta: `curl -I http://127.0.0.1:3000/it` |
| Il login del pannello non tiene | Manca HTTPS: il cookie di sessione è `secure` |
| "Pannello non configurato" | `.env.production.local` incompleto o non letto: controlla nome e permessi |
| 413 caricando un'immagine | Manca `client_max_body_size` in nginx |
| Le modifiche non compaiono | Permessi su `data/`: l'utente del servizio deve poterci scrivere |
| La build fallisce con errori strani | `rm -rf .next` e ricostruisci, senza altri processi Next attivi |
