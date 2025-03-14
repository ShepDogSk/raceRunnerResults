import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import RunnerService from '../services/runner.service';
import CategoryService from '../services/category.service';
import socketService from '../services/socket.service';
import { Runner, RunnerStatus } from '../types/runner';
import { Category } from '../types/category';
import ConfirmationModal from '../components/ConfirmationModal';
import RunnerDiploma from '../components/RunnerDiploma';
import './Runners.css';

const Runners: React.FC = () => {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [runnerToDelete, setRunnerToDelete] = useState<Runner | null>(null);
  
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [actionModalData, setActionModalData] = useState<{
    title: string;
    message: string;
    confirmText: string;
    confirmButtonClass: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  
  const [showDiplomaModal, setShowDiplomaModal] = useState<boolean>(false);
  const [diplomaData, setDiplomaData] = useState<{
    runner: Runner;
    category: Category;
    position: number;
  } | null>(null);

  // Timer for updating running times
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [runningTimes, setRunningTimes] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchData();
    
    // Set up socket subscription for real-time updates
    const unsubscribeRunnerUpdated = socketService.subscribe('runner.updated', 
      (runner: Runner) => {
        console.log(`Runner updated: ${runner.id}`);
        fetchData();
      }
    );
    
    const unsubscribeRunnerStarted = socketService.subscribe('runner.started', 
      (runner: Runner) => {
        console.log(`Runner started: ${runner.id}`);
        fetchData();
      }
    );
    
    const unsubscribeRunnerPaused = socketService.subscribe('runner.paused', 
      (runner: Runner) => {
        console.log(`Runner paused: ${runner.id}`);
        fetchData();
      }
    );
    
    const unsubscribeRunnerResumed = socketService.subscribe('runner.resumed', 
      (runner: Runner) => {
        console.log(`Runner resumed: ${runner.id}`);
        fetchData();
      }
    );
    
    const unsubscribeRunnerFinished = socketService.subscribe('runner.finished', 
      (runner: Runner) => {
        console.log(`Runner finished: ${runner.id}`);
        fetchData();
      }
    );
    
    const unsubscribeLapCreated = socketService.subscribe('lap.created', 
      (lap: any) => {
        console.log(`New lap logged for runner: ${lap.runner?.id}`);
        fetchData();
      }
    );
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Clean up socket subscriptions
      unsubscribeRunnerUpdated();
      unsubscribeRunnerStarted();
      unsubscribeRunnerPaused();
      unsubscribeRunnerResumed();
      unsubscribeRunnerFinished();
      unsubscribeLapCreated();
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [runnersData, categoriesData] = await Promise.all([
        RunnerService.getAll(),
        CategoryService.getAll()
      ]);
      setRunners(runnersData);
      setCategories(categoriesData);
      setError('');
      
      // Start timer to update running times
      startRunningTimeTimer(runnersData);
    } catch (err: any) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Start a timer to update running times every second
  const startRunningTimeTimer = (runnersList: Runner[]) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      const times: Record<number, number> = {};
      
      runnersList.forEach(runner => {
        if (runner.isStarted && !runner.isFinished && !runner.isPaused && runner.startTime) {
          // Calculate current running time
          const startTime = new Date(runner.startTime).getTime();
          const now = new Date().getTime();
          const pausedTime = runner.totalPausedTime || 0;
          times[runner.id!] = now - startTime - pausedTime;
        } else if (runner.totalRunningTime) {
          // Use stored running time for finished or paused runners
          times[runner.id!] = runner.totalRunningTime;
        }
      });
      
      setRunningTimes(times);
    }, 1000);
  };

  const handleDeleteClick = (runner: Runner) => {
    setRunnerToDelete(runner);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!runnerToDelete) return;
    
    try {
      await RunnerService.delete(runnerToDelete.id!);
      setRunners(runners.filter(r => r.id !== runnerToDelete.id));
      setShowDeleteModal(false);
      setRunnerToDelete(null);
    } catch (err: any) {
      setError('Failed to delete runner');
      console.error(err);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRunnerToDelete(null);
  };
  
  // Generic action confirmation setup
  const confirmAction = async (
    runner: Runner,
    title: string,
    message: string,
    confirmText: string,
    confirmButtonClass: string,
    action: (id: number) => Promise<Runner>
  ) => {
    setActionModalData({
      title,
      message,
      confirmText,
      confirmButtonClass,
      onConfirm: async () => {
        try {
          const updatedRunner = await action(runner.id!);
          setRunners(runners.map(r => r.id === runner.id ? updatedRunner : r));
          setShowActionModal(false);
        } catch (err: any) {
          setError(`Failed to ${confirmText.toLowerCase()} runner`);
          console.error(err);
        }
      }
    });
    setShowActionModal(true);
  };

  const handleStartRunner = (runner: Runner) => {
    confirmAction(
      runner,
      'Start Runner',
      `Are you sure you want to start ${runner.firstName} ${runner.lastName}?`,
      'Start',
      'btn-success',
      RunnerService.startRunner
    );
  };

  const handlePauseRunner = (runner: Runner) => {
    confirmAction(
      runner,
      'Pause Runner',
      `Are you sure you want to pause ${runner.firstName} ${runner.lastName}?`,
      'Pause',
      'btn-primary',
      RunnerService.pauseRunner
    );
  };

  const handleResumeRunner = (runner: Runner) => {
    confirmAction(
      runner,
      'Resume Runner',
      `Are you sure you want to resume ${runner.firstName} ${runner.lastName}?`,
      'Resume',
      'btn-success',
      RunnerService.resumeRunner
    );
  };

  const handleFinishRunner = (runner: Runner) => {
    confirmAction(
      runner,
      'Finish Runner',
      `Are you sure you want to mark ${runner.firstName} ${runner.lastName} as finished?`,
      'Finish',
      'btn-danger',
      RunnerService.finishRunner
    );
  };

  const handleLogLap = (runner: Runner) => {
    confirmAction(
      runner,
      'Log Lap',
      `Are you sure you want to log a lap for ${runner.firstName} ${runner.lastName}?`,
      'Log Lap',
      'btn-primary',
      RunnerService.logLap
    );
  };
  
  const handlePrintDiploma = (runner: Runner) => {
    // Find the category of the runner
    const category = categories.find(c => c.id === runner.category?.id);
    if (!category) {
      setError('Could not find category for runner');
      return;
    }
    
    // Find the position of the runner in the results
    const runnersInCategory = runners.filter(r => r.category?.id === category.id);
    const sortedRunners = [...runnersInCategory].sort(
      (a, b) => b.totalLaps - a.totalLaps || b.totalDistance - a.totalDistance
    );
    
    const position = sortedRunners.findIndex(r => r.id === runner.id) + 1;
    
    // Open diploma modal
    setDiplomaData({
      runner,
      category,
      position
    });
    setShowDiplomaModal(true);
  };

  // Helper function to get status badge
  const getStatusBadge = (runner: Runner) => {
    if (!runner.isStarted) {
      return <span className="badge badge-warning">Not Started</span>;
    } else if (runner.isFinished) {
      return <span className="badge badge-success">Finished</span>;
    } else if (runner.isPaused) {
      return <span className="badge badge-warning">Paused</span>;
    } else {
      return <span className="badge badge-primary">Running</span>;
    }
  };

  // Helper function to get running time display
  const getRunningTimeDisplay = (runner: Runner) => {
    if (!runner.isStarted) {
      return '00:00:00';
    }
    
    let time = 0;
    
    if (runner.isFinished) {
      time = runner.totalRunningTime || 0;
    } else if (runner.isPaused) {
      time = runner.totalRunningTime || 0;
    } else {
      time = runningTimes[runner.id!] || 0;
    }
      
    return RunnerService.formatRunningTime(time);
  };

  const filteredRunners = selectedCategory === 'all' 
    ? runners 
    : runners.filter(runner => runner.category?.id === selectedCategory);

  if (loading) {
    return <div className="loading"></div>;
  }

  return (
    <div className="runners-page">
      <div className="actions-bar">
        <h1 className="page-title">Runners</h1>
        <Link to="/admin/runners/new" className="btn">Add Runner</Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="filters">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select 
          id="category-filter" 
          value={selectedCategory.toString()} 
          onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      {filteredRunners.length === 0 ? (
        <div className="empty-state">
          <p>No runners found. Add your first runner!</p>
          <Link to="/admin/runners/new" className="btn">Add Runner</Link>
        </div>
      ) : (
        <div className="runners-list">
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Laps</th>
                <th>Distance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRunners.map((runner) => (
                <tr 
                  key={runner.id} 
                  className={
                    runner.isFinished 
                      ? 'finished-runner' 
                      : runner.isPaused 
                        ? 'paused-runner' 
                        : runner.isStarted 
                          ? 'active-runner' 
                          : ''
                  }
                >
                  <td>{runner.runnerNumber}</td>
                  <td>
                    {runner.firstName} {runner.lastName}
                    {runner.nickname && <span className="nickname">({runner.nickname})</span>}
                  </td>
                  <td>{runner.category?.name}</td>
                  <td>{getStatusBadge(runner)}</td>
                  <td>{runner.totalLaps}</td>
                  <td>
                    {runner.totalDistance} km
                    <div className="running-time">{getRunningTimeDisplay(runner)}</div>
                  </td>
                  <td className="actions">
                    <div className="action-buttons">
                      <Link to={`/admin/runners/edit/${runner.id}`} className="btn-edit">Edit</Link>
                      <button 
                        onClick={() => handleDeleteClick(runner)} 
                        className="btn-delete"
                        disabled={runner.isStarted && !runner.isFinished}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="race-actions">
                      {!runner.isStarted && (
                        <button 
                          onClick={() => handleStartRunner(runner)} 
                          className="btn-start"
                        >
                          Start
                        </button>
                      )}
                      
                      {runner.isStarted && !runner.isPaused && !runner.isFinished && (
                        <>
                          <button 
                            onClick={() => handleLogLap(runner)} 
                            className="btn-lap"
                          >
                            Log Lap
                          </button>
                          <button 
                            onClick={() => handlePauseRunner(runner)} 
                            className="btn-pause"
                          >
                            Pause
                          </button>
                          <button 
                            onClick={() => handleFinishRunner(runner)} 
                            className="btn-finish"
                          >
                            Finish
                          </button>
                        </>
                      )}
                      
                      {runner.isPaused && !runner.isFinished && (
                        <>
                          <button 
                            onClick={() => handleResumeRunner(runner)} 
                            className="btn-resume"
                          >
                            Resume
                          </button>
                          <button 
                            onClick={() => handleFinishRunner(runner)} 
                            className="btn-finish"
                          >
                            Finish
                          </button>
                        </>
                      )}
                      
                      {runner.isFinished && (
                        <button 
                          onClick={() => handlePrintDiploma(runner)} 
                          className="btn-diploma"
                        >
                          Print Diploma
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && runnerToDelete && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Confirm Delete"
          message={`Are you sure you want to delete the runner "${runnerToDelete.firstName} ${runnerToDelete.lastName}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="btn-danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      
      {/* Action Confirmation Modal */}
      {showActionModal && actionModalData && (
        <ConfirmationModal
          isOpen={showActionModal}
          title={actionModalData.title}
          message={actionModalData.message}
          confirmText={actionModalData.confirmText}
          cancelText="Cancel"
          confirmButtonClass={actionModalData.confirmButtonClass}
          onConfirm={actionModalData.onConfirm}
          onCancel={() => setShowActionModal(false)}
        />
      )}
      
      {/* Diploma Modal */}
      {showDiplomaModal && diplomaData && (
        <RunnerDiploma
          runner={diplomaData.runner}
          category={diplomaData.category}
          position={diplomaData.position}
          onClose={() => setShowDiplomaModal(false)}
          config={{
            eventName: "Race Runner Event",
            eventDate: new Date().toLocaleDateString(),
            eventLocation: "Race Event Location"
          }}
        />
      )}
    </div>
  );
};

export default Runners;
