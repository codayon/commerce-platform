import { Link } from "react-router-dom";

export default function HomeView() {
  return (
    <div className="space-y-10">
      <section className="hero min-h-[55vh] rounded-box bg-base-100 shadow-sm">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold sm:text-5xl">Commerce Platform</h1>
            <p className="py-6 opacity-70">
              Discover products you love and check out in a few clicks. Browse the catalog, build
              your cart, and track your orders — all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/shop" className="btn btn-primary">
                Browse shop
              </Link>
              <Link to="/cart" className="btn btn-outline">
                View cart
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card bg-base-100 shadow-sm p-6 text-center">
          <h3 className="font-semibold mb-1">Browse</h3>
          <p className="text-sm opacity-70">Search and filter a growing catalog of products.</p>
        </div>
        <div className="card bg-base-100 shadow-sm p-6 text-center">
          <h3 className="font-semibold mb-1">Cart</h3>
          <p className="text-sm opacity-70">Adjust quantities and check out in a couple of taps.</p>
        </div>
        <div className="card bg-base-100 shadow-sm p-6 text-center">
          <h3 className="font-semibold mb-1">Orders</h3>
          <p className="text-sm opacity-70">Track every order from placement to delivery.</p>
        </div>
      </section>
    </div>
  );
}
