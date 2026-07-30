import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, setApiToken, fetchCurrentUser } from "../services/api";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await loginUser({ email, password });
      const token = response.data.access_token;
      localStorage.setItem("car_dealership_token", token);
      setApiToken(token);
      const profileResponse = await fetchCurrentUser();
      localStorage.setItem("car_dealership_user_role", profileResponse.data.role);
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError("Invalid credentials. If you don't have an account, please register first.");
      } else if (status === 422) {
        setError("Please provide a valid email and password.");
      } else {
        setError(err.response?.data?.detail || "Unable to log in.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-sky-500 focus:ring-sky-500"
              required
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-sky-500 focus:ring-sky-500"
              required
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-sky-600 px-4 py-3 text-white hover:bg-sky-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-sky-600">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
