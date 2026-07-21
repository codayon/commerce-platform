// Tiny fetch wrapper around the API. Cookies are sent automatically because
// the browser treats /api same-origin (proxied by Vite in dev).

async function request(method, path, body) {
  const opts = { method, headers: {}, credentials: "include" };
  if (body !== undefined) {
    opts.headers["content-type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  let data = null;
  try {
    const res = await fetch(`/api/v1${path}`, opts);
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }
    if (!res.ok) {
      const message = (data && data.message) || `Request failed (${res.status})`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } catch (err) {
    if (err.status) throw err;
    throw new Error("Could not reach the server. Is the backend running?");
  }
}

export const api = {
  // Auth
  signup: (username, email, password) =>
    request("POST", "/auth/signup", { username, email, password }),
  verifyOtp: (email, otp) => request("POST", "/auth/verify-otp", { email, otp }),
  resendOtp: (email) => request("POST", "/auth/resend-otp", { email }),
  login: (email, password) => request("POST", "/auth/login", { email, password }),
  logout: () => request("POST", "/auth/logout"),
  getProfile: () => request("GET", "/user/get-profile"),

  // Catalog
  listProducts: (params = {}) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") qs.set(k, v);
    }
    const q = qs.toString();
    return request("GET", `/product/list-products${q ? `?${q}` : ""}`);
  },
  listCategories: () => request("GET", "/category/list-categories"),

  // Cart
  getCart: () => request("GET", "/cart/get-cart"),
  addToCart: (product, quantity = 1) => request("POST", "/cart/add-item", { product, quantity }),
  removeFromCart: (productId) => request("DELETE", `/cart/remove-item/${productId}`),

  // Orders
  createOrder: () => request("POST", "/order/create-order"),
  orderHistory: () => request("GET", "/order/order-history"),
  orderDetails: (orderId) => request("GET", `/order/order-details/${orderId}`),
};
