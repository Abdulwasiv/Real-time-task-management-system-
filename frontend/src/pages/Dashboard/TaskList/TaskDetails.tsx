import React, { useState, useEffect } from "react";
import {
	Task,
	TaskDataWithRelationships,
	UserProfile,
} from "../../../utils/interfaces";
import { updateTask, deleteTask } from "../../../api";
import { IoExitOutline } from "react-icons/io5";
import {
	menuButtonStyleBlue,
	menuButtonStyleGreen,
	menuButtonStyleRed,
} from "../../../utils/formStyles";
import { MdCancel, MdDelete, MdEdit, MdKeyboardReturn } from "react-icons/md";

interface TaskDetailProps {
	task: Task;
	onClose: () => void;
	isDetailOpen: boolean;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
	task,
	onClose,
	isDetailOpen,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<TaskDataWithRelationships>({
		id: task.id,
		name: task.name,
		description: task.description,
		dueDate: new Date(task.dueDate),
		priority: task.priority,
		isMultiUser: task.isMultiUser,
		assignees: task.assignees,
	});
	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
	};
	const handleDelete = async () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this task?"
		);
		if (confirmDelete) {
			try {
				await deleteTask(task.id.toString());
				console.log("Task deleted");
				onClose();
			} catch (error) {
				console.error("Error deleting task:", error);
			}
		}
	};
	const handleSubmit = async () => {
		try {
			const updatedTask: TaskDataWithRelationships = {
				...formData,
				dueDate: formData.dueDate,
				status: formData.status as "To Do" | "In Progress" | "Completed",
				assignees: formData.assignees,
			};
			await updateTask(task.id.toString(), updatedTask);
			console.log("Task updated:", updatedTask);
			setIsEditing(false);
			onClose();
		} catch (error) {
			console.error("Error updating task:", error);
		}
	};

	useEffect(() => {
		// console.log("TASK DATA",task);
	}, [task]);
	return (
		<div
			className={`absolute inset-0 flex items-center justify-center transition-transform duration-300
				${isDetailOpen ? "z-40" : "-z-40"} 
			}`}>
			<div
				className="fixed inset-0 bg-black/10"
				onClick={() => {
					onClose();
					setIsEditing(false);
				}}></div>
			<div
				className={`bg-slate-200 text-slate-900 dark:bg-slate-950 dark:text-slate-200 border border-r-0 rounded-r-none border-slate-300/20 dark:shadow-2xl dark:shadow-slate-50/10 rounded-lg shadow-lg p-5 fixed z-50 h-full top-0 duration-500 transform transition-transform
				${
					isDetailOpen
						? "translate-x-0 w-screen md:w-1/2 md:right-0 "
						: "translate-x-full right-0"
				}
				
				`}>
				<div className="h-full grid grid-rows-12">
					<div className="flex items-center justify-between md:justify-end border-b-2 border-white/20 dark:bg-white/5 bg-slate-900/5">
						{isEditing ? (
							<>
								<button
									className={menuButtonStyleGreen}
									onClick={handleSubmit}>
									<span className="relative z-10 px-3 py-2 rounded ml-2 flex items-center gap-2">
										Update <MdKeyboardReturn />
									</span>
								</button>
								<button
									type="button"
									onClick={() => setIsEditing(false)}
									className={menuButtonStyleRed}>
									<span className="relative z-10 px-3 py-2 rounded ml-2 flex items-center gap-2">
										Cancel <MdCancel />
									</span>
								</button>
							</>
						) : (
							<>
								<button
									className={menuButtonStyleGreen}
									onClick={() => setIsEditing(true)}>
									<span className="relative z-10 px-3 py-2 rounded ml-2 flex items-center gap-2">
										Edit <MdEdit />
									</span>
								</button>
								<button
									className={menuButtonStyleRed}
									onClick={handleDelete}>
									<span className="relative z-10 px-3 py-2 rounded ml-2 flex items-center gap-2">
										Delete <MdDelete />
									</span>
								</button>
							</>
						)}
						<button
							className={menuButtonStyleBlue}
							onClick={onClose}>
							<span className="relative z-10 px-3 py-2 rounded ml-2 flex items-center gap-2">
								Close <IoExitOutline />
							</span>
						</button>
					</div>

					<h2 className="text-xl md:text-2xl lg:text-4xl row-span-1 md:row-span-2 font-bold py-[4vh] text-ellipsis text-nowrap overflow-x-hidden border-b-2 border-black/20 dark:border-white/20 flex flex-col items-start">
						{task.name}
						<p className="text-base my-[3vh] flex items-center justify-between text-black/60 dark:text-white/50">
							Creator:
							<span className="text-black/60 dark:text-white/70 ml-1">
								{task.creator.name}
							</span>
						</p>
					</h2>

					{isEditing ? (
						<UpdateForm
							task={task}
							formData={formData}
							setFormData={setFormData}
						/>
					) : (
						<div className="mb-4 row-span-11 grid grid-rows-12">
							<p className="my-[3vh] flex items-center justify-between">
								<strong>Assignees:</strong>{" "}
								{task.assignees.length > 0
									? task.assignees.map((assignee) => assignee.name).join(", ")
									: "No Assignees"}
							</p>
							<p className="my-[3vh] flex items-center justify-between">
								<strong>Due Date:</strong> {formatDate(new Date(task.dueDate))}
							</p>
							<p className="my-[3vh] flex items-center justify-between">
								<strong>Created At:</strong>{" "}
								{formatDate(new Date(task.createdAt))}
							</p>
							<p className="my-[3vh] flex items-center justify-between">
								<span>
									<strong>Priority:</strong>
									<span
										className={`text-center rounded-full px-3 py-1 ${
											task.priority.toLowerCase() == "low"
												? "bg-green-500/50 "
												: task.priority.toLowerCase() == "high"
												? "bg-red-500/50"
												: "bg-yellow-500/50"
										}`}>
										{task.priority}
									</span>
								</span>
								<span>
									<strong>Status:</strong> {task.status}
								</span>
							</p>
							<p className="my-[3vh] row-span-4 flex flex-col">
								<strong>Description:</strong>
								<span className="border border-slate-900/20 dark:border-slate-300/20 rounded-xl p-1 h-full">
									{task.description}
								</span>
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

interface UpdateFormProps {
	task: Task;
	formData: TaskDataWithRelationships;
	setFormData: (data: TaskDataWithRelationships) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
	task,
	formData,
	setFormData,
}) => {
	const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev: TaskDataWithRelationships) => ({
			...prev,
			[name]: value,
		}));
	};
	const handleAssigneeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const userId = parseInt(e.target.value);
		console.log(userId);
		setFormData((prev: TaskDataWithRelationships) => ({
			...prev,
			assignees: e.target.checked
				? [
						...(prev.assignees || []),
						availableUsers.find((user) => user.id === userId)!,
				  ]
				: prev.assignees?.filter((assignee) => assignee.id !== userId),
		}));
	};
	const formatDate = (date: Date) => {
		const mmddyyyy = date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
		return mmddyyyy;
	};
	const formatDateInput = (dateString: string) => {
		const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
		if (!datePattern.test(dateString)) {
			throw new Error("Invalid date format. Expected format: MM/DD/YYYY");
		}
		const [month, day, year] = dateString.split("/");
		const formattedMonth = month.padStart(2, "0");
		const formattedDay = day.padStart(2, "0");
		return `${year}-${formattedMonth}-${formattedDay}`;
	};

	useEffect(() => {
		console.log(formData);
		const fetchUsers = async () => {
			try {
				// const users = await getAllUsers();
				const token = localStorage.getItem("token");
				if (token) {
					// const decodedToken = jwtDecode<UserProfile>(token);
				//	const currentUserId = decodedToken.id;
					// const filteredUsers = users.filter(
					// 	(user: UserProfile) => user.id !== currentUserId
					// );
					//setAvailableUsers(filteredUsers);
				}
				//setAvailableUsers(users);
			} catch (error) {
				console.error("Error fetching users:", error);
			} finally {
				setLoadingUsers(false);
			}
		};
		fetchUsers();
	}, []);

	return (
		<form
			id="taskForm"
			onSubmit={(e) => {
				e.preventDefault();
				console.log("Here");
			}}
			className="row-span-11 flex flex-col">
			<div className="mt-[2vh] mb-[3vh] flex flex-col items-start justify-between">
				<label className="block mb-1">Due Date</label>
				<input
					type="date"
					name="dueDate"
					defaultValue={formatDateInput(formatDate(new Date(task.dueDate)))}
					onChange={handleChange}
					className="border-b border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200"
				/>
			</div>

			<div className="mb-[3vh] flex flex-col items-start justify-between">
				<label className="block mb-1 ">Priority</label>
				<select
					name="priority"
					value={formData.priority}
					onChange={handleChange}
					className="border-b border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200"
					required>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</select>
			</div>

			<div className="mb-[3vh] flex flex-col items-start justify-between">
				<label className="block mb-1 ">Status</label>
				<select
					name="status"
					value={formData.status}
					onChange={handleChange}
					className="border-b border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200"
					required>
					<option value="To Do">To Do</option>
					<option value="In Progress">In Progress</option>
					<option value="Completed">Completed</option>
				</select>
			</div>

			<div className="mb-[3vh] flex flex-col items-start">
				<label className="block mb-1">Assign Users</label>
				{loadingUsers ? (
					<p>Loading users...</p>
				) : (
					<div
						className="border-b border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200 
					overflow-scroll h-[50%]">
						{availableUsers.map((user) => (
							<div
								key={user.id}
								className="flex items-center mt-[1vh] mb-[2vh]">
								<input
									type="checkbox"
									id={`user-${user.id}`}
									value={user.id}
									checked={formData.assignees?.some(
										(assignee) => assignee.id === user.id
									) || formData.assignees?.some(
										(assignee) => assignee.UserTask?.userId === user.id
									)}
									onChange={handleAssigneeChange}
									className="mr-2"
								/>
								<label htmlFor={`user-${user.id}`}>{user.name}</label>
							</div>
						))}
					</div>
				)}
			</div>
		</form>
	);
};

export default TaskDetail;
