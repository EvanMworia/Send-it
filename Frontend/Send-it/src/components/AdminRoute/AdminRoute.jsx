import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  if (!loggedInUser || loggedInUser.Role !== 'Admin') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;