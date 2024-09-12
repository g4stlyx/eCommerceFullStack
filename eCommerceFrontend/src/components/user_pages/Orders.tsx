import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Order } from "../../types/types";
import { useAuth } from "../security/AuthContext";
import { getOrdersByUsername } from "../api/UserApiService";
import '../../styles/orders.css';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>();
  const authContext = useAuth();
  const username = authContext.username;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchOrders = () => {
      getOrdersByUsername(username)
        .then((response) => {
          setOrders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user: ", error) 
          setLoading(false);
        });
    };

    fetchOrders();
  }, [username]);

  return (
    <Container className="orders-container mt-5">
      <h2 className="text-center mb-4">Siparişlerim</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="g-4">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Col key={order.id} md={6} lg={4}>
                <Card className="order-card shadow-sm">
                  <Card.Body>
                    <Card.Title>Sipariş #{order.id}</Card.Title>
                    <Card.Text>
                      <strong>Sipariş Tarihi: </strong> {new Date(order.orderDate).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text>
                      <strong>Toplam Fiyat: </strong> ${order.totalPrice.toFixed(2)}
                    </Card.Text>
                    <Card.Text>
                      <strong>Sipariş Durumu: </strong> {order.status}
                    </Card.Text>
                    <Card.Link href={`/orders/${order.id}`}>Detayları İncele</Card.Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <div className="text-center w-100">
              <p>Sipariş Bulunamadı</p>
            </div>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Orders;