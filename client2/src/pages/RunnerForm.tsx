import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RunnerService, { Runner } from '../services/runner.service';
import CategoryService, { Category } from '../services/category.service';
import './RunnerForm.css';

const RunnerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Runner>>({
    runnerNumber: 0,
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    phoneNumber: '',
    category: undefined,
    internalNote: '',
    nfcChipId: '',
    isStarted: false,
    totalLaps: 0,
    totalDistance: 0
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    fetchCategories();
    
    if (isEditMode) {
      fetchRunner();
    }
  }, [id]);
  
  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
      
      // Set default category if creating a new runner
      if (!isEditMode && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          category: data[0]
        }));
      }
    } catch (err: any) {
      console.error('Failed to load categories', err);
    }
  };
  
  const fetchRunner = async () => {
    try {
      setLoading(true);
      const data = await RunnerService.getById(parseInt(id!));
      setFormData(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load runner');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'categoryId') {
      const selectedCategory = categories.find(cat => cat.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        category: selectedCategory
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.runnerNumber || !formData.firstName || !formData.lastName || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const runnerData = {
        ...formData,
        isStarted: formData.isStarted || false,
        totalLaps: formData.totalLaps || 0,
        totalDistance: formData.totalDistance || 0
      } as Runner;
      
      if (isEditMode) {
        await RunnerService.update(parseInt(id!), runnerData);
      } else {
        await RunnerService.create(runnerData);
      }
      
      navigate('/admin/runners');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save runner');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return <div className="loading"></div>;
  }
  
  return (
    <div className="runner-form-page">
      <h1 className="page-title">{isEditMode ? 'Edit Runner' : 'Add Runner'}</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="runnerNumber">Runner Number*</label>
              <input
                type="number"
                id="runnerNumber"
                name="runnerNumber"
                value={formData.runnerNumber}
                onChange={handleChange}
                disabled={loading}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="categoryId">Category*</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.category?.id}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.distance}km)
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="nfcChipId">NFC Chip ID</label>
            <input
              type="text"
              id="nfcChipId"
              name="nfcChipId"
              value={formData.nfcChipId || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="internalNote">Internal Note</label>
            <textarea
              id="internalNote"
              name="internalNote"
              value={formData.internalNote || ''}
              onChange={handleChange}
              disabled={loading}
              rows={3}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => navigate('/admin/runners')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Runner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RunnerForm;
