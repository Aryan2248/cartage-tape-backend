import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getCurrentUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const loginRes = await loginUser(form);
      const token = loginRes.data.token;
      
      localStorage.setItem("token", token);
      const userRes = await getCurrentUser();
      
      login(token, userRes.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("ONGC Authentication Error:", err);
      alert("Invalid Security Credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 antialiased font-sans relative"
      style={{
        backgroundColor: "#f8fafc",
        backgroundImage: `
          linear-gradient(135deg, rgba(128, 0, 0, 0.04) 0%, transparent 100%),
          radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(128, 0, 0, 0.03) 0%, transparent 50%),
          linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 24px 24px, 24px 24px",
      }}
    >

      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-900 via-amber-500 to-red-950"></div>

      <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] overflow-hidden border border-slate-200/80 z-10">
        
        {/* Official ONGC Logo */}
        <div className="bg-red-900 text-white p-6 flex flex-col items-center justify-center border-b-4 border-amber-500">
          <div className="bg-white rounded-xl p-2 shadow-sm h-20 w-20 flex items-center justify-center select-none mb-3">
            <img 
              src="/ongc-logo.png" 
              alt="ONGC Logo" 
              className="h-full w-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span class="text-red-900 font-black text-xl tracking-tighter">ONGC</span>';
              }}
            />
          </div>
          <h2 className="text-lg font-bold tracking-wider uppercase text-center text-slate-100">
            Oil and Natural Gas Corporation
          </h2>
          <p className="text-[11px] text-red-200 uppercase tracking-widest mt-0.5">
            Inventory Management Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Official Email Address
            </label>
            <input
              type="email"
              placeholder="name@ongc.co.in"
              className="w-full border border-slate-300 p-3 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-900 focus:border-red-900 focus:outline-none transition-all"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-300 p-3 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-900 focus:border-red-900 focus:outline-none transition-all font-mono"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-900 hover:bg-red-800 disabled:bg-slate-400 text-white p-3 font-semibold rounded-lg shadow-sm transition-colors tracking-wide text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900"
          >
            {isSubmitting ? "Authenticating Session..." : "Secure Login"}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6 max-w-sm z-10">
        Authorized ONGC Personnel Only. Actions on this platform are monitored and audited under enterprise security guidelines.
      </p>
    </div>
  );
};

export default Login;