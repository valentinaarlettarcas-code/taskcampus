const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10'

export async function obtenerTareas() {
  const respuesta = await fetch(API_URL)
  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las tareas')
  }
  const datos = await respuesta.json()
  return datos.map((tarea) => ({
    id: tarea.id,
    titulo: tarea.title,
    estado: tarea.completed ? 'completada' : 'pendiente',
  }))
}