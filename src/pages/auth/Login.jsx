import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();

  const onSubmit = async (v) => {
    try {
      await login(v.email, v.password);
      window.location.href = "/profiles";
    } catch (e) {
      alert(e?.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Ingresar</h1>
        <input className="border p-2 w-full rounded" placeholder="Email" {...register("email")} />
        <input className="border p-2 w-full rounded" placeholder="Password" type="password" {...register("password")} />
        <button className="w-full bg-black text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  );
}