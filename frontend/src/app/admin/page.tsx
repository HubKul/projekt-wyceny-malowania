"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, X, Save } from "lucide-react";

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    final_updated_amount: "",
    inquiry_status: "new"
  });

  useEffect(() => {
    fetchApi('/inquiries/')
      .then(data => setInquiries(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleOpenDetails = (inq: any) => {
    setSelectedInquiry(inq);
    const est = inq.estimations?.[0];
    if (est) {
      setForm({
        final_updated_amount: est.final_updated_amount || est.calculated_amount,
        inquiry_status: est.inquiry_status
      });
    } else {
      setForm({ final_updated_amount: "", inquiry_status: "new" });
    }
  };

  const handleCloseDetails = () => {
    setSelectedInquiry(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    
    setSaving(true);
    try {
      const updatedEstimation = await fetchApi(`/inquiries/${selectedInquiry.id}/update_estimation/`, {
        method: 'PATCH',
        body: JSON.stringify({
          final_updated_amount: form.final_updated_amount,
          inquiry_status: form.inquiry_status
        })
      });
      
      setInquiries(prev => prev.map(inq => {
        if (inq.id === selectedInquiry.id) {
          return {
            ...inq,
            estimations: [updatedEstimation]
          };
        }
        return inq;
      }));
      handleCloseDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <h1 className="text-2xl font-bold text-orange-400 font-serif">Zlecenia</h1>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white border border-orange-200 rounded-xl p-12 text-center shadow-sm">
          <p className="text-gray-500">Brak zleceń.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inq: any) => {
            const estimation = inq.estimations?.[0];
            return (
              <div key={inq.id} className="bg-orange-50 border border-orange-200 rounded-xl overflow-hidden hover:border-orange-400 transition-colors shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Złożono {new Date(inq.submission_date).toLocaleDateString()}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {inq.wall_surface_area}m² Ściany &bull; {inq.ceiling_surface_area}m² Sufit
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Numer zlecenia #{inq.id}</div>
                </div>
                <div className="flex items-center gap-6">
                  {estimation && (
                    <div className="text-right">
                      <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                        estimation.inquiry_status === 'accepted' ? 'text-green-600' :
                        estimation.inquiry_status === 'rejected' ? 'text-orange-500' :
                        'text-gray-500'
                      }`}>
                        {estimation.inquiry_status}
                      </div>
                      <div className="font-bold text-gray-900 tabular-nums text-lg">
                        PLN {estimation.final_updated_amount || estimation.calculated_amount}
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => handleOpenDetails(inq)}
                    className="bg-orange-500 text-white font-medium text-sm transition-colors px-4 py-2 rounded-lg hover:bg-orange-600 cursor-pointer"
                  >
                    Szczegóły
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 bg-orange-50 border-b border-orange-200 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-orange-400 font-serif">Szczegóły zgłoszenia #{selectedInquiry.id}</h2>
              <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700 transition-colors p-1 bg-white rounded-full hover:bg-gray-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Dane Kontaktowe</h3>
                <div className="bg-white p-4 rounded-xl border border-orange-200 flex flex-col md:flex-row gap-4 md:gap-8">
                  <div>
                    <div className="text-gray-500 text-xs uppercase mb-1">Adres</div>
                    <div className="text-sm font-medium text-gray-900">{selectedInquiry.client_address || '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase mb-1">Numer telefonu</div>
                    <div className="text-sm font-medium text-gray-900">{selectedInquiry.client_phone || '-'}</div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Parametry Pomieszczenia</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-orange-200">
                    <div className="text-gray-500 text-xs uppercase mb-1">Powierzchnia Ścian</div>
                    <div className="text-lg font-medium tabular-nums text-gray-900">{selectedInquiry.wall_surface_area} m²</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-orange-200">
                    <div className="text-gray-500 text-xs uppercase mb-1">Powierzchnia Sufitu</div>
                    <div className="text-lg font-medium tabular-nums text-gray-900">{selectedInquiry.ceiling_surface_area} m²</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-orange-200">
                    <div className="text-gray-500 text-xs uppercase mb-1">Liczba okien</div>
                    <div className="text-lg font-medium tabular-nums text-gray-900">{selectedInquiry.number_of_windows}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-orange-200">
                    <div className="text-gray-500 text-xs uppercase mb-1">Liczba drzwi</div>
                    <div className="text-lg font-medium tabular-nums text-gray-900">{selectedInquiry.number_of_doors}</div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Wybrane Usługi Dodatkowe</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInquiry.selected_additional_services.map((service: string) => (
                    <span key={service} className="bg-white text-gray-700 px-3 py-1 rounded-lg text-sm capitalize border border-orange-200">
                      {service}
                    </span>
                  ))}
                </div>
              </section>

              {selectedInquiry.estimations?.[0] && (
                <section className="bg-white p-6 rounded-xl border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-600 mb-4 font-serif">Aktualna oferta</h3>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Finalna suma (PLN)</label>
                        <input 
                          type="number" step="0.01" required
                          disabled={['accepted', 'rejected'].includes(selectedInquiry.estimations[0].inquiry_status)}
                          value={form.final_updated_amount}
                          onChange={e => setForm({...form, final_updated_amount: e.target.value})}
                          className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 tabular-nums disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                          disabled={['accepted', 'rejected'].includes(selectedInquiry.estimations[0].inquiry_status)}
                          value={form.inquiry_status}
                          onChange={e => setForm({...form, inquiry_status: e.target.value})}
                          className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 capitalize disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="new">Nowe</option>
                          <option value="estimated">Wyceniono</option>
                          <option value="accepted">Zaakceptowane</option>
                          <option value="rejected">Odrzucone</option>
                        </select>
                      </div>
                    </div>
                    {!['accepted', 'rejected'].includes(selectedInquiry.estimations[0].inquiry_status) && (
                      <button 
                        type="submit" 
                        disabled={saving}
                        className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors flex justify-center items-center gap-2 mt-4 cursor-pointer"
                      >
                        {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-4 h-4" /> Zapisz Zmiany</>}
                      </button>
                    )}
                  </form>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
