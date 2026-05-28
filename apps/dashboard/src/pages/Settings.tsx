export const Settings = () => {
  return (
    <section>
      <h1 className="text-4xl font-black text-white">Settings</h1>
      <p className="mt-2 text-slate-300">Plan, billing, and integration controls for the demo workspace.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">Current plan</div>
          <div className="mt-4 text-4xl font-black text-white">Professional</div>
          <div className="mt-2 text-slate-300">$349/mo · 25 buildings · advanced evacuation analytics</div>
          <button className="mt-6 rounded-xl bg-blue px-5 py-3 font-black text-white">Manage Billing</button>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#10213A] p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">API key</div>
          <div className="mt-4 rounded-xl bg-navy p-4 font-mono text-blue">wp_live_demo_9f83a72c_precise</div>
          <p className="mt-4 text-slate-300">Use this demo key for internal facility system integrations.</p>
        </div>
      </div>
    </section>
  );
};
