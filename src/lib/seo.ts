import { site } from '../data/site.ts';
import { routePath, type Locale, type RouteKey } from '../i18n/routes.ts';
import { ui } from '../i18n/ui.ts';

interface SEOInput {
  locale: Locale;
  route: RouteKey;
  canonical: string;
  title: string;
  description: string;
  image: string;
  article?: { published: Date; updated?: Date };
}

/** Describe only the identity and content already visible in the portfolio. */
export function structuredData(input: SEOInput) {
  const { locale, route, canonical, title, description, image, article } = input;
  if (route === 'notFound') return null;
  const personId = `${site.origin}/#person`;
  const websiteId = `${site.origin}/#website`;
  const pageId = `${canonical}#webpage`;
  const person = {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    url: `${site.origin}/`,
    jobTitle: site.title,
    sameAs: [site.github, site.linkedin],
  };
  const pageType = ['home', 'about'].includes(route)
    ? 'ProfilePage'
    : route === 'contact'
      ? 'ContactPage'
      : ['projects', 'gallery', 'writing'].includes(route)
        ? 'CollectionPage'
        : 'WebPage';
  const entity = article
    ? {
        '@type': 'BlogPosting',
        '@id': `${canonical}#article`,
        headline: title,
        description,
        image,
        inLanguage: locale,
        datePublished: article.published.toISOString(),
        ...(article.updated ? { dateModified: article.updated.toISOString() } : {}),
        author: { '@id': personId },
        mainEntityOfPage: { '@id': pageId },
      }
    : route === 'project'
      ? {
          '@type': 'CreativeWork',
          '@id': `${canonical}#project`,
          name: title,
          description,
          url: canonical,
          inLanguage: locale,
          mainEntityOfPage: { '@id': pageId },
        }
      : null;
  const parent = route === 'project' ? 'projects' : route === 'article' ? 'writing' : null;
  const crumbs = [
    { name: ui[locale].nav.home, item: new URL(routePath(locale, 'home'), site.origin).href },
    ...(parent
      ? [
          {
            name: ui[locale].nav[parent],
            item: new URL(routePath(locale, parent), site.origin).href,
          },
        ]
      : []),
    { name: title, item: canonical },
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${site.origin}/`,
        name: site.name,
        inLanguage: ['en', 'es'],
        publisher: { '@id': personId },
      },
      {
        '@type': pageType,
        '@id': pageId,
        url: canonical,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
        primaryImageOfPage: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
        ...(['home', 'about'].includes(route) ? { mainEntity: { '@id': personId } } : {}),
        ...(entity ? { mainEntity: { '@id': entity['@id'] } } : {}),
        ...(route !== 'home' ? { breadcrumb: { '@id': `${canonical}#breadcrumb` } } : {}),
      },
      ...(entity ? [entity] : []),
      ...(route !== 'home'
        ? [
            {
              '@type': 'BreadcrumbList',
              '@id': `${canonical}#breadcrumb`,
              itemListElement: crumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                ...crumb,
              })),
            },
          ]
        : []),
    ],
  };
}

/** JSON-LD is embedded in a script raw-text element, including future article titles. */
export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
