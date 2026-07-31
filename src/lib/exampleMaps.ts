import { makeId } from "./id";
import type {
  Connection,
  Initiative,
  InitiativeProgress,
  Objective,
  ObjectiveStatus,
  Perspective,
  StrategyMap,
} from "../types";
import type { SavedMap } from "./storage";

function initv(text: string, progress: InitiativeProgress = "none"): Initiative {
  return { id: makeId("init"), text, progress };
}

function obj(text: string, status: ObjectiveStatus, initiatives: Initiative[]): Objective {
  return { id: makeId("obj"), text, status, initiatives };
}

function persp(name: string, objectives: Objective[]): Perspective {
  return { id: makeId("persp"), name, visible: true, objectives };
}

function value(text: string) {
  return { id: makeId("value"), text };
}

function conn(from: string, to: string): Connection {
  return { id: makeId("conn"), from, to };
}

function buildSaasMap(): StrategyMap {
  const financial = persp("Financial", [
    obj("Grow Annual Recurring Revenue (ARR)", "on-track", [
      initv("Launch usage-based pricing tier", "complete"),
      initv("Expand enterprise upsell motion", "on-track"),
    ]),
    obj("Improve net revenue retention", "needs-attention", [
      initv("Reduce logo churn through proactive CS outreach", "on-track"),
      initv("Cross-sell analytics add-on"),
    ]),
    obj("Reduce customer acquisition cost (CAC)", "off-track", [
      initv("Shift spend toward organic/content channels", "not-on-track"),
      initv("Optimize paid search targeting", "on-track"),
    ]),
  ]);
  const customer = persp("Customer", [
    obj("Increase product-qualified lead (PQL) conversion", "on-track", [
      initv("Redesign self-serve onboarding flow", "complete"),
      initv("Add in-app upgrade prompts", "on-track"),
    ]),
    obj("Improve customer satisfaction (CSAT)", "on-track", [
      initv("Launch 24/5 live chat support", "complete"),
      initv("Publish public product roadmap", "complete"),
    ]),
    obj("Grow net promoter score (NPS)", "needs-attention", [
      initv("Quarterly customer advisory board", "on-track"),
      initv("Close-the-loop feedback program"),
    ]),
  ]);
  const internalProcess = persp("Internal Process", [
    obj("Increase deployment frequency", "on-track", [
      initv("Adopt trunk-based development", "complete"),
      initv("Automate CI/CD pipeline", "complete"),
    ]),
    obj("Improve platform reliability (uptime)", "needs-attention", [
      initv("Implement multi-region failover", "on-track"),
      initv("Establish on-call/incident response process", "complete"),
    ]),
    obj("Streamline sales-to-onboarding handoff", "none", [
      initv("Automate CRM-to-CS handoff"),
      initv("Standardize onboarding playbook", "not-on-track"),
    ]),
  ]);
  const learningGrowth = persp("Learning & Growth", [
    obj("Upskill engineering team on AI tooling", "on-track", [
      initv("Run internal AI hackathon", "complete"),
      initv("Fund AI/ML certification stipends", "on-track"),
    ]),
    obj("Strengthen product management capability", "none", [
      initv("Hire senior PM for platform team", "on-track"),
      initv("Launch PM mentorship program"),
    ]),
    obj("Improve cross-functional collaboration", "needs-attention", [
      initv("Launch monthly all-hands demo day", "on-track"),
      initv("Adopt shared OKR tooling", "not-on-track"),
    ]),
  ]);

  return {
    title: "Nimbus Cloud Platforms",
    subtitle: "Balanced Scorecard strategy for a B2B SaaS analytics platform, FY26",
    sections: {
      mission: {
        visible: true,
        text: "We build reliable, easy-to-integrate SaaS tools that help product and support teams move faster, backed by transparent pricing and world-class support.",
      },
      vision: {
        visible: true,
        text: "To be the platform of choice for mid-market teams building customer experiences, powering seamless growth without the complexity of enterprise software.",
      },
      values: {
        visible: true,
        items: [
          value("Customer Obsession"),
          value("Ship Fast, Ship Safe"),
          value("Radical Transparency"),
          value("Own the Outcome"),
        ],
      },
    },
    perspectives: [financial, customer, internalProcess, learningGrowth],
    connections: [
      conn(learningGrowth.objectives[0].id, internalProcess.objectives[0].id),
      conn(learningGrowth.objectives[1].id, customer.objectives[0].id),
      conn(internalProcess.objectives[1].id, customer.objectives[1].id),
      conn(internalProcess.objectives[2].id, customer.objectives[2].id),
      conn(customer.objectives[0].id, financial.objectives[0].id),
      conn(customer.objectives[1].id, financial.objectives[1].id),
      conn(customer.objectives[2].id, financial.objectives[2].id),
    ],
  };
}

