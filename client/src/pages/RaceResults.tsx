import React, { useEffect, useState, useRef } from 'react';
import CategoryService from '../services/category.service';
import RunnerService from '../services/runner.service';
import socketService from '../services/socket.service';
import { Category } from '../types/category';
import { Runner, RunnerStatus } from '../types/runner';
import './RaceResults.css';

const RaceResults: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [runningTimes, setRunningTimes] = useState<Record<number, number>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchData();

    // Set up socket subscription for real-time updates
    const unsubscribeResults = socketService.subscribe('results.updated', () => {
      console.log('Race results updated, refreshing data...');
      fetchData();
    });
    
    const unsubscribeCategoryResults = socketService.subscribe('results.updated.category', 
      (data: { categoryId: number }) => {
        console.log(`Results updated for category ${data.categoryId}`);
        if (selectedCategory === data.categoryId) {
          fetchData();
        }
      }
    );
    
    const unsubscribeRunner = socketService.subscribe('runner.updated', 
      (runner: Runner) => {
        console.log(`Runner updated: ${runner.id}`);
        if (runner.category?.id === selectedCategory) {
          fetchData();
        }
      }
    );
    
    const unsubscribeLap = socketService.subscribe('lap.created', 
      (lap: any) => {
        console.log(`New lap logged for runner: ${lap.runner?.id}`);
        if (lap.runner?.category?.id === selectedCategory) {
          fetchData();
        }
      }
    );

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Clean up socket subscriptions
      unsubscribeResults();
      unsubscribeCategoryResults();
      unsubscribeRunner();
      unsubscribeLap();
    };
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, runnersData] = await Promise.all([
        CategoryService.getAll(),
        RunnerService.getAll()
      ]);
      setCategories(categoriesData);
      setRunners(runnersData);
      
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id!);
      }
      
      setError('');
      
      // Start timer to update running times
      startRunningTimeTimer(runnersData);
    } catch (err: any) {
      setError('Failed to load race results');
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

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  const getFilteredRunners = () => {
    if (!selectedCategory) return [];
    
    return runners
      .filter(runner => runner.category?.id === selectedCategory)
      .sort((a, b) => b.totalLaps - a.totalLaps || b.totalDistance - a.totalDistance);
  };

  const filteredRunners = getFilteredRunners();

  if (loading) {
    return <div className="loading"></div>;
  }

  return (
    <div className="race-results">
      <h1 className="page-title">Race Results</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {categories.length === 0 ? (
        <div className="empty-state">
          <p>No race categories available.</p>
        </div>
      ) : (
        <>
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id!)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {filteredRunners.length === 0 ? (
            <div className="empty-state">
              <p>No runners in this category yet.</p>
            </div>
          ) : (
            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Number</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Laps</th>
                    <th>Distance (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRunners.map((runner, index) => (
                    <tr key={runner.id} className={runner.isStarted ? 'active-runner' : ''}>
                      <td>{index + 1}</td>
                      <td>{runner.runnerNumber}</td>
                      <td>
                        {runner.firstName} {runner.lastName}
                        {runner.nickname && <span className="nickname">({runner.nickname})</span>}
                      </td>
                      <td>
                        {!runner.isStarted ? (
                          <span className="badge badge-warning">Not Started</span>
                        ) : runner.isFinished ? (
                          <span className="badge badge-success">Finished</span>
                        ) : runner.isPaused ? (
                          <span className="badge badge-warning">Paused</span>
                        ) : (
                          <span className="badge badge-primary">Running</span>
                        )}
                      </td>
                      <td>{runner.totalLaps}</td>
                      <td>
                        {runner.totalDistance} km
                        {runner.isStarted && (
                          <div className="running-time">
                            {RunnerService.formatRunningTime(
                              runner.isFinished || runner.isPaused
                                ? runner.totalRunningTime
                                : runningTimes[runner.id!]
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RaceResults;
