import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Info, Mail, MapPin, Phone, ArrowRight, Shield, Truck, RefreshCw } from "lucide-react";
import ProductNavbar from "../components/ProductNavbar.jsx";

const features = [
  {
    icon: Shield,
    title: "Quality First",
    description: "Every garment undergoes rigorous quality checks before reaching your doorstep.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Free delivery on all orders. Express options available for urgent needs.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free returns. Your satisfaction is our priority.",
  },
];

const stats = [
  { value: "100K+", label: "Happy Customers" },
  { value: "50+", label: "Countries Served" },
  { value: "500+", label: "Products" },
  { value: "99%", label: "Satisfaction Rate" },
];

function About() {
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
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba6877a4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-[#faf7f1]/80 to-white/90" />

          <div className="relative px-4 sm:px-6 md:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-lime-700">
                <Info className="h-3.5 w-3.5" />
                About Us
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Who We <span className="italic text-lime-700">Are</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base text-black/75 sm:text-lg">
                NOMAD. is a contemporary fashion brand dedicated to creating timeless,
                sustainable clothing for the modern individual. We believe in quality
                over quantity, and style over trends.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t border-black/10 px-4 py-12 sm:px-6 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="reveal rounded-2xl border border-black/15 bg-white p-6 text-center shadow-sm"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="text-3xl font-bold text-lime-700 md:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-black/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="border-t border-black/10 px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className="reveal space-y-6">
                <div className="inline-flex rounded-full border border-black/15 bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-black/80">
                  What We Do
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Crafted for the Modern Explorer
                </h2>
                <p className="leading-relaxed text-black/80">
                  At NOMAD., we design clothing that adapts to your lifestyle. From
                  bustling city streets to quiet mountain retreats, our pieces are
                  built to move with you. Each collection is thoughtfully curated to
                  provide versatile essentials that work together seamlessly.
                </p>
                <p className="leading-relaxed text-black/80">
                  Our design philosophy centers on three pillars: functionality,
                  sustainability, and timeless aesthetics. We do not follow fast
                  fashion trends. Instead, we create garments that remain relevant
                  season after season.
                </p>
                <Link
                  to="/product"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
                  className="inline-flex items-center gap-2 font-semibold text-lime-700 hover:underline"
                >
                  View Our Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="reveal">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop"
                    alt="Our craft"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-black/10 px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12 reveal">
              <div className="inline-flex rounded-full border border-black/15 bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-black/80">
                Why Choose Us
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                The NOMAD. Difference
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="reveal group rounded-2xl border border-black/15 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#faf7f1] hover:shadow-md"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="mx-auto mb-4 inline-flex rounded-xl bg-lime-50 p-4 text-lime-700">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/75">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="border-t border-black/10 px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12 reveal">
              <div className="inline-flex rounded-full border border-black/15 bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-black/80">
                Get In Touch
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Contact Us
              </h2>
              <p className="mt-4 text-black/75">
                Have questions? We would love to hear from you.
              </p>
            </div>

            <div className="reveal grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/15 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 inline-flex rounded-xl bg-lime-50 p-3 text-lime-700">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-black">Email</h3>
                <p className="mt-1 text-sm text-black/70">hello@nomad.com</p>
              </div>

              <div className="rounded-2xl border border-black/15 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 inline-flex rounded-xl bg-lime-50 p-3 text-lime-700">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-black">Phone</h3>
                <p className="mt-1 text-sm text-black/70">+1 (555) 123-4567</p>
              </div>

              <div className="rounded-2xl border border-black/15 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 inline-flex rounded-xl bg-lime-50 p-3 text-lime-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-black">Location</h3>
                <p className="mt-1 text-sm text-black/70">New York, NY</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 md:px-8 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="reveal rounded-3xl border border-black/15 bg-[#faf7f1] p-8 text-center shadow-sm md:p-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Explore?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-black/75">
                Discover our collection of timeless pieces designed for the modern nomad.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/product"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-black/85"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/story"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#f5f1e8]"
                >
                  Read Our Story
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

export default About;
