import type { Locale } from '../i18n/routes.ts';

interface CVConfiguration {
  enabled: boolean;
  path: string | null;
  label: Record<Locale, string>;
}
const cv: CVConfiguration = {
  enabled: false,
  path: null,
  label: { en: 'Download CV', es: 'Descargar CV' },
};

export function availableCV(locale: Locale): { path: string; label: string } | null {
  if (!cv.enabled || !cv.path) return null;
  if (!/^\/files\/[a-zA-Z0-9_-]+\.pdf$/.test(cv.path))
    throw new Error('CV must be a reviewed local PDF in public/files');
  return { path: cv.path, label: cv.label[locale] };
}

export const site = {
  name: 'Ignacio Belitzky',
  title: 'Software Developer',
  location: 'Córdoba, Argentina',
  email: 'ignabelitzky@gmail.com',
  github: 'https://github.com/ignabelitzky',
  origin: 'https://ignabelitzky.github.io',
  indexable: true,
  analytics: { enabled: false },
  cv,
} as const;
