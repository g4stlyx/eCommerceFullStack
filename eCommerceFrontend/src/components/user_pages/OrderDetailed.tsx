import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Order } from "../../types/types";
import { getOrderByIdApi } from '../api/OrderApiService';
import { Table, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import "../../styles/orderDetailed.css";

const OrderDetailed: React.FC = () => {
  const { order_id } = useParams<{ order_id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order_id) {
        setError('Invalid order ID.');
        setLoading(false);
        return;
      }

      try {
        const response = await getOrderByIdApi(parseInt(order_id));
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details: '+err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [order_id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if(!order){
    return (
      <Container className="my-5">
        <Alert variant="danger">Sipariş bulunamadı.</Alert>
      </Container>
    );
  }

  return (
    <Container className="order-detailed-container my-5">
      <Row className="mb-4">
        <Col>
          <h2>Sipariş Detayları</h2>
          <br />
          <p>
            <strong>Sipariş ID:</strong> {order.id} <br />
            <strong>Sipariş Tarihi: </strong> {new Date(order.orderDate || '').toLocaleDateString()} <br />
            <strong>Sipariş Durumu: </strong> {order.status} <br />
            <strong>Kullanıcı: </strong> {order.user.username} <br />
            <strong>Sipariş Toplam Fiyat: </strong> ${order.totalPrice} <br />
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Ürün</th>
                <th>Miktar</th>
                <th>Birim Fiyatı</th>
                <th>Toplam Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.product.price.toFixed(2)}</td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetailed;
