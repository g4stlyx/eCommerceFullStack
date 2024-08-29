import React, { useEffect, useState } from "react";
import { Category, Product } from "../types/types";
import { getAllProductsApi } from "./api/ProductApiService";
import { getAllCategoriesApi } from "./api/CategoryApiService";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import "../styles/mainPage.css";
import { ToastContainer } from "react-toastify";
import LoginModal from "../utils/LoginModal";
import ProductCard from "../utils/ProductCard";

const MainPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProductsApi();
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesApi();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <Container fluid className="main-page">
      <Row>
        {/* Categories Side Menu */}
        <Col md={3} className="categories-left-menu">
          <Card className="mb-4">
            <Card.Header as="h4">Categories</Card.Header>
            <ListGroup variant="flush">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/categories/${category.name}`}
                  className="text-decoration-none"
                >
                  <ListGroup.Item className="category-item">
                    {category.name}
                  </ListGroup.Item>
                </a>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Product Grid */}
        <Col md={9}>
          <Row xs={1} md={3} className="g-4">
            {products.map((product) => (
              <ProductCard product={product} />
            ))}
          </Row>
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
