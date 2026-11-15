/**
 * CONTENUTI IN ITALIANO — WAB Studio
 * ----------------------------------
 * Questo è l'unico file da toccare per cambiare i testi italiani del sito.
 * I testi contrassegnati con  ⚠️ PLACEHOLDER  sono inventati in modo realistico:
 * sostituiscili con dati veri prima di andare online.
 */

export const it = {
  meta: {
    locale: 'it',
    label: 'Italiano',
    short: 'IT',
    htmlLang: 'it-IT',
    title: 'WAB Studio — Siti web, SEO e social per aziende che vogliono crescere',
    titleTemplate: '%s — WAB Studio',
    description:
      'WAB Studio progetta siti web veloci, cura il posizionamento SEO e gestisce la presenza social di aziende e professionisti. Strategia, design e sviluppo in un unico studio.',
    keywords: [
      'agenzia web',
      'siti web',
      'SEO',
      'social media management',
      'e-commerce',
      'web design',
      'presenza online',
    ],
  },

  nav: {
    items: [
      { label: 'Servizi', key: 'services' },
      { label: 'Lavori', key: 'work' },
      { label: 'Studio', key: 'studio' },
      { label: 'Contatti', key: 'contact' },
    ] as { label: string; key: 'services' | 'work' | 'studio' | 'contact' }[],
    cta: 'Parliamone',
    menu: 'Menu',
    close: 'Chiudi',
    langLabel: 'Lingua',
  },

  hero: {
    eyebrow: 'Studio digitale',
    titleLines: ['Presenza online', 'che lavora', 'per te.'],
    lead: 'Siti web, SEO e social media per aziende e professionisti. Progettiamo tutto quello che serve per farsi trovare, convincere e crescere — senza fronzoli.',
    ctaPrimary: 'Iniziamo un progetto',
    ctaSecondary: 'Guarda i lavori',
    scrollHint: 'Scorri',
    marquee: [
      'Siti web',
      'E-commerce',
      'SEO',
      'Social media',
      'Brand identity',
      'Google Ads',
      'Analytics',
      'Manutenzione',
    ],
  },

  manifesto: {
    eyebrow: 'Il nostro approccio',
    text: 'Un sito non è un volantino online. È il luogo dove le persone decidono se fidarsi di te. Per questo partiamo sempre dalle domande difficili — chi deve arrivare qui, cosa deve capire in tre secondi, cosa deve fare dopo — e solo dopo apriamo il progetto grafico.',
    signature: 'WAB Studio',
  },

  services: {
    eyebrow: 'Servizi',
    title: 'Tutto quello che serve alla tua presenza online.',
    lead: 'Puoi affidarci un singolo pezzo o l’intera presenza digitale. Nella pratica, i risultati migliori arrivano quando sito, contenuti e pubblicità raccontano la stessa storia.',
    cta: 'Vedi tutti i servizi',
    pageTitle: 'Servizi',
    pageLead:
      'Sei aree di lavoro che si tengono insieme. Puoi partire da una sola: ti diremo noi, onestamente, se le altre servono davvero.',
    items: [
      {
        num: '01',
        slug: 'siti-web',
        title: 'Siti web & E-commerce',
        short: 'Siti veloci, chiari e costruiti per convertire.',
        desc: 'Progettiamo e sviluppiamo siti vetrina, siti aziendali ed e-commerce. Codice pulito, caricamento immediato, pannello di gestione che riesci davvero a usare da solo.',
        bullets: [
          'Design su misura, niente template riciclati',
          'Sviluppo headless o CMS a seconda del progetto',
          'Ottimizzazione Core Web Vitals',
          'Formazione finale per gestire i contenuti',
        ],
      },
      {
        num: '02',
        slug: 'seo',
        title: 'SEO & Posizionamento',
        short: 'Farsi trovare da chi sta già cercando.',
        desc: 'Analisi delle parole chiave, struttura del sito, contenuti e aspetti tecnici. Lavoriamo sia sulla ricerca nazionale sia sulla SEO locale, dove si gioca la partita dei clienti vicini.',
        bullets: [
          'Audit tecnico e piano di intervento',
          'Ricerca parole chiave e intento di ricerca',
          'Contenuti e struttura delle pagine',
          'Profilo Google Business e SEO locale',
        ],
      },
      {
        num: '03',
        slug: 'social-media',
        title: 'Social Media Management',
        short: 'Una voce riconoscibile, pubblicata con costanza.',
        desc: 'Piano editoriale, produzione dei contenuti, pubblicazione e community. Niente post riempitivi: ogni contenuto ha un motivo per esistere e un posto nella strategia.',
        bullets: [
          'Strategia e piano editoriale mensile',
          'Grafiche, foto e video brevi',
          'Pubblicazione e gestione dei commenti',
          'Report mensile con i numeri che contano',
        ],
      },
      {
        num: '04',
        slug: 'brand',
        title: 'Brand & Contenuti',
        short: 'Identità coerente su ogni canale.',
        desc: 'Logo, palette, tipografia e linee guida. Più i testi: quello che scrivi conta quanto come appari, e spesso di più.',
        bullets: [
          'Identità visiva e linee guida',
          'Copywriting per sito e campagne',
          'Fotografia e direzione creativa',
          'Kit di materiali pronti all’uso',
        ],
      },
      {
        num: '05',
        slug: 'advertising',
        title: 'Advertising',
        short: 'Budget pubblicitario speso con criterio.',
        desc: 'Campagne Google e Meta impostate su obiettivi misurabili. Partiamo piccoli, misuriamo, e spingiamo solo quello che funziona davvero.',
        bullets: [
          'Google Ads: ricerca, shopping, display',
          'Meta Ads: Facebook e Instagram',
          'Tracciamento conversioni e pubblico',
          'Ottimizzazione continua del budget',
        ],
      },
      {
        num: '06',
        slug: 'care',
        title: 'Care & Analytics',
        short: 'Il sito resta veloce, sicuro e sotto controllo.',
        desc: 'Aggiornamenti, backup, monitoraggio e lettura dei dati. Un sito lasciato a sé stesso invecchia in fretta: noi ce ne occupiamo ogni mese.',
        bullets: [
          'Aggiornamenti e backup programmati',
          'Monitoraggio uptime e performance',
          'Dashboard analytics in chiaro',
          'Supporto prioritario via email',
        ],
      },
    ],
  },

  process: {
    eyebrow: 'Come lavoriamo',
    title: 'Un metodo in cinque passi.',
    lead: 'Nessuna sorpresa in corso d’opera. Sai sempre a che punto siamo, cosa stiamo facendo e cosa serve da parte tua.',
    steps: [
      {
        num: '01',
        title: 'Ascolto',
        desc: 'Una call o un caffè. Capiamo cosa vendi, a chi, e cosa non ha funzionato finora. Da qui esce il brief, non dalla nostra fantasia.',
      },
      {
        num: '02',
        title: 'Strategia',
        desc: 'Obiettivi misurabili, pubblico, struttura del sito e piano dei contenuti. Ti mandiamo un documento chiaro prima di disegnare qualsiasi cosa.',
      },
      {
        num: '03',
        title: 'Design',
        desc: 'Prima le pagine chiave, poi il resto. Lavoriamo su prototipi navigabili: vedi il sito muoversi prima che una riga di codice esista.',
      },
      {
        num: '04',
        title: 'Sviluppo',
        desc: 'Costruiamo, testiamo su dispositivi reali, ottimizziamo velocità e accessibilità. Tu rivedi tutto su un link privato prima del lancio.',
      },
      {
        num: '05',
        title: 'Crescita',
        desc: 'Online è l’inizio. Misuriamo, correggiamo, aggiungiamo contenuti e campagne. I progetti migliori crescono per anni.',
      },
    ],
  },

  work: {
    eyebrow: 'Lavori',
    title: 'Progetti recenti.',
    lead: 'Una selezione di lavori: cosa serviva, cosa abbiamo fatto, cosa è cambiato dopo.',
    cta: 'Tutti i progetti',
    pageTitle: 'Lavori',
    pageLead:
      'Progetti veri, con i numeri che li accompagnano. Ogni scheda racconta la situazione di partenza, le scelte fatte e il risultato.',
    caseLabels: {
      client: 'Cliente',
      year: 'Anno',
      sector: 'Settore',
      services: 'Servizi',
      challenge: 'La situazione',
      solution: 'Cosa abbiamo fatto',
      result: 'Risultati',
      next: 'Progetto successivo',
      back: 'Tutti i lavori',
      visit: 'Visita il sito',
    },
    placeholderNote:
      '⚠️ PLACEHOLDER — progetti di esempio. Sostituiscili con i tuoi lavori reali in content/it.ts.',
    items: [
      {
        slug: 'hotel-alpenblick',
        client: 'Hotel Alpenblick',
        title: 'Un sito che riempie le camere in bassa stagione',
        year: '2025',
        sector: 'Ospitalità',
        services: ['Sito web', 'SEO locale', 'Fotografia'],
        excerpt: 'Sito bilingue con prenotazione diretta e pagine dedicate alle esperienze stagionali.',
        challenge:
          'Il 90% delle prenotazioni arrivava dai portali, con commissioni pesanti. Il sito esistente era lento, non bilingue e invisibile su Google per le ricerche locali.',
        solution:
          'Sito nuovo in italiano e tedesco, motore di prenotazione integrato, pagine dedicate alle stagioni e alle esperienze in zona. Servizio fotografico e struttura SEO costruita sulle ricerche reali degli ospiti.',
        results: [
          { value: '+64%', label: 'prenotazioni dirette' },
          { value: '-38%', label: 'costo per prenotazione' },
          { value: '1,1s', label: 'tempo di caricamento' },
        ],
        accent: '#C9A227',
      },
      {
        slug: 'cantina-terrarossa',
        client: 'Cantina Terrarossa',
        title: 'Dalla cantina al carrello, senza attriti',
        year: '2025',
        sector: 'Food & Beverage',
        services: ['E-commerce', 'Brand', 'Meta Ads'],
        excerpt: 'E-commerce di vini con spedizioni in tutta Europa e racconto della cantina.',
        challenge:
          'Vendite solo in loco e qualche ordine via WhatsApp. Nessun catalogo online, nessun modo di raggiungere i clienti dopo la visita in cantina.',
        solution:
          'E-commerce con schede prodotto curate, confezioni regalo, spedizioni europee e automazioni email. Identità rivista e campagne Meta sui visitatori della zona.',
        results: [
          { value: '48k', label: 'euro di fatturato online nel primo anno' },
          { value: '2.400', label: 'iscritti alla newsletter' },
          { value: '3,2%', label: 'tasso di conversione' },
        ],
        accent: '#8E2B3F',
      },
      {
        slug: 'studio-moser',
        client: 'Studio Legale Moser',
        title: 'Primo risultato su Google per le ricerche che contano',
        year: '2024',
        sector: 'Servizi professionali',
        services: ['Sito web', 'SEO', 'Contenuti'],
        excerpt: 'Sito istituzionale e strategia di contenuti su materie di nicchia.',
        challenge:
          'Uno studio con trent’anni di esperienza e un sito che sembrava fermo al 2009. Nessuna visibilità sulle ricerche di settore.',
        solution:
          'Sito sobrio e autorevole, pagine dedicate a ogni area di attività, archivio di approfondimenti aggiornato ogni mese e struttura tecnica pulita.',
        results: [
          { value: '5x', label: 'contatti ricevuti dal sito' },
          { value: '#1', label: 'su 12 ricerche chiave' },
          { value: '+280%', label: 'traffico organico' },
        ],
        accent: '#2F4B7C',
      },
      {
        slug: 'legno-vivo',
        client: 'Legno Vivo',
        title: 'Un laboratorio artigiano che vende in tutta Italia',
        year: '2024',
        sector: 'Artigianato',
        services: ['E-commerce', 'Social media', 'Fotografia'],
        excerpt: 'Negozio online per arredi su misura, con configuratore e preventivo immediato.',
        challenge:
          'Lavorazioni su misura difficili da vendere online: ogni richiesta richiedeva ore di email per arrivare a un preventivo.',
        solution:
          'Configuratore di prodotto con preventivo immediato, galleria dei lavori e racconto del laboratorio sui social. Il preventivo arriva in trenta secondi invece che in tre giorni.',
        results: [
          { value: '-70%', label: 'tempo speso in preventivi' },
          { value: '+120%', label: 'richieste qualificate' },
          { value: '18k', label: 'follower in un anno' },
        ],
        accent: '#A4623A',
      },
      {
        slug: 'lumen-spa',
        client: 'Lumen Spa',
        title: 'Agenda piena con un budget pubblicitario piccolo',
        year: '2024',
        sector: 'Benessere',
        services: ['Social media', 'Google Ads', 'Landing page'],
        excerpt: 'Campagne locali e landing page dedicate ai trattamenti più richiesti.',
        challenge:
          'Un centro appena aperto, zero notorietà in zona e un budget pubblicitario da far rendere al centesimo.',
        solution:
          'Landing page per ogni trattamento, campagne Google sulle ricerche locali e contenuti social costanti con il volto del team. Prenotazione in due tap.',
        results: [
          { value: '6,40', label: 'euro di costo per prenotazione' },
          { value: '+310%', label: 'prenotazioni online' },
          { value: '4 mesi', label: 'per riempire l’agenda' },
        ],
        accent: '#3F7D6E',
      },
      {
        slug: 'nordic-bike',
        client: 'Nordic Bike Tours',
        title: 'Tour prenotabili online in tre lingue',
        year: '2023',
        sector: 'Turismo attivo',
        services: ['Sito web', 'SEO', 'Prenotazioni'],
        excerpt: 'Piattaforma di prenotazione per escursioni guidate, con calendario e pagamenti.',
        challenge:
          'Prenotazioni gestite a mano su un foglio di calcolo, con sovrapposizioni continue e nessun pagamento anticipato.',
        solution:
          'Sito trilingue con calendario disponibilità, pagamento online, promemoria automatici e pagine ottimizzate per le ricerche turistiche stagionali.',
        results: [
          { value: '100%', label: 'prenotazioni automatizzate' },
          { value: '+95%', label: 'posti venduti' },
          { value: '3', label: 'lingue gestite' },
        ],
        accent: '#2E6F95',
      },
    ],
  },

  stats: {
    eyebrow: 'In breve',
    items: [
      { value: 120, suffix: '+', decimals: 0, label: 'progetti consegnati' },
      { value: 9, suffix: '', decimals: 0, label: 'anni di lavoro sul digitale' },
      { value: 96, suffix: '%', decimals: 0, label: 'clienti che restano' },
      { value: 1.4, suffix: 's', decimals: 1, label: 'caricamento medio' },
    ],
    note: '⚠️ PLACEHOLDER — sostituisci con i tuoi numeri reali.',
  },

  stack: {
    eyebrow: 'Strumenti',
    title: 'Tecnologie che usiamo ogni giorno.',
    items: [
      'Next.js',
      'React',
      'TypeScript',
      'Shopify',
      'WordPress',
      'Figma',
      'GSAP',
      'Tailwind',
      'Vercel',
      'Analytics',
      'Search Console',
      'Meta Business',
    ],
  },

  testimonials: {
    eyebrow: 'Dicono di noi',
    title: 'Le parole dei clienti.',
    note: '⚠️ PLACEHOLDER — testimonianze di esempio.',
    items: [
      {
        quote:
          'Finalmente qualcuno che spiega le cose invece di nasconderle dietro paroloni. Il sito ha cambiato il modo in cui arrivano i clienti.',
        author: 'Elena Marchetti',
        role: 'Titolare, Hotel Alpenblick',
      },
      {
        quote:
          'Hanno capito il nostro lavoro meglio di quanto sapessimo raccontarlo noi. E i numeri si vedono.',
        author: 'Giorgio Pedrini',
        role: 'Cantina Terrarossa',
      },
      {
        quote: 'Puntuali, precisi, e disponibili anche sei mesi dopo il lancio. Non è scontato.',
        author: 'Avv. Sara Moser',
        role: 'Studio Legale Moser',
      },
    ],
  },

  faq: {
    eyebrow: 'Domande frequenti',
    title: 'Le domande che ci fanno sempre.',
    items: [
      {
        q: 'Quanto costa un sito?',
        a: 'Dipende da cosa deve fare. Un sito vetrina ben fatto parte da circa 2.500 €, un sito aziendale strutturato dai 6.000 €, un e-commerce dai 9.000 €. Dopo la prima call ti mandiamo un preventivo con le voci dettagliate: niente cifre a sorpresa.',
      },
      {
        q: 'Quanto tempo serve?',
        a: 'Un sito vetrina richiede dalle 3 alle 5 settimane, un progetto strutturato dalle 8 alle 12. I tempi dipendono molto da quanto velocemente arrivano testi, foto e feedback da parte tua.',
      },
      {
        q: 'Posso aggiornare il sito da solo?',
        a: 'Sì, è il punto. Consegniamo sempre un pannello di gestione semplice e una sessione di formazione registrata. Se preferisci non pensarci, ce ne occupiamo noi con un piano di manutenzione.',
      },
      {
        q: 'Lavorate solo in zona?',
        a: 'No. Lavoriamo in italiano e tedesco con clienti in tutta Italia, Austria, Germania e Svizzera. Le riunioni si fanno in videochiamata, e di persona quando ha senso.',
      },
      {
        q: 'In quanto tempo si vedono i risultati SEO?',
        a: 'I primi movimenti si vedono in 6–10 settimane, i risultati solidi dopo 4–6 mesi di lavoro costante. Chi ti promette la prima posizione in due settimane ti sta vendendo fumo.',
      },
      {
        q: 'Gestite anche i social?',
        a: 'Sì, con un piano editoriale mensile. Possiamo occuparci di tutto — strategia, grafiche, pubblicazione, commenti — oppure affiancare chi già se ne occupa internamente.',
      },
    ],
  },

  studio: {
    eyebrow: 'Studio',
    title: 'Piccoli di proposito.',
    lead: 'WAB Studio è uno studio digitale indipendente. Niente catena di montaggio, niente account manager che fa da postino: parli con chi lavora davvero sul tuo progetto.',
    body: [
      'Siamo nati dall’idea che una buona presenza online non sia una questione di budget enormi, ma di scelte giuste fatte nell’ordine giusto. Prima si capisce il problema, poi si progetta, poi si costruisce. Saltare il primo passo è il motivo per cui tanti siti belli non portano un solo cliente.',
      'Lavoriamo con aziende, professionisti e attività locali che hanno qualcosa di buono da raccontare e un modo poco efficace di raccontarlo. In italiano e in tedesco, perché i nostri clienti vivono spesso a cavallo tra due mercati.',
      'Ogni progetto resta nostro anche dopo il lancio: continuiamo a guardare i numeri, a proporre migliorie, a rispondere al telefono. È il motivo per cui la maggior parte dei clienti è con noi da anni.',
    ],
    valuesTitle: 'Tre cose su cui non transigiamo',
    values: [
      {
        title: 'Chiarezza',
        desc: 'Preventivi leggibili, tempi dichiarati, nessun gergo usato per impressionare. Se non riusciamo a spiegartelo, vuol dire che non serve.',
      },
      {
        title: 'Velocità',
        desc: 'Un sito lento è un sito che perde clienti e posizioni. Ottimizziamo ogni progetto fino all’ultimo millisecondo utile.',
      },
      {
        title: 'Continuità',
        desc: 'Non consegniamo e spariamo. Il lancio è il punto di partenza, non la fine del rapporto.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contatti',
    title: 'Raccontaci il progetto.',
    lead: 'Scrivici due righe su cosa ti serve. Rispondiamo entro un giorno lavorativo, sempre con una persona vera.',
    directTitle: 'Oppure scrivici direttamente',
    responseTime: 'Risposta entro 1 giorno lavorativo',
    form: {
      name: 'Nome e cognome',
      namePlaceholder: 'Mario Rossi',
      email: 'Email',
      emailPlaceholder: 'mario@azienda.it',
      company: 'Azienda',
      companyPlaceholder: 'Facoltativo',
      phone: 'Telefono',
      phonePlaceholder: 'Facoltativo',
      servicesLabel: 'Di cosa hai bisogno?',
      budgetLabel: 'Budget indicativo',
      budgets: [
        'Meno di 3.000 €',
        '3.000 – 8.000 €',
        '8.000 – 20.000 €',
        'Oltre 20.000 €',
        'Non lo so ancora',
      ],
      message: 'Il progetto',
      messagePlaceholder:
        'Cosa fai, cosa ti serve e qual è il problema da risolvere. Anche poche righe vanno benissimo.',
      privacy: 'Ho letto l’informativa privacy e acconsento al trattamento dei dati per essere ricontattato.',
      submit: 'Invia richiesta',
      submitting: 'Invio in corso…',
      successTitle: 'Richiesta inviata.',
      successBody: 'Grazie, abbiamo ricevuto il messaggio. Ti rispondiamo entro un giorno lavorativo.',
      successAgain: 'Invia un’altra richiesta',
      errorTitle: 'Qualcosa è andato storto.',
      errorBody:
        'Non siamo riusciti a inviare la richiesta. Riprova tra poco oppure scrivici direttamente via email.',
      errors: {
        name: 'Inserisci il tuo nome.',
        email: 'Inserisci un indirizzo email valido.',
        message: 'Scrivi due righe sul progetto (almeno 20 caratteri).',
        privacy: 'Devi accettare l’informativa per procedere.',
      },
    },
  },

  cta: {
    title: 'Hai un progetto in mente?',
    lead: 'Prima call gratuita, senza impegno e senza presentazioni da trenta slide.',
    button: 'Scrivici ora',
    secondary: 'Scopri i servizi',
  },

  footer: {
    tagline: 'Studio digitale. Siti web, SEO e social per chi vuole crescere online.',
    navTitle: 'Naviga',
    servicesTitle: 'Servizi',
    contactTitle: 'Contatti',
    socialTitle: 'Social',
    legal: ['Privacy policy', 'Cookie policy', 'Note legali'],
    rights: 'Tutti i diritti riservati.',
    madeIn: 'Progettato e sviluppato in casa.',
  },

  notFound: {
    title: 'Pagina non trovata',
    lead: 'La pagina che cercavi non esiste più, o non è mai esistita.',
    cta: 'Torna alla home',
  },
};

export type Dict = typeof it;
