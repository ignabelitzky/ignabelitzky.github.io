import type { Locale, CoreRoute } from './routes.ts';

interface Copy {
  nav: Record<CoreRoute, string>;
  titles: Record<CoreRoute, string>;
  descriptions: Record<CoreRoute, string>;
  skip: string;
  mainNav: string;
  mobileNav: string;
  menu: string;
  language: string;
  languageLabel: string;
  languageHomeLabel: string;
  close: string;
  visitWebsite: string;
  experienceLink: string;
  theme: string;
  themes: { system: string; light: string; dark: string };
  hero: string;
  introduction: string;
  explore: string;
  touch: string;
  selected: string;
  all: string;
  source: string;
  aboutHeading: string;
  biography: string;
  more: string;
  interests: string;
  interestItems: readonly string[];
  contactHeading: string;
  contactText: string;
  emailText: string;
  githubText: string;
  linkedinText: string;
  writingEmpty: string;
  writingSupport: string;
  meanwhile: string;
  galleryIntroduction: string;
  gallerySource: string;
  notFound: string;
  notFoundText: string;
  home: string;
  categories: {
    desktop: string;
    graphics: string;
    tools: string;
    web: string;
    experiments: string;
    research: string;
  };
}

export const ui = {
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      about: 'About',
      writing: 'Writing',
      contact: 'Contact',
      gallery: 'Tiny Programs',
    },
    titles: {
      home: 'Ignacio Belitzky — Software Developer',
      projects: 'Projects',
      about: 'About',
      writing: 'Writing',
      contact: 'Contact',
      gallery: 'Tiny Programs',
    },
    descriptions: {
      home: 'Ignacio Belitzky, Software Developer in Córdoba, Argentina. Explore C++ and Qt applications, visual simulations, tools, and practical web development.',
      projects:
        'Explore Ignacio Belitzky’s desktop applications, simulations, software tools, and work for Veterinaria DACOR.',
      about:
        'Ignacio Belitzky’s software-development work, technical interests, and ongoing website development and IT support for Veterinaria DACOR.',
      contact: 'Contact Ignacio Belitzky about software-development opportunities or his projects.',
      gallery:
        'Explore Tiny Programs: Ignacio Belitzky’s experiments in graphics, particle behavior, numerical simulation, and algorithms.',
      writing: 'Technical notes by Ignacio Belitzky. No articles are currently published.',
    },
    skip: 'Skip to content',
    mainNav: 'Main navigation',
    mobileNav: 'Mobile navigation',
    menu: 'Menu',
    language: 'Español',
    languageLabel: 'Read this page in Spanish',
    languageHomeLabel: 'Go to the Spanish home page',
    theme: 'Theme',
    themes: {
      system: 'System',
      light: 'Light',
      dark: 'Dark',
    },
    hero: 'Desktop applications, simulations, and practical software.',
    introduction:
      'I’m Ignacio Belitzky, a Software Developer working primarily with C++ and Qt. I build desktop applications and explore algorithms through visual simulations, with a particular interest in parallel computing and software performance.',
    explore: 'Explore projects',
    touch: 'Get in touch',
    selected: 'Selected work',
    all: 'All projects',
    source: 'View source',
    aboutHeading: 'About my work',
    biography:
      'My public work ranges from Qt applications and C++ simulations to Python tools and interactive Unity projects. I also develop and maintain the website for Veterinaria DACOR and provide ongoing IT support.',
    more: 'More about me',
    interests: 'Technical interests',
    interestItems: [
      'Parallel computing',
      'Software performance',
      'Algorithms',
      'Computational simulations',
    ],
    contactHeading: 'Let’s discuss software.',
    contactText: 'For software-development opportunities or questions about my work, email me.',
    emailText: 'Send me an email.',
    githubText: 'Explore my applications, tools, and experiments on GitHub.',
    linkedinText: 'View my professional profile and connect with me on LinkedIn.',
    writingEmpty: 'No articles published yet.',
    writingSupport: 'This space is reserved for technical notes on software development.',
    meanwhile: 'Explore my projects',
    galleryIntroduction:
      'A collection of focused experiments in graphics, simulation, and algorithms. Each explores a different idea, from particle behavior to procedural patterns.',
    gallerySource: 'Explore the collection',
    notFound: 'Page not found',
    notFoundText: 'This address does not match a page on my portfolio.',
    home: 'Return home',
    categories: {
      desktop: 'Desktop applications',
      graphics: 'Simulations & graphics',
      tools: 'Tools',
      web: 'Web development',
      experiments: 'Experiments',
      research: 'Research collaboration',
    },
    close: 'Close menu',
    visitWebsite: 'Visit website',
    experienceLink: 'About my work for DACOR',
  },
  es: {
    nav: {
      home: 'Inicio',
      projects: 'Proyectos',
      about: 'Sobre mí',
      writing: 'Artículos',
      contact: 'Contacto',
      gallery: 'Tiny Programs',
    },
    titles: {
      home: 'Ignacio Belitzky — Software Developer',
      projects: 'Proyectos',
      about: 'Sobre mí',
      writing: 'Artículos',
      contact: 'Contacto',
      gallery: 'Tiny Programs',
    },
    descriptions: {
      home: 'Ignacio Belitzky, Software Developer de Córdoba, Argentina. Aplicaciones en C++ y Qt, simulaciones visuales, herramientas y desarrollo web.',
      projects:
        'Explorá las aplicaciones de escritorio, simulaciones, herramientas y el trabajo de Ignacio Belitzky para Veterinaria DACOR.',
      about:
        'El trabajo de Ignacio Belitzky en desarrollo de software, sus intereses técnicos y el desarrollo web y soporte informático continuo para Veterinaria DACOR.',
      contact:
        'Contactá a Ignacio Belitzky por oportunidades de desarrollo de software o consultas sobre sus proyectos.',
      gallery:
        'Explorá Tiny Programs: experimentos de Ignacio Belitzky sobre gráficos, partículas, simulación numérica y algoritmos.',
      writing: 'Notas técnicas de Ignacio Belitzky. Por el momento no hay artículos publicados.',
    },
    skip: 'Saltar al contenido',
    mainNav: 'Navegación principal',
    mobileNav: 'Navegación móvil',
    menu: 'Menú',
    language: 'English',
    languageLabel: 'Leer esta página en inglés',
    languageHomeLabel: 'Ir al inicio en inglés',
    theme: 'Tema',
    themes: {
      system: 'Sistema',
      light: 'Claro',
      dark: 'Oscuro',
    },
    hero: 'Aplicaciones de escritorio, simulaciones y software práctico.',
    introduction:
      'Soy Ignacio Belitzky, Software Developer. Trabajo principalmente con C++ y Qt: desarrollo aplicaciones de escritorio y exploro algoritmos mediante simulaciones visuales, con especial interés en la computación paralela y el rendimiento del software.',
    explore: 'Explorá los proyectos',
    touch: 'Contactame',
    selected: 'Proyectos destacados',
    all: 'Todos los proyectos',
    source: 'Ver código fuente',
    aboutHeading: 'Sobre mi trabajo',
    biography:
      'Mis proyectos públicos incluyen aplicaciones en Qt, simulaciones en C++, herramientas en Python y proyectos interactivos en Unity. También desarrollo y mantengo el sitio de Veterinaria DACOR y brindo soporte informático continuo.',
    more: 'Más sobre mí',
    interests: 'Intereses técnicos',
    interestItems: [
      'Computación paralela',
      'Rendimiento del software',
      'Algoritmos',
      'Simulaciones computacionales',
    ],
    contactHeading: 'Hablemos de software.',
    contactText:
      'Si querés conversar sobre una oportunidad de desarrollo de software o consultar por mis proyectos, escribime por correo.',
    emailText: 'Escribime por correo.',
    githubText: 'Explorá mis aplicaciones, herramientas y experimentos en GitHub.',
    linkedinText: 'Conocé mi perfil profesional y conectá conmigo en LinkedIn.',
    writingEmpty: 'Todavía no hay artículos publicados.',
    writingSupport: 'Este espacio está reservado para notas técnicas sobre desarrollo de software.',
    meanwhile: 'Explorá mis proyectos',
    galleryIntroduction:
      'Una colección de experimentos sobre gráficos, simulación y algoritmos. Cada uno explora una idea distinta, desde el comportamiento de partículas hasta la generación de patrones.',
    gallerySource: 'Explorá la colección',
    notFound: 'Página no encontrada',
    notFoundText: 'Esta dirección no corresponde a una página de mi portfolio.',
    home: 'Volver al inicio',
    categories: {
      desktop: 'Aplicaciones de escritorio',
      graphics: 'Simulaciones y gráficos',
      tools: 'Herramientas',
      web: 'Desarrollo web',
      experiments: 'Experimentos',
      research: 'Colaboración académica',
    },
    close: 'Cerrar menú',
    visitWebsite: 'Visitar sitio web',
    experienceLink: 'Sobre mi trabajo para DACOR',
  },
} as const satisfies Record<Locale, Copy>;
