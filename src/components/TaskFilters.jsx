
function TaskFilters({ filtro, setFiltro, busqueda, setBusqueda }) {
  return (
    <div className="task-filters">
      <input
        type="search"
        placeholder="Buscar tarea..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="filter-buttons">
        <button
          onClick={() => setFiltro("todas")}
          className={filtro === "todas" ? "activo" : ""}
        >
          Todas
        </button>

        <button
          onClick={() => setFiltro("pendiente")}
          className={filtro === "pendiente" ? "activo" : ""}
        >
          Pendientes
        </button>

        <button
          onClick={() => setFiltro("completada")}
          className={filtro === "completada" ? "activo" : ""}
        >
          Completadas
        </button>
      </div>
    </div>
  );
}

export default TaskFilters;
