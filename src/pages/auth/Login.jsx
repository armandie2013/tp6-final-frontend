import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email requerido"),
  password: yup.string().min(4, "Mínimo 4 caracteres").required("Password requerido"),
});

export default function Login() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (v) => {
    await login(v.email, v.password);
    window.location.href = "/profiles";
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Ingresar</h1>

        <div>
          <input className="border p-2 w-full rounded" placeholder="Email" {...register("email")} />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <input className="border p-2 w-full rounded" placeholder="Password" type="password" {...register("password")} />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <button disabled={isSubmitting} className="w-full bg-black text-white p-2 rounded disabled:opacity-50">
          {isSubmitting ? "Ingresando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}