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
import { Category } from "../types/types";

const Header: React.FC = () => {
  const authContext = useAuth();
  const isAuthenticated = authContext.isAuthenticated;
  const isAdmin = authContext.isAdmin;
  const [categories, setCategories] = useState<Category[]>([]);
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
      const queryParam = searchQuery;
      const searchPath = `/products/search?q=${encodeURIComponent(queryParam)}`;

      if (location.pathname === '/products/search') {
        // Update the query string without navigating
        navigate(searchPath, { replace: true });
      } else {
        navigate(searchPath);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        className="top-bar"
        style={{
          backgroundColor: "#212529",
          color: "#ffffff",
          padding: "2px 0",
          fontSize: "0.8rem",
        }}
      >
        <Container>
          <Nav className="ms-auto" style={{ justifyContent: "flex-end" }}>
            <Nav.Link href="/about-us" style={{ color: "#ffffff" }}>
              Hakkımızda
            </Nav.Link>
            <Nav.Link href="/faq" style={{ color: "#ffffff" }}>
              Yardım ve Destek
            </Nav.Link>
            
            {/* {isAdmin && <Nav.Link href="/administrator" style={{ color: "red" }}>
              Yönetim Ana Sayfa
            </Nav.Link>} */}
            {isAdmin && <Nav.Link href="/administrator/products" style={{ color: "red" }}>
              Ürünleri Yönet
            </Nav.Link>}
            {isAdmin && <Nav.Link href="/administrator/categories" style={{ color: "red" }}>
              Kategorileri Yönet
            </Nav.Link>}
            {isAdmin && <Nav.Link href="/administrator/users" style={{ color: "red" }}>
              Kullanıcıları Yönet
            </Nav.Link>}
            {isAdmin && <Nav.Link href="/administrator/orders" style={{ color: "red" }}>
              Siparişleri Yönet
            </Nav.Link>}


          </Nav>
        </Container>
      </div>

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
                      key={category.id}
                      href={`/categories/${category.name}`}
                    >
                      {category.name}
                    </NavDropdown.Item>
                  ))
                ) : (
                  <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
            <Form
              className="d-flex flex-grow-1"
              style={{ margin: "0 30px" }}
              onSubmit={search}
            >
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
              {isAuthenticated ? (
                <NavDropdown
                  title={
                    <>
                      <FaUser className="me-1" />
                      Hesabım
                    </>
                  }
                  id="account-dropdown"
                >
                  <NavDropdown.Item href="/profile/orders">
                    Siparişlerim
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/profile/reviews">
                    Değerlendirmelerim
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/profile">
                    Kullanıcı Bilgilerim
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/logout">Çıkış yap</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link href="/login">
                  <FaUser className="me-1" /> Giriş yap
                </Nav.Link>
              )}

              <Nav.Link href="/profile/wishlist">
                <FaHeart className="me-1" /> Favorilerim
              </Nav.Link>
              <Nav.Link href="/cart">
                <FaShoppingCart className="me-1" /> Sepetim
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;