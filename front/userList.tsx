import { useState, useEffect } from 'react';
import { BASE_DOMAIN } from 'config';
import { Table } from '@mui/material';

const UserList = () => {
  const [users, setUsers] = useState<{ 
    id: string, 
    username: string,
    password: string,
    email: string,
    state_id: string,
    restore_token: string,
    is_active: boolean,
    token: string
  }[]>([]);
  const [wallets, setWallets] = useState<{
    id: string,
    valuta_id: string,
    user_id: string
  }[]>([]);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_DOMAIN}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_DOMAIN}/koshelki`);
        const data = await response.json();
        setWallets(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>User List</h2>
      <Table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Email</th>
            <th>State ID</th>
            <th>Restore Token</th>
            <th>Is Active</th>
            <th>Token</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.email}</td>
              <td>{user.state_id}</td>
              <td>{user.restore_token}</td>
              <td>{user.is_active}</td>
              <td>{user.token}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Table>
        <thead>
          <tr>
            <th>valuta_id</th>
            <th>user_id</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((wallet) => (
            <tr key={wallet.id}>
              <td>{wallet.valuta_id}</td>
              <td>{wallet.user_id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;