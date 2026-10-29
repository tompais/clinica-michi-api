// Errores del dominio: hablan el idioma de la clínica, no el de HTTP.
// El filtro de infraestructura/http los traduce a códigos de respuesta.
export class ReglaDeNegocioRota extends Error {}
export class NoEncontrado extends Error {}
