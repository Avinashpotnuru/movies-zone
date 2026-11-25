const Stat = ({ label, value, accent }) => (
  <div className="border-l border-white/10 px-4 first:border-l-0 first:pl-0">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
      {label}
    </p>
    <p
      className={`mt-1.5 text-sm font-bold leading-snug ${
        accent ? "text-[#51E5FF]" : "text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

export default Stat;
