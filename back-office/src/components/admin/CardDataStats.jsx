const CardDataStats = ({ title, total, unit, children }) => {
  const display =
    total === undefined || total === null || total === "" ? "—" : total;

  return (
    <div className="panel group p-6 transition-colors hover:border-klein/40">
      <div className="flex items-start justify-between gap-4">
        <p className="label-cap">{title}</p>
        <span className="text-lg text-stone transition-colors group-hover:text-klein">
          {children}
        </span>
      </div>

      <p className="mt-5 font-display text-4xl font-bold leading-none tabular-nums text-ink">
        {display}
        {unit && display !== "—" && (
          <span className="ml-1.5 font-sans text-base font-semibold text-stone">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
};

export default CardDataStats;
