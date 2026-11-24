const LoadingRing = ({ label = "Loading" }) => (
  <div
    className="flex min-h-[70vh] items-center justify-center bg-[#04152d]"
    role="status"
    aria-label={label}
  >
    <svg
      className="h-20 w-20 animate-spin"
      viewBox="0 0 80 80"
      aria-hidden="true"
    >
      <circle
        cx="40"
        cy="40"
        r="32"
        fill="none"
        stroke="#F4442E"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <circle
        cx="40"
        cy="40"
        r="32"
        fill="none"
        stroke="#51E5FF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="150 201"
      />
    </svg>
    <span className="sr-only">{label}</span>
  </div>
);

export default LoadingRing;