function buildLogisticsMap(): StrategyMap {
  const financiera = persp("Financiera", [
    obj("Aumentar el margen operativo", "needs-attention", [
      initv("Renegociar tarifas con proveedores de combustible", "on-track"),
      initv("Optimizar rutas para reducir kilómetros vacíos", "complete"),
    ]),
    obj("Diversificar la cartera de clientes", "on-track", [
      initv("Expandir a nuevos sectores (retail, e-commerce)", "complete"),
      initv("Firmar contratos de largo plazo con clientes clave", "on-track"),
    ]),
    obj("Reducir el costo por kilómetro recorrido", "off-track", [
      initv("Renovar flota con vehículos más eficientes", "not-on-track"),
      initv("Implementar mantenimiento preventivo", "on-track"),
    ]),
  ]);
  const clientes = persp("Clientes", [
    obj("Mejorar el índice de entregas a tiempo", "on-track", [
      initv("Implementar sistema de rastreo GPS en tiempo real", "complete"),
      initv("Rediseñar rutas de última milla", "on-track"),
    ]),
    obj("Aumentar la satisfacción del cliente", "on-track", [
      initv("Lanzar portal de seguimiento de envíos para clientes", "complete"),
      initv("Establecer línea de atención al cliente 24/7", "complete"),
    ]),
    obj("Reducir reclamos por carga dañada", "needs-attention", [
      initv("Capacitar al personal en manejo de carga", "on-track"),
      initv("Mejorar el embalaje estándar"),
    ]),
  ]);
  const procesosInternos = persp("Procesos Internos", [
    obj("Digitalizar la gestión de flota", "on-track", [
      initv("Implementar software de gestión de transporte (TMS)", "complete"),
      initv("Integrar sensores IoT en los vehículos", "on-track"),
    ]),
    obj("Reducir el tiempo de carga y descarga en bodega", "needs-attention", [
      initv("Rediseñar el layout del centro de distribución", "on-track"),
      initv("Estandarizar procesos de carga"),
    ]),
    obj("Mejorar la seguridad vial de la flota", "none", [
      initv("Instalar cámaras de monitoreo de conducción"),
      initv("Programa de conducción defensiva", "on-track"),
    ]),
  ]);
  const aprendizaje = persp("Aprendizaje y Crecimiento", [
    obj("Capacitar a los conductores en nuevas tecnologías", "on-track", [
      initv("Certificación en uso de sistemas de rastreo", "complete"),
      initv("Talleres de eficiencia de combustible", "on-track"),
    ]),
    obj("Fortalecer el liderazgo en operaciones", "none", [
      initv("Programa de mentoría para supervisores de ruta", "on-track"),
      initv("Contratar gerente de operaciones regional"),
    ]),
    obj("Mejorar el clima laboral", "needs-attention", [
      initv("Encuesta trimestral de clima organizacional", "complete"),
      initv("Programa de reconocimiento a conductores", "not-on-track"),
    ]),
  ]);

  return {
    title: "Rutas del Pacífico",
    subtitle:
      "Estrategia de Cuadro de Mando Integral para una empresa de transporte y logística, año fiscal 2026",
    sections: {
      mission: {
        visible: true,
        text: "Ofrecemos soluciones de transporte y distribución eficientes, combinando tecnología de rastreo en tiempo real con una flota moderna y un equipo comprometido con la puntualidad.",
      },
      vision: {
        visible: true,
        text: "Ser la red logística más confiable de la región, conectando productores y comercios con sus clientes de forma rápida, segura y sostenible.",
      },
      values: {
        visible: true,
        items: [
          value("Puntualidad"),
          value("Seguridad en la Carga"),
          value("Mejora Continua"),
          value("Compromiso con el Cliente"),
        ],
      },
    },
    perspectives: [financiera, clientes, procesosInternos, aprendizaje],
    connections: [
      conn(aprendizaje.objectives[0].id, procesosInternos.objectives[0].id),
      conn(aprendizaje.objectives[1].id, procesosInternos.objectives[1].id),
      conn(procesosInternos.objectives[0].id, clientes.objectives[0].id),
      conn(procesosInternos.objectives[2].id, clientes.objectives[2].id),
      conn(clientes.objectives[0].id, financiera.objectives[1].id),
      conn(procesosInternos.objectives[1].id, financiera.objectives[2].id),
      conn(clientes.objectives[2].id, financiera.objectives[0].id),
    ],
  };
}

export function createExampleSavedMaps(): SavedMap[] {
  const now = new Date().toISOString();
  return [
    {
      id: makeId("map"),
      name: "Example - Nimbus Cloud Platforms (SaaS)",
      createdAt: now,
      updatedAt: now,
      map: buildSaasMap(),
    },
    {
      id: makeId("map"),
      name: "Ejemplo - Rutas del Pacífico (Logística)",
      createdAt: now,
      updatedAt: now,
      map: buildLogisticsMap(),
    },
  ];
}
