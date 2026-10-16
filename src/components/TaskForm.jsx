
import { useState } from "react";

function TaskForm({
  tareaEditar = null,
  onGuardar,
  onCancelar,
  creando = false
}) {
  const [titulo, setTitulo] = useState(tareaEditar?.titulo || "");
  const [error, setError] = useState("");

  async function manejarEnvio(e) {
    e.preventDefault();

    const texto = titulo.trim();

    if (!texto) {
      setError("Escribe un título para la tarea.");
      return;
    }

    const resultado = await onGuardar(texto);

    if (resultado?.ok) {
      setTitulo("");
      setError("");
    } else {
      setError(resultado?.error || "No se pudo guardar la tarea.");
    }
  }

  return (
    <form className="task-form" onSubmit={manejarEnvio}>
      <h2>
        {tareaEditar ? "Editar tarea" : "Nueva tarea"}
      </h2>

      <input
        type="text"
        value={titulo}
        onChange={(e) => {
          setTitulo(e.target.value);
          setError("");
        }}
        placeholder="Escribe el título de la tarea"
        maxLength={100}
        disabled={creando}
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={creando}>
        {creando
          ? "Guardando..."
          : tareaEditar
            ? "Guardar cambios"
            : "Crear tarea"}
      </button>

      {tareaEditar && (
        <button
          type="button"
          onClick={onCancelar}
          disabled={creando}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

export default TaskForm;
