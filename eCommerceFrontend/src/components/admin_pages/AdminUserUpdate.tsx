import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { UserForm, Wishlist, Cart, Order } from "../../types/types";
import {
  createUserApi,
  getUserByUsernameApi,
  updateUserApi,
  getCartByUsername,
  getOrdersByUsername,
  getWishlistByUsername
} from "../api/UserApiService";

const AdminUserUpdate: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserForm | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (username && username !== "-1") {
      setIsCreating(false);
      getUserByUsernameApi(username)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => console.error("Error fetching user: ", error));

      // Fetch wishlist, cart, and orders for the user
      getWishlistByUsername(username)
        .then((response) => setWishlist(response.data))
        .catch((error) => console.error("Error fetching wishlist: ", error));

      getCartByUsername(username)
        .then((response) => setCart(response.data))
        .catch((error) => console.error("Error fetching cart: ", error));

      getOrdersByUsername(username)
        .then((response) => setOrders(response.data))
        .catch((error) => console.error("Error fetching orders: ", error));
    }
  }, [username]);

  const handleSubmit = async (event: React.FormEvent) => {
    if (!username || !userData) return;
    event.preventDefault();

    if (isCreating) {
      // Create user
      try {
        await createUserApi(userData);
        alert("User created successfully!");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    } else {
      // Update user
      try {
        await updateUserApi(username, userData);
        alert("User updated successfully!");
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userData) {
      const { name, value, type, checked } = e.target;
      setUserData({
        ...userData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  return (
    <div className="container">
      <h2>{isCreating ? "Create User" : "Update User"}</h2>
      //TODO: update button throws 400, handle the type of userData 
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={userData?.username || ""}
            onChange={handleInputChange}
            placeholder="Enter username"
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
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

        //TODO: centeralize this

        <Form.Group controlId="formIsAdmin" style={{display:"flex", justifyContent:"center", marginTop:"10px"}}>
          <Form.Check
            type="checkbox"
            name="isAdmin"
            label="Admin"
            checked={userData?.admin || false}
            onChange={handleInputChange}
          />
        </Form.Group>

        //TODO: if empty say the lists are empty

        {!isCreating && (
          <>
            <div>
              <h3>Wishlist Items</h3>
              {wishlist ? (
                wishlist.wishlistItems.map((item) => (
                  <div key={item.id}>
                    {item.product.name} - {item.product.price}
                  </div>
                ))
              ) : (
                <p>Loading wishlist...</p>
              )}
            </div>

            <div>
              <h3>Cart Items</h3>
              {cart ? (
                cart.cartItems.map((item) => (
                  <div key={item.id}>
                    {item.product.name} - {item.product.price} x {item.quantity}
                  </div>
                ))
              ) : (
                <p>Loading cart...</p>
              )}
            </div>

            <div>
              <h3>Orders</h3>
              {orders ? (
                orders.map((order) => (
                  <div key={order.id}>
                    Order #{order.id} - {order.totalPrice}
                  </div>
                ))
              ) : (
                <p>Loading orders...</p>
              )}
            </div>
          </>
        )}

        <Button variant="primary" type="submit">
          {isCreating ? "Oluştur" : "Güncelle"}
        </Button>
      </Form>
    </div>
  );
};

export default AdminUserUpdate;
