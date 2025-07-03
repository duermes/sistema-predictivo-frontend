"use client";

import {useEffect, useState, ChangeEvent, FormEvent} from "react";
import {useAuth} from "@/lib/authContext";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Turnstile} from "@marsidev/react-turnstile";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Eye, EyeOff} from "lucide-react";

interface FormData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const router = useRouter();
  const {user, register} = useAuth() as {
    user: null; // Reemplaza con el tipo real de `user` en tu contexto
    register: (
      name: string,
      lastname: string,
      email: string,
      password: string,
      token?: string
    ) => Promise<{error: boolean; message: string}>;
  };

  const [token, setToken] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null); // Limpiar mensajes de error generales al cambiar los campos
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validación de campos
    let formValid = true;
    const newErrors: Errors = {};
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
      formValid = false;
    }
    if (!formData.lastname.trim()) {
      newErrors.lastname = "El apellido es obligatorio.";
      formValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
      formValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
      formValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      formValid = false;
    }
    setErrors(newErrors);

    if (formValid) {
      setLoading(true);
      try {
        const response = await register(
          formData.name,
          formData.lastname,
          formData.email,
          formData.password,
          token
        );
        console.log(response);

        if (response.error) {
          setErrorMessage(response.message);
        } else {
          setSuccessMessage(
            "Muchas gracias por registrarte. Por favor verifica tu correo y podrás iniciar sesión. Si no recibiste el correo, ponte en contacto con soporte."
          );
          setFormData({
            name: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && !loading) router.push("/perfil");
  }, [user, loading, router]);

  return (
    <main className="flex items-center justify-center min-h-[90vh] pt-10 bg-gray-100">
      <div className="w-96 max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Registrarse</h1>
        {successMessage && (
          <div className="p-4 text-sm text-green-800 bg-green-100 border border-green-400 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 text-sm text-red-800 bg-red-100 border border-red-400 rounded-lg">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Apellido</Label>
            <Input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Apellido"
              required
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
            )}
          </div>
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
          <div className="space-y-2 relative">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="space-y-2 relative">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-9 right-3 text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
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
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cargando..." : "Registrarse"}
          </Button>
        </form>
        <div className="text-center">
          <span className="text-sm">¿Ya tienes una cuenta? </span>
          <Link
            href="/auth/login"
            className="text-sm text-blue-600 hover:underline"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </main>
  );
}
