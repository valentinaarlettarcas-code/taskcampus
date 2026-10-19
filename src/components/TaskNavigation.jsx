
import ActionButton from "./ActionButton";

function TaskNavigation({ vista, setVista }) {
  const vistas = [
    { id: "resumen", nombre: "Resumen" },
    { id: "tareas", nombre: "Tareas" },
    { id: "nueva", nombre: "Nueva tarea" }
  ];

  return (
    <nav className="task-navigation">
      {vistas.map((opcion) => (
        <ActionButton
          key={opcion.id}
          className={vista === opcion.id ? "activo" : ""}
          onClick={() => setVista(opcion.id)}
        >
          {opcion.nombre}
        </ActionButton>
      ))}
    </nav>
  );
}

export default TaskNavigation;
