/* ====================================================================
   OCCASION PAGE GENERATOR
   --------------------------------------------------------------------
   Writes src/pages/<slug>.html for every occasion below, all sharing
   the proposal page's structure. Generating them from one spec keeps
   the five pages genuinely identical in shape — hand-maintaining five
   near-copies is how they drift apart.

   The proposal page is deliberately NOT in this list. It is
   hand-maintained and must not be regenerated.

   USAGE:  node src/build-occasions.js   (then: node build.js)
   ==================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const WA = 'https://wa.me/61468820725?text=';

const OCCASIONS = [
  {
    id: 'date_night_page',
    file: 'datenights',
    urlPath: 'occasions/romantic-picnic-date-sydney/',
    label: 'Date Nights',
    eyebrow: 'Date Nights &middot; Sydney',
    h1: 'Romantic picnic date nights in&nbsp;Sydney.',
    heroSub: 'A table for two, styled at golden hour and waiting for you. We set it up before you arrive and pack it down after &mdash; you just turn up.',
    heroAlt: 'Romantic date night picnic for two styled by Harmony Moments on a Sydney harbourside lawn at golden hour',
    waText: 'Hi%20Harmony%20Moments%2C%20I%27d%20love%20to%20book%20a%20date%20night%20picnic%20%F0%9F%8C%B8',
    title: 'Romantic Picnic Date Night Sydney | Styled Setups from $200',
    description: 'Planning a romantic date night in Sydney? We style low-table picnics for two at golden hour — set up before you arrive, packed down after. From $200. 5.0 on Google.',
    price: 'From $200',
    priceNote: 'For two. Harbourside, beach, park or your own backyard.',
    addOns: 'Add fresh florals, a bottle on ice, or our <strong>personally curated grazing</strong> &mdash; chosen by hand for the evening, never an off-the-shelf box. Optional, on request.',
    priceSchema: '200',
    faqPrice: 'Date night setups start from <strong>$200</strong> for two, which covers the styled setting, florals and setup. Extras like fresh florals, additional d&eacute;cor and curated grazing sit on top.',
    faqPriceText: 'Date night setups start from $200 for two, which covers the styled setting, florals and setup. Extras like fresh florals, additional decor and curated grazing sit on top. Send us your date and we will come back with an exact quote.',
    trust: ['Set up before you arrive', 'A table for two at golden hour', 'Harbourside, beach, park or at home', 'Packed down after &mdash; you lift nothing'],
    intro: 'Turn up. It&rsquo;s already done.',
    included: [
      'Styled low timber table, linen, cushions &amp; rug',
      'Seasonal florals in your palette',
      'Candles, glassware and finishing details',
      'Location suggestions right across Sydney',
      'Set up before you arrive, packed down after'
    ],
    steps: [
      ['Pick your evening', 'Your date and your spot. No spot in mind? We&rsquo;ll suggest one with the right light and the right amount of quiet.'],
      ['We set the scene', 'We arrive early and style the whole table, so it&rsquo;s lit and waiting the moment you walk up.'],
      ['You just turn up', 'Stay as long as you like. We come back afterwards and pack the whole thing down.']
    ],
    gallery: [
      ['occ-datenights-1.webp', 'Harbourside table for two at sunset', 'Date night picnic for two styled on a Sydney harbourside headland at sunset'],
      ['occ-datenights-2.webp', 'Candlelit dusk setting', 'Candlelit date night picnic at dusk with glass hurricane lanterns and fairy lights'],
      ['occ-datenights-3.webp', 'The details', 'Close-up of a date night tablescape with champagne coupes, blush roses and gold candles'],
      ['occ-datenights-4.webp', 'At home, in your backyard', 'At-home date night picnic styled in a Sydney backyard at dusk with string lights'],
      ['gallery-1.webp', 'A setup we styled &mdash; harbour sunset', 'A real Harmony Moments picnic setup at sunset beside Sydney Harbour'],
      ['gallery-6.webp', 'A setup we styled &mdash; candlelight', 'Close-up of candles and gold place settings from a real Harmony Moments setup']
    ],
    faqs: [
      ['How far in advance should I book?', 'A week or two is comfortable, and weekend sunset slots go first. If your date is sooner, message us anyway &mdash; we can often make it work.'],
      ['Where in Sydney can you set up?', 'Harbourside headlands, beaches, quiet park corners, and your own backyard &mdash; right across Sydney. If you&rsquo;re not sure where, we&rsquo;ll suggest a spot that suits your timing and the light.'],
      ['What if it rains?', 'We watch the forecast with you and move the date at no extra cost, or shift to an at-home setup so the evening still happens.'],
      ['Can we stay as long as we like?', 'Your setup is yours for the booked window, and we&rsquo;re flexible if you want longer &mdash; just let us know when you book.'],
      ['Do you provide the food?', 'We offer <strong>personally curated catering</strong> &mdash; put together by hand for your occasion, never an off-the-shelf grazing box. It&rsquo;s an optional add-on, arranged on request and quoted separately, so you&rsquo;re just as welcome to bring your own.']
    ]
  },

  {
    id: 'anniversary_page',
    file: 'anniversaries',
    urlPath: 'occasions/anniversary-picnic-sydney/',
    label: 'Anniversaries',
    eyebrow: 'Anniversaries &middot; Sydney',
    h1: 'Anniversary picnics in&nbsp;Sydney.',
    heroSub: 'However many years it&rsquo;s been, it deserves more than a restaurant booking. We style the whole setting so the evening is about the two of you.',
    heroAlt: 'Anniversary picnic for two styled by Harmony Moments on a Sydney harbourside lawn at golden hour',
    waText: 'Hi%20Harmony%20Moments%2C%20I%27d%20love%20to%20book%20an%20anniversary%20picnic%20%F0%9F%8C%B8',
    title: 'Anniversary Picnic Sydney | Styled Anniversary Setups from $200',
    description: 'Celebrating an anniversary in Sydney? We style romantic low-table picnics for two at golden hour — set up before you arrive, packed down after. From $200. 5.0 on Google.',
    price: 'From $200',
    priceNote: 'For two. Harbourside, beach, park or your own backyard.',
    addOns: 'Add a cake, fresh florals, or our <strong>personally curated grazing</strong> &mdash; chosen by hand for the occasion, never an off-the-shelf box. Optional, on request.',
    priceSchema: '200',
    faqPrice: 'Anniversary setups start from <strong>$200</strong> for two, which covers the styled setting, florals and setup. Extras like a cake, additional fresh florals and curated grazing sit on top.',
    faqPriceText: 'Anniversary setups start from $200 for two, which covers the styled setting, florals and setup. Extras like a cake, additional fresh florals and curated grazing sit on top. Send us your date and we will come back with an exact quote.',
    trust: ['Set up before you arrive', 'Styled around your milestone', 'Harbourside, beach, park or at home', 'Packed down after &mdash; you lift nothing'],
    intro: 'However many years &mdash; marked properly.',
    included: [
      'Styled low timber table, linen, cushions &amp; rug',
      'Seasonal florals in your palette',
      'Candles, glassware and finishing details',
      'Personalised touches for the milestone',
      'Set up before you arrive, packed down after'
    ],
    steps: [
      ['Tell us what you&rsquo;re marking', 'One year or forty. Your date, your spot, and anything you&rsquo;d like woven in.'],
      ['We style it in advance', 'We arrive early and set the whole thing up, so nothing is rushed and nothing is left to you.'],
      ['You just arrive', 'Take your time over it. We come back afterwards and pack it all down.']
    ],
    gallery: [
      ['occ-anniversaries-1.webp', 'Harbourside, at golden hour', 'Anniversary picnic for two styled on a Sydney harbourside headland at golden hour'],
      ['occ-anniversaries-2.webp', 'The details', 'Close-up of an anniversary tablescape with champagne coupes, roses and a small cake'],
      ['occ-anniversaries-3.webp', 'Under the eucalypts', 'Anniversary picnic styled under a eucalyptus canopy in a Sydney park at golden hour'],
      ['occ-anniversaries-4.webp', 'Candlelit, at home', 'Candlelit anniversary setup in a Sydney backyard at dusk with string lights'],
      ['gallery-5.webp', 'A setup we styled &mdash; waterside', 'A real Harmony Moments table for two set beside the water'],
      ['gallery-4.webp', 'A setup we styled &mdash; place settings', 'Close-up of a real Harmony Moments place setting with gold cutlery and woven placemat']
    ],
    faqs: [
      ['How far in advance should I book?', 'A week or two is comfortable, and weekend sunset slots go first. If your date is sooner, message us anyway &mdash; we can often make it work.'],
      ['Where in Sydney can you set up?', 'Harbourside headlands, beaches, quiet park corners, and your own backyard &mdash; right across Sydney. Tell us the vibe and we&rsquo;ll suggest a spot.'],
      ['What if it rains?', 'We watch the forecast with you and move the date at no extra cost, or shift to an at-home setup so the celebration still happens.'],
      ['Can you add a cake or personalised details?', 'Yes &mdash; signage, a cake, a particular flower, a framed photo. Mention it when you enquire and we&rsquo;ll build it in.'],
      ['Do you provide the food?', 'We offer <strong>personally curated catering</strong> &mdash; put together by hand for your occasion, never an off-the-shelf grazing box. It&rsquo;s an optional add-on, arranged on request and quoted separately, so you&rsquo;re just as welcome to bring your own.']
    ]
  },

  {
    id: 'birthday_page',
    file: 'birthdays',
    urlPath: 'occasions/birthday-picnic-sydney/',
    label: 'Birthdays',
    eyebrow: 'Birthdays &middot; Sydney',
    h1: 'Birthday picnics in&nbsp;Sydney.',
    heroSub: 'Turn up to a table that&rsquo;s already styled, already photographed-ready, already done. No hauling, no setting up, no packing down at the end.',
    heroAlt: 'Birthday picnic styled by Harmony Moments on a Sydney harbourside lawn at golden hour with cake and florals',
    waText: 'Hi%20Harmony%20Moments%2C%20I%27d%20love%20to%20book%20a%20birthday%20picnic%20%F0%9F%8E%82',
    title: 'Birthday Picnic Sydney | Styled Birthday Setups from $200',
    description: 'Planning a birthday in Sydney? We style low-table birthday picnics for two or for groups of 4–6 — set up before you arrive, packed down after. From $200. 5.0 on Google.',
    price: 'From $200',
    priceNote: 'For two &middot; from <strong>$300</strong> for a group of 4&ndash;6. Harbourside, park or your own backyard.',
    addOns: 'Add a cake, balloons, signage, or our <strong>personally curated grazing</strong> &mdash; chosen by hand for the party, never an off-the-shelf box. Optional, on request.',
    priceSchema: '200',
    faqPrice: 'Birthday setups start from <strong>$200</strong> for two, or <strong>$300</strong> for a group of four to six. That covers the styled setting, florals and setup. Extras like a cake, balloons, additional florals and curated grazing sit on top.',
    faqPriceText: 'Birthday setups start from $200 for two, or $300 for a group of four to six. That covers the styled setting, florals and setup. Extras like a cake, balloons, additional florals and curated grazing sit on top. Send us your date and guest count and we will come back with an exact quote.',
    trust: ['Set up before the party arrives', 'Two guests, or a group of six', 'Cake, balloons &amp; signage on request', 'Packed down after &mdash; you lift nothing'],
    intro: 'No hauling. No setting up. No packing down.',
    included: [
      'Styled low timber table, linen, cushions &amp; rug',
      'Seating and styling for two, or for up to six',
      'Seasonal florals in your palette',
      'Candles, glassware and finishing details',
      'Set up before you arrive, packed down after'
    ],
    steps: [
      ['Tell us who it&rsquo;s for', 'The date, the spot, how many are coming, and what they&rsquo;d love. We&rsquo;ll suggest a location if you need one.'],
      ['We set it all up', 'We arrive early and style everything, so the birthday starts the second everyone walks up.'],
      ['You just show up', 'Celebrate properly. We come back afterwards and clear every last thing.']
    ],
    gallery: [
      ['occ-birthdays-1.webp', 'Harbourside, for six', 'Birthday picnic for six styled on a Sydney harbourside lawn with cake, florals and balloons'],
      ['occ-birthdays-2.webp', 'Intimate, for two', 'Intimate birthday picnic for two styled in a Sydney park at golden hour with a small cake'],
      ['occ-birthdays-3.webp', 'The details', 'Close-up of a birthday tablescape with a layered cake, blush roses and a grazing board'],
      ['occ-birthdays-4.webp', 'At home, in your backyard', 'Birthday picnic styled in a Sydney backyard at dusk with string lights and balloons'],
      ['gallery-3.webp', 'A setup we styled &mdash; harbourside', 'A real Harmony Moments picnic table styled beside Sydney Harbour'],
      ['gallery-1.webp', 'A setup we styled &mdash; sunset', 'A real Harmony Moments setup at sunset beside the water']
    ],
    faqs: [
      ['How much does a birthday picnic cost?', 'PRICE_PLACEHOLDER'],
      ['How many guests can you style for?', 'Anywhere from two up to six around the low table. If you&rsquo;re planning something bigger, message us with the numbers and we&rsquo;ll tell you what&rsquo;s possible.'],
      ['Where in Sydney can you set up?', 'Harbourside headlands, beaches, quiet park corners, and your own backyard &mdash; right across Sydney.'],
      ['What if it rains?', 'We watch the forecast with you and move the date at no extra cost, or shift to an at-home setup so the birthday still happens.'],
      ['Can you add a cake, balloons or signage?', 'Yes &mdash; all available as add-ons. Mention what you&rsquo;d like when you enquire and we&rsquo;ll include it in the quote.'],
      ['Do you provide the food?', 'We offer <strong>personally curated catering</strong> &mdash; put together by hand for your occasion, never an off-the-shelf grazing box. It&rsquo;s an optional add-on, arranged on request and quoted separately, so you&rsquo;re just as welcome to bring your own.']
    ]
  },

  {
    id: 'baby_shower_page',
    file: 'babyshowers',
    urlPath: 'occasions/baby-shower-picnic-sydney/',
    label: 'Baby Showers',
    eyebrow: 'Baby Showers &middot; Sydney',
    h1: 'Baby shower picnics in&nbsp;Sydney.',
    heroSub: 'A soft, beautiful setting styled outdoors &mdash; without you carrying a single thing to it. We set up before your guests arrive and pack down after they leave.',
    heroAlt: 'Baby shower picnic styled by Harmony Moments on a Sydney harbourside lawn with a pastel balloon arch',
    waText: 'Hi%20Harmony%20Moments%2C%20I%27d%20love%20to%20book%20a%20baby%20shower%20picnic%20%F0%9F%8D%BC',
    title: 'Baby Shower Picnic Sydney | Styled Baby Shower Setups from $300',
    description: 'Planning a baby shower in Sydney? We style outdoor low-table setups for groups of 4–6 with pastel florals and balloon arches — set up and packed down for you. From $300.',
    price: 'From $300',
    priceNote: 'For 4&ndash;6 guests. Harbourside, park or your own backyard.',
    addOns: 'Add a balloon arch, dessert styling, extra florals, or our <strong>personally curated grazing</strong> &mdash; chosen by hand for the day, never an off-the-shelf box. Optional, on request.',
    priceSchema: '300',
    faqPrice: 'Baby shower setups start from <strong>$300</strong> for a group of four to six, which covers the styled setting, florals and setup. Extras like a balloon arch, dessert styling, additional florals and curated grazing sit on top.',
    faqPriceText: 'Baby shower setups start from $300 for a group of four to six, which covers the styled setting, florals and setup. Extras like a balloon arch, dessert styling, additional florals and curated grazing sit on top. Send us your date and guest count and we will come back with an exact quote.',
    trust: ['Set up before your guests arrive', 'Styled for groups of 4&ndash;6', 'Your palette, matched throughout', 'Packed down after &mdash; you just host'],
    intro: 'Beautiful outdoors, without you carrying a thing.',
    included: [
      'Styled low timber table, linen, cushions &amp; rug',
      'Seating and styling for up to six',
      'Soft seasonal florals in your palette',
      'Candles, glassware and finishing details',
      'Set up before you arrive, packed down after'
    ],
    steps: [
      ['Tell us your palette', 'The date, the spot, your colours and how many are coming. We&rsquo;ll suggest a location if you need one.'],
      ['We set it all up', 'We arrive early and style the whole setting, finished before the first guest walks up.'],
      ['You just host', 'Be present for it. We come back afterwards and pack every last thing down.']
    ],
    gallery: [
      ['occ-babyshowers-1.webp', 'Harbourside, with a balloon arch', 'Baby shower picnic for six styled on a Sydney harbourside lawn with a pastel balloon arch'],
      ['occ-babyshowers-2.webp', 'Under the eucalypts', 'Baby shower picnic styled under a eucalyptus canopy in a Sydney park with pastel balloons'],
      ['occ-babyshowers-3.webp', 'The details', 'Close-up of a baby shower tablescape with pastel cupcakes, peach roses and gold candles'],
      ['occ-babyshowers-4.webp', 'At home, in your garden', 'Baby shower picnic styled in a Sydney backyard with a pastel balloon arch and dessert display'],
      ['gallery-5.webp', 'A setup we styled &mdash; waterside', 'A real Harmony Moments table styled beside the water'],
      ['gallery-4.webp', 'A setup we styled &mdash; place settings', 'Close-up of a real Harmony Moments place setting with gold cutlery and woven placemat']
    ],
    faqs: [
      ['How much does a baby shower picnic cost?', 'PRICE_PLACEHOLDER'],
      ['How many guests can you style for?', 'Up to six around the low table. Planning something larger? Message us with the numbers and we&rsquo;ll tell you what&rsquo;s possible.'],
      ['Can we choose the colours?', 'Yes &mdash; tell us your palette and we&rsquo;ll style the florals, linen and d&eacute;cor to match it.'],
      ['Where in Sydney can you set up?', 'Harbourside lawns, quiet park corners, and your own backyard &mdash; right across Sydney.'],
      ['What if it rains?', 'We watch the forecast with you and move the date at no extra cost, or shift to an at-home setup so the day still happens.'],
      ['Do you provide the food?', 'We offer <strong>personally curated catering</strong> &mdash; put together by hand for your occasion, never an off-the-shelf grazing box. It&rsquo;s an optional add-on, arranged on request and quoted separately, so you&rsquo;re just as welcome to bring your own.']
    ]
  },

  {
    id: 'bridal_shower_page',
    file: 'bridalshowers',
    urlPath: 'occasions/bridal-shower-picnic-sydney/',
    label: 'Bridal Showers',
    eyebrow: 'Bridal Showers &middot; Sydney',
    h1: 'Bridal shower picnics in&nbsp;Sydney.',
    heroSub: 'Somewhere beautiful, styled properly, with nothing for you to carry or clean up. We set up before everyone arrives and pack down once they&rsquo;ve gone.',
    heroAlt: 'Bridal shower picnic styled by Harmony Moments on a Sydney harbourside lawn with white and blush florals',
    waText: 'Hi%20Harmony%20Moments%2C%20I%27d%20love%20to%20book%20a%20bridal%20shower%20picnic%20%F0%9F%92%90',
    title: 'Bridal Shower Picnic Sydney | Styled Bridal Shower Setups from $300',
    description: 'Planning a bridal shower in Sydney? We style outdoor low-table setups for groups of 4–6 with white and blush florals — set up and packed down for you. From $300.',
    price: 'From $300',
    priceNote: 'For 4&ndash;6 guests. Harbourside, park or your own backyard.',
    addOns: 'Add a cake, signage, extra florals, or our <strong>personally curated grazing</strong> &mdash; chosen by hand for the day, never an off-the-shelf box. Optional, on request.',
    priceSchema: '300',
    faqPrice: 'Bridal shower setups start from <strong>$300</strong> for a group of four to six, which covers the styled setting, florals and setup. Extras like a cake, signage, additional fresh florals and curated grazing sit on top.',
    faqPriceText: 'Bridal shower setups start from $300 for a group of four to six, which covers the styled setting, florals and setup. Extras like a cake, signage, additional fresh florals and curated grazing sit on top. Send us your date and guest count and we will come back with an exact quote.',
    trust: ['Set up before your guests arrive', 'Styled for groups of 4&ndash;6', 'Your palette, matched throughout', 'Packed down after &mdash; you just celebrate'],
    intro: 'Somewhere beautiful, with nothing left to you.',
    included: [
      'Styled low timber table, linen, cushions &amp; rug',
      'Seating and styling for up to six',
      'White and blush seasonal florals, or your palette',
      'Candles, glassware and finishing details',
      'Set up before you arrive, packed down after'
    ],
    steps: [
      ['Tell us her colours', 'The date, the spot, the palette and how many are coming. We&rsquo;ll suggest a location if you need one.'],
      ['We set it all up', 'We arrive early and style the whole setting, finished before the first guest walks up.'],
      ['You just celebrate', 'Enjoy the day with her. We come back afterwards and clear every last thing.']
    ],
    gallery: [
      ['occ-bridalshowers-1.webp', 'Harbourside, at golden hour', 'Bridal shower picnic for six styled on a Sydney harbourside lawn with white and blush roses'],
      ['occ-bridalshowers-2.webp', 'Under the eucalypts', 'Bridal shower picnic styled under a eucalyptus canopy in a Sydney park at golden hour'],
      ['occ-bridalshowers-3.webp', 'The details', 'Close-up of a bridal shower tablescape with white peonies, blush roses and a small white cake'],
      ['occ-bridalshowers-4.webp', 'At home, in your garden', 'Bridal shower picnic styled in a Sydney backyard with white florals and string lights'],
      ['gallery-3.webp', 'A setup we styled &mdash; harbourside', 'A real Harmony Moments picnic table styled beside Sydney Harbour'],
      ['gallery-6.webp', 'A setup we styled &mdash; candlelight', 'Close-up of candles and gold place settings from a real Harmony Moments setup']
    ],
    faqs: [
      ['How much does a bridal shower picnic cost?', 'PRICE_PLACEHOLDER'],
      ['How many guests can you style for?', 'Up to six around the low table. Planning something larger? Message us with the numbers and we&rsquo;ll tell you what&rsquo;s possible.'],
      ['Can we choose the colours?', 'Yes &mdash; tell us your palette and we&rsquo;ll style the florals, linen and d&eacute;cor to match it.'],
      ['Where in Sydney can you set up?', 'Harbourside lawns, quiet park corners, and your own backyard &mdash; right across Sydney.'],
      ['What if it rains?', 'We watch the forecast with you and move the date at no extra cost, or shift to an at-home setup so the day still happens.'],
      ['Do you provide the food?', 'We offer <strong>personally curated catering</strong> &mdash; put together by hand for your occasion, never an off-the-shelf grazing box. It&rsquo;s an optional add-on, arranged on request and quoted separately, so you&rsquo;re just as welcome to bring your own.']
    ]
  }
];

/* Every occasion links to the other five. Keeps each page a hub without
   ever linking a page to itself. */
