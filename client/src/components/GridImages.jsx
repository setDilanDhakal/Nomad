import { MdOutlinePayment } from "react-icons/md";
import { FaTruck } from "react-icons/fa";
import { IoHeadset } from "react-icons/io5";
import { useEffect, useRef } from "react";

function GridImages() {
      const revealRef = useRef(null);
  useEffect(() => {
    const root = revealRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".reveal, .reveal-scale");
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
<div ref={revealRef} className="px-4 sm:px-6 md:px-8 pt-12 pb-4 sm:pb-8">
        <p className="text-black/70 text-sm mb-2 flex flex-col">
          <span className="text-black/90 font-bold text-4xl">Hot and fresh:</span> Like your 
          morning coffee!
        </p>

        <div className="mb-8 h-[80vh] bg-[url('https://images.unsplash.com/photo-1538329972958-465d6d2144ed?q=80&w=1170&auto=format&fit=crop')] bg-center bg-cover rounded-lg"></div>

        <div className="flex flex-wrap items-center justify-between bg-black/90 text-white p-4 rounded-md">
          <div className="flex items-center gap-2">
            <MdOutlinePayment size={22} />
            <p>Full Secure Payment</p>
          </div>

          <div className="flex items-center gap-2">
            <FaTruck size={20} />
            <p>Free Delivery</p>
          </div>

          <div className="flex items-center gap-2">
            <IoHeadset size={20} />
            <p>24Hrs Customer Support</p>
          </div>
        </div>

        {/* SECTION for image banner  */}

        <div className="flex flex-col lg:flex-row lg:h-[80vh] mt-10  gap-3">
          <div className="flex-1">
            <div className="group reveal-scale relative min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[80vh] overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1768666608335-bd22b63ddad3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"></div>
              <div className="absolute left-0 right-0 bottom-0 h-12 bg-black/80 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-center justify-between px-3">
                <span className="text-white text-xs sm:text-sm">Winter Collection</span>
                <span className="text-white/70 text-[10px] sm:text-xs">Explore</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 mt-3 lg:mt-0">
            <div className="flex flex-col sm:flex-row flex-1 gap-2">
              <div className="flex-1">
                <div className="group reveal relative h-full min-h-[28vh] sm:min-h-[30vh] lg:min-h-[39vh] overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/7a/56/49/7a5649b6dea68012b2544668b665e125.jpg')] bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"></div>
                  <div className="absolute left-0 right-0 bottom-0 h-10 bg-black/80 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-center justify-between px-3">
                    <span className="text-white text-xs sm:text-sm">Minimal Looks</span>
                    <span className="text-white/70 text-[10px] sm:text-xs">Explore</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="group reveal relative h-full min-h-[28vh] sm:min-h-[30vh] lg:min-h-[39vh] overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577909687863-91bb3ec12db5?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover  bg-center transition-transform duration-500 ease-out group-hover:scale-105 "></div>
                  <div className="absolute left-0 right-0 bottom-0 h-10 bg-black/80 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-center justify-between px-3">
                    <span className="text-white text-xs sm:text-sm">Streetwear Drop</span>
                    <span className="text-white/70 text-[10px] sm:text-xs">Explore</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-1 gap-2">
              <div className="flex-1">
                <div className="group reveal relative h-full min-h-[28vh] sm:min-h-[30vh] lg:min-h-[39vh] overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587367336516-887f58881b13?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"></div>
                  <div className="absolute left-0 right-0 bottom-0 h-10 bg-black/80 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-center justify-between px-3">
                    <span className="text-white text-xs sm:text-sm">Seasonal Essentials</span>
                    <span className="text-white/70 text-[10px] sm:text-xs">Explore</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="group reveal relative h-full min-h-[28vh] sm:min-h-[30vh] lg:min-h-[39vh] overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625204614387-6509254d5b02?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"></div>
                  <div className="absolute left-0 right-0 bottom-0 h-10 bg-black/80 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-center justify-between px-3">
                    <span className="text-white text-xs sm:text-sm">Crafted Layers</span>
                    <span className="text-white/70 text-[10px] sm:text-xs">Explore</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</>
  );
}

export default GridImages;