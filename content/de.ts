/**
 * INHALTE AUF DEUTSCH — WAB Studio
 * --------------------------------
 * Diese Datei enthält alle deutschen Texte der Website.
 * Mit  ⚠️ PLACEHOLDER  markierte Inhalte sind realistische Beispiele:
 * vor dem Launch durch echte Daten ersetzen.
 */

import type { Dict } from './it';

export const de: Dict = {
  meta: {
    locale: 'de',
    label: 'Deutsch',
    short: 'DE',
    htmlLang: 'de-DE',
    title: 'WAB Studio — Websites, SEO und Social Media für Unternehmen, die wachsen wollen',
    titleTemplate: '%s — WAB Studio',
    description:
      'WAB Studio gestaltet schnelle Websites, kümmert sich um SEO und betreut die Social-Media-Präsenz von Unternehmen und Selbstständigen. Strategie, Design und Entwicklung aus einer Hand.',
    keywords: [
      'Webagentur',
      'Websites',
      'SEO',
      'Social Media Betreuung',
      'E-Commerce',
      'Webdesign',
      'Onlinepräsenz',
    ],
  },

  nav: {
    items: [
      { label: 'Leistungen', key: 'services' },
      { label: 'Arbeiten', key: 'work' },
      { label: 'Studio', key: 'studio' },
      { label: 'Kontakt', key: 'contact' },
    ],
    cta: 'Sprechen wir',
    menu: 'Menü',
    close: 'Schließen',
    langLabel: 'Sprache',
  },

  hero: {
    eyebrow: 'Digitalstudio',
    titleLines: ['Onlinepräsenz,', 'die für Sie', 'arbeitet.'],
    lead: 'Websites, SEO und Social Media für Unternehmen und Selbstständige. Wir bauen alles, was es braucht, um gefunden zu werden, zu überzeugen und zu wachsen — ohne Schnickschnack.',
    ctaPrimary: 'Projekt starten',
    ctaSecondary: 'Arbeiten ansehen',
    scrollHint: 'Scrollen',
    marquee: [
      'Websites',
      'E-Commerce',
      'SEO',
      'Social Media',
      'Markenauftritt',
      'Google Ads',
      'Analytics',
      'Wartung',
    ],
  },

  manifesto: {
    eyebrow: 'Unser Ansatz',
    text: 'Eine Website ist kein Flyer im Internet. Sie ist der Ort, an dem Menschen entscheiden, ob sie Ihnen vertrauen. Deshalb beginnen wir immer mit den unbequemen Fragen — wer soll hier ankommen, was muss in drei Sekunden klar sein, was soll danach passieren — und erst dann öffnen wir das Designprogramm.',
    signature: 'WAB Studio',
  },

  services: {
    eyebrow: 'Leistungen',
    title: 'Alles, was Ihre Onlinepräsenz braucht.',
    lead: 'Sie können uns einen einzelnen Baustein anvertrauen oder die gesamte digitale Präsenz. In der Praxis entstehen die besten Ergebnisse, wenn Website, Inhalte und Werbung dieselbe Geschichte erzählen.',
    cta: 'Alle Leistungen ansehen',
    pageTitle: 'Leistungen',
    pageLead:
      'Sechs Arbeitsbereiche, die zusammenspielen. Sie können mit einem einzigen starten: wir sagen Ihnen ehrlich, ob die anderen wirklich nötig sind.',
    items: [
      {
        num: '01',
        slug: 'siti-web',
        title: 'Websites & E-Commerce',
        short: 'Schnelle, klare Websites, die verkaufen.',
        desc: 'Wir gestalten und entwickeln Unternehmenswebsites und Onlineshops. Sauberer Code, sofortige Ladezeiten und ein Redaktionsbereich, den Sie tatsächlich selbst bedienen können.',
        bullets: [
          'Maßgeschneidertes Design, keine recycelten Vorlagen',
          'Headless oder CMS, je nach Projekt',
          'Optimierung der Core Web Vitals',
          'Abschließende Schulung für die Inhaltspflege',
        ],
      },
      {
        num: '02',
        slug: 'seo',
        title: 'SEO & Sichtbarkeit',
        short: 'Von denen gefunden werden, die bereits suchen.',
        desc: 'Keyword-Analyse, Seitenstruktur, Inhalte und Technik. Wir arbeiten an der überregionalen Suche genauso wie an der lokalen SEO, wo die Kunden aus der Nähe gewonnen werden.',
        bullets: [
          'Technisches Audit und Maßnahmenplan',
          'Keyword-Recherche und Suchintention',
          'Inhalte und Seitenstruktur',
          'Google-Unternehmensprofil und lokale SEO',
        ],
      },
      {
        num: '03',
        slug: 'social-media',
        title: 'Social Media Betreuung',
        short: 'Eine erkennbare Stimme, regelmäßig veröffentlicht.',
        desc: 'Redaktionsplan, Produktion der Inhalte, Veröffentlichung und Community. Keine Füllbeiträge: jeder Inhalt hat einen Grund und einen Platz in der Strategie.',
        bullets: [
          'Strategie und monatlicher Redaktionsplan',
          'Grafiken, Fotos und kurze Videos',
          'Veröffentlichung und Betreuung der Kommentare',
          'Monatlicher Bericht mit den relevanten Zahlen',
        ],
      },
      {
        num: '04',
        slug: 'brand',
        title: 'Marke & Inhalte',
        short: 'Ein stimmiger Auftritt auf allen Kanälen.',
        desc: 'Logo, Farben, Typografie und Richtlinien. Dazu die Texte: was Sie schreiben, zählt genauso viel wie Ihr Aussehen — oft mehr.',
        bullets: [
          'Visuelle Identität und Richtlinien',
          'Texte für Website und Kampagnen',
          'Fotografie und kreative Leitung',
          'Einsatzbereites Materialpaket',
        ],
      },
      {
        num: '05',
        slug: 'advertising',
        title: 'Werbung',
        short: 'Werbebudget mit Verstand eingesetzt.',
        desc: 'Google- und Meta-Kampagnen mit messbaren Zielen. Wir starten klein, messen, und skalieren nur, was wirklich funktioniert.',
        bullets: [
          'Google Ads: Suche, Shopping, Display',
          'Meta Ads: Facebook und Instagram',
          'Conversion-Tracking und Zielgruppen',
          'Laufende Budgetoptimierung',
        ],
      },
      {
        num: '06',
        slug: 'care',
        title: 'Betreuung & Analytics',
        short: 'Die Website bleibt schnell, sicher und im Blick.',
        desc: 'Updates, Backups, Monitoring und die Auswertung der Daten. Eine sich selbst überlassene Website altert schnell: wir kümmern uns jeden Monat darum.',
        bullets: [
          'Geplante Updates und Backups',
          'Monitoring von Erreichbarkeit und Tempo',
          'Verständliches Analytics-Dashboard',
          'Bevorzugter Support per E-Mail',
        ],
      },
    ],
  },

  process: {
    eyebrow: 'So arbeiten wir',
    title: 'Eine Methode in fünf Schritten.',
    lead: 'Keine Überraschungen unterwegs. Sie wissen jederzeit, wo wir stehen, woran wir arbeiten und was wir von Ihnen brauchen.',
    steps: [
      {
        num: '01',
        title: 'Zuhören',
        desc: 'Ein Gespräch oder ein Kaffee. Wir verstehen, was Sie verkaufen, an wen, und was bisher nicht funktioniert hat. Daraus entsteht das Briefing — nicht aus unserer Fantasie.',
      },
      {
        num: '02',
        title: 'Strategie',
        desc: 'Messbare Ziele, Zielgruppen, Seitenstruktur und Inhaltsplan. Sie bekommen ein klares Dokument, bevor irgendetwas gestaltet wird.',
      },
      {
        num: '03',
        title: 'Design',
        desc: 'Zuerst die wichtigen Seiten, dann der Rest. Wir arbeiten mit klickbaren Prototypen: Sie sehen die Website in Bewegung, bevor eine Zeile Code existiert.',
      },
      {
        num: '04',
        title: 'Entwicklung',
        desc: 'Wir bauen, testen auf echten Geräten und optimieren Tempo und Barrierefreiheit. Sie prüfen alles über einen privaten Link vor dem Launch.',
      },
      {
        num: '05',
        title: 'Wachstum',
        desc: 'Online zu sein ist der Anfang. Wir messen, korrigieren, ergänzen Inhalte und Kampagnen. Die besten Projekte wachsen über Jahre.',
      },
    ],
  },

  work: {
    eyebrow: 'Arbeiten',
    title: 'Aktuelle Projekte.',
    lead: 'Eine Auswahl an Arbeiten: was gebraucht wurde, was wir gemacht haben, was sich danach verändert hat.',
    cta: 'Alle Projekte',
    pageTitle: 'Arbeiten',
    pageLead:
      'Echte Projekte mit den Zahlen dazu. Jede Seite erzählt die Ausgangslage, die Entscheidungen und das Ergebnis.',
    caseLabels: {
      client: 'Kunde',
      year: 'Jahr',
      sector: 'Branche',
      services: 'Leistungen',
      challenge: 'Die Ausgangslage',
      solution: 'Was wir gemacht haben',
      result: 'Ergebnisse',
      next: 'Nächstes Projekt',
      back: 'Alle Arbeiten',
      visit: 'Website besuchen',
    },
    placeholderNote:
      '⚠️ PLACEHOLDER — Beispielprojekte. In content/de.ts durch echte Arbeiten ersetzen.',
    items: [
      {
        slug: 'hotel-alpenblick',
        client: 'Hotel Alpenblick',
        title: 'Eine Website, die in der Nebensaison die Zimmer füllt',
        year: '2025',
        sector: 'Hotellerie',
        services: ['Website', 'Lokale SEO', 'Fotografie'],
        excerpt: 'Zweisprachige Website mit Direktbuchung und Seiten zu den Erlebnissen der Saison.',
        challenge:
          '90% der Buchungen kamen über Portale, mit hohen Provisionen. Die bestehende Website war langsam, einsprachig und bei lokalen Suchanfragen unsichtbar.',
        solution:
          'Neue Website auf Italienisch und Deutsch, integrierte Buchungsmaschine, eigene Seiten für Jahreszeiten und Erlebnisse in der Region. Fotoproduktion und eine SEO-Struktur, die auf den echten Suchanfragen der Gäste aufbaut.',
        results: [
          { value: '+64%', label: 'Direktbuchungen' },
          { value: '-38%', label: 'Kosten pro Buchung' },
          { value: '1,1s', label: 'Ladezeit' },
        ],
        accent: '#C9A227',
      },
      {
        slug: 'cantina-terrarossa',
        client: 'Weingut Terrarossa',
        title: 'Vom Keller in den Warenkorb, ohne Reibung',
        year: '2025',
        sector: 'Food & Beverage',
        services: ['E-Commerce', 'Marke', 'Meta Ads'],
        excerpt: 'Weinshop mit Versand in ganz Europa und der Geschichte des Weinguts.',
        challenge:
          'Verkauf nur vor Ort und ein paar Bestellungen über WhatsApp. Kein Onlinekatalog, keine Möglichkeit, Gäste nach dem Besuch wieder zu erreichen.',
        solution:
          'Onlineshop mit sorgfältigen Produktseiten, Geschenkpaketen, Europaversand und E-Mail-Automationen. Überarbeiteter Auftritt und Meta-Kampagnen für Besucher der Region.',
        results: [
          { value: '48k', label: 'Euro Onlineumsatz im ersten Jahr' },
          { value: '2.400', label: 'Newsletter-Abonnenten' },
          { value: '3,2%', label: 'Conversion-Rate' },
        ],
        accent: '#8E2B3F',
      },
      {
        slug: 'studio-moser',
        client: 'Kanzlei Moser',
        title: 'Platz eins bei Google für die Suchanfragen, die zählen',
        year: '2024',
        sector: 'Dienstleistungen',
        services: ['Website', 'SEO', 'Inhalte'],
        excerpt: 'Repräsentative Website und Inhaltsstrategie für spezialisierte Rechtsgebiete.',
        challenge:
          'Eine Kanzlei mit dreißig Jahren Erfahrung und einer Website, die bei 2009 stehengeblieben war. Keinerlei Sichtbarkeit bei fachlichen Suchanfragen.',
        solution:
          'Zurückhaltende, seriöse Website, eigene Seiten für jedes Tätigkeitsfeld, ein monatlich gepflegtes Facharchiv und eine saubere technische Basis.',
        results: [
          { value: '5x', label: 'Anfragen über die Website' },
          { value: '#1', label: 'bei 12 zentralen Suchanfragen' },
          { value: '+280%', label: 'organischer Traffic' },
        ],
        accent: '#2F4B7C',
      },
      {
        slug: 'legno-vivo',
        client: 'Legno Vivo',
        title: 'Eine Tischlerei, die in ganz Italien verkauft',
        year: '2024',
        sector: 'Handwerk',
        services: ['E-Commerce', 'Social Media', 'Fotografie'],
        excerpt: 'Onlineshop für Möbel nach Maß, mit Konfigurator und sofortigem Angebot.',
        challenge:
          'Maßanfertigungen lassen sich online schwer verkaufen: jede Anfrage kostete Stunden an E-Mails bis zum Angebot.',
        solution:
          'Produktkonfigurator mit sofortigem Angebot, Galerie der Arbeiten und Einblicke in die Werkstatt auf Social Media. Das Angebot kommt in dreißig Sekunden statt in drei Tagen.',
        results: [
          { value: '-70%', label: 'Zeitaufwand für Angebote' },
          { value: '+120%', label: 'qualifizierte Anfragen' },
          { value: '18k', label: 'Follower in einem Jahr' },
        ],
        accent: '#A4623A',
      },
      {
        slug: 'lumen-spa',
        client: 'Lumen Spa',
        title: 'Volle Terminkalender mit kleinem Werbebudget',
        year: '2024',
        sector: 'Wellness',
        services: ['Social Media', 'Google Ads', 'Landingpage'],
        excerpt: 'Lokale Kampagnen und eigene Landingpages für die gefragtesten Behandlungen.',
        challenge:
          'Ein frisch eröffnetes Zentrum, null Bekanntheit in der Gegend und ein Werbebudget, das bis auf den Cent wirken musste.',
        solution:
          'Eine Landingpage pro Behandlung, Google-Kampagnen auf lokale Suchanfragen und regelmäßige Social-Media-Inhalte mit dem Gesicht des Teams. Terminbuchung in zwei Klicks.',
        results: [
          { value: '6,40', label: 'Euro Kosten pro Buchung' },
          { value: '+310%', label: 'Onlinebuchungen' },
          { value: '4 Monate', label: 'bis zum vollen Kalender' },
        ],
        accent: '#3F7D6E',
      },
      {
        slug: 'nordic-bike',
        client: 'Nordic Bike Tours',
        title: 'Touren online buchbar in drei Sprachen',
        year: '2023',
        sector: 'Aktivtourismus',
        services: ['Website', 'SEO', 'Buchungen'],
        excerpt: 'Buchungsplattform für geführte Touren, mit Kalender und Zahlungen.',
        challenge:
          'Buchungen wurden per Hand in einer Tabelle geführt, mit ständigen Überschneidungen und ohne Vorauszahlung.',
        solution:
          'Dreisprachige Website mit Verfügbarkeitskalender, Onlinezahlung, automatischen Erinnerungen und Seiten, die auf saisonale Suchanfragen optimiert sind.',
        results: [
          { value: '100%', label: 'automatisierte Buchungen' },
          { value: '+95%', label: 'verkaufte Plätze' },
          { value: '3', label: 'betreute Sprachen' },
        ],
        accent: '#2E6F95',
      },
    ],
  },

  stats: {
    eyebrow: 'Kurz gefasst',
    items: [
      { value: 120, suffix: '+', decimals: 0, label: 'abgeschlossene Projekte' },
      { value: 9, suffix: '', decimals: 0, label: 'Jahre Erfahrung im Digitalen' },
      { value: 96, suffix: '%', decimals: 0, label: 'Kunden, die bleiben' },
      { value: 1.4, suffix: 's', decimals: 1, label: 'durchschnittliche Ladezeit' },
    ],
    note: '⚠️ PLACEHOLDER — durch echte Zahlen ersetzen.',
  },

  stack: {
    eyebrow: 'Werkzeuge',
    title: 'Technologien, mit denen wir täglich arbeiten.',
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
    eyebrow: 'Stimmen',
    title: 'Was Kunden sagen.',
    note: '⚠️ PLACEHOLDER — Beispielstimmen.',
    items: [
      {
        quote:
          'Endlich jemand, der Dinge erklärt, statt sie hinter Fachbegriffen zu verstecken. Die Website hat verändert, wie Kunden zu uns kommen.',
        author: 'Elena Marchetti',
        role: 'Inhaberin, Hotel Alpenblick',
      },
      {
        quote:
          'Sie haben unsere Arbeit besser verstanden, als wir sie selbst erzählen konnten. Und man sieht es an den Zahlen.',
        author: 'Giorgio Pedrini',
        role: 'Weingut Terrarossa',
      },
      {
        quote: 'Pünktlich, präzise und auch sechs Monate nach dem Launch erreichbar. Das ist keine Selbstverständlichkeit.',
        author: 'RA Sara Moser',
        role: 'Kanzlei Moser',
      },
    ],
  },

  faq: {
    eyebrow: 'Häufige Fragen',
    title: 'Was uns immer gefragt wird.',
    items: [
      {
        q: 'Was kostet eine Website?',
        a: 'Das hängt davon ab, was sie leisten soll. Eine gut gemachte Präsenzwebsite startet bei rund 2.500 €, eine strukturierte Unternehmenswebsite ab 6.000 €, ein Onlineshop ab 9.000 €. Nach dem ersten Gespräch bekommen Sie ein Angebot mit allen Posten im Detail — keine Überraschungen.',
      },
      {
        q: 'Wie lange dauert es?',
        a: 'Eine Präsenzwebsite braucht 3 bis 5 Wochen, ein strukturiertes Projekt 8 bis 12. Die Dauer hängt stark davon ab, wie schnell Texte, Fotos und Rückmeldungen von Ihnen kommen.',
      },
      {
        q: 'Kann ich die Website selbst pflegen?',
        a: 'Ja, genau darum geht es. Sie bekommen immer einen einfachen Redaktionsbereich und eine aufgezeichnete Schulung. Wenn Sie lieber nicht daran denken möchten, übernehmen wir das mit einem Wartungspaket.',
      },
      {
        q: 'Arbeiten Sie nur regional?',
        a: 'Nein. Wir arbeiten auf Italienisch und Deutsch mit Kunden in ganz Italien, Österreich, Deutschland und der Schweiz. Besprechungen laufen per Video — und persönlich, wenn es Sinn ergibt.',
      },
      {
        q: 'Wann zeigen sich SEO-Ergebnisse?',
        a: 'Erste Bewegungen sieht man nach 6–10 Wochen, belastbare Ergebnisse nach 4–6 Monaten konsequenter Arbeit. Wer Ihnen Platz eins in zwei Wochen verspricht, verkauft Ihnen Luft.',
      },
      {
        q: 'Betreuen Sie auch Social Media?',
        a: 'Ja, mit einem monatlichen Redaktionsplan. Wir übernehmen alles — Strategie, Grafiken, Veröffentlichung, Kommentare — oder unterstützen die Person, die das intern bereits macht.',
      },
    ],
  },

  studio: {
    eyebrow: 'Studio',
    title: 'Klein, und zwar mit Absicht.',
    lead: 'WAB Studio ist ein unabhängiges Digitalstudio. Kein Fließband, kein Account Manager als Briefträger: Sie sprechen mit den Menschen, die tatsächlich an Ihrem Projekt arbeiten.',
    body: [
      'Wir sind aus der Überzeugung entstanden, dass eine gute Onlinepräsenz keine Frage riesiger Budgets ist, sondern richtiger Entscheidungen in der richtigen Reihenfolge. Erst das Problem verstehen, dann gestalten, dann bauen. Den ersten Schritt zu überspringen ist der Grund, warum so viele schöne Websites keinen einzigen Kunden bringen.',
      'Wir arbeiten mit Unternehmen, Selbstständigen und lokalen Betrieben, die etwas Gutes zu erzählen haben und es bisher wenig wirksam erzählen. Auf Italienisch und auf Deutsch, weil unsere Kunden oft zwischen zwei Märkten leben.',
      'Jedes Projekt bleibt auch nach dem Launch unseres: wir schauen weiter auf die Zahlen, schlagen Verbesserungen vor und gehen ans Telefon. Deshalb sind die meisten Kunden seit Jahren bei uns.',
    ],
    valuesTitle: 'Drei Dinge, bei denen wir keine Kompromisse machen',
    values: [
      {
        title: 'Klarheit',
        desc: 'Lesbare Angebote, zugesagte Termine, kein Fachjargon zum Beeindrucken. Wenn wir es Ihnen nicht erklären können, brauchen Sie es nicht.',
      },
      {
        title: 'Tempo',
        desc: 'Eine langsame Website verliert Kunden und Platzierungen. Wir optimieren jedes Projekt bis zur letzten sinnvollen Millisekunde.',
      },
      {
        title: 'Beständigkeit',
        desc: 'Wir liefern nicht ab und verschwinden. Der Launch ist der Startpunkt, nicht das Ende der Zusammenarbeit.',
      },
    ],
  },

  contact: {
    eyebrow: 'Kontakt',
    title: 'Erzählen Sie uns vom Projekt.',
    lead: 'Schreiben Sie uns ein paar Zeilen dazu, was Sie brauchen. Wir antworten innerhalb eines Werktags, immer persönlich.',
    directTitle: 'Oder schreiben Sie uns direkt',
    responseTime: 'Antwort innerhalb von 1 Werktag',
    form: {
      name: 'Vor- und Nachname',
      namePlaceholder: 'Max Mustermann',
      email: 'E-Mail',
      emailPlaceholder: 'max@unternehmen.de',
      company: 'Unternehmen',
      companyPlaceholder: 'Optional',
      phone: 'Telefon',
      phonePlaceholder: 'Optional',
      servicesLabel: 'Worum geht es?',
      budgetLabel: 'Ungefähres Budget',
      budgets: [
        'Unter 3.000 €',
        '3.000 – 8.000 €',
        '8.000 – 20.000 €',
        'Über 20.000 €',
        'Weiß ich noch nicht',
      ],
      message: 'Das Projekt',
      messagePlaceholder:
        'Was Sie machen, was Sie brauchen und welches Problem gelöst werden soll. Ein paar Zeilen genügen.',
      privacy: 'Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zur Kontaktaufnahme zu.',
      submit: 'Anfrage senden',
      submitting: 'Wird gesendet…',
      successTitle: 'Anfrage gesendet.',
      successBody: 'Danke, wir haben Ihre Nachricht erhalten. Sie hören innerhalb eines Werktags von uns.',
      successAgain: 'Weitere Anfrage senden',
      errorTitle: 'Da ist etwas schiefgelaufen.',
      errorBody:
        'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es gleich noch einmal oder schreiben Sie uns direkt per E-Mail.',
      errors: {
        name: 'Bitte geben Sie Ihren Namen an.',
        email: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
        message: 'Beschreiben Sie das Projekt kurz (mindestens 20 Zeichen).',
        privacy: 'Bitte stimmen Sie der Datenschutzerklärung zu.',
      },
    },
  },

  cta: {
    title: 'Sie haben ein Projekt im Kopf?',
    lead: 'Erstes Gespräch kostenlos, unverbindlich und ohne Präsentation mit dreißig Folien.',
    button: 'Jetzt schreiben',
    secondary: 'Leistungen ansehen',
  },

  footer: {
    tagline: 'Digitalstudio. Websites, SEO und Social Media für alle, die online wachsen wollen.',
    navTitle: 'Navigation',
    servicesTitle: 'Leistungen',
    contactTitle: 'Kontakt',
    socialTitle: 'Social',
    legal: ['Datenschutz', 'Cookie-Richtlinie', 'Impressum'],
    rights: 'Alle Rechte vorbehalten.',
    madeIn: 'Im Haus gestaltet und entwickelt.',
  },

  notFound: {
    title: 'Seite nicht gefunden',
    lead: 'Die gesuchte Seite gibt es nicht mehr — oder hat es nie gegeben.',
    cta: 'Zur Startseite',
  },
};
