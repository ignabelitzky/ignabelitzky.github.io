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
      'A small software contribution to KineticBox 1D, a simulation connected to collaborative academic research. See the project for the preprint and full team credit.',
    projects_intro:
      'Applications, simulations, tools, and experiments. Each project includes a source link and a description grounded in its implementation.',
    back: 'Back to projects',
    context: 'Context',
    features: 'What it does',
    focus: 'Engineering focus',
    role: 'My role',
    stack: 'Technologies',
    gallery: 'Browse the gallery',
    gallery_intro:
      'Small experiments, each centered on an idea. Source links lead directly to the corresponding directory.',
    directory: 'View source directory',
    other: 'Further experiments',
    experimental: 'Experimental',
    prototype: 'Prototype',
    practical: 'Practical work',
    dacor: 'Technical support & software development — DACOR Veterinaria',
    dacor_text:
      'I have carried out technical support and software-development work for DACOR Veterinaria in Córdoba, Argentina.',
    paper: 'Read the preprint',
    tech: 'Technologies represented in my projects',
    team: 'Preprint authors',
    recording: 'Repository-linked recording on YouTube',
    recordingNote: 'Recording availability has not been verified.',
    combined: 'Combined Fireworks and Ray Casting recording.',
    backWriting: 'Back to writing',
    updated: 'Updated',
    bioFull: [
      'Hi, I’m Ignacio Belitzky, a Software Developer from Córdoba, Argentina.',
      'I’m passionate about programming and software development, with a particular interest in parallel computing and performance optimization.',
      'In my free time, I enjoy contributing to open-source projects and experimenting with new technologies.',
      'My public work includes desktop applications in C++ and Qt, simulations and graphical experiments with SFML, a Python transcription tool, and an interactive Unity project. I use these projects to explore how software behaves, from data-driven interfaces to numerical and visual algorithms.',
    ],
    technologyGroups: [
      ['Desktop applications', 'C++, Qt Widgets, Qt Network, SQLite'],
      ['Simulations and graphics', 'C++, SFML, OpenMP, OpenCV'],
      ['Tools and interactive applications', 'Python, Whisper, FFmpeg, Tkinter, C#, Unity'],
      ['Build tools', 'GNU Make, qmake, CMake'],
    ],
  },
  es: {
    detail: 'Explorá el proyecto',
    research: 'Colaboración académica',
    research_text:
      'Una pequeña contribución de software a KineticBox 1D, una simulación vinculada con una investigación académica en equipo. En el proyecto podés consultar el preprint y los créditos completos.',
    projects_intro:
      'Aplicaciones, simulaciones, herramientas y experimentos. Cada proyecto incluye su código fuente y una descripción respaldada por su implementación.',
    back: 'Volver a proyectos',
    context: 'Contexto',
    features: 'Qué hace',
    focus: 'Enfoque técnico',
    role: 'Mi participación',
    stack: 'Tecnologías',
    gallery: 'Explorá la galería',
    gallery_intro:
      'Pequeños experimentos, cada uno centrado en una idea. Los enlaces al código llevan directamente al directorio correspondiente.',
    directory: 'Ver directorio del código',
    other: 'Otros experimentos',
    experimental: 'Experimental',
    prototype: 'Prototipo',
    practical: 'Trabajo práctico',
    dacor: 'Soporte técnico y desarrollo de software — DACOR Veterinaria',
    dacor_text:
      'He realizado tareas de soporte técnico y desarrollo de software para DACOR Veterinaria, en Córdoba, Argentina.',
    paper: 'Leé el preprint',
    tech: 'Tecnologías presentes en mis proyectos',
    team: 'Autores del preprint',
    recording: 'Grabación enlazada en el repositorio, en YouTube',
    recordingNote: 'La disponibilidad de la grabación no está verificada.',
    combined: 'Grabación conjunta de Fireworks y Ray Casting.',
    backWriting: 'Volver a artículos',
    updated: 'Actualizado',
    bioFull: [
      'Hola, soy Ignacio Belitzky, Software Developer de Córdoba, Argentina.',
      'Me apasionan la programación y el desarrollo de software, con especial interés en la computación paralela y la optimización del rendimiento.',
      'En mi tiempo libre disfruto contribuir a proyectos de código abierto y experimentar con nuevas tecnologías.',
      'Mi trabajo público incluye aplicaciones de escritorio en C++ y Qt, simulaciones y experimentos gráficos con SFML, una herramienta de transcripción en Python y un proyecto interactivo en Unity. Uso estos proyectos para explorar el comportamiento del software, desde interfaces basadas en datos hasta algoritmos numéricos y visuales.',
    ],
    technologyGroups: [
      ['Aplicaciones de escritorio', 'C++, Qt Widgets, Qt Network, SQLite'],
      ['Simulaciones y gráficos', 'C++, SFML, OpenMP, OpenCV'],
      ['Herramientas y aplicaciones interactivas', 'Python, Whisper, FFmpeg, Tkinter, C#, Unity'],
      ['Herramientas de compilación', 'GNU Make, qmake, CMake'],
    ],
  },
} as const satisfies Record<Locale, EditorialCopy>;
