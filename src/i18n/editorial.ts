import type { Locale } from './routes.ts';

interface EditorialCopy {
  detail: string;
  research: string;
  research_text: string;
  projects_intro: string;
  back: string;
  context: string;
  features: string;
  focus: string;
  role: string;
  stack: string;
  gallery: string;
  gallery_intro: string;
  directory: string;
  other: string;
  experimental: string;
  prototype: string;
  practical: string;
  dacor: string;
  dacor_text: string;
  paper: string;
  tech: string;
  team: string;
  recording: string;
  recordingNote: string;
  combined: string;
  backWriting: string;
  updated: string;
  bioFull: readonly string[];
  technologyGroups: readonly (readonly [string, string])[];
}

export const editorial = {
  en: {
    detail: 'Explore project',
    research: 'Research collaboration',
    research_text:
      'I made a small software contribution to KineticBox 1D, a C/OpenMP simulation associated with the preprint The problem of relaxation to equilibrium. The project page explains my contribution and credits the research team.',
    projects_intro:
      'Desktop applications, visual simulations, developer tools, and a website built for a local business. Explore the projects to see how they work and the code behind them.',
    back: 'Back to projects',
    context: 'Project overview',
    features: 'What it does',
    focus: 'Implementation details',
    role: 'My contribution',
    stack: 'Technologies',
    gallery: 'Browse the gallery',
    gallery_intro:
      'A collection of focused experiments in graphics, simulation, and algorithms. Each explores a different idea, from particle behavior to procedural patterns.',
    directory: 'View source directory',
    other: 'Further experiments',
    experimental: 'Experimental',
    prototype: 'Prototype',
    practical: 'Practical experience',
    dacor: 'Website development & technical support — Veterinaria DACOR',
    dacor_text:
      'I work with Veterinaria DACOR on its website and day-to-day IT needs. Since 2023, my responsibilities have included web development, preparing usable digital brand assets, assembling computers, and technical support.',
    paper: 'Read the preprint',
    tech: 'Technologies used in my projects',
    team: 'Preprint authors',
    recording: 'Repository-linked recording on YouTube',
    recordingNote: 'Recording availability has not been verified.',
    combined: 'Combined Fireworks and Ray Casting recording.',
    backWriting: 'Back to writing',
    updated: 'Updated',
    bioFull: [
      'I’m Ignacio Belitzky, a Software Developer from Córdoba, Argentina. My main focus is desktop development with C++ and Qt.',
      'My public projects include feed readers, terminal video rendering, visual simulations, and tools for working with data. I also use Python and Unity when the project calls for a different approach.',
      'I’m particularly interested in parallel computing, algorithms, and software performance. Building and sharing these projects gives me a practical way to explore those areas.',
      'Since 2023, I have also worked with Veterinaria DACOR on its website, digital brand assets, computer assembly, and ongoing technical support.',
    ],
    technologyGroups: [
      ['Desktop development', 'C++, Qt Widgets, Qt Network, Qt SQL, SQLite'],
      ['Graphics and simulation', 'C++, SFML, OpenCV; C and OpenMP in numerical simulation'],
      ['Tools and interactive applications', 'Python, Whisper, FFmpeg, Tkinter; C# and Unity'],
      [
        'Web development',
        'HTML, CSS, JavaScript; Astro, Tailwind CSS, and TypeScript in this portfolio',
      ],
      ['Build tools', 'qmake, CMake, GNU Make'],
    ],
  },
  es: {
    detail: 'Explorá el proyecto',
    research: 'Colaboración académica',
    research_text:
      'Realicé una pequeña contribución de software a KineticBox 1D, una simulación en C y OpenMP vinculada con el preprint The problem of relaxation to equilibrium. La página del proyecto explica mi participación y reconoce al equipo de investigación.',
    projects_intro:
      'Aplicaciones de escritorio, simulaciones visuales, herramientas y un sitio desarrollado para un comercio local. Explorá los proyectos para conocer cómo funcionan y consultar su código.',
    back: 'Volver a proyectos',
    context: 'Descripción general',
    features: 'Qué hace',
    focus: 'Detalles de implementación',
    role: 'Mi participación',
    stack: 'Tecnologías',
    gallery: 'Explorá la galería',
    gallery_intro:
      'Una colección de experimentos sobre gráficos, simulación y algoritmos. Cada uno explora una idea distinta, desde el comportamiento de partículas hasta la generación de patrones.',
    directory: 'Ver directorio del código',
    other: 'Otros experimentos',
    experimental: 'Experimental',
    prototype: 'Prototipo',
    practical: 'Experiencia práctica',
    dacor: 'Desarrollo web y soporte técnico — Veterinaria DACOR',
    dacor_text:
      'Trabajo con Veterinaria DACOR en su sitio web y sus necesidades informáticas cotidianas. Desde 2023, mis responsabilidades incluyen desarrollo web, preparación de recursos de identidad digital, armado de computadoras y soporte técnico.',
    paper: 'Leé el preprint',
    tech: 'Tecnologías presentes en mis proyectos',
    team: 'Autores del preprint',
    recording: 'Grabación enlazada en el repositorio, en YouTube',
    recordingNote: 'La disponibilidad de la grabación no está verificada.',
    combined: 'Grabación conjunta de Fireworks y Ray Casting.',
    backWriting: 'Volver a artículos',
    updated: 'Actualizado',
    bioFull: [
      'Soy Ignacio Belitzky, Software Developer de Córdoba, Argentina. Mi principal enfoque es el desarrollo de aplicaciones de escritorio con C++ y Qt.',
      'Mis proyectos públicos incluyen lectores de feeds, reproducción de video en la terminal, simulaciones visuales y herramientas para trabajar con datos. También utilizo Python y Unity cuando el proyecto requiere otro enfoque.',
      'Me interesan especialmente la computación paralela, los algoritmos y el rendimiento del software. Desarrollar y compartir estos proyectos me permite explorar esas áreas de manera práctica.',
      'Desde 2023 también trabajo con Veterinaria DACOR en su sitio web, recursos de identidad digital, armado de computadoras y soporte técnico continuo.',
    ],
    technologyGroups: [
      ['Desarrollo de escritorio', 'C++, Qt Widgets, Qt Network, Qt SQL, SQLite'],
      ['Gráficos y simulación', 'C++, SFML, OpenCV; C y OpenMP en simulación numérica'],
      ['Herramientas y aplicaciones interactivas', 'Python, Whisper, FFmpeg, Tkinter; C# y Unity'],
      [
        'Desarrollo web',
        'HTML, CSS, JavaScript; Astro, Tailwind CSS y TypeScript en este portfolio',
      ],
      ['Herramientas de compilación', 'qmake, CMake, GNU Make'],
    ],
  },
} as const satisfies Record<Locale, EditorialCopy>;
