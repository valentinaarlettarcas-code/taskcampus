
import TaskItem from "./TaskItem";

function TaskList({
  tareas = [],
  totalTareas = 0,
  enCurso = [],
  onCompletar,
  onEditar,
  onEliminar
}) {
  return (
    <section className="card">
      <h2 className="section-title">Listado de tareas</h2>

      {tareas.length === 0 ? (
        totalTareas === 0 ? (
          <p>No hay ninguna tarea creada todavía.</p>
        ) : (
          <p>No hay resultados para este filtro o búsqueda.</p>
        )
      ) : (
        <ul className="task-list">
          {tareas.map((tarea) => (
            <TaskItem
              key={tarea.id}
              tarea={tarea}
              enProceso={enCurso.includes(tarea.id)}
              onCompletar={onCompletar}
              onEditar={onEditar}
              onEliminar={onEliminar}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default TaskList;
