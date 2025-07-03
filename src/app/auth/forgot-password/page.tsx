"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";

import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

interface FormData {
	email: string;
}

interface Errors {
	email?: string;
}

export default function ResetPassword() {
	const router = useRouter();
	const { user, loading } = useAuth();

	useEffect(() => {
		if (user && !loading) router.push("/perfil");
	}, [user, loading, router]);
	
	const [formData, setFormData] = useState<FormData>({
		email: "",
	});
	const [errors, setErrors] = useState<Errors>({});
	const [formLoading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [token, setToken] = useState<string | undefined>(undefined);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
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

		// Validación de campo
		let formValid = true;
		const newErrors: Errors = {};

		if (!formData.email.trim()) {
			newErrors.email = "El correo electrónico es obligatorio.";
			formValid = false;
		}

		setErrors(newErrors);

		if (formValid) {
			setLoading(true);
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/resetPassword/request`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email: formData.email, token }),
				});

				if (response.ok) {
					setSuccess(true);
				} else {
					const errorData: { message?: string } = await response.json();
					setErrors({ email: errorData.message || "Error al enviar la solicitud." });
				}
			} catch {
				setErrors({ email: "Hubo un error. Por favor, inténtalo de nuevo." });
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<main className="flex items-center justify-center min-h-[80vh] bg-gray-100">
			<div className="w-96 max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center">Reiniciar Contraseña</h1>
				{success ? (
					<p className="text-center text-green-500">
						¡Solicitud enviada! Si el correo es válido, recibirás un mensaje con las instrucciones para reiniciar tu contraseña.
					</p>
				) : (
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
						<Turnstile
							siteKey={process.env.NEXT_PUBLIC_SITE_KEY as string}
							options={{
								theme: "light",
								size: "flexible",
								language: "es",
							}}
							onSuccess={(token: string) => setToken(token)}
						/>
						<Button type="submit" className="w-full" disabled={formLoading}>
							{formLoading ? "Cargando..." : "Enviar Solicitud"}
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
