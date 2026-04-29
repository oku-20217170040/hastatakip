import React from 'react';
import TaskItem from './TaskItem';
import { Sun, SunMedium, Moon } from 'lucide-react';

const icons = {
  morning: <Sun />,
  afternoon: <SunMedium />,
  evening: <Moon />
};

const titles = {
  morning: 'SABAH',
  afternoon: 'ÖĞLE',
  evening: 'AKŞAM'
};

const Column = ({ timeOfDay, tasks, taskStatuses, onToggleStatus }) => {
  return (
    <div className={`column ${timeOfDay}`}>
      <div className="column-header">
        <h2>{titles[timeOfDay]}</h2>
        <div className="column-icon">
          {icons[timeOfDay]}
        </div>
      </div>
      
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          status={taskStatuses[task.id]} 
          onToggleStatus={onToggleStatus} 
        />
      ))}
    </div>
  );
};

export default Column;
