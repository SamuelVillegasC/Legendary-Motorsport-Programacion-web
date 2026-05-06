/* 
const INITIAL_CARS = [
  ... (Datos iniciales comentados para cargar manualmente desde el Admin)
];
*/

// Funciones deprecadas tras la migración a la API REST de Django
function getCars() {
  console.warn("getCars() ya no se usa. Usa fetch('/api/vehiculos/')");
  return [];
}

function saveCars(cars) {
  console.warn("saveCars() ya no se usa. Usa fetch('/crear_auto/')");
}

function formatPrice(price) {
  return '$' + Number(price).toLocaleString('en-US');
}