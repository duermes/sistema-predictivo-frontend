import type React from "react";
import { ReactNode } from "react";
import Navbar from "@/components/dashboard/navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return <Navbar>{children}</Navbar>;
}
