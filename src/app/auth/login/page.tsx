"use client";

import {useEffect, useState, ChangeEvent, FormEvent} from "react";
import {useAuth} from "@/lib/authContext";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Turnstile} from "@marsidev/react-turnstile";
import Link from "next/link";
import {useRouter} from "next/navigation";
import React from "react";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

export default function Login() {
  const router = useRouter();
  const ref = React.useRef<HTMLFormElement>(null);
  const {user, login} = useAuth() as {
    user: null; // Reemplaza con el tipo real de `user` en tu contexto
    login: (email: string, password: string, token?: string) => Promise<void>;
  };

  const [token, setToken] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validación de campos
    let formValid = true;
    const newErrors: Errors = {};
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
      formValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
      formValid = false;
    }
    setErrors(newErrors);

    router.push("/dashboard");
    if (formValid) {
      setLoading(true);
      try {
        await login(formData.email, formData.password, token);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && !loading) router.push("/perfil");
  }, [user, loading, router]);

  return (
    <main className="flex items-center justify-center min-h-[80vh] bg-gray-100">
      <div className="w-96 max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_SITE_KEY as string}
            options={{
              theme: "light",
              size: "flexible",
              language: "es",
            }}
            onSuccess={(token: string) => setToken(token)}
            onExpire={() => ref.current?.reset()}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cargando..." : "Log in"}
          </Button>
        </form>
        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="text-center">
          <span className="text-sm">¿No tienes una cuenta? </span>
          <Link
            href="/register"
            className="text-sm text-blue-600 hover:underline"
          >
            Registrate
          </Link>
        </div>
      </div>
    </main>
  );
}