const ALL_LINKS = [
  ['proposals',     '/occasions/proposal-picnic-sydney/',      'Proposals',     'occasion-proposal.webp'],
  ['datenights',    '/occasions/romantic-picnic-date-sydney/',  'Date Nights',   'package-intimate.webp'],
  ['anniversaries', '/occasions/anniversary-picnic-sydney/',    'Anniversaries', 'perfect-anniversary.webp'],
  ['birthdays',     '/occasions/birthday-picnic-sydney/',       'Birthdays',     'perfect-birthday.webp'],
  ['babyshowers',   '/occasions/baby-shower-picnic-sydney/',    'Baby Showers',  'perfect-babyshower.webp'],
  ['bridalshowers', '/occasions/bridal-shower-picnic-sydney/',  'Bridal Showers','perfect-bridal.webp']
];

/* strip markup + entities so a string is safe inside JSON-LD */
function plain(s) {
  return s.replace(/<[^>]+>/g, '')
          .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
          .replace(/&rsquo;/g, '’').replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&').replace(/&eacute;/g, 'é')
          .replace(/&middot;/g, '·');
}

function page(o) {
  const faqs = o.faqs.map(([q, a]) => [q, a === 'PRICE_PLACEHOLDER' ? o.faqPrice : a]);
  const hasPriceFaq = o.faqs.some(([, a]) => a === 'PRICE_PLACEHOLDER');
  /* pages without an explicit price FAQ still need one for the schema */
  const schemaFaqs = hasPriceFaq
    ? faqs.map(([q, a], i) => [q, i === 0 ? o.faqPriceText : plain(a)])
    : [[`How much does a ${o.label.toLowerCase().replace(/s$/, '')} picnic in Sydney cost?`, o.faqPriceText]]
        .concat(faqs.map(([q, a]) => [q, plain(a)]));

  const meta = {
    id: o.id,
    path: o.urlPath,
    priority: '0.9',
    title: o.title,
    description: o.description,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: `${o.label} picnic styling Sydney`,
        name: `${o.label} picnic styling Sydney`,
        description: plain(o.description),
        url: `https://harmonymoments.com.au/${o.urlPath}`,
        areaServed: { '@type': 'City', name: 'Sydney' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'AUD',
          price: o.priceSchema,
          availability: 'https://schema.org/InStock'
        },
        provider: {
          '@type': 'LocalBusiness',
          name: 'Harmony Moments',
          telephone: '+61468820725',
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '3' }
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: schemaFaqs.map(([q, a]) => ({
          '@type': 'Question',
          name: plain(q),
          acceptedAnswer: { '@type': 'Answer', text: a }
        }))
      }
    ]
  };

  const others = ALL_LINKS.filter(l => l[0] !== o.file);

  return `<!--${JSON.stringify(meta, null, 2)}-->
<!-- ==================================================================
     ${o.label.toUpperCase()} LANDING PAGE
     GENERATED by src/build-occasions.js — do not hand-edit; edit the
     spec in that file and re-run it, or your change will be overwritten.
     Every section carries an id, so analytics fires
     section_view_${o.id}_<section> across the whole scroll journey.
     ================================================================== -->

<section class="hero hero-page" id="hero">
      <picture class="hero-picture">
        <source media="(max-width: 767px)" type="image/webp" srcset="occ-${o.file}-hero-portrait.webp">
        <source media="(max-width: 767px)" srcset="occ-${o.file}-hero-portrait.jpg">
        <source type="image/webp" srcset="occ-${o.file}-hero.webp">
        <img src="occ-${o.file}-hero.jpg" alt="${o.heroAlt}" class="hero-img" fetchpriority="high">
      </picture>
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="container hero-content">
        <p class="hero-eyebrow">${o.eyebrow}</p>
        <h1 class="hero-title">${o.h1}</h1>
        <p class="hero-sub">${o.heroSub}</p>
        <div class="hero-actions">
          <a href="#contact" class="btn btn-clay" data-enquiry-cta data-cta-location="${o.id}_hero">Check availability</a>
          <a href="${WA}${o.waText}" target="_blank" rel="noopener" class="btn btn-outline-light" data-enquiry-method="whatsapp">WhatsApp&nbsp;us</a>
        </div>
        <p class="hero-meta">Sydney-wide &middot; Set up before you arrive &middot; Packed down after</p>
      </div>
    </section>

    <section class="trust-strip trust-strip-page" id="trust" aria-label="Why clients book us">
      <div class="container">
        <ul class="trust-points">
${o.trust.map(t => `          <li class="trust-point">${t}</li>`).join('\n')}
        </ul>
        <div class="google-rating-wrap">
          <div class="google-rating">
            <svg class="google-rating-g" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true" focusable="false">
              <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
              <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
              <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
            </svg>
            <span class="google-rating-score">5.0</span>
            <span class="google-rating-stars" role="img" aria-label="Rated 5 out of 5">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span class="google-rating-label">Google&nbsp;Reviews</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="gallery">
      <div class="container">
        <div class="section-head fade-in">
          <p class="eyebrow">The look</p>
          <h2 class="section-title">${o.label} we style</h2>
          <p class="section-intro">A few of the ways we style ${o.label.toLowerCase()} across Sydney &mdash; tap any image to see it full size.</p>
        </div>
        <div class="gallery-grid gallery-grid-proposals">
${o.gallery.map(([src, label, alt]) =>
`          <figure class="frame frame-square" data-label="${label}">
            <img src="${src}" alt="${alt}" loading="lazy">
          </figure>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="section section-alt" id="included">
      <div class="container">
        <div class="section-head fade-in">
          <p class="eyebrow">What&rsquo;s included</p>
          <h2 class="section-title">${o.intro}</h2>
        </div>
        <div class="included-wrap fade-in">
          <ul class="included-list">
