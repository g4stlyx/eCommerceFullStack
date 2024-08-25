import React, { useEffect, useState } from "react";
import { searchAndFilterProductsApi } from "./api/ProductApiService";
import { getAllCategoriesApi } from "./api/CategoryApiService";
import { Category, Product } from "../types/types";
import { Card, Col, Form, Row, Button, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const ProductsBySearch: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultQuery = queryParams.get("q") || "";

  const [searchCriteria, setSearchCriteria] = useState<{
    query: string;
    category: string | undefined;
    priceMin: number | undefined;
    priceMax: number | undefined;
  }>({
    query: defaultQuery,
    category: undefined,
    priceMin: undefined,
    priceMax: undefined,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await getAllCategoriesApi();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // changes the query if smth searched by the header
  useEffect(() => {
    setSearchCriteria((prevCriteria) => ({
      ...prevCriteria,
      query: defaultQuery,
    }));
  }, [location.search, defaultQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); 
      try {
        const response = await searchAndFilterProductsApi({
          q: searchCriteria.query,
          category: searchCriteria.category,
          price_min: searchCriteria.priceMin,
          price_max: searchCriteria.priceMax,
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchCriteria]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    if (selectedCategory === "") {
      setSearchCriteria((prevCriteria) => ({
        ...prevCriteria,
        category: undefined,
      }));
    } else {
      setSearchCriteria((prevCriteria) => ({
        ...prevCriteria,
        category: selectedCategory,
      }));
    }
  };

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPriceMin(parseFloat(e.target.value) || undefined);
  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPriceMax(parseFloat(e.target.value) || undefined);

  const handleSearchClick = () => {
    setSearchCriteria({
      query,
      category: category || undefined,
      priceMin,
      priceMax,
    });
  };

  return (
    <div className="d-flex">
      <div className="filter-menu" style={{ width: "250px", padding: "15px" }}>
        <h5>Filters</h5>
        <Form.Group>
          <Form.Control
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Ara.."
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Select value={category} onChange={handleCategoryChange}>
            <option value="">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Control
            type="number"
            value={priceMin || ""}
            onChange={handlePriceMinChange}
            placeholder="Minimum Fiyat"
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Control
            type="number"
            value={priceMax || ""}
            onChange={handlePriceMaxChange}
            placeholder="Maximum Fiyat"
          />
        </Form.Group>

        <Button variant="primary" className="mt-3" onClick={handleSearchClick}>
          Ürün Ara
        </Button>
      </div>

      <div className="products-grid" style={{ margin: "25px 15px", flex: 1 }}>
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <h5>{products.length} ürün bulundu.</h5>

            <Row xs={1} md={3} className="g-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <Col key={product.id}>
                    <a
                      href={`/products/${product.id}`}
                      className="text-decoration-none"
                    >
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
                ))
              ) : (
                <div>Aradığınız kritlerde ürün bulunamadı.</div>
              )}
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsBySearch;
