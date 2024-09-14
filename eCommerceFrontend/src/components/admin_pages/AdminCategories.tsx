import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllCategoriesApi,
  deleteCategoryApi,
} from "../api/CategoryApiService";
import { Button, Spinner, Table } from "react-bootstrap";
import { Category } from "../../types/types";

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      setError("Error fetching categories: "+ error);
    } finally{
      setLoading(false)
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
      <br /><h2>Kategorileri Yönet</h2>
      <Button variant="primary" onClick={handleAddCategory} className="mb-3">
        Kategori Ekle
      </Button><br /><br />
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
                <a href={`/categories/${category.name}`} style={{textDecoration:"none"}}>{category.name}</a>
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
