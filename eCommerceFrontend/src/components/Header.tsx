import React, { useEffect, useState } from "react";
import "../styles/header.css";
import "../styles/App.css";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { useAuth } from "./security/AuthContext";
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { getAllCategoriesApi } from "./api/CategoryApiService";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const authContext = useAuth();
  const isAuthenticated = authContext.isAuthenticated;
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      getAllCategoriesApi()
        .then((response) => {
          console.log("API Response:", response);
          if (Array.isArray(response.data)) {
            setCategories(response.data);
          } else {
            console.error("Expected an array but got:", response.data);
          }
        })
        .catch((err) => console.log(err));
    };

    fetchCategories();
  }, []);

  const search = (formEvent: React.FormEvent) => {
    formEvent.preventDefault();
    try {
      navigate("/products/search?q=" + searchQuery);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="header"
    >
      <Container>
        <Navbar.Brand href="/">g-commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Kategoriler" id="basic-nav-dropdown">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <NavDropdown.Item
                    key={category}
                    href={`/categories/${category}`}
                  >
                    {category}
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
          <Form className="d-flex flex-grow-1" style={{ margin: "0 30px" }} onSubmit={search}>
            <FormControl
              type="search"
              placeholder="Ara.."
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: "10px" }}
            />
            <Button variant="outline-success" onClick={search}>
              Ara
            </Button>
          </Form>
          <Nav className="ms-auto">
            <Nav.Link href="/cart">
              <FaShoppingCart className="me-1" /> Sepetim
            </Nav.Link>
            <Nav.Link href="/wishlist">
              <FaHeart className="me-1" /> Favorilerim
            </Nav.Link>
            <Nav.Link href={isAuthenticated ? "/profile" : "/login"}>
              <FaUser className="me-1" />{" "}
              {isAuthenticated ? "Hesabım" : "Giriş yap"}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
