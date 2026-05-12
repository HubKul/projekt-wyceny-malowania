"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function AdminInquiryDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    final_updated_amount: "",
    inquiry_status: "new"
  });

  useEffect(() => {
    fetchApi(`/inquiries/${id}/`)
      .then(data => {
        setInquiry(data);
        const est = data.estimations?.[0];
        if (est) {
          setForm({
            final_updated_amount: est.final_updated_amount || est.calculated_amount,
            inquiry_status: est.inquiry_status
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const estId = inquiry?.estimations?.[0]?.id;
    if (!estId) return;

    setSaving(true);
    try {
      await fetchApi(`/inquiries/${id}/update_estimation/`, {
        method: 'PATCH',
        body: JSON.stringify({
          final_updated_amount: form.final_updated_amount,
          inquiry_status: form.inquiry_status
        })
      });
      router.push('/admin');
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;
  }

  if (!inquiry) return <div className="text-center text-gray-500">Inquiry not found.</div>;

  const estimation = inquiry.estimations?.[0];

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Panel
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 h-fit">
          <h2 className="text-xl font-bold text-slate-200 mb-6">Inquiry Details</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-500 text-xs uppercase mb-1">Wall Area</div>
                <div className="text-lg font-medium tabular-nums">{inquiry.wall_surface_area} m²</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-500 text-xs uppercase mb-1">Ceiling Area</div>
                <div className="text-lg font-medium tabular-nums">{inquiry.ceiling_surface_area} m²</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-500 text-xs uppercase mb-1">Windows</div>
                <div className="text-lg font-medium tabular-nums">{inquiry.number_of_windows}</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-500 text-xs uppercase mb-1">Doors</div>
                <div className="text-lg font-medium tabular-nums">{inquiry.number_of_doors}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Selected Services</h3>
              <div className="flex flex-wrap gap-2">
                {inquiry.selected_additional_services.map((service: string) => (
                  <span key={service} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm capitalize">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            
            {estimation && (
              <div className="bg-teal-950/30 p-4 rounded-xl border border-teal-500/20">
                <div className="text-teal-400 text-xs font-semibold uppercase mb-1">System Calculated Amount</div>
                <div className="text-2xl font-bold tabular-nums text-teal-300">${estimation.calculated_amount}</div>
              </div>
            )}
          </div>
        </div>

        {estimation && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 h-fit">
            <h2 className="text-xl font-bold text-slate-200 mb-6">Update Estimation</h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Final Amount ($)</label>
                <input 
                  type="number" step="0.01" required
                  value={form.final_updated_amount}
                  onChange={e => setForm({...form, final_updated_amount: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums text-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                <select 
                  value={form.inquiry_status}
                  onChange={e => setForm({...form, inquiry_status: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 capitalize"
                >
                  <option value="new">New</option>
                  <option value="estimated">Estimated</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-teal-500 text-slate-950 font-semibold py-4 rounded-xl hover:bg-teal-400 transition-colors flex justify-center items-center gap-2 h-14"
              >
                {saving ? <Loader2 className="animate-spin w-6 h-6" /> : <><Save className="w-5 h-5" /> Save Changes</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
