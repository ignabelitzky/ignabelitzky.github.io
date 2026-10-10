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
      text: 'I work with Veterinaria DACOR on its website and day-to-day IT needs. Since 2023, my responsibilities have included web development, preparing usable digital brand assets, assembling computers, and technical support.',
      responsibilities: [
        'Develop and maintain the business website, including its catalog, service information, and contact paths.',
        'Reconstruct the existing logo from a PNG into vector and production assets for digital and physical use.',
        'Assemble computers and provide ongoing support with computer systems and programming needs.',
      ],
      homeTitle: 'Ongoing work for Veterinaria DACOR',
      homeText:
        'Website development, logo reconstruction into usable production assets, computer assembly, and ongoing IT support for a veterinary clinic and pet shop in Córdoba.',
    },
    es: {
      title: 'Desarrollo web y soporte técnico — Veterinaria DACOR',
      text: 'Trabajo con Veterinaria DACOR en su sitio web y sus necesidades informáticas cotidianas. Desde 2023, mis responsabilidades incluyen desarrollo web, preparación de recursos de identidad digital, armado de computadoras y soporte técnico.',
      responsibilities: [
        'Desarrollar y mantener el sitio del comercio, incluido su catálogo, la información de servicios y las opciones de contacto.',
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
