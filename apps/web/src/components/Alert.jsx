export function Alert({ type = "info", children }) {
  const map = {
    info: "alert-info",
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
  };
  return (
    <div role="alert" className={`alert ${map[type] || "alert-info"} my-2`}>
      <span>{children}</span>
    </div>
  );
}
