import { useEffect, useState } from 'react'
import { obtenerTareas } from '../services/tareasService'

export default function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    obtenerTareas()
      .then((datos) => {
        if (activo) setTareas(datos)
      })
      .catch((e) => {
        if (activo) setError(e.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  return { tareas, cargando, error }
}