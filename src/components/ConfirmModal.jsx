
function ConfirmModal({ tarea, onConfirmar, onCancelar, procesando = false }) {
  if (!tarea) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <h2 id="modal-titulo">¿Eliminar tarea?</h2>

        <p>
          ¿Seguro que quieres eliminar "{tarea.titulo}"?
        </p>

        <div className="modal-buttons">
          <button onClick={onCancelar} disabled={procesando}>
            Cancelar
          </button>

          <button
            onClick={() => onConfirmar(tarea)}
            disabled={procesando}
          >
            {procesando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
