import { validarTitulo } from "../utils/validacion";
import { useState, useRef, useEffect } from "react";
import ActionButton from "./ActionButton";

function TaskItem({
  tarea,
  enProceso,
  onCompletar,
  onEditar,
  onEliminar
}) {
  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(tarea.titulo);
  const [error, setError] = useState("");
  const guardando = useRef(false);
  const cancelar = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!editando) {
      setTitulo(tarea.titulo);
    }
  }, [tarea.titulo, editando]);

  function iniciarEdicion() {
    if (enProceso) return;

    setTitulo(tarea.titulo);
    setError("");
    cancelar.current = false;
    setEditando(true);
  }

  async function guardarTitulo() {
    if (cancelar.current || guardando.current) return;

    const nuevoTitulo = titulo.trim();

    const mensajeError = validarTitulo(nuevoTitulo);

    if (mensajeError) {
      setError(mensajeError);
      inputRef.current?.focus();
      return;
    }

    if (nuevoTitulo === tarea.titulo) {
      setEditando(false);
      setError("");
      return;
    }

    guardando.current = true;

    try {
      const resultado = await onEditar(tarea, nuevoTitulo);

      if (resultado?.ok) {
        setEditando(false);
        setError("");
      } else {
        setError(resultado?.error || "No se pudo guardar el título.");
        inputRef.current?.focus();
      }
    } catch {
      setError("Error al actualizar la tarea.");
      inputRef.current?.focus();
    } finally {
      guardando.current = false;
    }
  }

  function manejarTecla(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }

    if (e.key === "Escape") {
      cancelar.current = true;
      setTitulo(tarea.titulo);
      setError("");
      setEditando(false);
    }
  }

  return (
    <li className="task-item">
      {editando ? (
        <div>
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            onKeyDown={manejarTecla}
            onBlur={guardarTitulo}
            aria-label="Editar título de tarea"
          />
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <span
          onDoubleClick={iniciarEdicion}
          title="Doble clic para editar"
          style={{ cursor: "text" }}
        >
          {tarea.titulo}
        </span>
      )}

      <span className={`estado-${tarea.estado}`}>
        {tarea.estado}
      </span>

      <ActionButton
        disabled={enProceso || editando}
        onClick={() => onCompletar(tarea)}
      >
        {tarea.estado === "pendiente"
          ? "Completar"
          : "Reabrir"}
      </ActionButton>

      <ActionButton
        disabled={enProceso || editando}
        onClick={() => onEliminar(tarea)}
      >
        Eliminar
      </ActionButton>
    </li>
  );
}

export default TaskItem;
