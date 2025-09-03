// import { useForm } from "react-hook-form";
// import { useAuth } from "../../context/AuthContext";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { isSubmitting, errors },
//   } = useForm({
//     defaultValues: { email: "", password: "" },
//   });

//   const onSubmit = async ({ email, password }) => {
//     await login(email, password);
//     toast.success("Sesión iniciada");
//     navigate("/profiles");
//   };

//   return (
//     <section className="max-w-md mx-auto">
//       <div className="card">
//         <div className="card-body">
//           <h1 className="card-title mb-2">Ingresar</h1>
//           <p className="card-subtle mb-6">
//             Accedé con tus credenciales para continuar.
//           </p>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <label className="label">Email</label>
//               <input
//                 type="email"
//                 className="input"
//                 placeholder="tu@email.com"
//                 {...register("email", { required: "Email requerido" })}
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-500 mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="label">Password</label>
//               <input
//                 type="password"
//                 className="input"
//                 placeholder="••••••••"
//                 {...register("password", { required: "Password requerido" })}
//               />
//               {errors.password && (
//                 <p className="text-sm text-red-500 mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <button className="w-full btn-primary" disabled={isSubmitting}>
//               {isSubmitting ? "Ingresando..." : "Ingresar"}
//             </button>
//           </form>

//           <p className="card-subtle mt-4">
//             ¿No tenés cuenta?{" "}
//             <Link to="/auth/register" className="underline">
//               Registrate
//             </Link>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email requerido"),
  password: yup.string().required("Password requerido"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      navigate("/profiles");
    } catch (err) {
      // Mensaje que viene del back en 4xx
      const msg =
        err?.response?.data?.error ||
        "Credenciales inválidas";

      // Mostrarlo debajo del password (y opcionalmente del email)
      setError("password", { type: "server", message: msg });
      // setError("email", { type: "server", message: msg }); // si querés marcar ambos campos
    }
  };

  return (
    <section className="max-w-md mx-auto">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title mb-2">Ingresar</h1>
          <p className="card-subtle mb-6">
            Accedé para gestionar tus perfiles y películas.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="tu@email.com"
                {...register("email")}
                autoComplete="email"
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
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button className="w-full btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="card-subtle mt-4">
            ¿No tenés cuenta?{" "}
            <Link to="/auth/register" className="underline">
              Registrate acá
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}