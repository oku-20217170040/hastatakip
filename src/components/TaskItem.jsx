import React from 'react';
import * as Icons from 'lucide-react';

const TaskItem = ({ task, status, onToggleStatus }) => {
  const IconComponent = Icons[task.icon] || Icons.Circle;

  // status can be: 'pending' (null/undefined), 'done' (true), 'missed' (false)
  let btnClass = 'status-pending';
  if (status === true) btnClass = 'status-done';
  if (status === false) btnClass = 'status-missed';

  const handleClick = () => {
    // Toggle logic: pending -> done -> missed -> pending
    let newStatus;
    if (status === undefined || status === null) {
      newStatus = true; // Mark done
    } else if (status === true) {
      newStatus = false; // Mark missed (cross)
    } else {
      newStatus = null; // Back to pending
    }
    onToggleStatus(task.id, newStatus);
  };

  return (
    <div className="task-item">
      <div className="task-info">
        <div className="task-icon-wrapper">
          <IconComponent />
        </div>
        <div className="task-title">{task.title}</div>
      </div>
      <button 
        className={`toggle-btn ${btnClass}`} 
        onClick={handleClick}
        aria-label={`Mark ${task.title} status`}
      >
        {status === true && <Icons.Check className="status-icon check" />}
        {status === false && <Icons.X className="status-icon cross" />}
      </button>
    </div>
  );
};

export default TaskItem;
