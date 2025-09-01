export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    {
      primary: "btn-primary",
      outline: "btn-outline",
      ghost: "btn-ghost",
    }[variant] || "btn-primary";

  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}