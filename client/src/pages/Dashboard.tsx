import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryService, { Category } from '../services/category.service';
import RunnerService, { Runner } from '../services/runner.service';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, runnersData] = await Promise.all([
          CategoryService.getAll(),
          RunnerService.getAll()
        ]);
        setCategories(categoriesData);
        setRunners(runnersData);
        setError('');
      } catch (err: any) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading"></div>;
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Admin Dashboard</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Categories</h3>
          <p className="stat-number">{categories.length}</p>
          <Link to="/admin/categories" className="btn btn-outline">Manage Categories</Link>
        </div>
        
        <div className="stat-card">
          <h3>Runners</h3>
          <p className="stat-number">{runners.length}</p>
          <Link to="/admin/runners" className="btn btn-outline">Manage Runners</Link>
        </div>
        
        <div className="stat-card">
          <h3>Active Runners</h3>
          <p className="stat-number">{runners.filter(runner => runner.isStarted).length}</p>
          <Link to="/admin/runners" className="btn btn-outline">View Active Runners</Link>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/categories/new" className="action-card">
            <h3>Add Category</h3>
            <p>Create a new race category</p>
          </Link>
          
          <Link to="/admin/runners/new" className="action-card">
            <h3>Add Runner</h3>
            <p>Register a new runner</p>
          </Link>
          
          <Link to="/results" className="action-card">
            <h3>View Results</h3>
            <p>See current race results</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

