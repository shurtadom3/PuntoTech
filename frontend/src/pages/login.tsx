import { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import Navbar from "./navbar";
import { iniciarSesion, registrarUsuario } from "../api";

const Login = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/products";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response =
        mode === "login"
          ? await iniciarSesion({ email, password })
          : await registrarUsuario({ name, email, password });

      if (response.error) {
        setMessage(response.error);
        return;
      }

      localStorage.setItem(
        "puntotech_user",
        JSON.stringify({ id: response.id, name: response.name || name, email: response.email })
      );
      window.dispatchEvent(new Event("puntotech_user_changed"));
      navigate(next);
    } catch {
      setMessage("No se pudo conectar con el backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 md:pt-28">
        <div className="container mx-auto max-w-md px-4 md:px-6">
          <section className="glass rounded-lg p-6 text-left">
            <div className="mb-6">
              <p className="text-sm font-semibold text-primary mb-2">Solo para comprar</p>
              <h1 className="font-heading text-3xl font-bold">
                {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
              </h1>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-lg border border-border p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold ${
                  mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <LogIn size={16} />
                Entrar
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold ${
                  mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <UserPlus size={16} />
                Registro
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <label className="block text-sm font-medium">
                  Nombre
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border border-border bg-card p-3 outline-none focus:border-primary"
                  />
                </label>
              )}

              <label className="block text-sm font-medium">
                Correo
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-card p-3 outline-none focus:border-primary"
                />
              </label>

              <label className="block text-sm font-medium">
                Contrasena
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  className="mt-2 w-full rounded-lg border border-border bg-card p-3 outline-none focus:border-primary"
                />
              </label>

              {message && <p className="text-sm text-red-600">{message}</p>}

              <button
                disabled={loading}
                className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {mode === "login" ? "Entrar" : "Crear cuenta"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
};

export default Login;
