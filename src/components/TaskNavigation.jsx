
function TaskNavigation({ vista, setVista }) {
  return (
    <nav className="task-navigation">
      <button
        className={vista === "inicio" ? "activo" : ""}
        onClick={() => setVista("inicio")}
      >
        Inicio
      </button>

      <button
        className={vista === "tareas" ? "activo" : ""}
        onClick={() => setVista("tareas")}
      >
        Mis tareas
      </button>

      <button
        className={vista === "resumen" ? "activo" : ""}
        onClick={() => setVista("resumen")}
      >
        Resumen
      </button>
    </nav>
  );
}

export default TaskNavigation;