${o.included.map(i => `            <li>${i}</li>`).join('\n')}
          </ul>
          <div class="included-price">
            <p class="experience-price">${o.price}</p>
            <p class="included-qualifier">${o.priceNote}</p>
            <p class="included-note">${o.addOns}</p>
            <a href="#contact" class="btn btn-clay" data-enquiry-cta data-cta-location="${o.id}_included">Check availability</a>
            <p class="included-reassure">No obligation &mdash; we&rsquo;ll confirm availability and send an exact quote.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-band" id="cta-band">
      <div class="container fade-in">
        <p class="cta-band-title">Have a date in mind? Let&rsquo;s check it.</p>
        <div class="cta-band-actions">
          <a href="#contact" class="btn btn-clay" data-enquiry-cta data-cta-location="${o.id}_band">Check availability</a>
          <a href="${WA}${o.waText}" target="_blank" rel="noopener" class="btn btn-outline-light" data-enquiry-method="whatsapp">WhatsApp&nbsp;us</a>
        </div>
        <p class="urgency urgency-on-dark">Weekend sunset slots book out first &mdash; reserve yours before it fills.</p>
      </div>
    </section>

    <section class="section" id="how-it-works">
      <div class="container">
        <div class="section-head fade-in">
          <p class="eyebrow">How it works</p>
          <h2 class="section-title">Three steps, and it&rsquo;s handled.</h2>
        </div>
        <div class="steps-grid">
