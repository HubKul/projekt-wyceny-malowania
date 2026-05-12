"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function InquiryDetails() {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  const handleRespond = async (status: 'accepted' | 'rejected') => {
    setResponding(true);
    try {
      const updatedEstimation = await fetchApi(`/inquiries/${id}/respond_estimation/`, {
        method: 'PATCH',
        body: JSON.stringify({ inquiry_status: status })
      });
      setInquiry((prev: any) => ({
        ...prev,
        estimations: [updatedEstimation]
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setResponding(false);
    }
  };

  useEffect(() => {
    fetchApi(`/inquiries/${id}/`)
      .then(data => setInquiry(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;
  }

  if (!inquiry) return <div className="text-center text-slate-400">Zgłoszenie nie zostało znalezione.</div>;

  const estimation = inquiry.estimations?.[0];

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Wróć do panelu
      </Link>

      <div className="bg-orange-50 rounded-2xl border border-orange-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-orange-200">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-orange-400">Podgląd wyceny</h1>
            {estimation && (
              <span className="bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {estimation.inquiry_status}
              </span>
            )}
          </div>
          <div className="text-gray-900 text-sm">
            Złożono {new Date(inquiry.submission_date).toLocaleString()}
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {estimation?.inquiry_status === 'accepted' && (
            <div className="bg-teal-500/10 border border-teal-500/50 text-teal-400 p-4 rounded-xl flex items-start gap-3">
              <div className="flex-1 text-sm font-medium">
                Twoje zgłoszenie zostało zaakceptowane. Nasz przedstawiciel skontaktuje się z Tobą pod podanym numerem telefonu w ciągu najbliższych dni, aby omówić szczegóły.
              </div>
            </div>
          )}
          <section>
            <h3 className="text-lg font-semibold text-gray-500 mb-4">Parametry pomieszczenia</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-orange-200">
                <div className="text-gray-500 text-xs uppercase mb-1">Powierzchnia ścian</div>
                <div className="text-gray-900  font-medium tabular-nums">{inquiry.wall_surface_area} m²</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-orange-200">
                <div className="text-gray-500 text-xs uppercase mb-1">Powierzchnia sufitu</div>
                <div className="text-gray-900  font-medium tabular-nums">{inquiry.ceiling_surface_area} m²</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-orange-200">
                <div className="text-gray-500 text-xs uppercase mb-1">Ilość okien</div>
                <div className="text-gray-900  font-medium tabular-nums">{inquiry.number_of_windows}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-orange-200">
                <div className="text-gray-500 text-xs uppercase mb-1">Ilość drzwi</div>
                <div className="text-gray-900  font-medium tabular-nums">{inquiry.number_of_doors}</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-500 mb-4">Wybrane Usługi</h3>
            <div className="flex flex-wrap gap-2">
              {inquiry.selected_additional_services.map((service: string) => (
                <span key={service} className="bg-orange-50 text-gray-900 px-3 py-1 rounded-lg text-sm capitalize">
                  {service}
                </span>
              ))}
            </div>
          </section>

          {estimation && (
            <section className="bg-teal-500/10 p-6 rounded-2xl border border-teal-500/20">
              <h3 className="text-lg font-semibold text-teal-400 mb-4">Szacowany Koszt</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-900">
                  <span>Szacowany Koszt</span>
                  <span className="tabular-nums font-medium">{estimation.calculated_amount} PLN</span>
                </div>
                {estimation.final_updated_amount && (
                  <div className="flex justify-between text-teal-300 font-bold text-xl pt-4 border-t border-teal-500/20">
                    <span>Ostateczna kwota</span>
                    <span className="tabular-nums">{estimation.final_updated_amount} PLN</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {estimation?.inquiry_status === 'estimated' && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => handleRespond('accepted')}
                disabled={responding}
                className="flex-1 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                {responding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Accept Proposal"}
              </button>
              <button 
                onClick={() => handleRespond('rejected')}
                disabled={responding}
                className="flex-1 bg-red-500 text-white hover:bg-red-300 hover:text-white border border-red-500/50 font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                {responding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reject Proposal"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
