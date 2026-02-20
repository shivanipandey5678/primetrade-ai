import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, addFavorite, removeFavorite } from "../api/products.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, favorites, updateFavorites } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favLoad, setFavLoad] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isFav = product && favorites && favorites.some((f) => String(f) === String(product._id));

  const toggleFav = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setFavLoad(true);
    try {
      if (isFav) {
        const res = await removeFavorite(id);
        updateFavorites(res.favorites);
      } else {
        const res = await addFavorite(id);
        updateFavorites(res.favorites);
      }
    } finally {
      setFavLoad(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Product nahi mila.</p>;

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <button type="button" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Back</button>
      {product.image && <img src={product.image} alt="" style={{ width: "100%", maxHeight: 280, objectFit: "cover" }} />}
      <h1>{product.title}</h1>
      <p>₹{product.price}</p>
      <p>{product.description}</p>
      {token && (
        <button onClick={toggleFav} disabled={favLoad} style={{ marginTop: 12 }}>
          {favLoad ? "..." : isFav ? "Remove from favorites" : "Add to favorites"}
        </button>
      )}
    </div>
  );
}
