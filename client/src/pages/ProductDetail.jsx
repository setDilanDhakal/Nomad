import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Info, ShoppingCart, Tag, Users } from "lucide-react";
import ProductNavbar from "../components/ProductNavbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function formatMoney(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? `Rs ${num.toFixed(2)}` : "Rs0.00";
}

function toAbsoluteUrl(value) {
  if (!value) {
    return "/vite.svg";
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  return `${API_BASE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      if (!id) {
        setProduct(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setActionError("");

      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Failed to load product");
        }

        if (!cancelled) {
          setProduct(result.data || null);
          setCurrentImageIndex(0);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setProduct(null);
          setActionError(fetchError.message || "Failed to load product");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const images = useMemo(() => {
    if (!product?.image) return [];
    return (Array.isArray(product.image) ? product.image : [product.image]).map(toAbsoluteUrl);
  }, [product?.image]);

  const tags = useMemo(() => {
    if (!product) return [];
    return [
      product.genderType ? { label: product.genderType, icon: Users } : null,
      product.season ? { label: product.season, icon: Tag } : null,
      { label: product.isActive ? "Active" : "Inactive", icon: Info },
    ].filter(Boolean);
  }, [product]);

  const breadcrumbs = useMemo(
    () => [
      { label: "Market", href: "/" },
      { label: "Clothing", href: "/product" },
      { label: product?.name || "Product", href: `/product/detail/${id || ""}` },
    ],
    [id, product?.name]
  );

  useEffect(() => {
    if (images.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentImageIndex((current) => (current + 1) % images.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [images]);

  if (loading) {
    return (
      <>
        <ProductNavbar />
        <div className="min-h-screen bg-white text-black">
          <div className="mx-auto max-w-screen-xl px-4 py-10">
            <div className="rounded-3xl border border-black/10 bg-[#faf7f1] px-6 py-10 text-center text-sm text-black/60">
              Loading product...
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <ProductNavbar />
        <div className="min-h-screen bg-white text-black">
          <div className="mx-auto max-w-screen-xl px-4 py-10">
            <div className="rounded-3xl border border-black/10 bg-[#faf7f1] p-8">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {actionError || "Product not found"}
              </div>
              <div className="mt-5">
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:opacity-70"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProductNavbar />
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-screen-xl px-4 py-10">
          <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm md:p-8">
          <nav className="mb-6 flex flex-wrap items-center text-sm text-black/50">
            {breadcrumbs.map((item, index) => (
              <div key={item.label} className="flex items-center">
                <Link to={item.href} className="transition-colors hover:text-black">
                  {item.label}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-black/25">/</span>
                )}
              </div>
            ))}
          </nav>

          <main className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl border border-black/10 bg-[#faf7f1]">
                <img
                  src={images[currentImageIndex] || "/vite.svg"}
                  alt={`${product.name} ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              {images.length ? (
                <div className="grid grid-cols-3 gap-3 sm:max-w-[320px]">
                  {images.map((image, index) => {
                    const isActive = currentImageIndex === index;

                    return (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setCurrentImageIndex(index)}
                        className={`overflow-hidden rounded-2xl border bg-[#faf7f1] transition-all ${
                          isActive
                            ? "border-black shadow-sm"
                            : "border-black/10 hover:border-black/30"
                        }`}
                        aria-label={`View thumbnail ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="h-24 w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        currentImageIndex === index
                          ? "bg-black"
                          : "bg-black/20 hover:bg-black/40"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
                Product Detail
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                {product.name}
              </h1>
              <div className="mt-2">
                <span className="text-4xl font-bold">{formatMoney(product.price)}</span>
              </div>

              {actionSuccess ? (
                <div className="mt-5 rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-700">
                  {actionSuccess}
                </div>
              ) : null}

              {actionError ? (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {actionError}
                </div>
              ) : null}

              <div className="my-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={adding || Boolean(user?.isAdmin)}
                  onClick={async () => {
                    if (user?.isAdmin) {
                      setActionError("Admins cannot use cart");
                      setActionSuccess("");
                      return;
                    }
                    setActionError("");
                    setActionSuccess("");
                    setAdding(true);
                    try {
                      await new Promise((resolve) => setTimeout(resolve, 300));
                      addToCart(product);
                      setActionSuccess(`${product.name} added to cart`);
                    } catch (err) {
                      setActionError(
                        err?.message || "Failed to add to cart"
                      );
                    } finally {
                      setAdding(false);
                    }
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-white transition-colors hover:bg-black/85 disabled:opacity-60"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {user?.isAdmin ? "Admins can't add to cart" : adding ? "Adding..." : "Add to Cart"}
                </button>
                <Link
                  to="/product"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-black/5"
                >
                  Back to Products
                </Link>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                {tags.map((item) => {
                  const Icon = item.icon;
                  return (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#faf7f1] px-3 py-1 text-xs text-black/70"
                    >
                      <Icon className="h-4 w-4" />
                      {String(item.label).toUpperCase()}
                    </span>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-black/10 bg-[#faf7f1] p-6">
                <h2 className="text-lg font-semibold text-black">About This Product</h2>
                <p className="mt-3 leading-relaxed text-black/70">{product.description}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
      </div>
    </>
  );
}

export default ProductDetail;