${o.steps.map(([name, desc], i) =>
`          <div class="step fade-in${i ? ' delay-' + i : ''}">
            <div class="step-num">${i + 1}</div>
            <div>
              <h3 class="step-name">${name}</h3>
              <p class="step-desc">${desc}</p>
            </div>
          </div>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="testimonials section section-alt" id="reviews">
      <div class="container">
        <div class="section-head fade-in">
          <p class="eyebrow">From our clients</p>
          <h2 class="section-title">Kind words</h2>
        </div>
        <div class="review-grid">
          <figure class="review-card fade-in">
            <div class="review-stars" role="img" aria-label="Rated 5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <blockquote class="review-quote">
              <p>A big thank you to Dipali from Harmony Moments! The picnic setup was even more beautiful than I had imagined and honestly exceeded all my expectations. Every little detail was perfect and she made us feel so special throughout the whole experience.</p>
              <p>Everything was stress-free and I couldn&rsquo;t have asked for a better setup. Highly recommend Harmony Moments if you want a truly memorable celebration!</p>
            </blockquote>
            <button type="button" class="review-more" aria-expanded="false">Read more</button>
            <figcaption class="review-meta"><span class="review-name">Rohan Mahajan</span></figcaption>
          </figure>
          <figure class="review-card fade-in delay-1">
            <div class="review-stars" role="img" aria-label="Rated 5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <blockquote class="review-quote">
              <p>I reached out to Dipali at Harmony Moments and I couldn&rsquo;t be happier with the experience. From our very first conversation, Dipali was friendly, approachable, and quickly understood exactly what I had envisioned. She made the entire booking and planning process smooth and stress free, keeping me updated every step of the way.</p>
              <p>Dipali is incredibly organised, responsive, and genuinely passionate about creating memorable experiences. The setup was absolutely stunning and exceeded all our expectations.</p>
            </blockquote>
            <button type="button" class="review-more" aria-expanded="false">Read more</button>
            <figcaption class="review-meta"><span class="review-name">Shallu Bali</span></figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="faq section" id="faq">
      <div class="container">
        <div class="section-head fade-in">
          <p class="eyebrow">Good to know</p>
          <h2 class="section-title">Questions</h2>
        </div>
        <div class="faq-list fade-in">
${faqs.map(([q, a]) =>
`          <details class="faq-item">
            <summary>${q}</summary>
            <div class="faq-answer"><p>${a}</p></div>
          </details>`).join('\n')}
        </div>
      </div>
    </section>

    {{PARTIAL:contact}}

    <section class="perfect-for section section-alt" id="more-occasions">
      <div class="container">
        <div class="section-head fade-in">
          <p class="eyebrow">Also styled by us</p>
          <h2 class="section-title">Other occasions</h2>
        </div>
        <div class="occasion-grid occasion-grid-compact">
${others.map(([id, href, name, img], i) =>
`          <a href="${href}" class="occasion-card fade-in${i ? ' delay-' + Math.min(i, 2) : ''}" data-occasion="${id}">
            <figure class="frame frame-square" data-label="${name}">
              <img src="${img}" alt="${name} picnic styling in Sydney by Harmony Moments" loading="lazy">
            </figure>
            <span class="occasion-name">${name}</span>
          </a>`).join('\n')}
        </div>
      </div>
    </section>

    {{PARTIAL:about}}
`;
}

let n = 0;
OCCASIONS.forEach(o => {
  const out = path.join(__dirname, 'pages', o.file + '.html');
  fs.writeFileSync(out, page(o), 'utf8');
  console.log('  ✓ src/pages/' + o.file + '.html  (' + o.price + ', ' + o.gallery.length + ' gallery tiles)');
  n++;
});
console.log('\nGenerated ' + n + ' occasion pages. The proposal page was not touched.');
