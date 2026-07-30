import React, { useState } from "react";

export default function EditVehicleModal({ vehicle, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    make: vehicle.make || "",
    model: vehicle.model || "",
    category: vehicle.category || "",
    price: vehicle.price || 0,
  });

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    await onSave?.(vehicle.id, payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit vehicle</h3>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>
        <form onSubmit={handleSave} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col">
            <span className="text-sm text-slate-600">Make</span>
            <input value={form.make} onChange={handleChange("make")} className="rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-slate-600">Model</span>
            <input value={form.model} onChange={handleChange("model")} className="rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-slate-600">Category</span>
            <input value={form.category} onChange={handleChange("category")} className="rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-slate-600">Price</span>
            <input value={form.price} onChange={handleChange("price")} type="number" className="rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <div className="mr-auto text-sm text-slate-600">Quantity: <strong className="ml-1">{vehicle.quantity}</strong></div>
            <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-6 py-3">Cancel</button>
            <button type="submit" className="rounded-2xl bg-emerald-600 px-6 py-3 text-white" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
