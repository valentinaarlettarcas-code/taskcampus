
import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import TaskNavigation from "./components/TaskNavigation";
import TaskStats from "./components/TaskStats";
import ConfirmModal from "./components/ConfirmModal";
import ActionButton from "./components/ActionButton";

import useTareas from "./hooks/useTareas";

function App() {
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

  const [vista, setVista] = useState("resumen");
  const [filtro, setFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [tareaEliminar, setTareaEliminar] = useState(null);

  const tareasFiltradas = tareas.filter((tarea) => {
    const coincideEstado =
      filtro === "todas" || tarea.estado === filtro;

    const coincideBusqueda = tarea.titulo
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());

    return coincideEstado && coincideBusqueda;
  });

  async function guardarTarea(titulo) {
    const resultado = await crear(titulo);

    if (resultado?.ok) {
      setVista("tareas");
    }

    return resultado;
  }

  async function confirmarEliminar(tarea) {
    const resultado = await eliminar(tarea);

    if (resultado?.ok) {
      setTareaEliminar(null);
    }

    return resultado;
  }

  const eliminandoEnCurso =
    tareaEliminar !== null &&
    enCurso.includes(tareaEliminar.id);

  return (
    <main className="app-container">
      <Header
        title="TaskCampus"
        description="Gestor de tareas académicas"
      />

      <TaskNavigation
        vista={vista}
        setVista={setVista}
      />

      {errorCarga && (
        <div className="error" role="alert">
          <p>{errorCarga}</p>
          <ActionButton onClick={recargar}>
            Reintentar
          </ActionButton>
        </div>
      )}

      {errorOperacion && (
        <p className="error" role="alert">
          {errorOperacion}
        </p>
      )}

      {aviso && (
        <p className="aviso" role="status">
          {aviso}
        </p>
      )}

      {(errorOperacion || aviso) && (
        <ActionButton onClick={limpiarMensajes}>
          Cerrar mensaje
        </ActionButton>
      )}

      {cargando && (
        <p role="status">Cargando tareas...</p>
      )}

      {!cargando && !errorCarga && (
        <>
          {vista === "resumen" && (
            <section className="card">
              <TaskStats
                tareas={tareas}
                cantidadMostrada={tareasFiltradas.length}
              />

              <p>
                Consulta el estado de tus actividades
                y organiza tu próximo trabajo.
              </p>

              <ActionButton
                onClick={() => setVista("tareas")}
              >
                Gestionar tareas
              </ActionButton>
            </section>
          )}

          {vista === "tareas" && (
            <section className="tasks-view">
              <TaskFilters
                filtro={filtro}
                setFiltro={setFiltro}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
              />

              <TaskList
                tareas={tareasFiltradas}
                totalTareas={tareas.length}
                enCurso={enCurso}
                onCompletar={alternarEstado}
                onEditar={actualizarTitulo}
                onEliminar={setTareaEliminar}
              />
            </section>
          )}

          {vista === "nueva" && (
            <section className="card">
              <h2>Nueva tarea</h2>

              <TaskForm
                tareaEditar={null}
                onGuardar={guardarTarea}
                onCancelar={() => setVista("tareas")}
                creando={creando}
              />
            </section>
          )}
        </>
      )}

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
