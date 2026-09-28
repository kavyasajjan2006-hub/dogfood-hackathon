
function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  icon: Icon,
}) {
  return (
    <button
      type={type}
      className={`custom-button ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

export default Button;