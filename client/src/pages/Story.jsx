import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Leaf, Heart, Globe, ArrowRight } from "lucide-react";
import ProductNavbar from "../components/ProductNavbar.jsx";

const milestones = [
  {
    year: "2020",
    title: "The Beginning",
    description: "NOMAD. was founded with a simple idea: create clothing that moves with you, wherever life takes you.",
  },
  {
    year: "2021",
    title: "First Collection",
    description: "Launched our debut Winter Archive collection, featuring raw essentials crafted from sustainable materials.",
  },
  {
    year: "2022",
    title: "Going Global",
    description: "Expanded to 15 countries, bringing our vision of minimalist fashion to a worldwide audience.",
  },
  {
    year: "2023",
    title: "Sustainability First",
    description: "Committed to 100% sustainable sourcing, partnering with ethical manufacturers across the globe.",
  },
  {
    year: "2024",
    title: "Community Built",
    description: "Grew to over 100,000 loyal customers who share our passion for quality and conscious fashion.",
  },
  {
    year: "2026",
    title: "Raw Essence",
    description: "Introducing our most refined collection yet — Winter Archive 2026, where minimalism meets maximum impact.",
  },
];

const values = [
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Every piece is crafted with eco-friendly materials and ethical manufacturing practices.",
  },
  {
    icon: Heart,
    title: "Authentic",
    description: "We believe in honest fashion — no compromises on quality, no unnecessary embellishments.",
  },
  {
    icon: Globe,
    title: "Universal",
    description: "Designed for everyone, everywhere. Fashion that transcends borders and seasons.",
  },
  {
    icon: Sparkles,
    title: "Timeless",
    description: "Creating pieces that outlast trends, becoming staples in your wardrobe for years to come.",
  },
];

function Story() {
  const revealRef = useRef(null);

  useEffect(() => {
    const root = revealRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <ProductNavbar />

      <div ref={revealRef} className="min-h-screen bg-white text-black">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-[#faf7f1]/80 to-white/90" />

          <div className="relative px-4 sm:px-6 md:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-lime-700">
                <Sparkles className="h-3.5 w-3.5" />
                Our Story
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Our <span className="italic text-lime-700">Story</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base text-black/75 sm:text-lg">
                Born from a desire to create clothing that speaks without shouting.
                NOMAD. is more than fashion — it is a philosophy of living simply,
                sustainably, and authentically.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-black/85"
                >
                  Shop Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="border-t border-black/10 px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className="reveal">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
                    alt="Our mission"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              <div className="reveal space-y-6">
                <div className="inline-flex rounded-full border border-black/15 bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-black/80">
                  Our Mission
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Less, But Better
                </h2>
                <p className="leading-relaxed text-black/80">
                  In a world of excess, we choose intention. Every NOMAD. piece is designed
                  with purpose — to serve you season after season, journey after journey.
                  We believe that true style does not need to shout; it simply exists,
                  confidently and quietly.
                </p>
                <p className="leading-relaxed text-black/80">
                  Our commitment goes beyond aesthetics. We partner with manufacturers
                  who share our values, ensuring fair wages and safe working conditions.
                  We source materials that respect the planet, because the future of
                  fashion must be sustainable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="border-t border-black/10 px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center reveal">
              <div className="inline-flex rounded-full border border-black/15 bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-black/80">
                What Drives Us
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Our Values
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="reveal group rounded-2xl border border-black/15 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#faf7f1] hover:shadow-md"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="mb-4 inline-flex rounded-xl bg-lime-50 p-3 text-lime-700">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/75">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="border-t border-black/10 px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center reveal">
              <div className="inline-flex rounded-full border border-black/15 bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-black/80">
                Our Journey
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                The Timeline
              </h2>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute bottom-0 left-4 top-0 w-px bg-black/15 md:left-1/2 md:-translate-x-1/2" />

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`reveal relative flex items-start gap-6 md:gap-0 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 mt-2 h-3 w-3 rounded-full bg-lime-700 ring-4 ring-white md:left-1/2 md:-translate-x-1/2" />

                    {/* Content */}
                    <div className={`ml-10 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}>
                      <div className="rounded-2xl border border-black/15 bg-white p-6 shadow-sm transition-all duration-300 hover:bg-[#faf7f1] hover:shadow-md">
                        <span className="inline-flex rounded-full border border-lime-200 bg-lime-50 px-3 py-1 text-sm font-bold text-lime-700">
                          {milestone.year}
                        </span>
                        <h3 className="mt-1 text-xl font-semibold">{milestone.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-black/75">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="border-t border-black/10 px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-4xl text-center reveal">
            <div className="rounded-3xl border border-black/15 bg-white p-8 shadow-sm md:p-12">
              <blockquote className="text-2xl font-medium italic leading-relaxed text-black md:text-3xl">
                "Fashion is not something that exists in dresses only. Fashion is in the sky,
                in the street. Fashion has to do with ideas, the way we live, what is happening."
              </blockquote>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-black/30" />
                <span className="text-sm uppercase tracking-wide text-black/70">Coco Chanel</span>
                <div className="h-px w-8 bg-black/30" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 md:px-8 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="reveal rounded-3xl border border-black/15 bg-[#faf7f1] p-8 text-center shadow-sm md:p-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Join the Journey
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-black/75">
                Be part of the NOMAD. community. Discover clothing that moves with you,
                crafted for the modern explorer.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-black/85"
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#f5f1e8]"
                >
                  Back Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
}

export default Story;
