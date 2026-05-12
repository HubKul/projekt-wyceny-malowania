"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewInquiry() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    client_address: "",
    client_phone: "",
    wall_surface_area: "",
    ceiling_surface_area: "",
    number_of_windows: "0",
    number_of_doors: "0",
    services: [] as string[]
  });

  const availableServices = [
    "Malowanie dwukrotne",
    "Gruntowanie",
    "Oklejanie folią"
  ];

  const wallArea = parseFloat(form.wall_surface_area) || 0;
  const windowsCount = parseInt(form.number_of_windows) || 0;
  const doorsCount = parseInt(form.number_of_doors) || 0;
  
  const totalOpeningsArea = (windowsCount * 1.5) + (doorsCount * 2);
  const isInvalidArea = form.wall_surface_area !== "" && totalOpeningsArea > wallArea;

  const handleToggleService = (service: string) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi('/inquiries/', {
        method: 'POST',
        body: JSON.stringify({
          client_address: form.client_address,
          client_phone: form.client_phone,
          wall_surface_area: form.wall_surface_area,
          ceiling_surface_area: form.ceiling_surface_area,
          number_of_windows: parseInt(form.number_of_windows),
          number_of_doors: parseInt(form.number_of_doors),
          selected_additional_services: form.services
        })
      });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Powrót do panelu
      </Link>
      
      <div className="bg-orange-50 rounded-2xl p-6 md:p-8 border border-orange-200">
        <h1 className="text-2xl font-bold text-orange-400 mb-6">Nowe zgłoszenie</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-2">Adres usługi</label>
              <input 
                type="text" required
                value={form.client_address}
                onChange={e => setForm({...form, client_address: e.target.value})}
                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="np. ul. Niepodległości 12/3, Szczecin"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-2">Numer telefonu</label>
              <input 
                type="tel" required
                pattern="^\+?[0-9\s\-\(\)]+$"
                value={form.client_phone}
                onChange={e => setForm({...form, client_phone: e.target.value})}
                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="np. 123 456 789"
                title="Phone number can contain digits, spaces, hyphens, and a leading plus sign"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Powierzchnia ścian (m²)</label>
              <input 
                type="number" step="0.01" required min="0"
                value={form.wall_surface_area}
                onChange={e => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setForm({...form, wall_surface_area: val});
                }}
                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 tabular-nums"
                placeholder="np. 45.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Powierzchnia sufitu (m²)</label>
              <input 
                type="number" step="0.01" required min="0"
                value={form.ceiling_surface_area}
                onChange={e => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setForm({...form, ceiling_surface_area: val});
                }}
                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 tabular-nums"
                placeholder="np. 20.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Liczba okien</label>
              <input 
                type="number" required min="0"
                value={form.number_of_windows}
                onChange={e => {
                  const val = e.target.value;
                  if (parseInt(val) < 0) return;
                  setForm({...form, number_of_windows: val});
                }}
                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 tabular-nums"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Liczba drzwi</label>
              <input 
                type="number" required min="0"
                value={form.number_of_doors}
                onChange={e => {
                  const val = e.target.value;
                  if (parseInt(val) < 0) return;
                  setForm({...form, number_of_doors: val});
                }}
                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 tabular-nums"
              />
            </div>
          </div>

          {isInvalidArea && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-medium">
              Łączna powierzchnia okien i drzwi nie może przekroczyć łącznej powierzchni ścian.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-3">Dodatkowe usługi</label>
            <div className="space-y-3">
              {availableServices.map(service => (
                <label key={service} className="bg-orange-50 flex items-center gap-3 p-3 rounded-xl border border-orange-200 cursor-pointer hover:bg-orange-300 transition-colors">
                  <input 
                    type="checkbox"
                    checked={form.services.includes(service)}
                    onChange={() => handleToggleService(service)}
                    className="w-5 h-5 rounded border-slate-600 text-teal-500 focus:ring-teal-500 bg-slate-950"
                  />
                  <span className="text-gray-900 capitalize">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || isInvalidArea}
            className="w-full bg-orange-400 text-gray-900 font-semibold py-4 rounded-xl hover:bg-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center h-14 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Wygeneruj wycenę"}
          </button>
        </form>
      </div>
    </div>
  );
}
