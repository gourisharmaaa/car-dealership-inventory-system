import React, { useMemo, useState } from "react";

export default function PurchaseModal({ vehicle, onClose, onConfirm, loading }) {
  const [qty, setQty] = useState(1);

  const total = useMemo(() => {
    const price = Number(vehicle?.price) || 0;
    return (price * (Number(qty) || 0)).toFixed(2);
  }, [vehicle, qty]);

  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Purchase {vehicle.make} {vehicle.model}</h3>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-600">Category: {vehicle.category}</p>
            <p className="text-sm text-slate-600">Price: ${Number(vehicle.price || 0).toFixed(2)}</p>
            <p className="text-sm text-slate-600">In stock: {vehicle.quantity}</p>
          </div>
          <div>
            <label className="text-sm text-slate-600">Quantity</label>
            <input
              type="number"
              min="1"
              max={vehicle.quantity}
              value={qty}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setQty(Number.isFinite(v) && v > 0 ? v : 1);
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2"
            />
            <p className="mt-2 text-slate-700">Total: <strong>${total}</strong></p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl px-4 py-2">Cancel</button>
          <button
            onClick={() => onConfirm(qty)}
            disabled={loading || qty <= 0 || qty > vehicle.quantity}
            className="rounded-xl bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Processing..." : `Purchase ${qty}`}
          </button>
        </div>
      </div>
    </div>
  );
}
