import React, { useEffect, useState } from 'react';
import './StatusTitle.css'; // Import the CSS file
import TaskCard from './Card';
import todo from "../images/todo.svg";
import canceled from "../images/Cancelled.svg";
import progress from "../images/progress.svg";
import backlog from "../images/Backlog.svg";
import Done from '../images/Done.svg';
import menu from '../images/menu.svg';
import Add from '../images/add.svg';

const StatusTitle = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTasks(data.tickets);
      } catch (error) {
        setError('Error fetching data.');
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

  const renderImg = (status) => {
    switch (status) {
      case 'Todo':
        return <img src={todo} alt='' />;
      case 'Backlog':
        return <img src={backlog} alt='' />;
      case 'In progress':
        return <img src={progress} alt='' />;
      case 'Canceled':
        return <img src={canceled} alt='' />;
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const sortedGroupedTasks = Object.keys(groupTasksByStatus()).reduce((acc, status) => {
    acc[status] = groupTasksByStatus()[status].sort((a, b) => a.title.localeCompare(b.title));
    return acc;
  }, {});

  return (
    <div className="wrapper">
      <div className="board">
        {Object.entries(sortedGroupedTasks).map(([status, tasksInStatus]) => (
          <div className="column" key={status}>
            <h2>
              <div>
                {renderImg(status)}
                <span style={{ marginLeft: '8px' }}>{status}</span>
                <span className="count" style={{ marginLeft: '8px' }}>{tasksInStatus.length}</span>
              </div>
              <div style={{ display: 'flex', marginRight: '5px' }}>
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
            <img src={Done} alt='' />
            <span style={{ marginLeft: '8px' }}>Done</span>
            <span className="count" style={{ marginLeft: '8px' }}>0</span>
            <div style={{ display: 'flex', marginRight: '5px' }}>
              <img src={Add} alt='' />
              <img src={menu} alt='' />
            </div>
          </h2>
        </div>
        <div className="column">
          <h2>
            <div>
              <img src={canceled} alt='' />
              <span style={{ marginLeft: '8px' }}>Canceled</span>
              <span className="count" style={{ marginLeft: '8px' }}>0</span>
            </div>
            <div style={{ display: 'flex', marginRight: '5px' }}>
              <img src={Add} alt='' />
              <img src={menu} alt='' />
            </div>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StatusTitle;
