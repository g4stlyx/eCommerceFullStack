import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { getProductByIdApi, createProductApi, updateProductApi } from '../api/ProductApiService';
import { getAllCategoriesApi } from '../api/CategoryApiService';
import { Product } from '../../types/types';
import { Category } from '../../types/types'; 

const AdminProductUpdate: React.FC = () => {
  const { product_id } = useParams<{ product_id: string }>();
  const [product, setProduct] = useState<Product>({
    id: -1,
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    imgSrc: '',
    updatedAt: new Date(),
    createdAt: new Date(),
    category: { id: -1, name: '', description: '', imgSrc: '', products:[] }
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCategories();
    if (product_id !== '-1' && product_id !== undefined) {
      fetchProduct(parseInt(product_id));
    }
  }, [product_id]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesApi();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async (id: number) => {
    try {
      const response = await getProductByIdApi(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => { // e: React.ChangeEvent<HTMLSelectElement>
    const selectedCategory = categories.find(category => category.id === parseInt(e.target.value));
    if (selectedCategory) {
      setProduct({
        ...product,
        category: selectedCategory,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product_id === '-1') {
        await createProductApi(product);
      } else {
        await updateProductApi(product.id, product);
      }
      navigate('/administrator/products');
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <div>
      <br />
      <h2>{product_id === '-1' ? 'Add Product' : 'Update Product'}</h2>
      <Form onSubmit={handleSubmit} className='container'>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDescription" className="mt-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formQuantity" className="mt-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product quantity"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPrice" className="mt-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            placeholder="Enter product price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formImgSrc" className="mt-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter image URL"
            name="imgSrc"
            value={product.imgSrc}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formCategory" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select" value={product.category?.id || ''} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          {product_id === '-1' ? 'Add Product' : 'Update Product'}
        </Button>
      </Form>
    </div>
  );
};

export default AdminProductUpdate;
