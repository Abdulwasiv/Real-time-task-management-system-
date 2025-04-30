import React, { useState, useEffect } from "react";
import { createTask } from "../../api";
//import { jwtDecode } from "jwt-decode";
import { IoIosAddCircle } from "react-icons/io";

const CreateTask = () => {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<>
			<span
				className={
					"relative z-10 text-sm md:text-base bg-blue-600 hover:text-blue-800 text-white hover:bg-slate-100 p-[0.4] md:p-2 md:px-3 sm:rounded-full rounded-3xl shadow hover:shadow-gray-900 hover:shadow-md shadow-gray-600 cursor-pointer flex items-center justify-start gap-3 transition duration-150"
				}
				onClick={() => setDialogOpen(true)}>
				<IoIosAddCircle className="text-2xl" />
				<span className="hidden md:block lg:block">Create Task</span>
			</span>
			<NewTaskForm
				onClose={() => {
					setDialogOpen(false);
				}}
				dialogOpen={dialogOpen}
			/>
		</>
	);
};

interface User {
	id: number;
	name: string;
}

interface NewTaskFormProps {
	onClose: () => void;
	dialogOpen: boolean;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onClose, dialogOpen }) => {
	const [taskData, setTaskData] = useState({
		name: "",
		description: "",
		dueDate: new Date().toISOString().split("T")[0], // Default to today
		priority: "Medium",
		assigneeIds: [] as string[],
	});
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				// const response = await getAllUsers();
				const token = localStorage.getItem("token");
				if (token) {
				//	const decodedToken = jwtDecode<User>(token);
				//	const currentUserId = decodedToken.id;
					// const filteredUsers = response.filter(
					// 	(user: User) => user.id !== currentUserId
					// );
					//setUsers(filteredUsers);
				}
			} catch (error) {
				console.error("Error fetching users:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setTaskData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleAssigneeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const userId = e.target.value;
		setTaskData((prev) => ({
			...prev,
			assigneeIds: e.target.checked
				? [...prev.assigneeIds, userId]
				: prev.assigneeIds.filter((id) => id !== userId),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const createdTask = { ...taskData, dueDate: new Date(taskData.dueDate) };
		console.log(createdTask);
		await createTask(createdTask);
		onClose();
	};

	return (
		<div
			className={`absolute inset-0 flex items-center justify-center 
				${dialogOpen ? "z-40" : "-z-40"} 
			}`}>
			<div
				className="fixed inset-0 bg-black/30"
				onClick={onClose}></div>
			<div
				className={`bg-slate-200 text-slate-900 dark:bg-slate-950 dark:text-slate-200 border border-r-0 rounded-r-none border-slate-300/20 dark:shadow-2xl dark:shadow-slate-50/10 rounded-lg shadow-lg p-5 fixed z-50 h-full w-1/2 duration-500 transform transition-transform ${
					dialogOpen ? "translate-x-0 right-0" : "translate-x-full right-0"
				}`}>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col justify-center h-full">
					<h2 className="text-3xl font-bold mb-4">Create New Task</h2>
					<div className="mb-4">
						<label className="block mb-1">Task Name</label>
						<input
							type="text"
							name="name"
							className={"border border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200"}
							value={taskData.name}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block mb-1">Description</label>
						<textarea
							name="description"
							className="border border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200"
							value={taskData.description}
							onChange={handleInputChange}></textarea>
					</div>
					<div className="mb-4">
						<label className="block mb-1">Due Date</label>
						<input
							type="date"
							name="dueDate"
							className="border border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200"
							value={taskData.dueDate}
							onChange={handleInputChange}
						/>
					</div>
					<div className="mb-4">
						<label className="block mb-1">Priority</label>
						<select
							name="priority"
							className="border border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200"
							value={taskData.priority}
							onChange={handleInputChange}>
							<option value="Low">Low</option>
							<option value="Medium">Medium</option>
							<option value="High">High</option>
						</select>
					</div>
					<div className="mb-4">
						<label className="block mb-1">Assign Users</label>
						{loading ? (
							<p>Loading users...</p>
						) : (
							<div className="border border-slate-900/20 dark:border-slate-300/20 p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200 h-[20vh] overflow-scroll">
								{users.map((user) => (
									<div
										key={user.id}
										className="flex items-center mb-2">
										<input
											type="checkbox"
											id={`user-${user.id}`}
											value={user.id}
											checked={taskData.assigneeIds.includes(
												user.id.toString()
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
					<div className="flex justify-end">
						<button
							type="button"
							className="mr-4 bg-gray-500 text-white px-3 py-2 rounded"
							onClick={onClose}>
							Cancel
						</button>
						<button
							type="submit"
							className="bg-blue-500 text-white px-3 py-2 rounded">
							Create Task
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateTask;
