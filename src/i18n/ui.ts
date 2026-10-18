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
  cookies: {
    title: string;
    description: string;
    detailsLabel: string;
    details: string;
    accept: string;
    reject: string;
    settings: string;
  };
  theme: string;
  themes: { system: string; light: string; dark: string };
  hero: string;
  introduction: string;
  explore: string;
  touch: string;
  selected: string;
  latestWebWork: string;
  webWorkIntroduction: string;
  businessWebHeading: string;
  businessWebText: string;
  businessWebContact: string;
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
        'Explore Ignacio Belitzky’s desktop applications, simulations, software tools, and websites for ElectroCuprum and Veterinaria DACOR.',
      about:
        'Ignacio Belitzky’s software-development work, technical interests, websites for ElectroCuprum and Veterinaria DACOR, and ongoing IT support.',
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
    businessWebHeading: 'A website for your business',
    businessWebText:
      'I’m available to build websites for small and medium-sized businesses, with clear service information, easy content updates, and straightforward ways for customers to get in touch.',
    businessWebContact: 'Discuss your website',
    latestWebWork: 'Latest web development work',
    webWorkIntroduction:
      'Websites built for local businesses, from service information and contact paths to content management and deployment.',
    all: 'All projects',
    source: 'View source',
    aboutHeading: 'About my work',
    biography:
      'My public work ranges from Qt applications and C++ simulations to Python tools and interactive Unity projects. I also build websites for local businesses, including ElectroCuprum and Veterinaria DACOR, where I provide ongoing website maintenance and IT support.',
    more: 'More about me',
    interests: 'Technical interests',
    interestItems: [
      'Parallel computing',
      'Software performance',
      'Algorithms',
      'Computational simulations',
    ],
    contactHeading: 'Let’s discuss software.',
    contactText:
      'For software-development opportunities, a website for your business, or questions about my work, email me.',
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
    cookies: {
      title: 'Your privacy matters',
      description:
        'This website uses essential storage for your preferences and optional Google Analytics to understand how visitors use the site. Analytics is enabled only with your consent.',
      detailsLabel: 'What does Analytics collect?',
      details:
        'If enabled, Google Analytics receives information about page visits and interactions, such as the pages viewed, approximate location derived from network information, device and browser details, and referral source. This helps understand how the portfolio is used. Google may set cookies and process this data under its own terms and policies.',
      accept: 'Accept analytics',
      reject: 'Reject analytics',
      settings: 'Cookie settings',
    },
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
        'Explorá las aplicaciones de escritorio, simulaciones, herramientas y los sitios de Ignacio Belitzky para ElectroCuprum y Veterinaria DACOR.',
      about:
        'El trabajo de Ignacio Belitzky en desarrollo de software, sus intereses técnicos, los sitios para ElectroCuprum y Veterinaria DACOR y el soporte informático continuo.',
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
    businessWebHeading: 'Un sitio web para tu negocio',
    businessWebText:
      'Desarrollo sitios web para pequeñas y medianas empresas, con información clara sobre sus servicios, contenido fácil de actualizar y opciones directas para que sus clientes se pongan en contacto.',
    businessWebContact: 'Hablemos de tu sitio web',
    latestWebWork: 'Últimos trabajos en desarrollo web',
    webWorkIntroduction:
      'Sitios para empresas locales, desde la presentación de servicios y las opciones de contacto hasta la administración de contenido y la publicación.',
    all: 'Todos los proyectos',
    source: 'Ver código fuente',
    aboutHeading: 'Sobre mi trabajo',
    biography:
      'Mis proyectos públicos incluyen aplicaciones en Qt, simulaciones en C++, herramientas en Python y proyectos interactivos en Unity. También desarrollo sitios para empresas locales, como ElectroCuprum y Veterinaria DACOR, donde brindo mantenimiento web y soporte informático continuo.',
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
      'Si querés conversar sobre una oportunidad de desarrollo de software, un sitio web para tu negocio o mis proyectos, escribime por correo.',
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
    cookies: {
      title: 'Tu privacidad importa',
      description:
        'Este sitio utiliza almacenamiento esencial para tus preferencias y Google Analytics opcional para conocer cómo se utiliza. Analytics solo se activa con tu consentimiento.',
      detailsLabel: '¿Qué recopila Analytics?',
      details:
        'Si lo activás, Google Analytics recibe información sobre las visitas e interacciones, como las páginas vistas, una ubicación aproximada derivada de información de red, datos del dispositivo y navegador y el sitio de referencia. Esto ayuda a entender cómo se usa el portfolio. Google puede guardar cookies y procesar estos datos según sus propios términos y políticas.',
      accept: 'Aceptar analíticas',
      reject: 'Rechazar analíticas',
      settings: 'Preferencias de privacidad',
    },
  },
} as const satisfies Record<Locale, Copy>;
