/**
 * DATI DELLO STUDIO
 * -----------------
 * ⚠️ PLACEHOLDER: sostituisci email, telefono, indirizzo, P.IVA e social
 * con i tuoi dati reali prima di pubblicare il sito.
 */

export const site = {
  name: 'WAB Studio',
  legalName: 'WAB Studio',
  // Dominio di produzione: serve per metadata, sitemap e dati strutturati.
  url: 'https://www.wabstudio.it',

  email: 'info@wabstudio.it',
  phone: '+39 351 000 0000',
  phoneHref: '+393510000000',

  address: {
    street: 'Via Esempio 12',
    zip: '39100',
    city: 'Bolzano',
    region: 'BZ',
    country: 'Italia',
    countryCode: 'IT',
  },

  vat: 'IT00000000000',

  // Orari indicativi mostrati nei contatti
  hours: {
    it: 'Lun – Ven, 9:00 – 18:00',
    de: 'Mo – Fr, 9:00 – 18:00',
  },

  socials: [
    { name: 'Instagram', url: 'https://instagram.com/wabstudio', handle: '@wabstudio' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/wabstudio', handle: 'WAB Studio' },
    { name: 'Facebook', url: 'https://facebook.com/wabstudio', handle: 'WAB Studio' },
  ],

  founded: '2016',
} as const;

export const fullAddress = `${site.address.street}, ${site.address.zip} ${site.address.city} (${site.address.region}), ${site.address.country}`;
