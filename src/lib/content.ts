import residenceData from "../../content/residences.json";
export const locales = ["en", "es", "ca"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";
export const isLocale = (v: string): v is Locale =>
  locales.includes(v as Locale);
export type Residence = {
  slug: string;
  name: string;
  area: string;
  image: string;
  description: Record<Locale, string>;
  gallery?: { src: string; category: string; caption?: string }[];
  architecture?: Record<Locale, string>;
  terrain?: string;
  render?: string;
  video?: string;
  model?: string;
  modelViews?: {
    name: Record<Locale, string>;
    position: [number, number, number];
    target: [number, number, number];
  }[];
  modelHotspots?: {
    id: string;
    label: Record<Locale, string>;
    description: Record<Locale, string>;
    position: [number, number, number];
  }[];
  modelFloors?: { name: Record<Locale, string>; url: string }[];
  environment?: string;
  nightEnvironment?: string;
  viewerHtml?: string;
  panoramas?: { id: string; name: string; url: string; links: string[] }[];
  plans?: string[];
  coordinates?: [number, number];
  approximate?: boolean;
  verified?: boolean;
  status?: Record<Locale, string>;
  plot?: number;
  built?: number;
  beds?: number;
  baths?: number;
  price?: number;
  satelliteStyle?: string;
};
export const residences: Residence[] = residenceData;

export const copy = {
  en: {
    collection: "The residences",
    experience: "The Mallorca experience",
    about: "Our philosophy",
    contact: "Private enquiries",
    hero: "Your place\nin Mallorca.",
    intro:
      "Exceptional land. Extraordinary architecture.\nA private Mediterranean lifestyle.",
    discover: "Discover the residences",
    explore: "Explore the experience",
    eyebrow: "MALLORCA, BALEARIC ISLANDS",
    scroll: "SCROLL TO DISCOVER",
    chapter: "A DIFFERENT PERSPECTIVE",
    title: "Some places are found.\nOthers are felt.",
    body: "The morning light. The stillness of an olive grove. The feeling of belonging, somewhere extraordinary. A considered collection of future homes, shaped around the way you want to live.",
    selected: "THE PRIVATE COLLECTION",
    selectedTitle: "A place of your own.",
    selectedBody:
      "Distinctive settings. Individual visions. Discover the possibilities of a home in Mallorca.",
    view: "Explore the residence",
    concept: "Concept collection · illustrative content",
    showroom: "The Private Showroom",
    showroomBody:
      "Explore the vision. Discover the details. Imagine the possibilities.",
    transform: "From possibility\nto extraordinary.",
    transformBody:
      "A new perspective on the land. Explore how an architectural vision takes shape, from first impression to future home.",
    lifestyle: "Life, at a different pace.",
    lifeBody:
      "Salt in the air. Long lunches in the shade. A landscape that invites you to slow down. This is the Mediterranean, in your own time.",
    cta: "Let’s imagine\nyour Mallorca.",
    ctaBody: "Every extraordinary home begins with a conversation.",
    arrange: "Arrange a private presentation",
    demo: "Architectural concept · Not an actual property",
    pending: "Project information awaiting verification",
    footer: "Considered architecture. Extraordinary living.",
    all: "View the collection",
    back: "Back to the collection",
    privacy: "Privacy",
    legal: "Legal notice",
  },
  es: {
    collection: "Las residencias",
    experience: "La experiencia Mallorca",
    about: "Nuestra filosofía",
    contact: "Contacto privado",
    hero: "Tu lugar\nen Mallorca.",
    intro:
      "Terrenos excepcionales. Arquitectura extraordinaria.\nUna vida mediterránea privada.",
    discover: "Descubrir las residencias",
    explore: "Explorar la experiencia",
    eyebrow: "MALLORCA, ISLAS BALEARES",
    scroll: "DESLIZA PARA DESCUBRIR",
    chapter: "UNA PERSPECTIVA DIFERENTE",
    title: "Hay lugares que encuentras.\nY otros que sientes.",
    body: "La luz de la mañana. La calma de un olivar. La sensación de pertenecer a un lugar extraordinario. Una cuidada colección de futuros hogares, pensada alrededor de tu forma de vivir.",
    selected: "LA COLECCIÓN PRIVADA",
    selectedTitle: "Un lugar propio.",
    selectedBody:
      "Entornos singulares. Visiones individuales. Descubre las posibilidades de un hogar en Mallorca.",
    view: "Explorar la residencia",
    concept: "Colección conceptual · contenido ilustrativo",
    showroom: "El Showroom Privado",
    showroomBody:
      "Explora la visión. Descubre los detalles. Imagina las posibilidades.",
    transform: "De la posibilidad\na lo extraordinario.",
    transformBody:
      "Una nueva mirada al terreno. Descubre cómo toma forma una visión arquitectónica, desde la primera impresión hasta el futuro hogar.",
    lifestyle: "La vida, a otro ritmo.",
    lifeBody:
      "Sal en el aire. Sobremesas a la sombra. Un paisaje que invita a bajar el ritmo. El Mediterráneo, a tu manera.",
    cta: "Imaginemos\ntu Mallorca.",
    ctaBody: "Todo hogar extraordinario empieza con una conversación.",
    arrange: "Solicitar una presentación privada",
    demo: "Concepto arquitectónico · No es una propiedad real",
    pending: "Información del proyecto pendiente de verificar",
    footer: "Arquitectura consciente. Una vida extraordinaria.",
    all: "Ver la colección",
    back: "Volver a la colección",
    privacy: "Privacidad",
    legal: "Aviso legal",
  },
  ca: {
    collection: "Les residències",
    experience: "L’experiència Mallorca",
    about: "La nostra filosofia",
    contact: "Contacte privat",
    hero: "El teu lloc\na Mallorca.",
    intro:
      "Terrenys excepcionals. Arquitectura extraordinària.\nUna vida mediterrània privada.",
    discover: "Descobreix les residències",
    explore: "Explora l’experiència",
    eyebrow: "MALLORCA, ILLES BALEARS",
    scroll: "DESPLAÇA’T PER DESCOBRIR",
    chapter: "UNA PERSPECTIVA DIFERENT",
    title: "Hi ha llocs que trobes.\nI altres que sents.",
    body: "La llum del matí. La calma d’un olivar. La sensació de pertànyer a un lloc extraordinari. Una selecció de futures llars, pensada al voltant de la teva manera de viure.",
    selected: "LA COL·LECCIÓ PRIVADA",
    selectedTitle: "Un lloc propi.",
    selectedBody:
      "Entorns singulars. Visions individuals. Descobreix les possibilitats d’una llar a Mallorca.",
    view: "Explora la residència",
    concept: "Col·lecció conceptual · contingut il·lustratiu",
    showroom: "El Showroom Privat",
    showroomBody:
      "Explora la visió. Descobreix els detalls. Imagina les possibilitats.",
    transform: "De la possibilitat\na allò extraordinari.",
    transformBody:
      "Una nova mirada al terreny. Descobreix com pren forma una visió arquitectònica, de la primera impressió a la futura llar.",
    lifestyle: "La vida, a un altre ritme.",
    lifeBody:
      "Sal a l’aire. Sobretaules a l’ombra. Un paisatge que convida a alentir el ritme. El Mediterrani, a la teva manera.",
    cta: "Imaginem\nla teva Mallorca.",
    ctaBody: "Tota llar extraordinària comença amb una conversa.",
    arrange: "Sol·licita una presentació privada",
    demo: "Concepte arquitectònic · No és una propietat real",
    pending: "Informació del projecte pendent de verificar",
    footer: "Arquitectura conscient. Una vida extraordinària.",
    all: "Veure la col·lecció",
    back: "Tornar a la col·lecció",
    privacy: "Privacitat",
    legal: "Avís legal",
  },
};
export const labels = {
  en: {
    name: "Full name",
    email: "Email address",
    phone: "Phone with country code",
    country: "Country of residence (optional)",
    property: "Residence of interest",
    message: "Your message",
    consent:
      "I have read the privacy information and consent to being contacted about my enquiry.",
    submit: "Send private enquiry",
    unavailable:
      "Enquiries are not connected yet. No information has been sent or stored.",
    choose: "Select a residence",
    general: "General enquiry",
    gallery: "Gallery",
    film: "Film",
    model: "3D architecture",
    tour: "360° tour",
    plans: "Floor plans",
    location: "Location",
    exterior: "Exterior",
    interior: "Interior",
    architecture: "Architecture",
    lifestyle: "Lifestyle",
    construction: "Construction",
    waiting: "Awaiting project assets",
    before: "Land",
    after: "Architecture",
    demoCompare:
      "Demonstration of the comparison interaction using the same concept image. Aligned terrain photography and final renders are required.",
    fullscreen: "Full screen",
    close: "Close",
    next: "Next image",
    previous: "Previous image",
  },
  es: {
    name: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono con prefijo internacional",
    country: "País de residencia (opcional)",
    property: "Residencia de interés",
    message: "Tu mensaje",
    consent:
      "He leído la información de privacidad y consiento que contacten conmigo sobre mi consulta.",
    submit: "Enviar consulta privada",
    unavailable:
      "Las consultas todavía no están conectadas. No se ha enviado ni almacenado información.",
    choose: "Selecciona una residencia",
    general: "Consulta general",
    gallery: "Galería",
    film: "Vídeo",
    model: "Arquitectura 3D",
    tour: "Tour 360°",
    plans: "Planos",
    location: "Ubicación",
    exterior: "Exterior",
    interior: "Interior",
    architecture: "Arquitectura",
    lifestyle: "Estilo de vida",
    construction: "Construcción",
    waiting: "Pendiente de recursos del proyecto",
    before: "Terreno",
    after: "Arquitectura",
    demoCompare:
      "Demostración del comparador con la misma imagen conceptual. Se necesitan fotografías del terreno y renders finales con perspectivas alineadas.",
    fullscreen: "Pantalla completa",
    close: "Cerrar",
    next: "Siguiente imagen",
    previous: "Imagen anterior",
  },
  ca: {
    name: "Nom complet",
    email: "Correu electrònic",
    phone: "Telèfon amb prefix internacional",
    country: "País de residència (opcional)",
    property: "Residència d’interès",
    message: "El teu missatge",
    consent:
      "He llegit la informació de privacitat i consent que em contactin sobre la meva consulta.",
    submit: "Envia una consulta privada",
    unavailable:
      "Les consultes encara no estan connectades. No s’ha enviat ni desat informació.",
    choose: "Selecciona una residència",
    general: "Consulta general",
    gallery: "Galeria",
    film: "Vídeo",
    model: "Arquitectura 3D",
    tour: "Tour 360°",
    plans: "Plànols",
    location: "Ubicació",
    exterior: "Exterior",
    interior: "Interior",
    architecture: "Arquitectura",
    lifestyle: "Estil de vida",
    construction: "Construcció",
    waiting: "Pendent de recursos del projecte",
    before: "Terreny",
    after: "Arquitectura",
    demoCompare:
      "Demostració del comparador amb la mateixa imatge conceptual. Calen fotografies del terreny i renders finals amb perspectives alineades.",
    fullscreen: "Pantalla completa",
    close: "Tanca",
    next: "Imatge següent",
    previous: "Imatge anterior",
  },
};
