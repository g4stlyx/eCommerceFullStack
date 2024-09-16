import React, { useEffect, useState } from "react";
import { Category, Product } from "../types/types";
import { getAllProductsApi } from "./api/ProductApiService";
import { getAllCategoriesApi } from "./api/CategoryApiService";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Spinner,
  Form,
} from "react-bootstrap";
import "../styles/mainPage.css";
import { toast, ToastContainer } from "react-toastify";
import LoginModal from "../utils/LoginModal";
import ProductCard from "../utils/ProductCard";

const MainPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>("default");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await getAllProductsApi();
        setProducts(response.data);
      } catch (error) {
        toast.error("Failed to fetch products: " + error);
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await getAllCategoriesApi();
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to fetch categories: " + error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Sorting logic
  const sortProducts = (products: Product[]) => {
    switch (sortOption) {
      case "nameAsc":
        return [...products].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      case "nameDesc":
        return [...products].sort((a, b) =>
          b.name.localeCompare(a.name)
        );
      case "priceLowHigh":
        return [...products].sort((a, b) => a.price - b.price);
      case "priceHighLow":
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  };

  return (
    <Container fluid className="main-page">
      <Row>
        {/* Categories Side Menu */}
        <Col md={3} className="categories-left-menu">
          <Card className="mb-4">
            <Card.Header as="h4">Categories</Card.Header>
            <ListGroup variant="flush">
              {loadingCategories ? (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/categories/${category.name}`}
                    className="text-decoration-none"
                  >
                    <ListGroup.Item className="category-item">
                      {category.name}
                    </ListGroup.Item>
                  </a>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* Product Grid */}
        <Col md={9}>
          {/* Sorting ComboBox */}
          <div className="d-flex justify-content-end mb-3">
            <Form.Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ maxWidth: "300px" }}
            >
              <option value="default">Önerilen Sıralama</option>
              <option value="nameAsc">İsme Göre (Artan)</option>
              <option value="nameDesc">İsme Göre (Azalan)</option>
              <option value="priceLowHigh">Fiyata Göre (Önce En Ucuz)</option>
              <option value="priceHighLow">Fiyata Göre (Önce En Pahalı)</option>
            </Form.Select>
          </div>

          {loadingProducts ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row xs={1} md={3} className="g-4">
              {sortProducts(products).map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Toast notifications */}
      <ToastContainer />

      {/* Modal for login/signup */}
      <LoginModal />
    </Container>
  );
};

export default MainPage;
