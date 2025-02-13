import React from 'react';
import { AreaCards, AreaCharts, AreaTable } from '../../components';
import AreaTopAdmin from '../../components/AdminPages/AdminDashboard/AreaTopAdmin/AreaTopAdmin';
// import './AdminScreen.css';

const AdminDashboard = () => {
  return (
    <div className="content-area">
      <AreaTopAdmin />
      <AreaCards />
      <AreaCharts />
      <AreaTable />
    </div>
  );
};

export default AdminDashboard;