import api from "./axios.js";
import { PRODUCTS_BASE } from "../config.js";

export async function getProducts(params = {}) {
  const { data } = await api.get(PRODUCTS_BASE, { params });
  return data;
}

export async function getProduct(id) {
  const { data } = await api.get(PRODUCTS_BASE + "/" + id);
  return data;
}

export async function addFavorite(productId) {
  const { data } = await api.post(PRODUCTS_BASE + "/" + productId + "/favorite");
  return data;
}

export async function removeFavorite(productId) {
  const { data } = await api.delete(PRODUCTS_BASE + "/" + productId + "/favorite");
  return data;
}
