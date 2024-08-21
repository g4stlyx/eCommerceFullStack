import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types/types'; 
import { searchAndFilterProductsApi } from './api/ProductApiService';
import { Card, Col } from 'react-bootstrap';

const ProductsByCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>(); 
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await searchAndFilterProductsApi({ category });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products: '+ err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Products in {category}</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <Col key={product.id}>
              <a href={`/categories/${product.category.name}/products/${product.id}`} className="text-decoration-none">
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={product.imgSrc}
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.price} $</Card.Text>
                  </Card.Body>
                </Card>
              </a>
            </Col>
          ))) : (
          <div>No products found in this category.</div>
        )}
      </div>
    </div>
  );
};

export default ProductsByCategory;
