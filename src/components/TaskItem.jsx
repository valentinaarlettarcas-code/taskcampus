
function TaskItem({ tarea, enProceso, onCompletar, onEditar, onEliminar }) {
  return (
    <li className="task-item">
      <span>{tarea.titulo}</span>
      <span className={`estado-${tarea.estado}`}>
       {tarea.estado}
      </span>
      
      <button
        disabled={enProceso}
        onClick={() => onCompletar(tarea)}
      >
        {tarea.estado === "pendiente" ? "Completar" : "Reabrir"}
      </button>

      <button
        disabled={enProceso}
        onClick={() => onEditar(tarea)}
      >
        Editar
      </button>

      <button
        disabled={enProceso}
        onClick={() => onEliminar(tarea)}
      >
        Eliminar
      </button>
    </li>
  );
}

export default TaskItem;
