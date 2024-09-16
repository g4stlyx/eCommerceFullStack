import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Table, Form } from 'react-bootstrap';
import { getAllProductsApi, deleteProductApi } from '../api/ProductApiService';
import { Product } from '../../types/types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProductsApi();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to fetch products: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate('/administrator/products/-1/edit');
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    const sortedProducts = [...products];

    switch (selectedOption) {
      case "nameAsc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "idAsc":
        sortedProducts.sort((a, b) => a.id - b.id);
        break;
      case "idDesc":
        sortedProducts.sort((a, b) => b.id - a.id);
        break;
      case "priceAsc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "quantityAsc":
        sortedProducts.sort((a, b) => a.quantity - b.quantity);
        break;
      case "quantityDesc":
        sortedProducts.sort((a, b) => b.quantity - a.quantity);
        break;
      default:
        break;
    }

    setProducts(sortedProducts);
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center" style={{ marginTop: '20px' }}>
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
      <div style={{display:"flex", justifyContent:"center"}}>
      <Form.Select aria-label="Ürün Sıralama Seçenekleri" onChange={handleSortChange} className="mt-3 mb-3" style={{maxWidth:"300px"}}>
        <option value="">Sıralama Seç</option>
        <option value="nameAsc">İsme Göre (Artan)</option>
        <option value="nameDesc">İsme Göre (Azalan)</option>
        <option value="idAsc">ID'ye Göre (Artan)</option>
        <option value="idDesc">ID'ye Göre (Azalan)</option>
        <option value="priceAsc">Fiyata Göre (Önce En Ucuz)</option>
        <option value="priceDesc">Fiyata Göre (Önce En Pahalı)</option>
        <option value="quantityAsc">Adete Göre (Artan)</option>
        <option value="quantityDesc">Adete Göre (Azalan)</option>
      </Form.Select>
      </div>
      <Table striped bordered hover>
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
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price.toFixed(2)}</td>
              <td>{product.quantity}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleEditProduct(product.id)}
                  className="me-2"
                >
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
