import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaSpinner } from "react-icons/fa";
import { createPortal } from "react-dom";
import ProductNavbar from "../components/ProductNavbar.jsx";
import Authentication from "../components/Authentication.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE_URL, toAbsoluteUrl } from "../lib/apiBase.js";

function formatMoney(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? `Rs ${num.toFixed(2)}` : "Rs0.00";
}

function ProductCard({ product, onAddToCart, adding, disableAddToCart }) {
  const tags = [product.genderType].filter(Boolean);
  const imageSrc = Array.isArray(product.image) ? product.image[0] : product.image;

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
              <h3 className="mt-1 truncate text-lg font-semibold">{product.name}</h3>
            </div>
          </div>

          <div className="mt-3 min-h-[78px]">
            <p className="line-clamp-2 text-sm text-black/70">{product.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="text-sm text-black/90">
                <span>{formatMoney(product.price)}</span>
              </div>
              {tags.map((tag) => (
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
            disabled={adding || disableAddToCart}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 ${
              disableAddToCart
                ? "border-black/10 bg-black/10 text-black/50"
                : "border-black bg-black text-[#f7f4ee] hover:bg-black/80 hover:shadow-md"
            }`}
          >
            <FaShoppingCart className="h-4 w-4" />
            {disableAddToCart ? "Admins can't add to cart" : adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </Link>
    </div>
  );
}

function Product() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

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
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Failed to load products");
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => String(p.name || "").toLowerCase().includes(q));
  }, [products, query]);

  return (
    <>
      <ProductNavbar />

      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-screen-xl px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="mt-1 text-sm text-black/60">
                Browse active products from the latest collection.
              </p>
            </div>

            <div className="w-full md:w-96">
              <label className="text-xs font-semibold text-black/60">Search</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-black/10 bg-[#f7f4ee] px-3 py-2">
                <FaSearch className="h-4 w-4 text-black/60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full bg-transparent text-sm text-black placeholder:text-black/40 outline-none"
                />
              </div>
            </div>
          </div>

          {success ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-10 flex items-center justify-center gap-2 text-black/70">
              <FaSpinner className="h-5 w-5 animate-spin" />
              Loading products...
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {!loading && !error ? (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-10 text-center text-sm text-black/60">
                  No products found
                </div>
              ) : (
                filtered.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    adding={addingId === p._id}
                    disableAddToCart={false}
                    onAddToCart={async (product) => {
                      if (!user) {
                        setError("");
                        setSuccess("");
                        setShowAuth(true);
                        return;
                      }
                      setError("");
                      setSuccess("");
                      setAddingId(product._id);
                      try {
                        await new Promise((resolve) => setTimeout(resolve, 400));
                        addToCart(product);
                        setSuccess(`${product.name} added to cart`);
                      } catch (err) {
                        setError(err?.message || "Failed to add to cart");
                      } finally {
                        setAddingId("");
                      }
                    }}
                  />
                ))
              )}
            </div>
          ) : null}
        </div>
      </div>

      {showAuth && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
              <div className="relative w-full max-w-md rounded-3xl bg-[#f7f4ee] p-6 shadow-2xl">
                <button
                  type="button"
                  onClick={() => setShowAuth(false)}
                  className="absolute right-4 top-4 rounded-full border border-black/10 px-3 py-1 text-sm text-black transition-colors hover:bg-black/5"
                >
                  Close
                </button>
                <Authentication onSuccess={() => setShowAuth(false)} />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

export default Product;


