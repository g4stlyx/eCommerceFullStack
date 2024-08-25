import React, { useEffect, useState } from "react";
import { Category, Product } from "../types/types";
import { getAllProductsApi } from "./api/ProductApiService";
import { getAllCategoriesApi } from "./api/CategoryApiService";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import "../styles/mainPage.css";

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
              <Col key={product.id}>
                <a href={`/products/${product.id}`} className="text-decoration-none">
                  <Card className="h-100">
                    <Card.Img
                      variant="top"
                      src={product.imgSrc}
                      alt={product.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>{product.price} $</Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
