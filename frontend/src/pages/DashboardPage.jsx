import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  addVehicle,
  deleteVehicle,
  fetchVehicles,
  purchaseVehicle,
  restockVehicle,
  searchVehicles,
  setApiToken,
  fetchCurrentUser,
} from "../services/api";
import Loader from "../components/Loader";
import PurchaseModal from "../components/PurchaseModal";

function DashboardPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filter, setFilter] = useState({ make: "", model: "", category: "" });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [restockCounts, setRestockCounts] = useState({});
  const [purchaseVehicleSelected, setPurchaseVehicleSelected] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("car_dealership_token");
    if (token) {
      setApiToken(token);
      loadVehicles();
      fetchCurrentUser().then((response) => {
        setIsAdmin(response.data.role === "admin");
      }).catch(() => {
        setIsAdmin(false);
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadVehicles = async () => {
    try {
      const response = await fetchVehicles();
      setVehicles(response.data);
      // reset restock counters
      const initialCounts = {};
      response.data.forEach((v) => { initialCounts[v.id] = 0; });
      setRestockCounts(initialCounts);
      setError(null);
    } catch (err) {
      const msg = getErrorMessage(err, "Unable to load vehicles.");
      setError(msg);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsSearching(true);
    try {
      const params = {
        make: filter.make || undefined,
        model: filter.model || undefined,
        category: filter.category || undefined,
        min_price: priceRange.min || undefined,
        max_price: priceRange.max || undefined,
      };
      const response = await searchVehicles(params);
      setVehicles(response.data);
    } catch (err) {
      const msg = getErrorMessage(err, "Search failed.");
      setError(msg);
    } finally {
      setIsSearching(false);
    }
  };

  const openPurchaseModal = (vehicle) => setPurchaseVehicleSelected(vehicle);

  const confirmPurchase = async (quantity) => {
    if (!purchaseVehicleSelected) return;
    setPurchaseLoading(true);
    try {
      await purchaseVehicle(purchaseVehicleSelected.id, quantity);
      setSuccess("Purchase successful.");
      setTimeout(() => setSuccess(null), 2000);
      setPurchaseVehicleSelected(null);
      await loadVehicles();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("purchase error", err);
      const msg = getErrorMessage(err, "Unable to purchase vehicle.");
      setError(msg);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVehicle(id);
      setSuccess("Vehicle deleted.");
      setTimeout(() => setSuccess(null), 2000);
      setVehicles((current) => current.filter((vehicle) => vehicle.id !== id));
    } catch (err) {
      const msg = getErrorMessage(err, "Unable to delete vehicle.");
      setError(msg);
    }
  };

  const handleRestock = async (id) => {
    const qty = restockCounts[id] || 0;
    if (qty <= 0) return;
    try {
      setIsAdding(true);
      await restockVehicle(id, qty);
      setSuccess("Restock successful.");
      setTimeout(() => setSuccess(null), 2000);
      await loadVehicles();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("restock error", err);
      const msg = getErrorMessage(err, "Unable to restock vehicle.");
      setError(msg);
    } finally {
      setIsAdding(false);
      setRestockCounts((c) => ({ ...c, [id]: 0 }));
    }
  };

  const handleAddVehicle = async (event) => {
    event.preventDefault();
    try {
      setIsAdding(true);
      const payload = {
        make: newVehicle.make,
        model: newVehicle.model,
        category: newVehicle.category,
        price: Number(newVehicle.price),
        quantity: Number(newVehicle.quantity),
      };
      // if exact match exists, call restock instead of creating duplicate
      const existing = vehicles.find(
        (v) => v.make === payload.make && v.model === payload.model && v.category === payload.category && Number(v.price) === Number(payload.price),
      );
      if (existing) {
        await restockVehicle(existing.id, payload.quantity);
        setSuccess("Existing vehicle updated with additional stock.");
      } else {
        await addVehicle(payload);
        setSuccess("Vehicle added successfully.");
      }
      setTimeout(() => setSuccess(null), 2000);
      setNewVehicle({ make: "", model: "", category: "", price: "", quantity: "" });
      await loadVehicles();
    } catch (err) {
      const msg = getErrorMessage(err, "Unable to add vehicle.");
      setError(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const formatApiError = (detail) => {
    if (!detail) return null;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((d) => {
          if (!d) return "";
          if (typeof d === "string") return d;
          if (d.msg) return d.msg;
          if (d.message) return d.message;
          return JSON.stringify(d);
        })
        .filter(Boolean)
        .join(" | ");
    }
    if (typeof detail === "object") {
      return detail.detail || detail.message || Object.values(detail).join(" ");
    }
    return String(detail);
  };

  const getErrorMessage = (err, fallback) => {
    const detail = err?.response?.data?.detail;
    const formatted = formatApiError(detail);
    return formatted || err?.message || fallback;
  };

  const handleLogout = () => {
    localStorage.removeItem("car_dealership_token");
    navigate("/login");
  };

  const canAddVehicle = useMemo(
    () => isAdmin && newVehicle.make && newVehicle.model && newVehicle.category && newVehicle.price && newVehicle.quantity,
    [isAdmin, newVehicle],
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-md md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Dealership Inventory</h1>
            <p className="mt-2 text-slate-600">Browse vehicles, purchase stock, and manage inventory.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-700"
          >
            Logout
          </button>
        </header>

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-900">Search vehicles</h2>
          <form onSubmit={handleSearch} className="mt-4 grid gap-4 md:grid-cols-4">
            <input
              value={filter.make}
              onChange={(event) => setFilter((current) => ({ ...current, make: event.target.value }))}
              placeholder="Make"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              value={filter.model}
              onChange={(event) => setFilter((current) => ({ ...current, model: event.target.value }))}
              placeholder="Model"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              value={filter.category}
              onChange={(event) => setFilter((current) => ({ ...current, category: event.target.value }))}
              placeholder="Category"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={priceRange.min}
                onChange={(event) => setPriceRange((current) => ({ ...current, min: event.target.value }))}
                placeholder="Min price"
                type="number"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={priceRange.max}
                onChange={(event) => setPriceRange((current) => ({ ...current, max: event.target.value }))}
                placeholder="Max price"
                type="number"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-sky-600 px-6 py-3 text-white hover:bg-sky-700 md:col-span-4"
            >
              {isSearching ? <Loader message="Searching..." /> : "Search"}
            </button>
          </form>
        </section>

        {error && <p className="mb-4 rounded-2xl bg-red-50 p-4 text-red-700">{error}</p>}
        {success && <p className="mb-4 rounded-2xl bg-emerald-50 p-4 text-emerald-700">{success}</p>}

        {isAdmin && (
          <section className="mb-8 rounded-3xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-semibold text-slate-900">Add a new vehicle</h2>
            <form onSubmit={handleAddVehicle} className="mt-4 grid gap-4 md:grid-cols-5">
              <input
                value={newVehicle.make}
                onChange={(event) => setNewVehicle((current) => ({ ...current, make: event.target.value }))}
                placeholder="Make"
                className="rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <input
                value={newVehicle.model}
                onChange={(event) => setNewVehicle((current) => ({ ...current, model: event.target.value }))}
                placeholder="Model"
                className="rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <input
                value={newVehicle.category}
                onChange={(event) => setNewVehicle((current) => ({ ...current, category: event.target.value }))}
                placeholder="Category"
                className="rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <input
                value={newVehicle.price}
                onChange={(event) => setNewVehicle((current) => ({ ...current, price: event.target.value }))}
                placeholder="Price"
                type="number"
                className="rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <input
                value={newVehicle.quantity}
                onChange={(event) => setNewVehicle((current) => ({ ...current, quantity: event.target.value }))}
                placeholder="Quantity"
                type="number"
                className="rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <button
                type="submit"
                className="rounded-2xl bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700 md:col-span-5 disabled:opacity-60"
                disabled={!canAddVehicle || isAdding}
              >
                {isAdding ? <Loader message="Saving..." /> : "Add vehicle"}
              </button>
            </form>
          </section>
        )}

        <section className="rounded-3xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-900">Available vehicles</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="rounded-3xl border border-slate-200 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-sm text-slate-500">{vehicle.category}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {vehicle.quantity} in stock
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-xl font-semibold text-slate-900">${(Number(vehicle.price) || 0).toFixed(2)}</p>
                  <button
                    onClick={() => openPurchaseModal(vehicle)}
                    disabled={vehicle.quantity === 0}
                    className="rounded-xl bg-sky-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Purchase
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  {isAdmin ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRestockCounts((c) => ({ ...c, [vehicle.id]: Math.max(0, (c[vehicle.id] || 0) - 1) }))}
                          className="rounded-full border border-slate-200 px-3 py-1"
                        >
                          -
                        </button>
                        <div className="px-3">{restockCounts[vehicle.id] || 0}</div>
                        <button
                          onClick={() => setRestockCounts((c) => ({ ...c, [vehicle.id]: (c[vehicle.id] || 0) + 1 }))}
                          className="rounded-full border border-slate-200 px-3 py-1"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRestock(vehicle.id)}
                        disabled={(restockCounts[vehicle.id] || 0) <= 0}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="rounded-xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
        {purchaseVehicleSelected && (
          <PurchaseModal
            vehicle={purchaseVehicleSelected}
            onClose={() => setPurchaseVehicleSelected(null)}
            onConfirm={confirmPurchase}
            loading={purchaseLoading}
          />
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
