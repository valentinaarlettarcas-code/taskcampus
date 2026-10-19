
function ActionButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`task-button ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default ActionButton;
