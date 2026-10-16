
import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import TaskNavigation from "./components/TaskNavigation";
import TaskStats from "./components/TaskStats";
import ConfirmModal from "./components/ConfirmModal";

import useTareas from "./hooks/useTareas";

function App() {
  // Datos y funciones del hook de Valentina
  const {
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
    eliminar
  } = useTareas();

  // Estados de nuestra interfaz
  const [vista, setVista] = useState("inicio");
  const [filtro, setFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [tareaEditar, setTareaEditar] = useState(null);
  const [tareaEliminar, setTareaEliminar] = useState(null);

  // Filtrar tareas por estado y título
  const tareasFiltradas = tareas.filter((tarea) => {
    const coincideEstado =
      filtro === "todas" || tarea.estado === filtro;

    const coincideBusqueda = tarea.titulo
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());

    return coincideEstado && coincideBusqueda;
  });

  // Crear o editar una tarea
  async function guardarTarea(titulo) {
    if (tareaEditar) {
      const resultado = await actualizarTitulo(tareaEditar, titulo);

      if (resultado.ok) {
        setTareaEditar(null);
      }

      return resultado;
    }

    return crear(titulo);
  }

  // Eliminar después de confirmar
  async function confirmarEliminar(tarea) {
    const resultado = await eliminar(tarea);

    if (resultado.ok) {
      setTareaEliminar(null);
    }

    return resultado;
  }

  const editandoEnCurso =
    tareaEditar !== null && enCurso.includes(tareaEditar.id);

  const eliminandoEnCurso =
    tareaEliminar !== null && enCurso.includes(tareaEliminar.id);

  return (
    <main className="app-container">
      <Header
        title="TaskCampus"
        description="Gestor de tareas académicas"
      />

      <TaskNavigation vista={vista} setVista={setVista} />

      {errorCarga && (
        <div className="error">
          <p>{errorCarga}</p>
          <button onClick={recargar}>Reintentar</button>
        </div>
      )}

      {errorOperacion && (
        <p className="error" role="alert">{errorOperacion}</p>
      )}

      {aviso && (
        <p className="aviso" role="status">{aviso}</p>
      )}

      {(errorOperacion || aviso) && (
        <button onClick={limpiarMensajes}>
          Cerrar mensaje
        </button>
      )}

      {cargando && <p>Cargando tareas...</p>}

      {!cargando && (
        <>
          {/* VISTA 1: INICIO */}
          {vista === "inicio" && (
            <section className="card">
              <h2>Bienvenida a TaskCampus</h2>
              <p>
                Organiza tus actividades académicas,
                controla tus pendientes y revisa tu progreso.
              </p>

              <TaskStats tareas={tareas} />

              <button onClick={() => setVista("tareas")}>
                Ver mis tareas
              </button>
            </section>
          )}

          {/* VISTA 2: MIS TAREAS */}
          {vista === "tareas" && (
            <section className="tasks-view">
              <TaskForm
                key={tareaEditar?.id ?? "nueva"}
                tareaEditar={tareaEditar}
                onGuardar={guardarTarea}
                onCancelar={() => setTareaEditar(null)}
                creando={creando || editandoEnCurso}
              />

              <TaskFilters
                filtro={filtro}
                setFiltro={setFiltro}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
              />

              <TaskList
                tareas={tareasFiltradas}
                enCurso={enCurso}
                onCompletar={alternarEstado}
                onEditar={setTareaEditar}
                onEliminar={setTareaEliminar}
              />
            </section>
          )}

          {/* VISTA 3: RESUMEN */}
          {vista === "resumen" && (
            <section className="card">
              <TaskStats tareas={tareas} />

              <p>
                Consulta el estado de tus actividades
                y organiza tu próximo trabajo.
              </p>

              <button onClick={() => setVista("tareas")}>
                Gestionar tareas
              </button>
            </section>
          )}
        </>
      )}

      {/* Confirmación para eliminar */}
      <ConfirmModal
        tarea={tareaEliminar}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setTareaEliminar(null)}
        procesando={eliminandoEnCurso}
      />
    </main>
  );
}

export default App;
