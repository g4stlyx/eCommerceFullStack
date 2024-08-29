import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../types/types";
import { searchAndFilterProductsApi } from "./api/ProductApiService";
import { Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import LoginModal from "../utils/LoginModal";
import ProductCard from "../utils/ProductCard";

const ProductsByCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await searchAndFilterProductsApi({ category });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products: " + err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <br />
      <h2>{category} Ürünleri</h2>
      <br />
      <div className="products-grid" style={{ margin: "5px 25px" }}>
        <Row xs={1} md={3} className="g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard product={product} />
            ))
          ) : (
            <div>Bu kategoriye ait ürün bulunamadı.</div>
          )}
        </Row>
      </div>

      {/* Toast notifications */}
      <ToastContainer />

      {/* Modal for login/signup */}
      <LoginModal />
    </div>
  );
};

export default ProductsByCategory;
