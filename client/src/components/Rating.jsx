    const testimonials = [
      {
        text: "I absolutely love the quality of the clothes! The fabric feels premium and the fit is perfect. Definitely my new favorite clothing store.",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Briana Patton",
        role: "Happy Customer",
      },
      {
        text: "The styles are modern and trendy. Every time I wear these outfits, I get compliments from my friends.",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Bilal Ahmed",
        role: "Regular Shopper",
      },
      {
        text: "Great shopping experience! The clothes arrived quickly and the quality exceeded my expectations.",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Saman Malik",
        role: "Fashion Lover",
      },
      {
        text: "Amazing collection and affordable prices. I found the perfect outfit for every occasion.",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Omar Raza",
        role: "Customer",
      },
      {
        text: "The fabric quality is outstanding and the designs are stylish. Highly recommend this store!",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Zainab Hussain",
        role: "Satisfied Buyer",
      },
      {
        text: "I ordered multiple items and every piece fits perfectly. The attention to detail is impressive.",
        image:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Aliza Khan",
        role: "Fashion Enthusiast",
      },
      {
        text: "Great variety of styles and colors. Shopping here always makes me excited about fashion.",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Farhan Siddiqui",
        role: "Style Blogger",
      },
      {
        text: "The clothes are comfortable, stylish, and worth every penny. I will definitely shop again.",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Sana Sheikh",
        role: "Loyal Customer",
      },
      {
        text: "One of the best clothing stores online. The quality, delivery, and designs are fantastic.",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Hassan Ali",
        role: "Online Shopper",
      },
    ];

    function TestimonialsColumn({ testimonialsList, duration = 16, className = "" }) {
      const looped = [...testimonialsList, ...testimonialsList];

      return (
        <div className={`overflow-hidden ${className}`}>
          <ul
            className="testimonial-marquee m-0 list-none p-0 flex flex-col gap-6"
            style={{ animationDuration: `${duration}s` }}
          >
            {looped.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className="max-w-xs rounded-3xl border border-black/10 bg-black/5 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-black/10"
              >
                <p className="leading-relaxed text-black/80">{item.text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold leading-5 text-black">{item.name}</p>
                    <p className="text-sm text-black/60">{item.role}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    function Rating() {
      const firstColumn = testimonials.slice(0, 3);
      const secondColumn = testimonials.slice(3, 6);
      const thirdColumn = testimonials.slice(6, 9);

      return (
        <section className="relative overflow-hidden bg-white py-16 text-black">
          <style>{`
            .testimonial-marquee {
              animation-name: testimonial-scroll;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
              will-change: transform;
            }
            @keyframes testimonial-scroll {
              from { transform: translateY(12%); }
              to { transform: translateY(calc(-50% + 12%)); }
            }
          `}</style>

          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <div className="inline-flex rounded-full border border-black/10 bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-black/70">
                Testimonials
              </div>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">
                What our users say
              </h2>
              <p className="mt-4 text-base text-black/60">
                Discover how teams streamline operations with our platform.
              </p>
            </div>

            <div className="mx-auto flex max-h-[680px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]">
              <TestimonialsColumn
                testimonialsList={firstColumn}
                duration={15}
                className=""
              />
              <TestimonialsColumn
                testimonialsList={secondColumn}
                duration={19}
                className="hidden md:block"
              />
              <TestimonialsColumn
                testimonialsList={thirdColumn}
                duration={17}
                className="hidden lg:block"
              />  
            </div>
          </div>
        </section>
      );
    }

    export default Rating;
