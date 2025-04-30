import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
	menuButtonStyleBlue,
	menuButtonStyleRed,
} from "../../../utils/formStyles";

const FilterMenu = ({
	onClose,
	setFilter,
	filter,
}: {
	onClose: () => void;
	setFilter: Dispatch<
		SetStateAction<{ priority: string; status: string; dueDate: string }>
	>;
	filter: { priority: string; status: string; dueDate: string };
}) => {
	const [filterCriteria, setFilterCriteria] = useState({
		priority: "",
		status: "",
		dueDate: "",
	});
	const applyFilters = () => {
		console.log(filterCriteria);
		setFilter(filterCriteria);
		onClose();
	};

	const clearFilters = () => {
		setFilterCriteria({ priority: "", status: "", dueDate: "" });
		setFilter({ priority: "", status: "", dueDate: "" });
		onClose();
	};

	const handleCriteriaChange = (
		e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setFilterCriteria((prev) => ({ ...prev, [name]: value }));
	};
	useEffect(() => {
		setFilterCriteria(filter);
	}, [filter]);
	return (
		<>
			<div
				className="fixed w-screen h-screen top-0 right-0 z-40 bg-black/5"
				onClick={onClose}></div>
			<div className="absolute z-40 -right-[30px] top-0 px-3 py-4 bg-slate-200 text-slate-900 dark:bg-slate-950 dark:text-slate-200 border border-r-0 rounded-r-none border-slate-300/20 dark:shadow-2xl dark:shadow-slate-50/10">
				<div className="h-full w-full flex flex-col items-center justify-center">
					<h3 className="font-bold mb-2">Filter Tasks</h3>
					<div className="mb-2">
						<label>Priority:</label>
						<select
							name="priority"
							className="border-b border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200"
							value={filterCriteria.priority}
							onChange={handleCriteriaChange}>
							<option value="">All</option>
							<option value="High">High</option>
							<option value="Medium">Medium</option>
							<option value="Low">Low</option>
						</select>
					</div>
					<div className="mb-2">
						<label>Status:</label>
						<select
							name="status"
							className="border-b border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200"
							value={filterCriteria.status}
							onChange={handleCriteriaChange}>
							<option value="">All</option>
							<option value="Completed">Completed</option>
							<option value="In Progress">In Progress</option>
							<option value="To Do">To Do</option>
						</select>
					</div>
					<div className="mb-2">
						<label>Due Date:</label>
						<input
							type="date"
							name="dueDate"
							className="border-b border-slate-900/20 dark:border-slate-300/20  p-2 w-full bg-slate-300 text-slate-950 dark:bg-slate-800 dark:text-slate-200"
							value={filterCriteria.dueDate}
							onChange={handleCriteriaChange}
						/>
					</div>
					<div className="flex flex-col justify-end gap-2 w-full">
						<button
							className={menuButtonStyleRed}
							onClick={clearFilters}>
							<span className="relative z-10">Clear</span>
						</button>
						<button
							className={menuButtonStyleBlue}
							onClick={applyFilters}>
							<span className="relative z-10">Apply</span>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default FilterMenu;
