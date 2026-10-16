export const LARGO_MAXIMO_TITULO = 120

// Devuelve un mensaje de error, o '' si el título es válido.
export function validarTitulo(titulo) {
  const limpio = (titulo ?? '').trim()
  if (limpio === '') return 'El título no puede estar vacío ni contener solo espacios.'
  if (limpio.length > LARGO_MAXIMO_TITULO) {
    return `El título no puede superar los ${LARGO_MAXIMO_TITULO} caracteres.`
  }
  return ''
}