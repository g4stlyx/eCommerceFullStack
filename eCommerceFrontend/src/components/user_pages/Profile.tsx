import React, { useState, useEffect } from "react";
import { Tab, Tabs, Form, Button, Container, Row, Col } from "react-bootstrap";
import { getUserByUsernameApi, updateUserApi } from "../api/UserApiService";
import { useAuth } from "../security/AuthContext";
import { UserForm } from "../../types/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bcrypt from "bcryptjs";

const Profile: React.FC = () => {
  const authContext = useAuth();
  const username = authContext.username;

  const [userData, setUserData] = useState<UserForm | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [hashedPassword, setHashedPassword] = useState<string>("");

  useEffect(() => {
    if (!username) return;
    const fetchUserData = async () => {
      try {
        const response = await getUserByUsernameApi(username);
        setUserData({
          username: response.data.username,
          email: response.data.email,
          address: response.data.address,
          phoneNumber: response.data.phoneNumber,
          password: "",
          isAdmin: response.data.admin,
          admin: response.data.admin,
        });

        setHashedPassword(response.data.password);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [username]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userData) {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || !userData) return;

    try {
      await updateUserApi(username, userData);
      toast.success("Profil başarıyla güncellendi!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profili güncellerken hata!");
    }
  };

  const validatePassword = (password: string): string | null => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{3,32}$/;
    if (!password) {
      return "Şifre boş olamaz!";
    }
    if (!passwordRegex.test(password)) {
      return "Şifre 3-32 karakter arasında olmalı, en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir!";
    }
    return null;
  };

  const handlePasswordChangeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || !userData) return;

    const validationError = validatePassword(newPassword);
    setPasswordError(validationError);
    if (validationError) return;

    try {
      const isPasswordMatch = await bcrypt.compare(oldPassword, hashedPassword);

      if (!isPasswordMatch) {
        toast.error("Mevcut şifreniz yanlış!");
        return;
      }
      console.log("passwords matched");
      console.log(newPassword);
      console.log(userData);
      await updateUserApi(username, { ...userData, password: newPassword});
      toast.success("Parolanız başarıyla güncellendi!");
      setNewPassword("");
      setOldPassword("");
      setPasswordError(null);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Parola güncellenirken hata!");
    }
  };

  return (
    <Container className="mt-4">
      <Tabs id="profile-tabs" defaultActiveKey="profile" className="mb-3">
        <Tab eventKey="profile" title="Profile">
          <Form onSubmit={handleProfileSubmit}>
            <Form.Group as={Row} controlId="formUsername">
              <Form.Label
                column
                sm={2}
                style={{ fontSize: "small", textAlign: "left" }}
              >
                Kullanıcı Adı
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  name="username"
                  value={userData?.username || ""}
                  readOnly
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formEmail">
              <Form.Label
                column
                sm={2}
                style={{ fontSize: "small", textAlign: "left" }}
              >
                Email
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="email"
                  name="email"
                  value={userData?.email || ""}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPhoneNumber">
              <Form.Label
                column
                sm={2}
                style={{ fontSize: "small", textAlign: "left" }}
              >
                Telefon Numarası
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={userData?.phoneNumber || ""}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formAddress">
              <Form.Label
                column
                sm={2}
                style={{ fontSize: "small", textAlign: "left" }}
              >
                Adresiniz
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  name="address"
                  value={userData?.address || ""}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
              Kaydet
            </Button>
          </Form>
        </Tab>

        <Tab eventKey="password" title="Change Password">
          <Form onSubmit={handlePasswordChangeSubmit}>
            <Form.Group as={Row} controlId="formOldPassword">
              <Form.Label
                column
                sm={2}
                style={{ fontSize: "small", textAlign: "left" }}
              >
                Mevcut Şifre
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Mevcut şifre"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formNewPassword">
              <Form.Label
                column
                sm={2}
                style={{ fontSize: "small", textAlign: "left" }}
              >
                Yeni Şifre
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yeni şifre"
                  isInvalid={!!passwordError}
                />
                <Form.Control.Feedback type="invalid">
                  {passwordError}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
              Güncelle
            </Button>
          </Form>
        </Tab>
      </Tabs>

      {/* Toast notifications */}
      <ToastContainer />
    </Container>
  );
};

export default Profile;
