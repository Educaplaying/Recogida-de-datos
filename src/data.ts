import { PartnerData, SupportTicket } from './types';

export const SAMPLE_PARTNERS: PartnerData[] = [
  {
    id: 'PART-001',
    companyName: 'Logística Global S.L.',
    companyDescription: 'Operador logístico internacional especializado en distribución farmacéutica y alimentación seca.',
    contactPerson: 'Alejandro Sanz Gómez',
    contactRole: 'Responsable de Talento y RSC',
    contactEmail: 'asanz@logisticaglobal.com',
    contactPhone: '611223344',
    participations: [
      {
        id: 'p-001-1',
        locationExact: 'Avenida de la Logística, 42, Polígono Industrial de Coslada, 28821 Madrid',
        profile: 'Mozo auxiliar de almacén',
        functions: 'Recepción de mercancías, preparación de pedidos (picking y packing), control de inventario mediante radiofrecuencia, organización del almacén de distribución.',
        competencies: 'Capacidad de trabajo en equipo, puntualidad, destreza en herramientas de digitalización, atención al detalle.',
        slotsCount: 8
      },
      {
        id: 'p-001-2',
        locationExact: 'Calle del Transporte, 15, Plataforma Logística PLAZA, 50197 Zaragoza',
        profile: 'Carretillero / Preparador de pedidos',
        functions: 'Carga y descarga de camiones, ubicación de palets en estanterías de altura, picking dinámico.',
        competencies: 'Carnet de carretillero vigente, precisión, orientación a la seguridad laboral.',
        slotsCount: 4
      }
    ],
    submissionDate: '2026-07-01'
  },
  {
    id: 'PART-002',
    companyName: 'Mercadona Distribución',
    companyDescription: 'Compañía de supermercados de capital español y familiar con amplia red logística nacional.',
    contactPerson: 'Marta Solano Castro',
    contactRole: 'Coordinadora de Recursos Humanos',
    contactEmail: 'msolano@mercadona.es',
    contactPhone: '622334455',
    participations: [
      {
        id: 'p-002-1',
        locationExact: 'Plataforma Logística de Zaragoza (PLAZA), Parcela 4.2, 50197 Zaragoza',
        profile: 'Mozo auxiliar de almacén',
        functions: 'Clasificación de productos frescos, reposición de lineales en el centro de distribución regional, preparación de palés para envío a tiendas.',
        competencies: 'Orientación al cliente interno, resistencia física, rigurosidad en pautas sanitarias.',
        slotsCount: 8
      }
    ],
    submissionDate: '2026-07-04'
  },
  {
    id: 'PART-003',
    companyName: 'Tecno-Stock Solutions',
    companyDescription: 'Servicios integrales de reacondicionamiento y distribución de hardware y tecnología.',
    contactPerson: 'Jaime Ortega Ruiz',
    contactRole: 'Director de Operaciones',
    contactEmail: 'jortega@tecnostock.com',
    contactPhone: '633445566',
    participations: [
      {
        id: 'p-003-1',
        locationExact: 'Parque Tecnológico de Andalucía, C/ Severo Ochoa, 12, 29590 Campanillas, Málaga',
        profile: 'Auxiliar de soporte técnico y almacén',
        functions: 'Revisión y reacondicionamiento de equipos informáticos devueltos, registro en base de datos, embalaje y etiquetado.',
        competencies: 'Conocimientos de hardware, paciencia, adaptabilidad y capacidad de aprendizaje continuo.',
        slotsCount: 5
      }
    ],
    submissionDate: '2026-07-06'
  }
];

export const SAMPLE_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-102',
    fullName: 'Javier Domínguez Rivas',
    email: 'jdominguez@logisticaglobal.com',
    subject: 'Problema con la subida del logotipo',
    message: 'Hola, intento subir el logotipo secundario de la empresa en formato PNG de alta resolución pero la plataforma indica un error en la carga. El tamaño del archivo es de 4.2 MB. ¿Existe alguna limitación de tamaño?',
    submissionDate: '2026-07-02',
    status: 'Resolved'
  },
  {
    id: 'TCK-103',
    fullName: 'Marta Solano Castro',
    email: 'msolano@mercadona.es',
    subject: 'Modificar datos de capacidad de acogida',
    message: 'Buenas tardes, envié el formulario ayer indicando una capacidad de acogida de 8 personas, pero debido a una ampliación de nuestros turnos logísticos en Zaragoza, nos gustaría ampliar el número de plazas a 12. ¿Es posible actualizar el registro?',
    submissionDate: '2026-07-05',
    status: 'In Progress'
  }
];

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: '¿Cuál es el objetivo principal del Portal de Colaboración?',
    answer: 'El portal permite a las empresas asociadas dar de alta ofertas de colaboración, perfiles requeridos y capacidades de acogida formativa de forma rápida y estructurada. Con esto agilizamos la inserción laboral y el seguimiento del impacto social.',
    category: 'General'
  },
  {
    question: '¿Qué perfiles de trabajadores se pueden solicitar?',
    answer: 'Principalmente se recogen perfiles orientados a auxiliares de almacén y logística, aunque a través de la opción "Otro" puede detallar cualquier necesidad técnica o de servicios específicos que su empresa requiera.',
    category: 'Formulario'
  },
  {
    question: '¿Quién se encarga del seguimiento de los candidatos?',
    answer: 'Un tutor especializado de la Fundación Secretariado Gitano y BeJob coordinará con el responsable de su empresa el proceso de selección, la formación y el seguimiento diario del participante.',
    category: 'Gestión'
  },
  {
    question: '¿Tienen soporte para la firma de convenios?',
    answer: 'Sí, todas las colaboraciones están amparadas por convenios estándar de colaboración social. Nuestro equipo legal le asistirá con la tramitación digital automatizada.',
    category: 'Legal'
  }
];

export interface GuidelineItem {
  title: string;
  date: string;
  category: string;
  description: string;
  downloadUrl?: string;
}

export const GUIDELINE_ITEMS: GuidelineItem[] = [
  {
    title: 'Manual de Acogida al Colaborador 2026',
    date: 'Mayo 2026',
    category: 'Acogida',
    description: 'Guía práctica para los tutores de empresa sobre cómo recibir y guiar a los candidatos durante sus primeras semanas de inserción socio-laboral.',
  },
  {
    title: 'Estándares de Seguridad para Almacenes Automatizados',
    date: 'Junio 2026',
    category: 'Seguridad',
    description: 'Actualización obligatoria sobre normativa de riesgos laborales y medidas preventivas para mozos y operarios de almacén con maquinaria robotizada.',
  },
  {
    title: 'Código de Conducta y Diversidad Corporativa',
    date: 'Enero 2026',
    category: 'Ética',
    description: 'Establece los principios compartidos de igualdad de oportunidades, inclusión, no discriminación y respeto a la diversidad en el entorno laboral.',
  }
];
