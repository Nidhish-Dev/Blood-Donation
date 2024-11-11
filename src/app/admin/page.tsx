'use client'
import React, { useState } from 'react';
import AdminData from '@/components/AdminData';

function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const requiredPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD; 

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (password === requiredPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  };

  return (
    <div>
      {!isAuthenticated ? (
        <form onSubmit={handleSubmit}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <h1 className='text-2xl font-semibold text-center'>Admin Dashboard</h1>
          {/* Your admin content goes here */}
         <AdminData />
        </div>
      )}
    </div>
  );
}

export default AdminPage;
