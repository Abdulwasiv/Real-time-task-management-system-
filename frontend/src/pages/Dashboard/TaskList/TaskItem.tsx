import React, { useState } from "react";
import { Task } from "../../../utils/interfaces";
import TaskDetail from "./TaskDetails";

interface TaskItemProps {
	task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	const formatDate = (date: string | Date) => {
		return date ? new Date(date).toLocaleDateString() : "N/A";
	};

	const handleTaskClick = () => {
		setIsDetailOpen(true);
	};

	const closeDetailModal = () => {
		setIsDetailOpen(false);
	};

	if (!task) {
		return <div>No task data available.</div>;
	}

	return (
    <div className="px-4 py-1 border-b border-black/20 dark:border-white/20">
      <div className="col-span-11 grid grid-cols-7 md:grid-cols-10 h-10 text-[10px] md:text-sm lg:text-base items-center whitespace-nowrap">
        <span
          className="text-ellipsis text-blue-600 dark:text-blue-300 overflow-hidden font-bold hover:underline cursor-pointer col-span-2"
          onClick={handleTaskClick}>
          {task.name || "No name available"}
        </span>
        <span className="cursor-default select-none text-ellipsis overflow-hidden col-span-2">
          {task.description || "No description"}
        </span>
        <span className="cursor-default select-none text-ellipsis overflow-hidden">
          <span
            className={`text-center rounded-full px-1 md:px-3 py-1 ${
              task.priority.toLowerCase() == "low"
                ? "bg-green-500/50 "
                : task.priority.toLowerCase()=="high"?"bg-red-500/50":"bg-yellow-500/50"
            }`}>
            {task.priority || "No priority"}
          </span>
        </span>
        <span
          className={`cursor-default select-none text-ellipsis overflow-hidden`}>
          {task.status || "No status"}
        </span>
        <span className="cursor-default select-none text-ellipsis overflow-hidden">
          {formatDate(task.dueDate)}
        </span>
        <span className="cursor-default select-none text-ellipsis overflow-hidden hidden sm:block">
          {task.creator?.name || "No creator"}
        </span>
        <span className="cursor-default select-none text-ellipsis overflow-hidden col-span-2 hidden sm:block">
          {task.assignees && task.assignees.length > 0
            ? task.assignees.map(
                (assignee, index) =>
                  `${assignee.name || "Unknown"}${
                    index === task.assignees.length - 1 ? "" : ", "
                  }`
              )
            : "No Assignees"}
        </span>
      </div>
        <TaskDetail
          task={task}
          onClose={closeDetailModal}
          isDetailOpen={isDetailOpen}
        />
    </div>
  );
};

export default TaskItem;
