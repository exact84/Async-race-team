import { NAV_LINKS } from './nav-links';
import { Navbar } from './navbar';

function createComponent<C, P>(Ctor: new (properties: P) => C, properties: P): C {
  return new Ctor(properties);
}

describe(Navbar.name, () => {
  it('renders links from NAV_LINKS', () => {
    const navbar = createComponent(Navbar, { links: NAV_LINKS });

    const root = navbar.render();

    expect(root.querySelectorAll('li')).toHaveLength(NAV_LINKS.length);

    const links = root.querySelectorAll('a');

    for (const [index, link] of NAV_LINKS.entries()) {
      expect(links[index].textContent).toBe(link.textContent);
      expect(links[index].getAttribute('href')).toBe(link.to);
    }
  });
});
