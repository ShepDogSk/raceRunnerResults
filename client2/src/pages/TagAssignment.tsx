import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RunnerService, { Runner } from '../services/runner.service';
import NfcService, { NfcTag } from '../services/nfc.service';
import ConfirmationModal from '../components/ConfirmationModal';
import './TagAssignment.css';

const TagAssignment: React.FC = () => {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [unassignedTags, setUnassignedTags] = useState<NfcTag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [selectedTag, setSelectedTag] = useState<NfcTag | null>(null);
  const [manualTagId, setManualTagId] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showUnassignModal, setShowUnassignModal] = useState<boolean>(false);
  const [runnerToUnassign, setRunnerToUnassign] = useState<Runner | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all runners
      const runnersData = await RunnerService.getAll();
      setRunners(runnersData);
      
      // Fetch unassigned tags
      await fetchUnassignedTags();
    } catch (err: any) {
      setError('Failed to load data: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedTags = async () => {
    try {
      const tags = await NfcService.getUnassignedTags();
      setUnassignedTags(tags);
    } catch (err: any) {
      setError('Failed to load unassigned tags: ' + (err.message || 'Unknown error'));
      console.error(err);
    }
  };

  const handleAssignTag = () => {
    if (!selectedRunner) {
      setError('Please select a runner');
      return;
    }
    
    if (!selectedTag && !manualTagId) {
      setError('Please select or enter a tag ID');
      return;
    }
    
    // Use the selected tag or the manually entered one
    const tagId = selectedTag ? selectedTag.tagId : manualTagId;
    
    if (!tagId) {
      setError('Invalid tag ID');
      return;
    }
    
    // If manual tag ID entered, validate it
    if (manualTagId && !NfcService.isValidTagId(manualTagId)) {
      setError('Invalid tag ID format. Tag IDs should be hexadecimal (e.g., A1B2C3D4)');
      return;
    }
    
    setShowConfirmModal(true);
  };

  const confirmAssign = async () => {
    try {
      const tagId = selectedTag ? selectedTag.tagId : manualTagId;
      
      if (!selectedRunner || !tagId) {
        return;
      }
      
      const result = await NfcService.assignTagToRunner(tagId, selectedRunner.id!);
      
      setSuccess(`Tag successfully assigned to ${selectedRunner.firstName} ${selectedRunner.lastName}`);
      setShowConfirmModal(false);
      
      // Reset selections
      setSelectedRunner(null);
      setSelectedTag(null);
      setManualTagId('');
      
      // Refresh data
      fetchData();
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err: any) {
      setError('Failed to assign tag: ' + (err.message || 'Unknown error'));
      console.error(err);
      setShowConfirmModal(false);
    }
  };

  const handleShowUnassign = (runner: Runner) => {
    setRunnerToUnassign(runner);
    setShowUnassignModal(true);
  };

  const confirmUnassign = async () => {
    if (!runnerToUnassign) return;
    
    try {
      await NfcService.unassignTagFromRunner(runnerToUnassign.id!);
      
      setSuccess(`Tag successfully unassigned from ${runnerToUnassign.firstName} ${runnerToUnassign.lastName}`);
      setShowUnassignModal(false);
      setRunnerToUnassign(null);
      
      // Refresh data
      fetchData();
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err: any) {
      setError('Failed to unassign tag: ' + (err.message || 'Unknown error'));
      console.error(err);
      setShowUnassignModal(false);
    }
  };

  const filteredRunners = searchTerm
    ? runners.filter(runner => 
        runner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        runner.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (runner.nickname && runner.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (runner.runnerNumber && runner.runnerNumber.toString().includes(searchTerm))
      )
    : runners;

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="tag-assignment-page">
      <div className="page-header">
        <h1>NFC Tag Assignment</h1>
        <div className="actions">
          <button onClick={() => navigate('/admin/runners')} className="btn secondary">
            Back to Runners
          </button>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger">
          <span>{error}</span>
          <button onClick={() => setError('')} className="close-button">×</button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="close-button">×</button>
        </div>
      )}
      
      <div className="tag-assignment-container">
        <div className="assignment-section">
          <h2>Assign NFC Tag</h2>
          
          <div className="form-group">
            <label>1. Select Runner:</label>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search runner by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="runners-list">
              {filteredRunners.length === 0 ? (
                <div className="empty-message">No runners found</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Number</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Tag Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRunners.map(runner => (
                      <tr 
                        key={runner.id}
                        className={selectedRunner?.id === runner.id ? 'selected' : ''}
                        onClick={() => setSelectedRunner(runner)}
                      >
                        <td>{runner.runnerNumber}</td>
                        <td>
                          {runner.firstName} {runner.lastName}
                          {runner.nickname && <span className="nickname">({runner.nickname})</span>}
                        </td>
                        <td>{runner.category?.name}</td>
                        <td>
                          {runner.nfcTagId ? (
                            <span className="tag-assigned">
                              {NfcService.formatTagId(runner.nfcTagId)}
                            </span>
                          ) : (
                            <span className="no-tag">No Tag</span>
                          )}
                        </td>
                        <td>
                          {runner.nfcTagId ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowUnassign(runner);
                              }}
                              className="btn btn-small btn-warning"
                            >
                              Unassign
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRunner(runner);
                              }}
                              className="btn btn-small btn-primary"
                            >
                              Select
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
          {selectedRunner && !selectedRunner.nfcTagId && (
            <>
              <div className="form-group">
                <label>2. Select or Enter NFC Tag ID:</label>
                
                <div className="tag-options">
                  <div className="tag-option">
                    <h3>Option A: Select from unassigned tags</h3>
                    <div className="unassigned-tags">
                      {unassignedTags.length === 0 ? (
                        <div className="empty-message">No unassigned tags available</div>
                      ) : (
                        <div className="tags-grid">
                          {unassignedTags.map(tag => (
                            <div 
                              key={tag.id}
                              className={`tag-item ${selectedTag?.id === tag.id ? 'selected' : ''}`}
                              onClick={() => {
                                setSelectedTag(tag);
                                setManualTagId('');
                              }}
                            >
                              <div className="tag-id">{NfcService.formatTagId(tag.tagId)}</div>
                              <div className="tag-seen">First seen: {new Date(tag.firstSeen).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="tag-option">
                    <h3>Option B: Manually enter tag ID</h3>
                    <div className="manual-tag">
                      <input
                        type="text"
                        placeholder="Enter NFC tag ID (hex format e.g., A1B2C3D4)"
                        value={manualTagId}
                        onChange={(e) => {
                          setManualTagId(e.target.value);
                          setSelectedTag(null);
                        }}
                      />
                      <div className="help-text">
                        Tag IDs should be hexadecimal format (e.g., A1B2C3D4)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  onClick={handleAssignTag}
                  className="btn btn-primary"
                  disabled={!selectedRunner || (!selectedTag && !manualTagId)}
                >
                  Assign Tag to Runner
                </button>
                <button 
                  onClick={() => {
                    setSelectedRunner(null);
                    setSelectedTag(null);
                    setManualTagId('');
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
        
        <div className="info-section">
          <h2>How to Assign NFC Tags</h2>
          <ol>
            <li>Select a runner from the list on the left.</li>
            <li>Either:
              <ul>
                <li>Select an existing unassigned tag from the list, or</li>
                <li>Manually enter a new tag ID.</li>
              </ul>
            </li>
            <li>Click "Assign Tag to Runner" to complete the assignment.</li>
          </ol>
          
          <h3>About NFC Tags</h3>
          <p>
            NFC tags can be scanned by the hardware to automatically log laps for
            runners during races. Each runner should have a unique tag assigned.
          </p>
          
          <h3>Adding New Tags</h3>
          <p>
            New tags can be added to the system by:
          </p>
          <ul>
            <li>Manually entering the tag ID in the form</li>
            <li>Scanning the tag with the NFC hardware, which will automatically register it as unassigned</li>
          </ul>
        </div>
      </div>
      
      {/* Assign Confirmation Modal */}
      {showConfirmModal && selectedRunner && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          title="Confirm Tag Assignment"
          message={`Are you sure you want to assign ${selectedTag ? 'tag ' + NfcService.formatTagId(selectedTag.tagId) : 'tag ' + manualTagId} to runner ${selectedRunner.firstName} ${selectedRunner.lastName}?`}
          confirmText="Assign"
          cancelText="Cancel"
          confirmButtonClass="btn-primary"
          onConfirm={confirmAssign}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      
      {/* Unassign Confirmation Modal */}
      {showUnassignModal && runnerToUnassign && (
        <ConfirmationModal
          isOpen={showUnassignModal}
          title="Confirm Tag Unassignment"
          message={`Are you sure you want to unassign the NFC tag from runner ${runnerToUnassign.firstName} ${runnerToUnassign.lastName}?`}
          confirmText="Unassign"
          cancelText="Cancel"
          confirmButtonClass="btn-warning"
          onConfirm={confirmUnassign}
          onCancel={() => {
            setShowUnassignModal(false);
            setRunnerToUnassign(null);
          }}
        />
      )}
    </div>
  );
};

export default TagAssignment;
