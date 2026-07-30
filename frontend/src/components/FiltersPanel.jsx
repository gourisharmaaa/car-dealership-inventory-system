import React, { useMemo, useState } from "react";

export default function FiltersPanel({ vehicles = [], initial = {}, onApply, onReset }) {
  const [filters, setFilters] = useState({
    make: initial.make || "",
    model: initial.model || "",
    category: initial.category || "",
    minPrice: initial.minPrice || "",
    maxPrice: initial.maxPrice || "",
  });

  const options = useMemo(() => {
    const makes = new Set();
    const models = new Set();
    const categories = new Set();
    vehicles.forEach((v) => {
      if (v.make) makes.add(v.make);
      if (v.model) models.add(v.model);
      if (v.category) categories.add(v.category);
    });
    return {
      makes: Array.from(makes).sort(),
      models: Array.from(models).sort(),
      categories: Array.from(categories).sort(),
    };
  }, [vehicles]);

  const handleApply = (e) => {
    e.preventDefault();
    onApply?.(filters);
  };

  const handleReset = () => {
    setFilters({ make: "", model: "", category: "", minPrice: "", maxPrice: "" });
    onReset?.();
  };

  return (
    <form onSubmit={handleApply} className="grid gap-3 md:grid-cols-5">
      <select
        value={filters.make}
        onChange={(e) => setFilters((s) => ({ ...s, make: e.target.value }))}
        className="rounded-2xl border border-slate-200 px-4 py-3"
      >
        <option value="">All makes</option>
        {options.makes.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select
        value={filters.model}
        onChange={(e) => setFilters((s) => ({ ...s, model: e.target.value }))}
        className="rounded-2xl border border-slate-200 px-4 py-3"
      >
        <option value="">All models</option>
        {options.models.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select
        value={filters.category}
        onChange={(e) => setFilters((s) => ({ ...s, category: e.target.value }))}
        className="rounded-2xl border border-slate-200 px-4 py-3"
      >
        <option value="">All categories</option>
        {options.categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <input
        value={filters.minPrice}
        onChange={(e) => setFilters((s) => ({ ...s, minPrice: e.target.value }))}
        placeholder="Min price"
        type="number"
        className="rounded-2xl border border-slate-200 px-4 py-3"
      />
      <input
        value={filters.maxPrice}
        onChange={(e) => setFilters((s) => ({ ...s, maxPrice: e.target.value }))}
        placeholder="Max price"
        type="number"
        className="rounded-2xl border border-slate-200 px-4 py-3"
      />

      <div className="flex gap-2 md:col-span-5">
        <button type="submit" className="rounded-2xl bg-sky-600 px-6 py-3 text-white hover:bg-sky-700">Apply</button>
        <button type="button" onClick={handleReset} className="rounded-2xl border border-slate-200 px-6 py-3">Reset</button>
      </div>
    </form>
  );
}
