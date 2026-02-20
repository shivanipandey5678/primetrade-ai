import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProduct } from "../api/products.js";
import { useAuth } from "../context/AuthContext.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";

function FavoritesPage() {
  const { favorites } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    const ids = favorites.map((f) => (typeof f === "object" ? f._id : f));
    Promise.all(ids.map((id) => getProduct(id).then((r) => r.product).catch(() => null)))
      .then((list) => setProducts(list.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [favorites?.length, (favorites || []).join(",")]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!products.length) return <p style={{ padding: 20 }}>Abhi koi favorite nahi.</p>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Favorites</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {products.map((p) => (
          <Link
            key={p._id}
            to={"/product/" + p._id}
            style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8, textDecoration: "none", color: "inherit" }}
          >
            {p.image && <img src={p.image} alt="" style={{ width: "100%", maxHeight: 120, objectFit: "cover" }} />}
            <strong>{p.title}</strong> — ₹{p.price}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Favorites() {
  return (
    <PrivateRoute>
      <FavoritesPage />
    </PrivateRoute>
  );
}
