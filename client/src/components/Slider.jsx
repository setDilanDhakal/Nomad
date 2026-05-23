import React from "react";

function Marquee({
  children,
  className = "",
  duration = 20,
  pauseOnHover = false,
  direction = "left",
  fade = true,
  fadeAmount = 10,
  ...props
}) {
  const containerRef = React.useRef(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const items = React.Children.toArray(children);
  const contentRef = React.useRef(null);
  const [repeatCount, setRepeatCount] = React.useState(2);
  const [distance, setDistance] = React.useState(0);
  React.useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const cluster = contentRef.current;
      if (!container || !cluster) return;
      const clusterWidth = cluster.scrollWidth;
      const containerWidth = container.offsetWidth;
      const count = Math.max(2, Math.ceil(containerWidth / clusterWidth) + 2);
      setRepeatCount(count);
      setDistance(clusterWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children]);
  const isVertical = direction === "up" || direction === "down";
  return (
    <>
      <style>{`
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(calc(-1 * var(--scroll-distance, 0px))); } }
        @keyframes scroll-reverse { from { transform: translateX(calc(-1 * var(--scroll-distance, 0px))); } to { transform: translateX(0); } }
        @keyframes scroll-y { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes scroll-y-reverse { from { transform: translateY(-50%); } to { transform: translateY(0); } }
        .marquee-scroller { display: flex; animation: ${
          isVertical
            ? direction === "up"
              ? "scroll-y"
              : "scroll-y-reverse"
            : direction === "left"
            ? "scroll"
            : "scroll-reverse"
        } ${duration}s linear infinite; }
        .marquee-scroller.paused { animation-play-state: paused; }
      `}</style>
      <div
        ref={containerRef}
        className={`flex w-full overflow-hidden ${isVertical ? "flex-col" : ""} ${className}`}
        style={{
          ...(fade && {
            maskImage: isVertical
              ? `linear-gradient(to bottom, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`
              : `linear-gradient(to right, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`,
            WebkitMaskImage: isVertical
              ? `linear-gradient(to bottom, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`
              : `linear-gradient(to right, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`,
          }),
        }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        {...props}
      >
        <div
          className={`marquee-scroller flex shrink-0 ${isVertical ? "flex-col" : ""} ${
            isPaused ? "paused" : ""
          }`}
          style={{ "--scroll-distance": `${distance}px` }}
        >
          <div ref={contentRef} className={`flex shrink-0 ${isVertical ? "w-full" : ""}`}>
            {items.map((item, index) => (
              <div key={`cluster-0-${index}`} className={`flex shrink-0 ${isVertical ? "w-full" : ""}`}>
                {item}
              </div>
            ))}
          </div>
          {Array.from({ length: repeatCount - 1 }).map((_, rIndex) => (
            <div key={`cluster-${rIndex + 1}`} className={`flex shrink-0 ${isVertical ? "w-full" : ""}`}>
              {items.map((item, index) => (
                <div key={`cluster-${rIndex + 1}-${index}`} className={`flex shrink-0 ${isVertical ? "w-full" : ""}`}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Slide() {
  return (
    <div className="w-full bg-neon py-2 md:py-3">
      <Marquee duration={18} pauseOnHover direction="left" fade={false}>
        <span className="mx-8 text-black italic text-sm sm:text-base md:text-lg">
          RAW ESSENCE
        </span>
        <span className="mx-8 text-black italic text-sm sm:text-base md:text-lg">
          NOMAD.
        </span>
        <span className="mx-8 text-black italic text-sm sm:text-base md:text-lg">
          WINTER 2026
        </span>
        <span className="mx-8 text-black italic text-sm sm:text-base md:text-lg">
          COLLECTION
        </span>
      </Marquee>
    </div>
  );
}

export default Slide;

