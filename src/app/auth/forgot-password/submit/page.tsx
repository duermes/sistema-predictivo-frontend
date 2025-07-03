"use client";

import { useState, ChangeEvent, FormEvent, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface FormData {
	password: string;
	confirmPassword: string;
}

interface Errors {
	password?: string;
	confirmPassword?: string;
	general?: string;
}
function ResetPasswordSubmit() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const resetToken = searchParams.get("resetToken");

	const [formData, setFormData] = useState<FormData>({
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<Errors>({});
	const [formLoading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [token, setToken] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (!resetToken) {
			router.push("/login"); // Redirigir si no hay resetToken
		}
	}, [resetToken, router]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setErrors((prev) => ({
			...prev,
			[name]: "",
			general: "",
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Validación de campo
		let formValid = true;
		const newErrors: Errors = {};

		if (!formData.password.trim()) {
			newErrors.password = "La contraseña es obligatoria.";
			formValid = false;
		} else if (formData.password.length < 8) {
			newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
			formValid = false;
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Las contraseñas no coinciden.";
			formValid = false;
		}

		if (!token) {
			newErrors.general = "Debes completar la verificación.";
			formValid = false;
		}

		setErrors(newErrors);

		if (formValid) {
			setLoading(true);
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/resetPassword/submit`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ password: formData.password, resetToken, token }),
				});

				if (response.ok) {
					setSuccess(true);
				} else {
					const errorData: { message?: string } = await response.json();
					setErrors({ general: errorData.message || "Error al cambiar la contraseña." });
				}
			} catch {
				setErrors({ general: "Hubo un error. Por favor, inténtalo de nuevo." });
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<main className="flex items-center justify-center min-h-[80vh] bg-gray-100">
			<div className="w-96 max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center">Cambiar Contraseña</h1>
				{success ? (
					<p className="text-center text-green-500">
						¡Contraseña cambiada exitosamente! Ahora puedes{" "}
						<Link href="/login" className="text-blue-600 hover:underline">
							iniciar sesión
						</Link>
						.
					</p>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="password">Nueva Contraseña</Label>
							<Input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Nueva contraseña"
								required
							/>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">{errors.password}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
							<Input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder="Confirmar contraseña"
								required
							/>
							{errors.confirmPassword && (
								<p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
							)}
						</div>
						<Turnstile
							siteKey={process.env.NEXT_PUBLIC_SITE_KEY as string}
							options={{
								theme: "light",
								size: "flexible",
								language: "es",
							}}
							onSuccess={(newToken: string) => setToken(newToken)}
						/>
						{errors.general && (
							<p className="text-red-500 text-sm mt-1 text-center">
								{errors.general}
							</p>
						)}
						<Button type="submit" className="w-full" disabled={formLoading}>
							{formLoading ? "Cargando..." : "Cambiar Contraseña"}
						</Button>
					</form>
				)}
				<div className="text-center">
					<Link
						href="/login"
						className="text-sm text-blue-600 hover:underline"
					>
						Volver al inicio de sesión
					</Link>
				</div>
			</div>
		</main>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<ResetPasswordSubmit />
		</Suspense>
	);
}