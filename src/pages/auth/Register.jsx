import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email requerido"),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("Password requerido"),
});

export default function Register() {
  const { register: doRegister, login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async ({ email, password }) => {
    await doRegister(email, password);
    toast.success("Usuario registrado");
    // opcional: loguear automáticamente
    await login(email, password);
    navigate("/profiles");
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Crear cuenta</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input className="border p-2 w-full rounded" placeholder="Email" {...register("email")} />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <input className="border p-2 w-full rounded" placeholder="Password" type="password" {...register("password")} />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <button disabled={isSubmitting} className="w-full bg-black text-white p-2 rounded disabled:opacity-50">
          {isSubmitting ? "Creando…" : "Registrarme"}
        </button>
      </form>

      <p className="text-sm text-slate-500 mt-4">
        ¿Ya tenés cuenta?{" "}
        <Link to="/auth/login" className="underline">Ingresá</Link>
      </p>
    </div>
  );
}