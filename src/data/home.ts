// Homepage content. Edit copy, listings and images here; the components in
// src/components/home/ only handle layout.

/** Unsplash photo URL, cropped and sized by the Unsplash CDN. */
export const photo = (id: string, w = 1600, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=80`;

export const brand = {
  name: 'Maren',
  tagline: 'Maren Estates — homes with a story worth living.',
  email: 'hello@maren.estate',
  phone: '+1 (415) 555-0142',
  address: ['214 Harbor Street', 'San Francisco, CA 94111'],
};

export const nav = [
  { label: 'Homes', href: '#listings' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Advisors', href: '#advisors' },
];

export const hero = {
  lines: ['Find the home', 'your story', 'deserves'],
  image: '1600585154340-be6161a56a0c',
  imageAlt: 'Modern timber and glass house glowing at dusk beneath a large oak',
};

export const marquee = ['Buy', 'Sell', 'Rent', 'Invest', 'Live well'];

export const intro = {
  label: 'About',
  text: 'Maren is a boutique real estate studio helping families, founders and investors find places that feel like theirs — with honest advice, beautiful marketing and negotiations that go your way.',
  images: [
    { id: '1600607687644-c7171b42498f', alt: 'Calm bedroom with black-framed windows' },
    { id: '1502672260266-1c1ef2d93688', alt: 'Sunlit living room with plants' },
  ],
};

export interface Listing {
  name: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  tag?: 'New' | 'Featured' | 'Off-market';
  image: string;
}

export const listings: Listing[] = [
  { name: 'Casa Blanca', location: 'Malibu, California', price: '$4,850,000', beds: 5, baths: 4, area: '4,200 sq ft', tag: 'Featured', image: '1600596542815-ffad4c1539a9' },
  { name: 'The Timber House', location: 'Portland, Oregon', price: '$1,920,000', beds: 4, baths: 3, area: '2,850 sq ft', tag: 'New', image: '1600566753190-17f0baa2a6c3' },
  { name: 'Villa Serena', location: 'Scottsdale, Arizona', price: '$3,400,000', beds: 5, baths: 5, area: '3,900 sq ft', image: '1613490493576-7fde63acd811' },
  { name: 'Hillside Cabin', location: 'Lake Tahoe, Nevada', price: '$2,275,000', beds: 3, baths: 2, area: '2,100 sq ft', tag: 'Off-market', image: '1568605114967-8130f3a36994' },
  { name: 'Harbor Colonial', location: 'Nantucket, Massachusetts', price: '$2,690,000', beds: 4, baths: 3, area: '3,100 sq ft', image: '1570129477492-45c003edd2be' },
  { name: 'Brick & Cedar', location: 'Austin, Texas', price: '$1,480,000', beds: 3, baths: 3, area: '2,400 sq ft', tag: 'New', image: '1600047509807-ba8f99d2cdde' },
];

export const stats = [
  { value: 16, suffix: '', label: 'Years', note: 'Guiding buyers and sellers through every market cycle since 2009.' },
  { value: 2.4, prefix: '$', suffix: 'B', decimals: 1, label: 'Sold', note: 'In residential sales across the West Coast and beyond.' },
  { value: 1200, suffix: '+', label: 'Homes', note: 'Keys handed over — each one a story that started with a first visit.' },
  { value: 98, suffix: '%', label: 'Referrals', note: 'Of new clients come from people we have already helped move.' },
];

export const services = [
  { title: 'Buying', text: 'Curated searches, off-market access and negotiation that protects your budget.', image: '1600607687939-ce8a6c25118c' },
  { title: 'Selling', text: 'Staging, film-quality photography and a launch plan built to create competition.', image: '1618221195710-dd6b41faaea6' },
  { title: 'Renting', text: 'Vetted homes and tenants, clear contracts and a move-in that simply works.', image: '1600210492486-724fe5c67fb0' },
  { title: 'Management', text: 'Maintenance, rent collection and reporting, handled end to end.', image: '1507089947368-19c1da9775ae' },
  { title: 'Investment', text: 'Data-led advice on yield, growth areas and portfolio strategy.', image: '1616594039964-ae9021a400a0' },
];

export const showcase = {
  image: '1600573472550-8090b5e0745e',
  imageAlt: 'Double-height living room opening onto a pool through floor-to-ceiling glass',
  quote: 'They didn’t sell us a house. They found the place our kids will call home.',
  author: 'Priya & Daniel, Mill Valley',
};

export const advisors = [
  { name: 'Elena Brooks', role: 'Founder & Principal', image: '1573496359142-b8d87734a5a2' },
  { name: 'Marcus Hale', role: 'Head of Sales', image: '1500648767791-00dcc994a43e' },
  { name: 'Sofia Lind', role: 'Buyer Advisor', image: '1438761681033-6461ffad8d80' },
  { name: 'David Okafor', role: 'Investment Lead', image: '1507003211169-0a1dd7228f2d' },
];

export const footerLinks = [
  { title: 'Explore', links: ['Homes for sale', 'Rentals', 'Off-market', 'Neighbourhoods'] },
  { title: 'Company', links: ['About', 'Advisors', 'Journal', 'Careers'] },
  { title: 'Follow', links: ['Instagram', 'LinkedIn', 'Pinterest', 'YouTube'] },
];
