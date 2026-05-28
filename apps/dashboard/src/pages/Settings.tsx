export const Settings = () => {
  return (
    <section>
      <h1 className="text-3xl font-black text-white sm:text-4xl">Settings</h1>
      <p className="mt-2 max-w-2xl text-slate-300">Plan, billing, and integration controls for the workspace.</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-5 sm:p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">Current plan</div>
          <div className="mt-4 break-words text-3xl font-black text-white sm:text-4xl">Professional</div>
          <div className="mt-2 text-slate-300">$349/mo · 25 buildings · advanced evacuation analytics</div>
          <button disabled className="mt-6 min-h-11 w-full rounded-xl bg-blue px-5 py-3 font-black text-white opacity-50 sm:w-auto">
            Billing not connected
          </button>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-5 sm:p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">API access</div>
          <div className="mt-4 rounded-xl bg-navy p-4 font-mono text-base text-blue [overflow-wrap:anywhere]">Not configured</div>
          <p className="mt-4 text-slate-300">Connect a server-managed API key workflow before enabling facility system integrations.</p>
        </div>
      </div>
    </section>
  );
};
