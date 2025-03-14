import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryService, { Category } from '../services/category.service';
import './Categories.css';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAll();
      setCategories(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await CategoryService.delete(categoryToDelete.id!);
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      setError('Failed to delete category');
      console.error(err);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  if (loading) {
    return <div className="loading"></div>;
  }

  return (
    <div className="categories-page">
      <div className="actions-bar">
        <h1 className="page-title">Race Categories</h1>
        <Link to="/admin/categories/new" className="btn">Add Category</Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {categories.length === 0 ? (
        <div className="empty-state">
          <p>No categories found. Create your first race category!</p>
          <Link to="/admin/categories/new" className="btn">Add Category</Link>
        </div>
      ) : (
        <div className="categories-list">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Distance (km)</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.distance}</td>
                  <td>{category.year}</td>
                  <td className="actions">
                    <Link to={`/admin/categories/edit/${category.id}`} className="btn-edit">Edit</Link>
                    <button 
                      onClick={() => handleDeleteClick(category)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete the category "{categoryToDelete?.name}"?</p>
            <p className="warning">This action cannot be undone!</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="btn btn-outline">Cancel</button>
              <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
