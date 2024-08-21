import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllCategoriesApi,
  deleteCategoryApi,
} from "../api/CategoryApiService";
import { Button, Table } from "react-bootstrap";
import { Category } from "../../types/types";

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    try {
      const response = await getAllCategoriesApi();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
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

  return (
    <div className="admin-categories-container">
      <h2>Kategorileri Yönet</h2>
      <Button variant="primary" onClick={handleAddCategory} className="mb-3">
        Ekle
      </Button>
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
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteCategory(category.id)}
                >
                  Delete
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
