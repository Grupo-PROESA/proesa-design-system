import { useState, type FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { Shield } from "lucide-react";
import { useAuth } from "./AuthContext";
import { BrandMark } from "../layout/BrandMark";
import { Button } from "../ui/Button";
import { Field, INPUT_CLASS } from "../ui/form-fields";

interface LoginPageProps {
  appName: string;
  brandIcon?: LucideIcon;
  mode?: "login" | "changePassword";
}

export function LoginPage({ appName, brandIcon = Shield, mode = "login" }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--proesa-navy-900) 0%, var(--proesa-navy-800) 55%, var(--proesa-teal-900) 100%)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-2 mb-6">
          <BrandMark icon={brandIcon} size={48} iconSize={24} />
          <h1 className="text-lg font-semibold text-gray-900 mt-2">{appName}</h1>
          <p className="text-xs uppercase tracking-wider text-gray-500">PROESA</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {mode === "login" ? (
            <>
              <Field label="Correo">
                <input
                  type="email"
                  className={INPUT_CLASS}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  autoFocus
                />
              </Field>
              <Field label="Contraseña">
                <input
                  type="password"
                  className={INPUT_CLASS}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Field>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Cambia tu contraseña antes de continuar.
            </p>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" loading={submitting} className="w-full mt-2">
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
