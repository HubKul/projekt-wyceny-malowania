"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { Plus, ChevronRight, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/inquiries/')
      .then(data => setInquiries(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-400 font-serif">Moje zgłoszenia</h1>
        <Link
          href="/dashboard/new"
          className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Nowe zgłoszenie
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white border border-orange-200 rounded-xl p-12 text-center shadow-sm">
          <p className="text-gray-500 mb-4">Nie masz jeszcze żadnych zgłoszeń.</p>
          <Link href="/dashboard/new" className="text-orange-500 font-semibold hover:text-orange-600">Utwórz pierwsze zgłoszenie &rarr;</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inq: any) => {
            const estimation = inq.estimations?.[0];
            return (
              <div key={inq.id} className="bg-orange-50 border border-orange-200 rounded-xl overflow-hidden hover:border-orange-400 transition-colors shadow-sm group">
                <Link
                  href={`/dashboard/inquiries/${inq.id}`}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 block"
                >
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Zgłoszono {new Date(inq.submission_date).toLocaleDateString()}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {inq.wall_surface_area}m² Ściany &bull; {inq.ceiling_surface_area}m² Sufit
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {estimation && (
                      <div className="text-right">
                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${estimation.inquiry_status === 'accepted' ? 'text-green-600' :
                          estimation.inquiry_status === 'rejected' ? 'text-orange-500' :
                            'text-gray-500'
                          }`}>
                          {estimation.inquiry_status}
                        </div>
                        <div className="font-bold text-gray-900 tabular-nums text-lg">
                          ${estimation.final_updated_amount || estimation.calculated_amount}
                        </div>
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors hidden sm:block" />
                  </div>
                </Link>
                {estimation?.inquiry_status === 'accepted' && (
                  <div className="bg-green-50 border-t border-green-100 text-green-700 px-6 py-4 text-sm font-medium">
                    Zgłoszenie zaakceptowane. Nasz przedstawiciel skontaktuje się z Tobą pod podanym numerem telefonu w ciągu najbliższych dni, aby omówić szczegóły.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
