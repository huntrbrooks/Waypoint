import { FormEvent, useState } from "react";
import { isDemoMode } from "../lib/supabase";

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState("admin@waypoint.app");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      await onLogin(email, password);
    } catch {
      setError(isDemoMode ? "Use admin@waypoint.app / demo1234 for local demo mode." : "Unable to sign in with those credentials.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-6 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-[#10213A] p-8 shadow-2xl">
        <div className="text-4xl font-black tracking-[0.25em]">WAYPOINT</div>
        <p className="mt-3 text-slate-300">Facilities command access</p>
        {isDemoMode && <p className="mt-4 rounded-xl bg-blue/10 p-3 text-sm text-blue-100">Local demo mode is active until Supabase env vars are configured.</p>}
        <label className="mt-8 block text-sm font-bold text-slate-300">Email</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-blue"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
        />
        <label className="mt-4 block text-sm font-bold text-slate-300">Password</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-blue"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
        />
        {error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        <button className="mt-6 w-full rounded-xl bg-blue px-4 py-3 font-black text-white">SIGN IN</button>
      </form>
    </main>
  );
};
