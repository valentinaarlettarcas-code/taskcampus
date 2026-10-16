
function TaskStats({ tareas = [] }) {
  const total = tareas.length;

  const pendientes = tareas.filter(
    (tarea) => tarea.estado === "pendiente"
  ).length;

  const completadas = tareas.filter(
    (tarea) => tarea.estado === "completada"
  ).length;

  return (
    <section className="task-stats">
      <h2>Resumen de tareas</h2>

      <div className="stats-container">
        <p>Total: {total}</p>
        <p>Pendientes: {pendientes}</p>
        <p>Completadas: {completadas}</p>
      </div>
    </section>
  );
}

export default TaskStats;
