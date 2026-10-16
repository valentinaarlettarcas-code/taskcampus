import { useEffect, useState } from 'react'
import * as tareasService from '../services/tareasService'
import { validarTitulo } from '../utils/validacion'

// Identidad local única y estable para las tareas creadas en la sesión.
let contadorLocal = 0
const nuevoIdLocal = () => {
  contadorLocal += 1
  return `local-${contadorLocal}`
}

const AVISO_LOCAL =
  'Esta tarea se creó durante la sesión y la API simulada no la almacena: el cambio se aplicó solo en la aplicación.'

export default function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [creando, setCreando] = useState(false)
  const [enCurso, setEnCurso] = useState([])
  const [errorOperacion, setErrorOperacion] = useState('')
  const [aviso, setAviso] = useState('')

  // Carga inicial (GET)
  useEffect(() => {
    let activo = true
    tareasService
      .obtenerTareas()
      .then((datos) => {
        if (activo) setTareas(datos)
      })
      .catch((e) => {
        if (activo) setErrorCarga(`No se pudieron cargar las tareas: ${e.message}.`)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  const recargar = async () => {
    setCargando(true)
    setErrorCarga('')
    try {
      setTareas(await tareasService.obtenerTareas())
    } catch (e) {
      setErrorCarga(`No se pudieron cargar las tareas: ${e.message}.`)
    } finally {
      setCargando(false)
    }
  }

  const limpiarMensajes = () => {
    setErrorOperacion('')
    setAviso('')
  }

  // Ejecuta una operación sobre una tarea. Si tiene idRemoto hace la petición HTTP;
  // el estado local solo cambia si todo salió bien.
  const operar = async (tarea, peticion, aplicar, textoError) => {
    if (enCurso.includes(tarea.id)) {
      return { ok: false, error: 'Hay una operación en curso para esta tarea.' }
    }
    limpiarMensajes()
    setEnCurso((previas) => [...previas, tarea.id])
    try {
      if (tarea.idRemoto !== null) await peticion(tarea.idRemoto)
      else setAviso(AVISO_LOCAL)
      aplicar()
      return { ok: true }
    } catch (e) {
      const mensaje = `${textoError}: ${e.message}.`
      setErrorOperacion(mensaje)
      return { ok: false, error: mensaje }
    } finally {
      setEnCurso((previas) => previas.filter((id) => id !== tarea.id))
    }
  }

  const crear = async (titulo) => {
    const mensaje = validarTitulo(titulo)
    if (mensaje) return { ok: false, error: mensaje }
    limpiarMensajes()
    setCreando(true)
    try {
      const remota = await tareasService.crearTarea(titulo.trim())
      const nueva = {
        id: nuevoIdLocal(),
        idRemoto: null,
        idRespuestaApi: remota.idRespuestaApi,
        titulo: remota.titulo,
        estado: 'pendiente',
      }
      setTareas((previas) => [nueva, ...previas])
      return { ok: true }
    } catch (e) {
      const error = `No se pudo crear la tarea: ${e.message}.`
      setErrorOperacion(error)
      return { ok: false, error }
    } finally {
      setCreando(false)
    }
  }

  const alternarEstado = (tarea) => {
    const nuevoEstado = tarea.estado === 'completada' ? 'pendiente' : 'completada'
    return operar(
      tarea,
      (idRemoto) => tareasService.actualizarTarea(idRemoto, { estado: nuevoEstado }),
      () =>
        setTareas((previas) =>
          previas.map((t) => (t.id === tarea.id ? { ...t, estado: nuevoEstado } : t)),
        ),
      'No se pudo cambiar el estado',
    )
  }

  const actualizarTitulo = (tarea, titulo) => {
    const mensaje = validarTitulo(titulo)
    if (mensaje) return Promise.resolve({ ok: false, error: mensaje })
    const nuevoTitulo = titulo.trim()
    return operar(
      tarea,
      (idRemoto) => tareasService.actualizarTarea(idRemoto, { titulo: nuevoTitulo }),
      () =>
        setTareas((previas) =>
          previas.map((t) => (t.id === tarea.id ? { ...t, titulo: nuevoTitulo } : t)),
        ),
      'No se pudo editar el título',
    )
  }

  const eliminar = (tarea) =>
    operar(
      tarea,
      (idRemoto) => tareasService.eliminarTarea(idRemoto),
      () => setTareas((previas) => previas.filter((t) => t.id !== tarea.id)),
      'No se pudo eliminar la tarea',
    )

  return {
    tareas,
    cargando,
    errorCarga,
    creando,
    enCurso,
    errorOperacion,
    aviso,
    recargar,
    limpiarMensajes,
    crear,
    alternarEstado,
    actualizarTitulo,
    eliminar,
  }
}