
import { Link } from "react-router-dom";
import Navbar from "./Navbar";


function Hero() {
  return (
    <div className="relative bg-[url('https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat">

      <div className="absolute inset-x-0 top-0 h-24 md:h-40 bg-gradient-to-b from-black/90 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 h-24 md:h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
      <Navbar />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4 pt-20 pb-12 text-center md:min-h-[80vh] md:gap-4 md:px-8 md:pt-28 md:pb-16">
        
        <p
          className="text-white text-xs sm:text-sm md:text-base tracking-[0.1em]"
          style={{ letterSpacing: "clamp(0.1rem, 1.5vw, 0.5rem)" }}
        >
          WINTER ARCHIEVE 2026
        </p>
        <p className="text-white italic text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
          RAW
        </p>
        <p
          className="italic text-5xl hover:text-neon sm:text-7xl md:text-8xl lg:text-9xl"
          style={{
            WebkitTextStroke: "clamp(0.3px, 0.15vw, 1.5px) white",
            letterSpacing: "clamp(1rem, 4vw, 3rem)",
            color: "transparent",
          }}
        >
          ESSENCE
        </p>
        <div className="mt-6 text-sm md:mt-8">
          <div className="lg:hidden">
            <div className="flex items-center justify-center gap-2">
              <Link
                to="/product"
                className="hero-cta inline-block bg-neon px-6 py-2 text-black transition-transform duration-300 ease-out hover:scale-105 hover:border-neon md:px-8 md:py-3"
              >
                Shop Collection
              </Link>
              <Link
                to="/story"
                className="hero-cta inline-block border border-neon px-6 py-2 text-neon transition-transform duration-300 ease-out hover:scale-105 hover:border-neon md:px-8 md:py-3"
              >
                LookBook
              </Link>
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to="/product"
              className="hero-cta inline-block bg-neon px-6 py-2 text-black transition-transform duration-300 ease-out hover:scale-105 hover:border-neon md:px-8 md:py-3"
            >
              Shop Collection
            </Link>
            <Link
              to="/story"
              className="hero-cta inline-block border border-neon px-10 py-2 text-neon transition-transform duration-300 ease-out hover:scale-105 hover:border-neon md:px-8 md:py-3"
            >
              LookBook
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
