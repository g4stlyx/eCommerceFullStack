import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllCategoriesApi,
  deleteCategoryApi,
} from "../api/CategoryApiService";
import { Button, Spinner, Table, Form } from "react-bootstrap";
import { Category } from "../../types/types";

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategoriesApi();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      setError("Error fetching categories: " + error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId: number) => {
    const confirmDelete = window.confirm("Emin Misiniz?");
    if (confirmDelete) {
      try {
        await deleteCategoryApi(categoryId);
        setCategories(
          categories.filter((category) => category.id !== categoryId)
        );
      } catch (error) {
        console.error("Error deleting category", error);
      }
    }
  };

  const handleAddCategory = () => {
    navigate("/administrator/categories/-1/edit");
  };

  const handleEditCategory = (categoryId: number) => {
    navigate(`/administrator/categories/${categoryId}/edit`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    const sortedCategories = [...categories];

    switch (selectedOption) {
      case "nameAsc":
        sortedCategories.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        sortedCategories.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "idAsc":
        sortedCategories.sort((a, b) => a.id - b.id);
        break;
      case "idDesc":
        sortedCategories.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setCategories(sortedCategories);
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
    <div className="admin-categories-container">
      <br />
      <h2>Kategorileri Yönet</h2>
      <Button variant="primary" onClick={handleAddCategory} className="mb-3">
        Kategori Ekle
      </Button>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Form.Select
          aria-label="Kategori Sıralama Seçenekleri"
          onChange={handleSortChange}
          className="mb-3"
          style={{ maxWidth: "250px" }}
        >
          <option value="">Sıralama Seç</option>
          <option value="nameAsc">İsme Göre (Artan)</option>
          <option value="nameDesc">İsme Göre (Azalan)</option>
          <option value="idAsc">ID'ye Göre (Artan)</option>
          <option value="idDesc">ID'ye Göre (Azalan)</option>
        </Form.Select>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim</th>
            <th>Açıklama</th>
            <th>Eylemler</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>
                <a
                  href={`/categories/${category.name}`}
                  style={{ textDecoration: "none" }}
                >
                  {category.name}
                </a>
              </td>
              <td>{category.description}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleEditCategory(category.id)}
                  className="me-2"
                >
                  Güncelle
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteCategory(category.id)}
                >
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminCategories;
