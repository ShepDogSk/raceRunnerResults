import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryService, { Category } from '../services/category.service';
import './CategoryForm.css';

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<Category>({
    name: '',
    distance: 0,
    year: new Date().getFullYear()
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);
  
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getById(parseInt(id!));
      setFormData(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load category');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'distance' || name === 'year' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Category form submission:', formData);
    
    if (!formData.name || !formData.distance || !formData.year) {
      setError('Please fill in all required fields');
      console.warn('Form validation failed - missing required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log(`Attempting to ${isEditMode ? 'update' : 'create'} category`);
      
      if (isEditMode) {
        console.log(`Updating category with ID: ${id}`);
        await CategoryService.update(parseInt(id!), formData);
      } else {
        console.log('Creating new category');
        await CategoryService.create(formData);
      }
      
      console.log('Category saved successfully, redirecting to categories list');
      navigate('/admin/categories');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to save category';
      console.error('Error saving category:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return <div className="loading"></div>;
  }
  
  return (
    <div className="category-form-page">
      <h1 className="page-title">{isEditMode ? 'Edit Category' : 'Add Category'}</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Category Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="distance">Distance (km)*</label>
            <input
              type="number"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              disabled={loading}
              step="0.1"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="year">Year*</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              disabled={loading}
              min="2000"
              max="2100"
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => navigate('/admin/categories')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;

