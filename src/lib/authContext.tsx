"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {useRouter} from "next/navigation";
import {hasCookie} from "cookies-next";
import {toast} from "sonner";

interface User {
  balance: number;
  user_id?: string;
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  second_name: string;
  second_lastname: string;
  dni: string;
  phone: string;
  avatar: number;
  takwto_hash: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, token: string) => Promise<void>;
  register: (
    name: string,
    last_name: string,
    email: string,
    password: string,
    token: string
  ) => Promise<{error: boolean; message: string}>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/profile`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data: User = await res.json();
        setUser(data);
      } else {
        setUser(null); // Usuario no autenticado.
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasCookie("sessionId")) {
      console.log("Cookie no encontrado");
      setLoading(false); // No hay cookie, no se necesita cargar usuario.
      return;
    }
    if (!user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const login = async (email: string, password: string, token: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
          token: token,
        }),
      }).then(async (res) => {
        if (res.status == 200) {
          fetchUserData();
          router.push("/dashboard");
        } else {
          toast.error("Error al iniciar sesión. Verifica tus credenciales.");
          router.refresh();
        }
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async (
    name: string,
    last_name: string,
    email: string,
    password: string,
    token: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/auth/register`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({name, last_name, email, password, token}),
          credentials: "include",
        }
      );

      if (response.ok) {
        return {
          error: false,
          message: "Registro exitoso. Por favor, verifica tu correo.",
        };
      } else {
        const errorData = (await response.json()) as {message: string};
        return {
          error: true,
          message: errorData.message || "Hubo un problema en el registro.",
        };
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      return {
        error: true,
        message:
          "No se pudo completar el registro. Intenta nuevamente más tarde.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{user, login, loading, register, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
