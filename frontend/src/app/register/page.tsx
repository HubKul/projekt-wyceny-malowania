"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: any = { email_address: email, password };
      if (secretCode) {
        payload.secret_company_code = secretCode;
      }

      const data = await fetchApi('/register/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      login(data.token, data.role);
    } catch (err: any) {
      setError("Registration failed. Email might be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-orange-50 border border-orange-200 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">Rejestracja</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Hasło</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Kod firmowy (Opcjonalnie)</label>
            <input 
              type="text" 
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
              placeholder="Dla pracowników"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-400 text-gray-900 font-semibold py-3 rounded-xl hover:bg-orange-300 transition-colors flex justify-center items-center h-12 mt-6 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Załóż konto"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Masz już konto? <Link href="/login" className="text-orange-400 hover:text-orange-300">Zaloguj się tutaj</Link>
        </p>
      </div>
    </div>
  );
}
