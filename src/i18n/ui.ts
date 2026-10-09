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
    experiments: string;
    research: string;
  };
}

export const ui = {
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      gallery: 'Tiny Programs',
      about: 'About',
      writing: 'Writing',
      contact: 'Contact',
    },
    titles: {
      home: 'Ignacio Belitzky — Software Developer',
      projects: 'Projects',
      gallery: 'Tiny Programs',
      about: 'About',
      writing: 'Writing',
      contact: 'Contact',
    },
    descriptions: {
      home: 'Ignacio Belitzky, Software Developer from Córdoba, Argentina. Desktop development with C++ and Qt, algorithms, and computational experiments.',
      projects:
        'Selected public desktop applications and visual experiments by Ignacio Belitzky, with verified technologies and source links.',
      gallery:
        'Tiny Programs, Ignacio Belitzky’s collection of small computational and graphical experiments.',
      about:
        'Meet Ignacio Belitzky, a Software Developer interested in parallel computing, performance optimization, and algorithms.',
      writing:
        'Future technical notes on software development and ideas explored through code. No articles have been published yet.',
      contact: 'Contact Ignacio Belitzky by email or explore his public work on GitHub.',
    },
    skip: 'Skip to content',
    mainNav: 'Main navigation',
    mobileNav: 'Mobile navigation',
    menu: 'Menu',
    language: 'Español',
    languageLabel: 'Read this page in Spanish',
    languageHomeLabel: 'Go to the Spanish home page',
    theme: 'Theme',
    themes: { system: 'System', light: 'Light', dark: 'Dark' },
    hero: 'I build desktop applications and explore algorithms through code.',
    introduction:
      'My projects focus on C++ and Qt, alongside visual simulations and small developer tools. I’m particularly interested in parallel computing and performance optimization.',
    explore: 'Explore projects',
    touch: 'Get in touch',
    selected: 'Selected work',
    all: 'All projects',
    source: 'View source',
    aboutHeading: 'A little about me',
    biography:
      'I’m Ignacio, a Software Developer from Córdoba, Argentina. I enjoy programming, exploring new technologies, and sharing projects as open source.',
    more: 'More about me',
    interests: 'Technical interests',
    interestItems: [
      'Parallel computing',
      'Performance optimization',
      'Algorithms',
      'Computational simulations',
    ],
    contactHeading: 'Let’s talk software.',
    contactText:
      'Want to discuss software development or a possible opportunity? Get in touch by email.',
    emailText: 'Email is the simplest way to reach me.',
    githubText: 'Browse my public repositories and experiments.',
    writingEmpty: 'Technical articles coming soon.',
    writingSupport:
      'This space will hold notes on software development and ideas explored through code.',
    meanwhile: 'In the meantime, explore the projects.',
    galleryIntroduction:
      'Small experiments, each centered on an idea. Explore the source collection on GitHub.',
    gallerySource: 'Explore the collection',
    notFound: 'Page not found',
    notFoundText: 'The page you’re looking for could not be found.',
    home: 'Go to home',
    categories: {
      desktop: 'Desktop applications',
      graphics: 'Simulations & graphics',
      tools: 'Tools',
      experiments: 'Experiments',
      research: 'Research collaboration',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      projects: 'Proyectos',
      gallery: 'Tiny Programs',
      about: 'Sobre mí',
      writing: 'Artículos',
      contact: 'Contacto',
    },
    titles: {
      home: 'Ignacio Belitzky — Software Developer',
      projects: 'Proyectos',
      gallery: 'Tiny Programs',
      about: 'Sobre mí',
      writing: 'Artículos',
      contact: 'Contacto',
    },
    descriptions: {
      home: 'Ignacio Belitzky, Software Developer de Córdoba, Argentina. Desarrollo de escritorio con C++ y Qt, algoritmos y experimentos computacionales.',
      projects:
        'Una selección de aplicaciones de escritorio y experimentos visuales de Ignacio Belitzky, con tecnologías verificadas y enlaces al código.',
      gallery:
        'Tiny Programs, la colección de pequeños experimentos computacionales y gráficos de Ignacio Belitzky.',
      about:
        'Conocé a Ignacio Belitzky, Software Developer interesado en computación paralela, optimización del rendimiento y algoritmos.',
      writing:
        'Futuras notas técnicas sobre desarrollo de software e ideas exploradas a través del código. Todavía no hay artículos publicados.',
      contact: 'Contactá a Ignacio Belitzky por correo o explorá su trabajo público en GitHub.',
    },
    skip: 'Saltar al contenido',
    mainNav: 'Navegación principal',
    mobileNav: 'Navegación móvil',
    menu: 'Menú',
    language: 'English',
    languageLabel: 'Leer esta página en inglés',
    languageHomeLabel: 'Ir al inicio en inglés',
    theme: 'Tema',
    themes: { system: 'Sistema', light: 'Claro', dark: 'Oscuro' },
    hero: 'Desarrollo aplicaciones de escritorio y exploro algoritmos a través del código.',
    introduction:
      'Mis proyectos se centran en C++ y Qt, junto con simulaciones visuales y pequeñas herramientas. Me interesan especialmente la computación paralela y la optimización del rendimiento.',
    explore: 'Explorá los proyectos',
    touch: 'Contactame',
    selected: 'Proyectos destacados',
    all: 'Todos los proyectos',
    source: 'Ver código fuente',
    aboutHeading: 'Un poco sobre mí',
    biography:
      'Soy Ignacio, Software Developer de Córdoba, Argentina. Disfruto programar, explorar nuevas tecnologías y compartir proyectos de código abierto.',
    more: 'Más sobre mí',
    interests: 'Intereses técnicos',
    interestItems: [
      'Computación paralela',
      'Optimización del rendimiento',
      'Algoritmos',
      'Simulaciones computacionales',
    ],
    contactHeading: 'Hablemos de software.',
    contactText:
      '¿Querés conversar sobre desarrollo de software o una posible oportunidad? Escribime por correo.',
    emailText: 'El correo es la forma más sencilla de contactarme.',
    githubText: 'Explorá mis repositorios públicos y experimentos.',
    writingEmpty: 'Próximamente, artículos técnicos.',
    writingSupport:
      'Este espacio reunirá notas sobre desarrollo de software e ideas exploradas a través del código.',
    meanwhile: 'Mientras tanto, explorá los proyectos.',
    galleryIntroduction:
      'Pequeños experimentos, cada uno centrado en una idea. Explorá la colección de código en GitHub.',
    gallerySource: 'Explorá la colección',
    notFound: 'Página no encontrada',
    notFoundText: 'No se pudo encontrar la página que buscás.',
    home: 'Ir al inicio',
    categories: {
      desktop: 'Aplicaciones de escritorio',
      graphics: 'Simulaciones y gráficos',
      tools: 'Herramientas',
      experiments: 'Experimentos',
      research: 'Colaboración académica',
    },
  },
} as const satisfies Record<Locale, Copy>;
