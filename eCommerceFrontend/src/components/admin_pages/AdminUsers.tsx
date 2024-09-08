import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { getAllUsersApi, deleteUserApi } from '../api/UserApiService';
import { User } from '../../types/types';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsersApi();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
