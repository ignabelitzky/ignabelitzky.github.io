import type { Locale } from '../i18n/routes.ts';

interface ExperienceCopy {
  title: string;
  text: string;
  responsibilities: readonly string[];
  homeTitle: string;
  homeText: string;
}
interface Experience {
  organization: string;
  startYear: number;
  endYear: number | null;
  website: string;
  caseStudySlug: string;
  translations: Record<Locale, ExperienceCopy>;
}

export const dacor = {
  organization: 'Veterinaria DACOR',
  startYear: 2023,
  endYear: null,
  website: 'https://www.veterinariadacor.com/',
  caseStudySlug: 'veterinaria-dacor',
  translations: {
    en: {
      title: 'Website development & technical support — Veterinaria DACOR',
      text: 'Since 2023, I have worked with Veterinaria DACOR on developing and maintaining its website and Sanity content-management setup, alongside preparing digital brand assets, assembling computers, and providing technical support.',
      responsibilities: [
        'Contribute to the development and maintenance of the Astro website and its Sanity content-management setup, including catalog, service, and contact content.',
        'Reconstruct the existing logo from a PNG into vector and production assets for digital and physical use.',
        'Assemble computers and provide ongoing support with computer systems and programming needs.',
      ],
      homeTitle: 'Ongoing work for Veterinaria DACOR',
      homeText:
        'Website development, logo reconstruction into usable production assets, computer assembly, and ongoing IT support for a veterinary clinic and pet shop in Córdoba.',
    },
    es: {
      title: 'Desarrollo web y soporte técnico — Veterinaria DACOR',
      text: 'Desde 2023 trabajo con Veterinaria DACOR en el desarrollo y mantenimiento de su sitio y su sistema de gestión de contenidos en Sanity, además de preparar recursos de identidad digital, armar computadoras y brindar soporte técnico.',
      responsibilities: [
        'Participar en el desarrollo y mantenimiento del sitio en Astro y su sistema de gestión de contenidos en Sanity, con catálogo, servicios y opciones de contacto.',
        'Reconstruir el logo existente a partir de un PNG para obtener recursos vectoriales y de producción destinados a usos digitales y físicos.',
        'Armar computadoras y brindar soporte continuo para sus sistemas informáticos y necesidades de programación.',
      ],
      homeTitle: 'Trabajo continuo para Veterinaria DACOR',
      homeText:
        'Desarrollo web, reconstrucción del logo en formatos utilizables, armado de computadoras y soporte informático continuo para una veterinaria y pet shop de Córdoba.',
    },
  },
} as const satisfies Experience;

export function experiencePeriod(locale: Locale): string {
  return `${dacor.startYear}–${dacor.endYear ?? (locale === 'es' ? 'actualidad' : 'present')}`;
}
