import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import {UserForm } from "../../types/types";
import { createUserApi, getUserByUsernameApi, updateUserApi } from "../api/UserApiService";
import { getWishlistApi } from "../api/WishlistApiService";
import { getCartApi } from "../api/CartApiService";

const AdminUserUpdate: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserForm | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(true);

  useEffect(() => {
    if (username && username !== "-1") {
      setIsCreating(false);
      getUserByUsernameApi(username)
        .then((response) => setUserData(response.data))
        .catch((error) => console.error("Error fetching user: ", error));
    }
  }, [username]);

  const handleSubmit = async (event: React.FormEvent) => {
    if(!username || !userData) return;
    event.preventDefault();

    if (isCreating) {
      try {
        await createUserApi(userData);
        alert("User created successfully!");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    } else {
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
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
    }
  };

  return (
    <div className="container">
      <h2>{isCreating ? 'Create User' : 'Update User'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={userData?.username || ''}
            onChange={handleInputChange}
            placeholder="Enter username"
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={userData?.email || ''}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group controlId="formPhoneNumber">
          <Form.Label>Telefon Numarası</Form.Label>
          <Form.Control
            type="tel"
            name="phoneNumber"
            value={userData?.phoneNumber || ''}
            onChange={handleInputChange}
            placeholder="Enter phone number"
          />
        </Form.Group>

        <Form.Group controlId="formAddress">
          <Form.Label>Adres</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={userData?.address || ''}
            onChange={handleInputChange}
            placeholder="Enter address"
          />
        </Form.Group>

        {!isCreating && (
          <>
            <div>
              <h3>Wishlist Items</h3>
              {/* Display the user's wishlist items */}
            </div>

            <div>
              <h3>Cart Items</h3>
              {/* Display the user's cart items */}
            </div>

            <div>
              <h3>Orders</h3>
              {/* Display the user's orders */}
            </div>
          </>
        )}

        <Button variant="primary" type="submit">
          {isCreating ? 'Oluştur' : 'Güncelle'}
        </Button>
      </Form>
    </div>
  );
};

export default AdminUserUpdate;
