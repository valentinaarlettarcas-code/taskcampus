const API_URL = 'https://jsonplaceholder.typicode.com/todos'
const CABECERAS = { 'Content-Type': 'application/json; charset=UTF-8' }

// Hace la petición y comprueba que el servidor respondió bien.
async function solicitar(url, opciones) {
  let respuesta
  try {
    respuesta = await fetch(url, opciones)
  } catch {
    throw new Error('no hay conexión con el servidor')
  }
  if (!respuesta.ok) {
    throw new Error(`el servidor respondió con el estado HTTP ${respuesta.status}`)
  }
  return respuesta.json()
}

export async function obtenerTareas() {
  const datos = await solicitar(`${API_URL}?_limit=10`)
  return datos.map((tarea) => ({
    id: `api-${tarea.id}`,
    idRemoto: tarea.id,
    titulo: tarea.title,
    estado: tarea.completed ? 'completada' : 'pendiente',
  }))
}

export async function crearTarea(titulo) {
  const respuesta = await solicitar(API_URL, {
    method: 'POST',
    headers: CABECERAS,
    body: JSON.stringify({ title: titulo, completed: false, userId: 1 }),
  })
  return { titulo: respuesta.title, idRespuestaApi: respuesta.id }
}

// cambios puede ser { titulo: '...' } o { estado: 'completada' }
export async function actualizarTarea(idRemoto, cambios) {
  const cuerpo = {}
  if (cambios.titulo !== undefined) cuerpo.title = cambios.titulo
  if (cambios.estado !== undefined) cuerpo.completed = cambios.estado === 'completada'
  await solicitar(`${API_URL}/${idRemoto}`, {
    method: 'PATCH',
    headers: CABECERAS,
    body: JSON.stringify(cuerpo),
  })
}

export async function eliminarTarea(idRemoto) {
  await solicitar(`${API_URL}/${idRemoto}`, { method: 'DELETE' })
}