import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email requerido"),
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Password requerido"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Repetí la contraseña"),
});

export default function Register() {
  const { register: doRegister, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const onSubmit = async ({ email, password, confirmPassword }) => {
    try {
      await doRegister(email, password, confirmPassword);

      // Éxito (si no querés toast en éxito, podés quitar esta línea)
      toast.success("Usuario registrado");

      await login(email, password);
      reset();
      navigate("/profiles");
    } catch (err) {
      // Mostrar SOLO errores inline (sin toast)
      const msg = err?.response?.data?.error || "";

      const lower = msg.toLowerCase();
      if (lower.includes("email") && (lower.includes("existe") || lower.includes("registrad"))) {
        setError("email", { type: "server", message: msg || "El email ya está registrado" });
      }
      if (lower.includes("contraseñ") && lower.includes("coinciden")) {
        setError("password", { type: "server", message: msg || "Las contraseñas no coinciden" });
        setError("confirmPassword", { type: "server", message: msg || "Las contraseñas no coinciden" });
      }
      if (!lower && !errors.email && !errors.password && !errors.confirmPassword) {
        // Error general no mapeable → lo ponemos en password para que se vea en el form
        setError("password", { type: "server", message: "No se pudo registrar" });
      }
      // importante: NO resetear el form en error
    }
  };

  return (
    <section className="max-w-md mx-auto">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title mb-2">Crear cuenta</h1>
          <p className="card-subtle mb-6">
            Registrate para empezar a gestionar tus perfiles y películas.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="tu@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="label">Repetí la contraseña</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button className="w-full btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="card-subtle mt-4">
            ¿Ya tenés cuenta?{" "}
            <Link to="/auth/login" className="underline">
              Ingresá acá
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}