import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductNavbar from "../components/ProductNavbar.jsx";
import SideBar from "../components/SideBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE_URL, toAbsoluteUrl } from "../lib/apiBase.js";
const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;
const customerSidebarItems = [
  { id: "profile", label: "Profile" },
  { id: "details", label: "Details" },
  { id: "update", label: "Update Profile" },
  { id: "orders", label: "Order History" },
];
const adminSidebarItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "products", label: "All Products" },
  { id: "add-product", label: "Add Product" },
  { id: "recent-orders", label: "Recent Orders" },
  { id: "update", label: "Update Profile" },
];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}

function Profile() {
  const navigate = useNavigate();
  const { user, setAuthSession, clearAuthSession } = useAuth();
  const {
    cartItems,
    cartSubtotal,
    orderHistory,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    placeOrder,
    deleteOrder,
  } = useCart();
  const [activeSection, setActiveSection] = useState("profile");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    password: "",
    profileImage: "",
  });
  const [selectedProfileImageFile, setSelectedProfileImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminProductQuery, setAdminProductQuery] = useState("");
  const [adminEditingId, setAdminEditingId] = useState("");
  const [adminSavingProductId, setAdminSavingProductId] = useState("");
  const [adminDeletingId, setAdminDeletingId] = useState("");
  const [adminTogglingId, setAdminTogglingId] = useState("");
  const [adminUpdatingOrderId, setAdminUpdatingOrderId] = useState("");
  const [adminProductForm, setAdminProductForm] = useState({
    name: "",
    description: "",
    price: "",
    genderType: "unisex",
    stock: "",
    isActive: true,
  });
  const [adminProductImages, setAdminProductImages] = useState({
    files: [],
    previews: [],
    existing: [],
  });
  const [adminCreateForm, setAdminCreateForm] = useState({
    name: "",
    description: "",
    price: "",
    genderType: "unisex",
    stock: "",
    isActive: true,
  });
  const [adminCreateImages, setAdminCreateImages] = useState({
    files: [],
    previews: [],
  });
  const [adminCreatingProduct, setAdminCreatingProduct] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState("");

  useEffect(() => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      mobileNo: user?.mobileNo || "",
      password: "",
      profileImage: user?.profileImage || user?.avatar || user?.image || "",
    });
    setSelectedProfileImageFile(null);
  }, [user]);

  useEffect(() => {
    if (user?.isAdmin) {
      setActiveSection((current) =>
        adminSidebarItems.some((item) => item.id === current) ? current : "dashboard"
      );
      return;
    }

    setActiveSection((current) =>
      customerSidebarItems.some((item) => item.id === current) ? current : "profile"
    );
  }, [user?.isAdmin]);

  const firstName = useMemo(() => {
    if (!user?.fullName) {
      return "";
    }

    return user.fullName.trim().split(" ")[0];
  }, [user]);
  const formatMoney = (value) => `Rs ${Number(value || 0).toFixed(2)}`;
  const profileImage = toAbsoluteUrl(
    formData.profileImage || user?.profileImage || user?.avatar || user?.image || ""
  );
  const profileInitial = (firstName || user?.fullName || "U").charAt(0).toUpperCase();
  const isAdminUser = Boolean(user?.isAdmin);
  const sidebarItems = isAdminUser ? adminSidebarItems : customerSidebarItems;
  const recentAdminOrders = useMemo(() => adminOrders.slice(0, 5), [adminOrders]);
  const adminRevenue = useMemo(
    () => adminOrders.reduce((total, order) => total + Number(order.totalPrice || 0), 0),
    [adminOrders]
  );
  const activeProductsCount = useMemo(
    () => adminProducts.filter((product) => product.isActive).length,
    [adminProducts]
  );
  const filteredAdminProducts = useMemo(() => {
    const query = adminProductQuery.trim().toLowerCase();

    if (!query) {
      return adminProducts;
    }

    return adminProducts.filter((product) => {
      const text = [
        product.name,
        product.description,
        product.genderType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [adminProducts, adminProductQuery]);

  const loadAdminData = useCallback(async () => {
    if (!user?.isAdmin) {
      return;
    }

    setAdminLoading(true);
    setAdminError("");

    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/products`, {
          method: "GET",
          credentials: "include",
        }),
        fetch(`${API_BASE_URL}/orders`, {
          method: "GET",
          credentials: "include",
        }),
      ]);

      const productsResult = await productsResponse.json().catch(() => ({}));
      const ordersResult = await ordersResponse.json().catch(() => ({}));

      if (!productsResponse.ok) {
        throw new Error(productsResult.message || "Failed to fetch products");
      }

      if (!ordersResponse.ok) {
        throw new Error(ordersResult.message || "Failed to fetch recent orders");
      }

      setAdminProducts(Array.isArray(productsResult.data) ? productsResult.data : []);
      setAdminOrders(Array.isArray(ordersResult.data) ? ordersResult.data : []);
    } catch (fetchError) {
      setAdminError(fetchError.message || "Failed to load admin dashboard");
    } finally {
      setAdminLoading(false);
    }
  }, [user?.isAdmin]);

  useEffect(() => {
    if (!user?.isAdmin) {
      setAdminProducts([]);
      setAdminOrders([]);
      setAdminError("");
      return;
    }

    let cancelled = false;

    const fetchAdminData = async () => {
      try {
        await loadAdminData();
      } catch (fetchError) {
        if (!cancelled) {
          setAdminError(fetchError.message || "Failed to load admin dashboard");
        }
      }
    };

    fetchAdminData();

    return () => {
      cancelled = true;
    };
  }, [loadAdminData, user?.isAdmin]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/");
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setError("");
    setMessage("");

    try {
      const placedOrder = await placeOrder();

      if (placedOrder) {
        setMessage(`Order ${placedOrder.id} placed successfully`);
        setActiveSection("orders");
      }
    } catch (placeOrderError) {
      setError(placeOrderError.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm("Delete this order from your history?");

    if (!confirmed) {
      return;
    }

    setDeletingOrderId(orderId);
    setError("");
    setMessage("");

    try {
      await deleteOrder(orderId);
      setMessage("Order deleted successfully");
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete order");
    } finally {
      setDeletingOrderId("");
    }
  };

  const startEditingProduct = (product) => {
    setAdminEditingId(product._id);
    setAdminProductForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      genderType: String(product.genderType || "unisex").toLowerCase(),
      stock: String(product.stock ?? ""),
      isActive: Boolean(product.isActive),
    });
    setAdminProductImages({
      files: [],
      previews: [],
      existing: (Array.isArray(product.image) ? product.image : [product.image])
        .filter(Boolean)
        .map(toAbsoluteUrl),
    });
    setAdminError("");
    setMessage("");
  };

  const handleAdminProductFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAdminProductForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdminProductImageChange = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      setAdminProductImages((current) => ({
        ...current,
        files: [],
        previews: [],
      }));
      return;
    }

    if (files.length > 3) {
      setAdminError("You can upload up to 3 product images");
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setAdminError("Please select valid image files only");
      return;
    }

    try {
      const previews = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setAdminProductImages((current) => ({
        ...current,
        files,
        previews,
      }));
      setAdminError("");
    } catch (imageError) {
      setAdminError(imageError.message || "Failed to load product images");
    } finally {
      event.target.value = "";
    }
  };

  const handleAdminCreateFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAdminCreateForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdminCreateImageChange = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      setAdminCreateImages({
        files: [],
        previews: [],
      });
      return;
    }

    if (files.length > 3) {
      setAdminError("You can upload up to 3 product images");
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setAdminError("Please select valid image files only");
      return;
    }

    try {
      const previews = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setAdminCreateImages({
        files,
        previews,
      });
      setAdminError("");
    } catch (imageError) {
      setAdminError(imageError.message || "Failed to load product images");
    } finally {
      event.target.value = "";
    }
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setAdminCreatingProduct(true);
    setAdminError("");
    setMessage("");

    try {
      if (adminCreateImages.files.length < 1 || adminCreateImages.files.length > 3) {
        throw new Error("Please select between 1 and 3 product images");
      }

      const payload = new FormData();
      payload.append("name", adminCreateForm.name.trim());
      payload.append("description", adminCreateForm.description.trim());
      payload.append("price", String(Number(adminCreateForm.price || 0)));
      payload.append("genderType", adminCreateForm.genderType.toLowerCase());
      payload.append("stock", String(Number(adminCreateForm.stock || 0)));
      payload.append("isActive", String(Boolean(adminCreateForm.isActive)));
      adminCreateImages.files.forEach((file) => {
        payload.append("image", file);
      });

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to create product");
      }

      const createdProduct = result.data || null;
      if (createdProduct) {
        setAdminProducts((current) => [createdProduct, ...current]);
      } else {
        await loadAdminData();
      }

      setAdminCreateForm({
        name: "",
        description: "",
        price: "",
        genderType: "unisex",
        stock: "",
        isActive: true,
      });
      setAdminCreateImages({
        files: [],
        previews: [],
      });
      setActiveSection("products");
      setMessage(result.message || "Product created successfully");
    } catch (createError) {
      setAdminError(createError.message || "Failed to create product");
    } finally {
      setAdminCreatingProduct(false);
    }
  };

  const handleSaveProduct = async (productId) => {
    setAdminSavingProductId(productId);
    setAdminError("");
    setMessage("");

    try {
      const payload = new FormData();
      payload.append("name", adminProductForm.name.trim());
      payload.append("description", adminProductForm.description.trim());
      payload.append("price", String(Number(adminProductForm.price || 0)));
      payload.append("genderType", adminProductForm.genderType.toLowerCase());
      payload.append("stock", String(Number(adminProductForm.stock || 0)));
      payload.append("isActive", String(Boolean(adminProductForm.isActive)));

      if (adminProductImages.files.length > 3) {
        throw new Error("Please select up to 3 images to replace the current product gallery");
      }

      adminProductImages.files.forEach((file) => {
        payload.append("image", file);
      });

      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PUT",
        credentials: "include",
        body: payload,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to update product");
      }

      setAdminProducts((current) =>
        current.map((product) => (product._id === productId ? result.data || product : product))
      );
      setAdminProductImages({
        files: [],
        previews: [],
        existing: [],
      });
      setAdminEditingId("");
      setMessage(result.message || "Product updated successfully");
    } catch (updateError) {
      setAdminError(updateError.message || "Failed to update product");
    } finally {
      setAdminSavingProductId("");
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    setAdminDeletingId(productId);
    setAdminError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete product");
      }

      setAdminProducts((current) => current.filter((product) => product._id !== productId));
      if (adminEditingId === productId) {
        setAdminEditingId("");
      }
      setMessage(result.message || "Product deleted successfully");
    } catch (deleteError) {
      setAdminError(deleteError.message || "Failed to delete product");
    } finally {
      setAdminDeletingId("");
    }
  };

  const handleToggleProductStatus = async (product) => {
    setAdminTogglingId(product._id);
    setAdminError("");
    setMessage("");

    try {
      const payload = new FormData();
      payload.append("isActive", String(!product.isActive));

      const response = await fetch(`${API_BASE_URL}/products/${product._id}`, {
        method: "PUT",
        credentials: "include",
        body: payload,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to update product status");
      }

      const updatedProduct = result.data || {
        ...product,
        isActive: !product.isActive,
      };

      setAdminProducts((current) =>
        current.map((item) => (item._id === product._id ? updatedProduct : item))
      );
      setMessage(
        result.message ||
          `Product ${updatedProduct.isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (toggleError) {
      setAdminError(toggleError.message || "Failed to update product status");
    } finally {
      setAdminTogglingId("");
    }
  };

  const handleAdminOrderStatusUpdate = async (orderId, status) => {
    setAdminUpdatingOrderId(orderId);
    setAdminError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || `Failed to mark order as ${status.toLowerCase()}`);
      }

      const updatedOrder = result.data || null;
      if (updatedOrder) {
        setAdminOrders((current) =>
          current.map((order) => (order._id === orderId ? updatedOrder : order))
        );
      } else {
        await loadAdminData();
      }
      setMessage(result.message || `Order ${status.toLowerCase()} successfully`);
    } catch (updateError) {
      setAdminError(updateError.message || "Failed to update order");
    } finally {
      setAdminUpdatingOrderId("");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setError("Image size should be 2MB or less");
      return;
    }

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      setFormData((current) => ({
        ...current,
        profileImage: imageDataUrl,
      }));
      setSelectedProfileImageFile(file);
      setError("");
    } catch (imageError) {
      setError(imageError.message || "Failed to load image");
    } finally {
      event.target.value = "";
    }
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    if (!user?._id) {
      setError("Please login first");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = new FormData();
      payload.append("fullName", formData.fullName.trim());
      payload.append("email", formData.email.trim());
      payload.append("mobileNo", formData.mobileNo.trim());

      if (formData.password.trim()) {
        payload.append("password", formData.password);
      }

      if (selectedProfileImageFile) {
        payload.append("image", selectedProfileImageFile);
      }

      const response = await fetch(`${API_BASE_URL}/users/${user._id}`, {
        method: "PUT",
        credentials: "include",
        body: payload,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      const nextUser = result.data || user;

      setAuthSession({
        user: nextUser,
        token: localStorage.getItem("nomadToken") || "",
      });
      setFormData((current) => ({
        ...current,
        password: "",
        profileImage:
          nextUser?.profileImage || nextUser?.avatar || nextUser?.image || current.profileImage,
      }));
      setSelectedProfileImageFile(null);
      setMessage(result.message || "Profile updated successfully");
      setActiveSection(user?.isAdmin ? "dashboard" : "details");
    } catch (updateError) {
      setError(updateError.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const renderWelcomeSection = () => (
    <div className="mb-8 rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
            {isAdminUser ? "Admin Panel" : "Dashboard"}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-black">
            {firstName ? `Welcome, ${firstName}` : "My Profile"}
          </h1>
          <p className="mt-3 max-w-2xl text-black/70">
            {isAdminUser
              ? "Review platform activity, products, and recent orders from one admin dashboard."
              : "Manage your personal information, review your details, explore order history, and logout from one place."}
          </p>
        </div>

        <div className="shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={firstName ? `${firstName} profile` : "Profile"}
              className="h-20 w-20 rounded-2xl border border-black/10 object-cover shadow-sm sm:h-24 sm:w-24"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-black/10 bg-[#faf7f1] text-2xl font-semibold text-black shadow-sm sm:h-24 sm:w-24">
              {profileInitial}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {adminError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {adminError}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/50">Total Products</p>
          <p className="mt-2 text-3xl font-bold text-black">{adminProducts.length}</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/50">Active Products</p>
          <p className="mt-2 text-3xl font-bold text-black">{activeProductsCount}</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/50">Recent Orders</p>
          <p className="mt-2 text-3xl font-bold text-black">{adminOrders.length}</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/50">Revenue Snapshot</p>
          <p className="mt-2 text-3xl font-bold text-black">{formatMoney(adminRevenue)}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
          Dashboard
        </p>
        <h2 className="mt-3 text-3xl font-bold text-black">Recent Orders</h2>
        <p className="mt-2 text-black/65">
          Real customer orders from the backend with customer contact details.
        </p>

        {adminLoading ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-[#faf7f1] px-6 py-10 text-center text-sm text-black/60">
            Loading admin dashboard...
          </div>
        ) : recentAdminOrders.length ? (
          <div className="mt-8 space-y-4">
            {recentAdminOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-black/10 bg-[#faf7f1] p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-base font-semibold text-black">
                      {order.user?.fullName || "Unknown Customer"}
                    </p>
                    <p className="mt-1 text-sm text-black/60">{order.user?.email || "No email"}</p>
                    <p className="mt-1 text-sm text-black/60">
                      {order.user?.mobileNo || "No phone number"}
                    </p>
                    <p className="mt-1 text-sm text-black/60">
                      {new Date(order.updatedAt || order.createdAt || order.orderedOn).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
                      {(order.items || []).length} items
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "Cancelled" || order.status === "Rejected"
                          ? "border border-red-200 bg-red-50 text-red-600"
                          : "border border-lime-200 bg-lime-50 text-lime-700"
                      }`}
                    >
                      {order.status || "Placed"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    {order.status !== "Cancelled" && order.status !== "Rejected" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAdminOrderStatusUpdate(order._id, "Cancelled")}
                          disabled={adminUpdatingOrderId === order._id}
                          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-70"
                        >
                          {adminUpdatingOrderId === order._id ? "Updating..." : "Cancel"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminOrderStatusUpdate(order._id, "Rejected")}
                          disabled={adminUpdatingOrderId === order._id}
                          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-70"
                        >
                          {adminUpdatingOrderId === order._id ? "Updating..." : "Reject"}
                        </button>
                      </>
                    ) : null}
                    <div className="text-base font-semibold text-black">
                      {formatMoney(order.totalPrice)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-[#faf7f1] px-6 py-10 text-center text-sm text-black/60">
            No recent orders available yet.
          </div>
        )}
      </div>
    </div>
  );

  const renderAdminProducts = () => (
    <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
        Products
      </p>
      <h2 className="mt-3 text-3xl font-bold text-black">All Products</h2>
      <p className="mt-2 text-black/65">
        Review the current product catalog and quick inventory details.
      </p>

      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Search Products
        </label>
        <input
          type="text"
          value={adminProductQuery}
          onChange={(event) => setAdminProductQuery(event.target.value)}
          placeholder="Search by name, description, or gender..."
          className="mt-2 w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 text-sm text-black outline-none transition focus:border-black/25"
        />
      </div>

      {adminError ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {adminError}
        </div>
      ) : null}
      {message ? (
        <div className="mt-6 rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-700">
          {message}
        </div>
      ) : null}

      {adminLoading ? (
        <div className="mt-8 rounded-2xl border border-black/10 bg-[#faf7f1] px-6 py-10 text-center text-sm text-black/60">
          Loading products...
        </div>
      ) : filteredAdminProducts.length ? (
        <div className="mt-8 space-y-4">
          {filteredAdminProducts.map((product) => (
            <div
              key={product._id}
              className="rounded-2xl border border-black/10 bg-[#faf7f1] p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <img
                  src={toAbsoluteUrl(product.image?.[0] || product.image || "") || "/vite.svg"}
                  alt={product.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  {adminEditingId === product._id ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={adminProductForm.name}
                            onChange={handleAdminProductFormChange}
                            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                            Gender Type
                          </label>
                          <select
                            name="genderType"
                            value={adminProductForm.genderType}
                            onChange={handleAdminProductFormChange}
                            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unisex">Unisex</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                            Price
                          </label>
                          <input
                            type="number"
                            min="0"
                            name="price"
                            value={adminProductForm.price}
                            onChange={handleAdminProductFormChange}
                            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                            Stock
                          </label>
                          <input
                            type="number"
                            min="0"
                            name="stock"
                            value={adminProductForm.stock}
                            onChange={handleAdminProductFormChange}
                            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={adminProductForm.description}
                          onChange={handleAdminProductFormChange}
                          rows={3}
                          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                          Current Images
                        </label>
                        <div className="mt-2 flex flex-wrap gap-3">
                          {adminProductImages.existing.length ? (
                            adminProductImages.existing.map((image, index) => (
                              <img
                                key={`${product._id}-existing-${index}`}
                                src={image}
                                alt={`${product.name} ${index + 1}`}
                                className="h-20 w-20 rounded-2xl border border-black/10 object-cover"
                              />
                            ))
                          ) : (
                            <div className="rounded-2xl border border-dashed border-black/10 bg-white px-4 py-6 text-sm text-black/50">
                              No saved images
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                          Replace Images
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAdminProductImageChange}
                          className="mt-2 block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                        />
                        <p className="mt-2 text-xs text-black/50">
                          Select 3 images to replace the current product gallery.
                        </p>

                        {adminProductImages.previews.length ? (
                          <div className="mt-4 flex flex-wrap gap-3">
                            {adminProductImages.previews.map((image, index) => (
                              <img
                                key={`${product._id}-preview-${index}`}
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="h-20 w-20 rounded-2xl border border-black/10 object-cover"
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <label className="inline-flex items-center gap-2 text-sm font-medium text-black">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={adminProductForm.isActive}
                          onChange={handleAdminProductFormChange}
                          className="h-4 w-4 rounded border-black/20"
                        />
                        Active Product
                      </label>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleSaveProduct(product._id)}
                          disabled={adminSavingProductId === product._id}
                          className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-70"
                        >
                          {adminSavingProductId === product._id ? "Saving..." : "Save Update"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminEditingId("")}
                          className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-black">{product.name}</h3>
                          <p className="mt-1 text-sm text-black/60">
                            {String(product.genderType || "N/A").toUpperCase()}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
                            Stock: {product.stock ?? 0}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              product.isActive
                                ? "border border-lime-200 bg-lime-50 text-lime-700"
                                : "border border-red-200 bg-red-50 text-red-600"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-black/60">{product.description}</p>
                        <p className="text-base font-semibold text-black">
                          {formatMoney(product.price)}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => startEditingProduct(product)}
                          className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/85"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleProductStatus(product)}
                          disabled={adminTogglingId === product._id}
                          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition disabled:opacity-70 ${
                            product.isActive
                              ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "border border-lime-200 bg-lime-50 text-lime-700 hover:bg-lime-100"
                          }`}
                        >
                          {adminTogglingId === product._id
                            ? "Updating..."
                            : product.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={adminDeletingId === product._id}
                          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-70"
                        >
                          {adminDeletingId === product._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-black/10 bg-[#faf7f1] px-6 py-10 text-center text-sm text-black/60">
          No products found.
        </div>
      )}
    </div>
  );

  const renderAdminOrders = () => (
    <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
        Orders
      </p>
      <h2 className="mt-3 text-3xl font-bold text-black">Recent Orders</h2>
      <p className="mt-2 text-black/65">
        Real customer orders with contact details for admin monitoring.
      </p>

      {adminError ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {adminError}
        </div>
      ) : null}

      {adminLoading ? (
        <div className="mt-8 rounded-2xl border border-black/10 bg-[#faf7f1] px-6 py-10 text-center text-sm text-black/60">
          Loading recent orders...
        </div>
      ) : adminOrders.length ? (
        <div className="mt-8 space-y-4">
          {adminOrders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-black/10 bg-[#faf7f1] p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-base font-semibold text-black">
                    {order.user?.fullName || "Unknown Customer"}
                  </p>
                  <p className="mt-1 text-sm text-black/60">{order.user?.email || "No email"}</p>
                  <p className="mt-1 text-sm text-black/60">
                    {order.user?.mobileNo || "No phone number"}
                  </p>
                  <p className="mt-1 text-sm text-black/60">
                    {new Date(order.updatedAt || order.createdAt || order.orderedOn).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
                    {(order.items || []).length} products
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === "Cancelled" || order.status === "Rejected"
                        ? "border border-red-200 bg-red-50 text-red-600"
                        : "border border-lime-200 bg-lime-50 text-lime-700"
                    }`}
                  >
                    {order.status || "Placed"}
                  </span>
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
                    {String(order.paymentMethod || "cod").toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  {order.status !== "Cancelled" && order.status !== "Rejected" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAdminOrderStatusUpdate(order._id, "Cancelled")}
                        disabled={adminUpdatingOrderId === order._id}
                        className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-70"
                      >
                        {adminUpdatingOrderId === order._id ? "Updating..." : "Cancel"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdminOrderStatusUpdate(order._id, "Rejected")}
                        disabled={adminUpdatingOrderId === order._id}
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-70"
                      >
                        {adminUpdatingOrderId === order._id ? "Updating..." : "Reject"}
                      </button>
                    </>
                  ) : null}
                  <div className="text-base font-semibold text-black">
                    {formatMoney(order.totalPrice)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-black/10 bg-[#faf7f1] px-6 py-10 text-center text-sm text-black/60">
          No recent orders found.
        </div>
      )}
    </div>
  );

  const renderAdminAddProduct = () => (
    <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
        Products
      </p>
      <h2 className="mt-3 text-3xl font-bold text-black">Add Product</h2>
      <p className="mt-2 text-black/65">
        Create a new product for the store with up to 3 images for the gallery.
      </p>

      {adminError ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {adminError}
        </div>
      ) : null}
      {message ? (
        <div className="mt-6 rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-700">
          {message}
        </div>
      ) : null}

      <form className="mt-8 space-y-5" onSubmit={handleCreateProduct}>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-black">Product Name</label>
            <input
              type="text"
              name="name"
              value={adminCreateForm.name}
              onChange={handleAdminCreateFormChange}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 outline-none transition focus:border-black/30"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Gender Type</label>
            <select
              name="genderType"
              value={adminCreateForm.genderType}
              onChange={handleAdminCreateFormChange}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 outline-none transition focus:border-black/30"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-black">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={adminCreateForm.price}
              onChange={handleAdminCreateFormChange}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 outline-none transition focus:border-black/30"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Stock</label>
            <input
              type="number"
              min="0"
              name="stock"
              value={adminCreateForm.stock}
              onChange={handleAdminCreateFormChange}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 outline-none transition focus:border-black/30"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-black">Description</label>
          <textarea
            name="description"
            value={adminCreateForm.description}
            onChange={handleAdminCreateFormChange}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 outline-none transition focus:border-black/30"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-black">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdminCreateImageChange}
            className="mt-2 block w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 text-sm text-black file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          <p className="mt-2 text-xs text-black/50">
            Select 1 to 3 images for the product gallery.
          </p>

          {adminCreateImages.previews.length ? (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:max-w-sm">
              {adminCreateImages.previews.map((image, index) => (
                <img
                  key={`create-preview-${index}`}
                  src={image}
                  alt={`New product preview ${index + 1}`}
                  className="h-24 w-full rounded-2xl border border-black/10 object-cover"
                />
              ))}
            </div>
          ) : null}
        </div>

        <label className="inline-flex items-center gap-2 text-sm font-medium text-black">
          <input
            type="checkbox"
            name="isActive"
            checked={adminCreateForm.isActive}
            onChange={handleAdminCreateFormChange}
            className="h-4 w-4 rounded border-black/20"
          />
          Active Product
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={adminCreatingProduct}
            className="inline-flex rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {adminCreatingProduct ? "Creating..." : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => {
              setAdminCreateForm({
                name: "",
                description: "",
                price: "",
                genderType: "unisex",
                stock: "",
                isActive: true,
              });
              setAdminCreateImages({
                files: [],
                previews: [],
              });
              setAdminError("");
            }}
            className="inline-flex rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    if (!user) {
      return (
        <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-black">Profile Access</h2>
          <p className="mt-3 max-w-xl text-black/70">
            Please login from the navbar to view your profile, update your details,
            and access order history.
          </p>
        </div>
      );
    }

    if (user.isAdmin) {
      if (activeSection === "dashboard") {
        return renderAdminDashboard();
      }

      if (activeSection === "products") {
        return renderAdminProducts();
      }

      if (activeSection === "add-product") {
        return renderAdminAddProduct();
      }

      if (activeSection === "recent-orders") {
        return renderAdminOrders();
      }
    }

    if (activeSection === "profile") {
      return (
        <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
            Cart
          </p>
          <h2 className="mt-3 text-3xl font-bold text-black">Your Cart Items</h2>
          <p className="mt-2 text-black/65">
            Review your selected products, update quantity, remove items, or place
            your order.
          </p>

          {message ? (
            <div className="mt-6 rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-700">
              {message}
            </div>
          ) : null}
          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {cartItems.length ? (
            <>
              <div className="mt-8 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-black/10 bg-[#faf7f1] p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <img
                        src={
                          toAbsoluteUrl(Array.isArray(item.image) ? item.image[0] : item.image) ||
                          "/vite.svg"
                        }
                        alt={item.name}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-black">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-black/60">
                              {formatMoney(item.price)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="w-fit rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="inline-flex w-fit items-center overflow-hidden rounded-xl border border-black/10 bg-white">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item._id)}
                              className="px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-black/5"
                            >
                              -
                            </button>
                            <span className="min-w-12 px-3 text-center text-sm font-semibold text-black">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => increaseQuantity(item._id)}
                              className="px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-black/5"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-base font-semibold text-black">
                            {formatMoney(Number(item.price || 0) * Number(item.quantity || 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-black/10 bg-[#faf7f1] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-black/55">Subtotal</p>
                    <p className="mt-1 text-2xl font-bold text-black">
                      {formatMoney(cartSubtotal)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPlacingOrder ? "Placing..." : "Place Order"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-black/10 bg-[#faf7f1] px-6 py-10 text-center text-sm text-black/60">
              Your cart is empty. Add products from the products page to see them here.
            </div>
          )}
        </div>
      );
    }

    if (activeSection === "details") {
      return (
        <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
            Details
          </p>
          <h2 className="mt-3 text-3xl font-bold text-black">Account Details</h2>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-black/10 p-5">
              <span className="text-sm text-black/55">Full Name</span>
              <p className="mt-1 text-base font-medium text-black">{user.fullName}</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-5">
              <span className="text-sm text-black/55">Email</span>
              <p className="mt-1 text-base font-medium text-black">{user.email}</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-5">
              <span className="text-sm text-black/55">Mobile Number</span>
              <p className="mt-1 text-base font-medium text-black">
                {user.mobileNo || "Not added yet"}
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 p-5">
              <span className="text-sm text-black/55">Role</span>
              <p className="mt-1 text-base font-medium text-black">
                {user.isAdmin ? "Admin" : "Customer"}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "update") {
      return (
        <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
            Update Profile
          </p>
          <h2 className="mt-3 text-3xl font-bold text-black">Edit Your Details</h2>
          <p className="mt-2 text-black/65">
            Keep your account information current for a smoother shopping experience.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleUpdateProfile}>
            <div>
              <label className="text-sm font-medium text-black">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 outline-none transition focus:border-black/30"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 outline-none transition focus:border-black/30"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black">Mobile Number</label>
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="Enter 10 digit mobile number"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current password"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 block w-full rounded-2xl border border-black/10 bg-[#faf7f1] px-4 py-3 text-sm text-black file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <p className="mt-2 text-xs text-black/50">
                Upload a JPG, PNG, or WEBP image up to 2MB.
              </p>

              {formData.profileImage ? (
                <div className="mt-4">
                  <img
                    src={formData.profileImage}
                    alt="Profile preview"
                    className="h-24 w-24 rounded-2xl border border-black/10 object-cover"
                  />
                </div>
              ) : null}
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-green-700">{message}</p> : null}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-700">
          Orders
        </p>
        <h2 className="mt-3 text-3xl font-bold text-black">Order History</h2>
        <p className="mt-2 text-black/65">
          A quick look at your recent orders and their current status.
        </p>

        <div className="mt-8 space-y-4">
          {orderHistory.length ? (
            orderHistory.map((order) => (
              <div
                key={order.id || order._id}
                className="rounded-2xl border border-black/10 bg-[#faf7f1] p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-black/60">
                      {new Date(order.date || order.createdAt || order.orderedOn).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm text-black/70">
                    {formatMoney(order.total ?? order.totalPrice)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "Cancelled" || order.status === "Rejected"
                          ? "border border-red-200 bg-red-50 text-red-600"
                          : "border border-lime-200 bg-lime-50 text-lime-700"
                      }`}
                    >
                      {order.status}
                    </span>
                    {order.status === "Cancelled" || order.status === "Rejected" ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order._id || order.id)}
                        disabled={deletingOrderId === (order._id || order.id)}
                        className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {deletingOrderId === (order._id || order.id) ? "Deleting..." : "Delete"}
                      </button>
                    ) : null}
                  </div>
                </div>

                {(order.items || []).length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {order.items.map((item, index) => {
                      const itemImage = Array.isArray(item.image) ? item.image[0] : item.image;
                      return (
                        <div
                          key={`${order._id || order.id}-item-${index}`}
                          className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-4"
                        >
                          <img
                            src={toAbsoluteUrl(itemImage) || "/vite.svg"}
                            alt={item.name || "Product"}
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-black truncate">
                              {item.name || "Product"}
                            </h3>
                            <p className="mt-1 text-xs text-black/60">
                              {formatMoney(item.price || 0)} × {item.quantity || 1}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-black">
                            {formatMoney((item.subtotal || 0) || (Number(item.price || 0) * Number(item.quantity || 0)))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-black/10 bg-[#faf7f1] px-6 py-10 text-center text-sm text-black/60">
              No order history yet. Place an order from the cart to see it here.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <ProductNavbar />

      <div className="min-h-screen bg-[#f4f5f7]">
        <div className="px-4 py-10 sm:px-6 md:px-8 lg:hidden">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <SideBar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                onLogout={handleLogout}
                userName={firstName}
                showMobileTrigger={true}
                showDesktopSidebar={false}
                items={sidebarItems}
                panelLabel={isAdminUser ? "Admin" : "Account"}
                panelName={isAdminUser ? "Admin" : "Profile"}
              />
            </div>

            {renderWelcomeSection()}

            {renderContent()}
          </div>
        </div>

        <div className="hidden lg:grid lg:min-h-[calc(100vh-80px)] lg:grid-cols-[290px_minmax(0,1fr)]">
          <div className="sticky top-20 h-[calc(100vh-80px)] self-start overflow-hidden">
            <SideBar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onLogout={handleLogout}
              userName={firstName}
              showMobileTrigger={false}
              showDesktopSidebar={true}
              desktopDocked={true}
              items={sidebarItems}
              panelLabel={isAdminUser ? "Admin" : "Account"}
              panelName={isAdminUser ? "Admin" : "Profile"}
            />
          </div>

          <div className="min-w-0 px-8 py-8 xl:px-10">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-black">
                {isAdminUser ? "Admin Dashboard" : "Account Dashboard"}
              </h1>
              <p className="mt-1 text-sm text-black/55">
                {isAdminUser
                  ? "Monitor products and recent order activity from one place."
                  : "Manage your profile, cart, orders, and account settings from one place."}
              </p>
            </div>

            {renderWelcomeSection()}

            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
