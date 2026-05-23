import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE_URL, toAbsoluteUrl } from "../lib/apiBase.js";

function formatMoney(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? `Rs ${num.toFixed(2)}` : "Rs0.00";
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const imageSrc = Array.isArray(product.image) ? product.image[0] : product.image;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);

    setTimeout(() => {
      addToCart(product);
      setAdded(true);
      setAdding(false);
      setTimeout(() => setAdded(false), 2000);
    }, 500);
  };

  return (
    <div className="group">
      <Link
        to={`/product/detail/${product._id}`}
        className="block w-full overflow-hidden rounded-2xl border border-black/10 bg-[#f7f4ee] text-black shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#f2ede3] hover:shadow-xl"
      >
        <div className="relative h-44 w-full">
          <img
            src={toAbsoluteUrl(imageSrc)}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="mt-1 truncate text-lg font-semibold">
                {product.name}
              </h3>
            </div>
          </div>

          <div className="mt-3 min-h-[78px]">
            <p className="text-sm text-black/70 line-clamp-2">
              {product.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <div className="text-sm  text-black/90">
                <span>{formatMoney(product.price)}</span>
              </div>
              {[product.genderType].filter(Boolean).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 bg-[#f1ebdf] px-3 py-1 text-xs text-black/70"
                >
                  {String(tag).toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
              added
                ? "border-neon bg-neon text-black hover:brightness-95"
                : "border-black bg-black text-[#f7f4ee] hover:bg-black/80 hover:shadow-md"
            } disabled:opacity-60`}
          >
            {adding ? "Adding..." : added ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </Link>
    </div>
  );
}

function Card() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const rootRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/products/active`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Failed to load products");
        }

        if (!cancelled) {
          setProducts(Array.isArray(result.data) ? result.data : []);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
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
      { threshold: 0.1 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [products]);

  return (
    <div ref={rootRef} className="px-4 sm:px-6 md:px-8 pt-12 pb-4 sm:pb-8">
      <h1 className="text-3xl font-bold tracking-tight text-black">
        Latest Collection
      </h1>
      <p className="mt-1 text-sm text-black/60">
        Discover our latest collection of trendy and stylish jackets.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {loading ? (
          <div className="col-span-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-10 text-center text-sm text-black/60">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-10 text-center text-sm text-black/60">
            No products found
          </div>
        ) : (
          products.slice(0, 5).map((product) => (
            <div key={product._id} className="reveal">
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Card;
