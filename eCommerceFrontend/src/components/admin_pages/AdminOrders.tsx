import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';
import {Order} from "../../types/types"
import { getAllOrdersApi } from '../api/OrderApiService';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrdersApi();
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders: '+err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container className="my-4">
      <h1 className="mb-4 text-center">Siparişleri Yönet</h1>

      {loading && <Spinner animation="border" variant="primary" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Kullanıcı</th>
              <th>Siparişler</th>
              <th>Sipariş Durumu</th>
              <th>Toplam Fiyat</th>
              <th>Sipariş Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user.username}</td>
                <td>{order.orderItems.map((orderItem)=>(<td key={orderItem.id}>{orderItem.product.name}</td>))}</td>
                <td>{order.status}</td>
                <td>{order.totalPrice}</td>
                <td>{order.orderDate.toUTCString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminOrders;