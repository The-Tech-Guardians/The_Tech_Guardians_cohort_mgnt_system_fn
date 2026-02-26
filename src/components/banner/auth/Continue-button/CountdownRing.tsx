interface CountdownRingProps {
  timeLeft: number;
  total?: number;
  radius?: number;
}

export default function CountdownRing({
  timeLeft,
  total = 30,
  radius = 26,
}: CountdownRingProps) {
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * timeLeft) / total;
  const size = (radius + 2) * 2; 

  const color =
    timeLeft <= 10 ? "#EF4444" : timeLeft <= 20 ? "#F59E0B" : "#4F46E5";

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="4"
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
      </svg>

     
      <div
        className="absolute inset-0 flex items-center justify-center text-sm font-extrabold"
        style={{ color }}
        aria-live="polite"
        aria-label={`${timeLeft} seconds remaining`}
      >
        {timeLeft}
      </div>
    </div>
  );
}