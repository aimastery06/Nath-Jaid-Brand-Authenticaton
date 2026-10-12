// Navigation and footer links, from brand/website-direction.md.
import { activeCollection } from './catalog';

export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: `${activeCollection.route}#shop` },
  { label: 'Collection', href: activeCollection.route },
  { label: 'Our Story', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const bagLink: NavLink = { label: 'Bag', href: '/bag' };
export const accountLink: NavLink = { label: 'Account', href: '/account' };

// Placeholders until official handles exist: each links to the platform homepage.
export const socialLinks: NavLink[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
];
