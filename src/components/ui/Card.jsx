export function Card({ className = "", children, ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className = "", children }) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }) {
  return <h3 className={`card-title ${className}`}>{children}</h3>;
}

export function CardSubtle({ className = "", children }) {
  return <p className={`card-subtle ${className}`}>{children}</p>;
}