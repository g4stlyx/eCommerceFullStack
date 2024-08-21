import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryByIdApi, createCategoryApi, updateCategoryApi } from "../api/CategoryApiService";
import { Form, Button } from "react-bootstrap";
import { Category } from "../../types/types";

const AdminCategoryUpdate: React.FC = () => {
  const [category, setCategory] = useState<Category>({
    id: -1,
    name: "",
    description: "",
    imgSrc: "",
    products: []
  });
  const { category_id } = useParams<{ category_id: string }>();
  const navigate = useNavigate();

  const isEditing = category_id !== "-1";

  useEffect(() => {
    if (isNaN(Number(category_id))) {
      navigate("/not-found");
      return;
    }

    if (isEditing) {
      fetchCategoryById(Number(category_id));
    }
  }, [category_id, isEditing, navigate]);

  const fetchCategoryById = async (id: number) => {
    try {
      const response = await getCategoryByIdApi(id);
      if (!response.data) {
        navigate("/not-found");
        return;
      }
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching category", error);
      navigate("/not-found");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateCategoryApi(category.id, category);
      } else {
        await createCategoryApi(category);
      }
      navigate("/administrator/categories");
    } catch (error) {
      console.error("Error submitting category", error);
    }
  };

  return (
    <div className="admin-category-update-container">
      <h2>{isEditing ? "Kategori Güncelle" : "Kategori Ekle"}</h2>
      <Form onSubmit={handleSubmit} className="container">
        <Form.Group controlId="formCategoryName" className="mb-3">
          <Form.Label>İsim</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={category.name}
            onChange={handleInputChange}
            placeholder="Kategori İsmi"
            required
          />
        </Form.Group>

        <Form.Group controlId="formCategoryDescription" className="mb-3">
          <Form.Label>Açıklama</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={category.description}
            onChange={handleInputChange}
            placeholder="Kategori Açıklaması"
            required
          />
        </Form.Group>

        <Form.Group controlId="formCategoryImgSrc" className="mb-3">
          <Form.Label>Görsel URL</Form.Label>
          <Form.Control
            type="text"
            name="imgSrc"
            value={category.imgSrc}
            onChange={handleInputChange}
            placeholder="Görsel URL"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {isEditing ? "Güncelle" : "Ekle"}
        </Button>
      </Form>
    </div>
  );
};

export default AdminCategoryUpdate;
