import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Table } from 'react-bootstrap';
import { getAllUsersApi, deleteUserApi } from '../api/UserApiService';
import { User } from '../../types/types';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await getAllUsersApi();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users: '+ error);
    } finally{
      setLoading(false)
    }
  };

  const handleCreateUser = () => {
    navigate('/administrator/users/-1/edit')
  };

  const handleUpdateUser = (username: string) => {
    navigate(`/administrator/users/${username}/edit`); 
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      try {
        await deleteUserApi(userId);
        fetchUsers();
      } catch (error) {
        console.error('Kullanıcı silinirken hata: ', error);
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
      <h2>Kullanıcı Yönetim Sayfası</h2>
      <Button variant="primary" onClick={handleCreateUser}>
        Kullanıcı Oluştur
      </Button>
      <br />
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Kullanıcı Adı</th>
            <th>Email Adresi</th>
            <th>Adres</th>
            <th>Telefon Numarası</th>
            <th>Rol</th>
            <th>Eylemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.admin ? "Admin" : "User"}</td>
              <td>
                <Button variant="warning" onClick={() => handleUpdateUser(user.username)} className="me-2">
                  Detaylar
                </Button>
                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
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

export default AdminUsers;
