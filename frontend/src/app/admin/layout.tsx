"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, logout, email } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (role !== "employee") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== "employee") return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-orange-500 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <Link href="/admin" className="text-2xl font-bold font-serif">Panel Pracownika</Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-orange-50">Witaj, {email}</span>
            <button onClick={logout} className="text-orange-100 hover:text-white transition-colors bg-orange-600/50 hover:bg-orange-600 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Wyloguj się</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
