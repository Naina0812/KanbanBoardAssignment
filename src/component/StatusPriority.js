import React, { useEffect, useState } from 'react';
import './StatusPriority.css';
import TaskCard from './Card';

import todo from "../images/todo.svg";
import canceled from "../images/Cancelled.svg";
import progress from "../images/progress.svg";
import backlog from "../images/Backlog.svg";
import Done from '../images/Done.svg';
import menu from '../images/menu.svg';
import Add from '../images/add.svg';

const StatusPriority = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();

        // Log the fetched data for debugging
        console.log('Fetched Data:', data);

        // Update the state with fetched data
        setTasks(data.tickets);
      } catch (error) {
        setError('Error fetching data.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupTasksByStatus = () => {
    return tasks.reduce((groups, task) => {
      if (!groups[task.status]) {
        groups[task.status] = [];
      }
      groups[task.status].push(task);
      return groups;
    }, {});
  };

  const sortedGroupedTasks = Object.keys(groupTasksByStatus()).reduce((acc, status) => {
    acc[status] = groupTasksByStatus()[status].sort((a, b) => b.priority - a.priority);
    return acc;
  }, {});

  const renderedImg = (status) => {
    switch (status) {
      case 'Todo':
        return <img src={todo} alt='' />;
      case 'Backlog':
        return <img src={backlog} alt='' />;
      case 'In progress':
        return <img src={progress} alt='' />;
      default:
        return <img src={canceled} alt='' />;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="wrapper">
      <div className="board">
        {Object.entries(sortedGroupedTasks).map(([status, tasksInStatus]) => (
          <div className="column" key={status}>
            <h2>
              <div>
                {renderedImg(status)}
                <span className="status-name">{status}</span>
                <span className="count">{tasksInStatus.length}</span>
              </div>
              <div className="icons">
                <img src={Add} alt='' />
                <img src={menu} alt='' />
              </div>
            </h2>
            {tasksInStatus.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ))}
        <div className="column">
          <h2>
            <div>
              <img src={Done} alt='' />
              <span className="status-name">Done</span>
              <span className="count">0</span>
            </div>
            <div className="icons">
              <img src={Add} alt='' />
              <img src={menu} alt='' />
            </div>
          </h2>
        </div>
        <div className="column">
          <h2>
            <img src={canceled} alt='' />
            <span className="status-name">Canceled</span>
            <span className="count">0</span>
            <div className="icons">
              <img src={Add} alt='' />
              <img src={menu} alt='' />
            </div>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StatusPriority;
