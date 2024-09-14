import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import { UserForm, Wishlist, CartType, Order } from "../../types/types";
import {
  createUserApi,
  getUserByUsernameApi,
  updateUserApi,
  getCartByUsername,
  getOrdersByUsername,
  getWishlistByUsername,
} from "../api/UserApiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminUserUpdate: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserForm>({
    username: "",
    email: "",
    address: "",
    phoneNumber: "",
    password: "",
    isAdmin: false,
  });
  const [isCreating, setIsCreating] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [cart, setCart] = useState<CartType | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username && username !== "-1") {
      setIsCreating(false);
      setLoading(true);
      getUserByUsernameApi(username)
        .then((response) => {
          setUserData({
            username: response.data.username,
            email: response.data.email,
            address: response.data.address,
            phoneNumber: response.data.phoneNumber,
            password: "",
            isAdmin: response.data.admin, // Update isAdmin
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user: ", error);
          setError("Error fetching user: " + error);
        });

      // Fetch wishlist, cart, and orders for the user
      getWishlistByUsername(username)
        .then((response) => setWishlist(response.data))
        .catch((error) => {
          console.error("Error fetching wishlist: ", error);
          setError("Error fetching wishlist: " + error);
        });

      getCartByUsername(username)
        .then((response) => setCart(response.data))
        .catch((error) => {
          console.error("Error fetching cart: ", error);
          setError("Error fetching cart: " + error);
        });

      getOrdersByUsername(username)
        .then((response) => setOrders(response.data))
        .catch((error) => {
          console.error("Error fetching orders: ", error);
          setError("Error fetching orders: " + error);
        });

      setLoading(false);
    }
  }, [username]);

  const handleSubmit = async (event: React.FormEvent) => {
    if (!username || !userData) return;
    event.preventDefault();

    if (isCreating) {
      // Create user
      try {
        await createUserApi(userData);
        toast.success("Kullanıcı başarıyla oluşturuldu!");
      } catch (error) {
        toast.error("Kullanıcı oluştururken hata!" + error);
      }
    } else {
      // Update user
      try {
        await updateUserApi(username, userData);
        toast.success("Kullanıcı başarıyla güncellendi!");
      } catch (error) {
        toast.error("Kullanıcı güncellenirken hata!" + error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <Spinner animation="border" />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <br />
      <h2>{isCreating ? "Kullanıcı Oluştur" : "Kullanıcıyı Güncelle"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Kullanıcı Adı</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={userData?.username || ""}
            onChange={handleInputChange}
            placeholder="Enter username"
            disabled={!isCreating}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={userData?.email || ""}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group controlId="formPhoneNumber">
          <Form.Label>Telefon Numarası</Form.Label>
          <Form.Control
            type="tel"
            name="phoneNumber"
            value={userData?.phoneNumber || ""}
            onChange={handleInputChange}
            placeholder="Enter phone number"
          />
        </Form.Group>

        <Form.Group controlId="formAddress">
          <Form.Label>Adres</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={userData?.address || ""}
            onChange={handleInputChange}
            placeholder="Enter address"
          />
        </Form.Group>

        {/* Password Field only when creating */}
        {isCreating && (
          <Form.Group controlId="formPassword">
            <Form.Label>Şifre</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={userData?.password || ""}
              onChange={handleInputChange}
              placeholder="Enter password"
            />
          </Form.Group>
        )}

        <Form.Group
          controlId="formIsAdmin"
          className="text-center mt-3"
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Form.Check
            type="checkbox"
            name="isAdmin" // Ensure name matches state
            label="Admin"
            checked={userData?.isAdmin || false} // Ensure checked matches state
            onChange={handleInputChange}
          />
        </Form.Group>

        {!isCreating && (
          <>
            <div>
              <h3>Favoriler</h3>
              {wishlist ? (
                wishlist.wishlistItems && wishlist.wishlistItems.length > 0 ? (
                  wishlist.wishlistItems.map((item) => (
                    <div key={item.id}>
                      {item.product.name} - {item.product.price}
                    </div>
                  ))
                ) : (
                  <p>Favorilerde ürün bulunamadı.</p>
                )
              ) : (
                <p>Favoriler yükleniyor...</p>
              )}
            </div>

            <div>
              <h3>Sepetteki Ürünler</h3>
              {cart ? (
                cart.cartItems && cart.cartItems.length > 0 ? (
                  cart.cartItems.map((item) => (
                    <div key={item.id}>
                      {item.product.name} - {item.product.price} x{" "}
                      {item.quantity}
                    </div>
                  ))
                ) : (
                  <p>Sepette ürün bulunamadı.</p>
                )
              ) : (
                <p>Sepetteki ürünler yükleniyor...</p>
              )}
            </div>

            <div>
              <h3>Siparişler</h3>
              {orders ? (
                orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id}>
                      Sipariş #{order.id} - {order.totalPrice}
                    </div>
                  ))
                ) : (
                  <p>Sipariş bulunamadı.</p>
                )
              ) : (
                <p>Siparişler yükleniyor...</p>
              )}
            </div>
          </>
        )}

        <Button variant="primary" type="submit">
          {isCreating ? "Oluştur" : "Güncelle"}
        </Button>
      </Form>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default AdminUserUpdate;
