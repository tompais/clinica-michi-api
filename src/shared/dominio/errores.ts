// Errores del dominio: hablan el idioma de la clínica, no el de HTTP.
// El filtro de infraestructura/http los traduce a códigos de respuesta.
export class ReglaDeNegocioRota extends Error {}

export class NoEncontrado extends Error {
  // Arma siempre el mismo mensaje: "No existe el gato 3".
  constructor(recurso: string, id: number | string) {
    super(`No existe ${recurso} ${id}`)
  }
}
