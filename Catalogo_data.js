const LM_KEY = 'lm_catalogo';

const INITIAL_CARS = [
  {
    id: 1,
    nombre: "Pegassi Zentorno",
    marca: "Pegassi",
    precio: 725000,
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/a/a9/Zentorno-GTAV-front.png/revision/latest/scale-to-width-down/350",
    descripcion: "Superdeportivo de inspiración italiana con motor V8 central y diseño aerodinámico agresivo. Uno de los más rápidos de Los Santos.",
    badge: "Bestseller"
  },
  {
    id: 2,
    nombre: "Progen T20",
    marca: "Progen",
    precio: 2200000,
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/4/4e/T20-GTAV-front.png/revision/latest/scale-to-width-down/350",
    descripcion: "Hiperdeportivo de producción limitada con sistema de propulsión híbrido. Inspirado en lo mejor de la ingeniería británica.",
    badge: "Exclusivo"
  },
  {
    id: 3,
    nombre: "Överflöd Krieger",
    marca: "Överflöd",
    precio: 2875000,
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/6/6d/Krieger-GTAO-front.png/revision/latest/scale-to-width-down/350",
    descripcion: "El superdeportivo más exclusivo del catálogo. Diseño vanguardista sueco con motor de altísimo rendimiento.",
    badge: "Premium"
  },
  {
    id: 4,
    nombre: "Grotti Turismo R",
    marca: "Grotti",
    precio: 500000,
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/2/24/TurismoR-GTAV-front.png/revision/latest/scale-to-width-down/350",
    descripcion: "Clásico de la gama alta italiana. Velocidad, elegancia y presencia en cada curva de Los Santos.",
    badge: ""
  },
  {
    id: 5,
    nombre: "Dewbauchee Vagner",
    marca: "Dewbauchee",
    precio: 1535000,
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/3/30/Vagner-GTAO-front.png/revision/latest/scale-to-width-down/350",
    descripcion: "Superdeportivo británico con carrocería de fibra de carbono. Uno de los mejores en circuito.",
    badge: "Recién llegado"
  },
  {
    id: 6,
    nombre: "Progen Itali GTB",
    marca: "Progen",
    precio: 1189000,
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/a/a7/ItaliGTBCustom-GTAO-front.png/revision/latest/scale-to-width-down/350",
    descripcion: "Deportivo de lujo con líneas elegantes y motor de alta potencia derivado de la competición.",
    badge: ""
  },
  {
    id: 7,
    nombre: "Bravado Banshee 900R",
    marca: "Bravado",
    precio: 565000,
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/0/00/Banshee900R-GTAV-front.png/revision/latest/scale-to-width-down/350",
    descripcion: "Muscle car americano con motor sobrealimentado. Potencia bruta y diseño intimidante sin igual.",
    badge: ""
  }
];

/* Carga desde localStorage; si está vacío, inicializa con los datos base */
function getCars() {
  const raw = localStorage.getItem(LM_KEY);
  if (!raw) {
    localStorage.setItem(LM_KEY, JSON.stringify(INITIAL_CARS));
    return INITIAL_CARS;
  }
  return JSON.parse(raw);
}

function saveCars(cars) {
  localStorage.setItem(LM_KEY, JSON.stringify(cars));
}

function formatPrice(price) {
  return '$' + Number(price).toLocaleString('en-US');
}