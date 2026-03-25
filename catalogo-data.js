const LM_KEY     = 'lm_catalogo';
const LM_VER_KEY = 'lm_catalogo_version';
const LM_VERSION = 'v2';

const INITIAL_CARS = [
  {
    id: 1,
    nombre: "Zentorno",
    marca: "Pegassi",
    precio: 725000,
    imagen: "https://e1.pxfuel.com/desktop-wallpaper/965/647/desktop-wallpaper-gta-5-zentorno.jpg",
    descripcion: "Superdeportivo de inspiración italiana con motor V8 central y diseño aerodinámico agresivo. Uno de los más rápidos de Los Santos.",
    badge: "Bestseller"
  },
  {
    id: 2,
    nombre: "T20",
    marca: "Progen",
    precio: 2200000,
    imagen: "https://th.bing.com/th/id/R.372bb1316f55691209c5f7f4686ca241?rik=bqPQdjxqIS30NQ&pid=ImgRaw&r=0",
    descripcion: "Hiperdeportivo de producción limitada con sistema de propulsión híbrido. Inspirado en lo mejor de la ingeniería británica.",
    badge: "Exclusivo"
  },
  {
    id: 3,
    nombre: "Proto x80",
    marca: "Grotti",
    precio: 2875000,
    imagen: "https://tse3.mm.bing.net/th/id/OIP.g4_NTbAirB77jKfgEKEU6QHaEI?rs=1&pid=ImgDetMain&o=7&rm=3",
    descripcion: "Este vehiculo es causa de mayor avistamientos de ovni en la ciudad se debe, a menudo cuando pides a chat gpt que quite el avion de la foto, elimina al Proto",
    badge: "Premium"
  },
  {
    id: 4,
    nombre: "Turismo R",
    marca: "Grotti",
    precio: 500000,
    imagen: "https://tse3.mm.bing.net/th/id/OIP.F_awkkUUntlDi3E7lr64oAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    descripcion: "Clásico de la gama alta italiana. Velocidad, elegancia y presencia en cada curva de Los Santos.",
    badge: ""
  },
  {
    id: 5,
    nombre: "Vagner",
    marca: "Dewbauchee",
    precio: 1535000,
    imagen: "https://tse1.mm.bing.net/th/id/OIP.OQd5CGJgMKXRe-HVc-v5ewHaEI?rs=1&pid=ImgDetMain&o=7&rm=3",
    descripcion: "Superdeportivo británico con carrocería de fibra de carbono. Uno de los mejores en circuito.",
    badge: "Recién llegado"
  },
  {
    id: 6,
    nombre: "Itali GTB",
    marca: "Progen",
    precio: 1189000,
    imagen: "https://tse1.mm.bing.net/th/id/OIP.GeQcLOj58ohM2i9L0UBnAQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    descripcion: "Deportivo de lujo con líneas elegantes y motor de alta potencia derivado de la competición.",
    badge: ""
  },
  {
    id: 7,
    nombre: "Entity MT",
    marca: "Overflod",
    precio: 2165000,
    imagen: "https://tse4.mm.bing.net/th/id/OIP.5xQszl00SY88wu2aI7qyPAHaDm?rs=1&pid=ImgDetMain&o=7&rm=3",
    descripcion: "Si buscas rapido en el diccionario te sale su foto, en una frase: alta maniobrabilidad en velocidades supersonicas. Es tan rapido que me pone ******* ****** ***",
    badge: ""
  }
];

function getCars() {
  const savedVersion = localStorage.getItem(LM_VER_KEY);

  if (savedVersion !== LM_VERSION) {
    localStorage.setItem(LM_KEY,     JSON.stringify(INITIAL_CARS));
    localStorage.setItem(LM_VER_KEY, LM_VERSION);
    return INITIAL_CARS;
  }

  const raw = localStorage.getItem(LM_KEY);
  return raw ? JSON.parse(raw) : INITIAL_CARS;
}

function saveCars(cars) {
  localStorage.setItem(LM_KEY, JSON.stringify(cars));
}

function formatPrice(price) {
  return '$' + Number(price).toLocaleString('en-US');
}