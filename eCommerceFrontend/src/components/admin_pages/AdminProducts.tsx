import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Table } from 'react-bootstrap';
import { getAllProductsApi, deleteProductApi } from '../api/ProductApiService';
import { Product } from '../../types/types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await getAllProductsApi();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to fetch products: '+ error);
    } finally{
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate('/administrator/products/-1/edit')
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/administrator/products/${productId}/edit`); 
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        await deleteProductApi(productId);
        fetchProducts();
      } catch (error) {
        console.error('Ürün silinirken hata: ', error);
      }
    }
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
    <div>
      <br />
      <h2>Ürün Yönetim Sayfası</h2>
      <Button variant="primary" onClick={handleAddProduct}>
        Ürün ekle
      </Button>
      <br />
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim</th>
            <th>Açıklama</th>
            <th>Fiyat</th>
            <th>Adet</th>
            <th>Eylemler</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price.toFixed(2)}</td>
              <td>{product.quantity}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditProduct(product.id)} className="me-2">
                  Güncelle
                </Button>
                <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
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

export default AdminProducts;
