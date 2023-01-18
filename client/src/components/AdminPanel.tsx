import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
    loadProducts();
    
    // VULNERABILITY: Log admin access
    console.log('Admin panel accessed by:', localStorage.getItem('username'));
    console.log('Admin token:', localStorage.getItem('userToken'));
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setUsers(response.data);
      
      // VULNERABILITY: Log user data
      console.log('Admin loaded users:', response.data);
    } catch (error: any) {
      console.error('Error loading users:', error);
      
      // VULNERABILITY: Expose error details
      if (error.response) {
        setMessage(`Error loading users: ${error.response.data.message || 'Unknown error'}`);
      }
    }
  };

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:5000/api/admin/products', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setProducts(response.data);
      
      // VULNERABILITY: Log product data
      console.log('Admin loaded products:', response.data);
    } catch (error: any) {
      console.error('Error loading products:', error);
      
      // VULNERABILITY: Expose error details
      if (error.response) {
        setMessage(`Error loading products: ${error.response.data.message || 'Unknown error'}`);
      }
    }
  };
  const promoteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(`http://localhost:5000/api/admin/users/${userId}/promote`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setMessage('User promoted successfully!');
      loadUsers(); // Reload users
      
      // VULNERABILITY: Log promotion action
      console.log('User promoted:', { userId, response: response.data });
    } catch (error: any) {
      console.error('Error promoting user:', error);
      
      // VULNERABILITY: Expose error details
      if (error.response) {
        setMessage(`Error promoting user: ${error.response.data.message || 'Unknown error'}`);
      }
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setMessage('User deleted successfully!');
      loadUsers(); // Reload users
      
      // VULNERABILITY: Log deletion action
      console.log('User deleted:', userId);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      
      // VULNERABILITY: Expose error details
      if (error.response) {
        setMessage(`Error deleting user: ${error.response.data.message || 'Unknown error'}`);
      }
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setMessage('Product deleted successfully!');
      loadProducts(); // Reload products
      
      // VULNERABILITY: Log deletion action
      console.log('Product deleted:', productId);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      
      // VULNERABILITY: Expose error details
      if (error.response) {
        setMessage(`Error deleting product: ${error.response.data.message || 'Unknown error'}`);
      }
    }
  };
  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      {/* VULNERABILITY: Display message with potential XSS */}
      {message && (
        <div 
          className="admin-message"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}

      <div className="admin-tabs">
        <button 
          onClick={() => setActiveTab('users')}
          className={activeTab === 'users' ? 'active' : ''}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={activeTab === 'products' ? 'active' : ''}
        >
          Products
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="users-section">
          <h3>User Management</h3>
          <div className="users-list">
            {users.map(user => (
              <div key={user._id} className="user-item">
                <div className="user-info">
                  <h4>{user.username}</h4>
                  <p>Email: {user.email}</p>
                  <p>Name: {user.firstName} {user.lastName}</p>
                  <p>Role: {user.role}</p>
                  
                  {/* VULNERABILITY: Expose user ID */}
                  <p className="user-id">ID: {user._id}</p>
                </div>
                <div className="user-actions">
                  <button 
                    onClick={() => promoteUser(user._id)}
                    className="promote-btn"
                  >
                    Promote to Admin
                  </button>
                  <button 
                    onClick={() => deleteUser(user._id)}
                    className="delete-btn"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="products-section">
          <h3>Product Management</h3>
          <div className="products-list">
            {products.map(product => (
              <div key={product._id} className="product-item">
                <div className="product-info">
                  <h4>{product.name}</h4>
                  
                  {/* VULNERABILITY: Render product description with XSS */}
                  <div 
                    className="product-description"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  
                  <p>Price: ${product.price}</p>
                  <p>Category: {product.category}</p>
                  <p>Stock: {product.stock}</p>
                  
                  {/* VULNERABILITY: Expose product ID */}
                  <p className="product-id">ID: {product._id}</p>
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => deleteProduct(product._id)}
                    className="delete-btn"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* VULNERABILITY: Expose sensitive admin data */}
      <div style={{ display: 'none' }} className="admin-debug">
        <p>Admin Token: {localStorage.getItem('userToken')}</p>
        <p>Admin User: {localStorage.getItem('username')}</p>
        <p>Total Users: {users.length}</p>
        <p>Total Products: {products.length}</p>
      </div>
    </div>
  );
};

export default AdminPanel;