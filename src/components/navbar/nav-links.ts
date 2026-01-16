export interface RouterLinkProperties {
  textContent: string;
  to: string;
}
export const NAV_LINKS: RouterLinkProperties[] = [
  { textContent: 'Garage', to: '/garage' },
  { textContent: 'Winners', to: '/winners' },
];
