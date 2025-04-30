import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import TaskItem from "./TaskItem";
import { Task } from "../../../utils/interfaces";
interface TaskListProps {
	myTask: number;
	filter: {
		status: string;
        priority: string;
        dueDate: string;
	}
}

const API_URL = import.meta.env.VITE_SOCKET_URL
// const socket = io(API_URL);

const TaskList = ({ myTask,filter }: TaskListProps) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [sortBy, setSortBy] = useState<string>("");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [tasksFromDB,setTasksFromDB]=useState<Task[]>([]);

	useEffect(() => {
		const fetchTasks = async () => {
			setSortBy("");
			try {
				// const responseFunc =()=>{
				// 	if(myTask==1){
                //         return 
                //     }
                //     if(myTask==2){
                //         return getTasksByUser()
                //     }
                //     return getAllTasks()
				// }
				// const response = await responseFunc();
				// setTasksFromDB(response);
				// setTasks(response);
			} catch (error) {
				console.error("Error fetching tasks:", error);
			}
		};
		fetchTasks();

		// socket.on("taskUpdate", () => {
		// 	fetchTasks();
		// });

		// return () => {
		// 	socket.off("taskUpdate");
		// };
	}, [myTask]);

	const handleSort = (sortField: keyof Task) => {
		const sortableFields: (keyof Task)[] = [
			"name",
			"priority",
			"status",
			"dueDate",
		];

		if (!sortableFields.includes(sortField)) return;

		const isSameField = sortBy === sortField;
		const direction = isSameField && sortDirection === "asc" ? "desc" : "asc";
		setSortBy(sortField);
		setSortDirection(direction);

		const sortedTasks = [...tasks].sort((a, b) => {
			const aValue = a[sortField];
			const bValue = b[sortField];
			if (sortField === "priority") {
				const priorityOrder = ["high", "medium", "low"];
				const aPriority = (aValue as string).toLowerCase();
				const bPriority = (bValue as string).toLowerCase();

				const aIndex = priorityOrder.indexOf(aPriority);
				const bIndex = priorityOrder.indexOf(bPriority);

				if (aIndex < bIndex) return direction === "asc" ? -1 : 1;
				if (aIndex > bIndex) return direction === "asc" ? 1 : -1;
				return 0;
			}

			if (aValue < bValue) return direction === "asc" ? -1 : 1;
			if (aValue > bValue) return direction === "asc" ? 1 : -1;
			return 0;
		});

		setTasks(sortedTasks);
	};

	const getArrow = (field: string) => {
		if (sortBy === field) {
			return sortDirection === "asc" ? <FaArrowUp /> : <FaArrowDown />;
		}
		return "";
	};

	const sortFieldMapping: { [label: string]: keyof Task } = {
		Name: "name",
		Description: "description",
		Priority: "priority",
		Status: "status",
		"Due Date": "dueDate",
		"Created At": "createdAt",
		Creator: "creator",
		Assignees: "assignees",
	};
	useEffect(() => {
		let filteredTasks: Task[] = [...tasksFromDB];
		if (filter.status) {
			filteredTasks = filteredTasks.filter(task => task.status.toLowerCase() === filter.status.toLowerCase());
		}
		if (filter.priority) {
			filteredTasks = filteredTasks.filter(task => task.priority.toLowerCase() === filter.priority.toLowerCase());
		}
		if (filter.dueDate) {
			const dueDate = new Date(filter.dueDate);
			filteredTasks = filteredTasks.filter(task => new Date(task.dueDate) <= dueDate);
		}
		setTasks(filteredTasks);
	}, [filter, tasksFromDB]);

	return (
		<div className="relative h-full">
			{tasks?.length !== 0 ? (
				<>
					<div className="font-extrabold uppercase text-white bg-blue-600/80 dark:bg-blue-500/80 text-[12px] md:text-sm lg:text-base transition-all duration-150 sticky top-0 w-full grid grid-cols-7 md:grid-cols-10 items-center z-10">
						{[
							{ label: "Name", key: "name" },
							{ label: "Description", key: "description" },
							{ label: "Priority", key: "priority" },
							{ label: "Status", key: "status" },
							{ label: "Due Date", key: "dueDate" },
							{ label: "Creator", key: "creator" },
							{ label: "Assignees", key: "assignees" },
						].map(({ label, key }) => (
							<span
								key={label}
								className={`${
									["Name", "Description", "Assignees"].includes(label)
										? "col-span-2"
										: "col-span-1"
								} ${
									["Name", "Priority", "Status", "Due Date"].includes(label)
										? "cursor-pointer hover:underline"
										: "cursor-default"
								}  
								${["Creator", "Assignees"].includes(label) ? "hidden sm:block" : ""}
								flex items-center py-4 px-1 gap-2 text-ellipsis overflow-hidden`}
								onClick={() => handleSort(sortFieldMapping[label])}>
								{label} {getArrow(key)}
							</span>
						))}
					</div>

					<div className="overflow-y-auto">
						{tasks?.map((task, index) => (
							<div key={index}>
								<TaskItem task={task} />
							</div>
						))}
					</div>
				</>
			) : (
				<span className="text-center h-full grid grid-rows-1 place-items-center text-2xl font-extrabold">
					No Tasks Found!
				</span>
			)}
		</div>
	);
};

export default TaskList;
