import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email requerido"),
  password: yup.string().min(4, "Mínimo 4 caracteres").required("Password requerido"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      navigate("/profiles", { replace: true }); // mejor que window.location.href
    } catch (e) {
      // Si tu interceptor ya hace toast, podés dejar vacío este catch.
      // Si no, descomentá:
      // toast.error(e?.response?.data?.error || "No se pudo iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Ingresar</h1>

        <div>
          <input
            className="border p-2 w-full rounded"
            placeholder="Email"
            autoComplete="email"
            autoFocus
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <input
            className="border p-2 w-full rounded"
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Ingresando…" : "Entrar"}
        </button>

        <p className="text-sm text-slate-500 mt-4 text-center">
          ¿No tenés cuenta?{" "}
          <Link to="/auth/register" className="underline">Crear cuenta</Link>
        </p>
      </form>
    </div>
  );
}