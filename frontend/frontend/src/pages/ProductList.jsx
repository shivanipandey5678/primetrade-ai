import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/products.js";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    getProducts({ page, limit: 10, search: search || undefined })
      .then((res) => {
        setProducts(res.products);
        setTotal(res.total);
        setErr("");
      })
      .catch((e) => setErr(e.response?.data?.message || "Load fail"))
      .finally(() => setLoading(false));
  }, [page, search]);

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Products</h1>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        style={{ marginBottom: 16, padding: 8, width: 280 }}
      />
      {err && <p style={{ color: "red" }}>{err}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {products.map((p) => (
              <Link
                key={p._id}
                to={"/product/" + p._id}
                style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8, textDecoration: "none", color: "inherit" }}
              >
                {p.image && <img src={p.image} alt="" style={{ width: "100%", maxHeight: 140, objectFit: "cover" }} />}
                <strong>{p.title}</strong> — ₹{p.price}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
            <button disabled={page <= 1} onClick={() => setPage((x) => x - 1)}>Prev</button>
            <span>Page {page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((x) => x + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
