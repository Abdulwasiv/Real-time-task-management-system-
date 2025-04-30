import { useEffect, useState } from "react";
import Logout from "../Auth/Logout";
import CreateTask from "./CreateTask";
import TaskList from "./TaskList/TaskList";
import { useAuth } from "../../context/AuthContext";
import { DecodedToken, UserProfile } from "../../utils/interfaces";
import { MdAssignment, MdFilter1, MdFilter2, MdFilter3 } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import ThemeButton from "../ThemeButton";
import FilterMenu from "./TaskList/FilterMenu";

const Home = () => {
	const { user, setUser } = useAuth();
	const [myTask, setMyTask] = useState(1);
	const [filterMenu, setFilterMenu] = useState(false);
	const [filter,setFilter]=useState({ priority: "", status: "", dueDate: "" });
	const [filterCount,setFilterCount] = useState(0);

	const closeFilterMenu = () => {
		setFilterMenu(false);
	};
	useEffect(() => {
		const fetchUserDetails = async () => {
			
		};
		fetchUserDetails();
	}, [setUser]);
	useEffect(()=>{
		let count=0;
        if(filter.priority) count++;
        if(filter.status) count++;
        if(filter.dueDate) count++;
        setFilterCount(count);
	},[filter])
	const renderFilterIcon = () => {
        switch (filterCount) {
            case 1:
                return <MdFilter1 />;
            case 2:
                return <MdFilter2 />;
            case 3:
                return <MdFilter3 />;
            default:
                return <IoFilter />;
        }
    };
	return (
		<div className="h-[100vh] grid grid-rows-12">
			<Header user={user} />
			<div className="row-span-11 grid grid-rows-12 px-0 md:px-6 lg:px-12 pt-2 bg-slate-300 dark:bg-slate-900 transition-colors duration-150">
				<div className="rounded-none md:rounded-3xl px-3 md:px-6 lg:px-10 grid grid-cols-2 bg-stone-900/5 dark:bg-stone-950/40 border border-black/20 shadow-sm dark:border-slate-700/90 transition-all duration-150">
					<div className="flex justify-start items-center gap-2 select-none">
						<span
							className={`text-sm md:text-base p-1 md:p-2 lg:p-3 rounded-xl hover:shadow-gray-900 shadow-gray-600 font-bold  cursor-pointer flex items-center justify-start gap-3 transition-all duration-300 ${
								myTask == 1
									? "bg-slate-200 text-blue-700 hover:text-blue-800 hover:shadow-inner"
									: "text-blue-900 dark:text-white hover:bg-slate-400/20 dark:hover:text-blue-400 shadow-none hover:shadow-md"
							}`}
							onClick={() => {
								setMyTask(1);
							}}>
							<FaTasks className="hidden md:block lg:block" />
							<span>My Tasks</span>
						</span>
						<span
							className={`text-sm md:text-base p-1 md:p-2 lg:p-3 rounded-xl  hover:shadow-gray-900 shadow-gray-600 font-bold  cursor-pointer flex items-center justify-start gap-3 transition-all duration-300 ${
								myTask == 2
									? "bg-slate-200 text-blue-600 hover:text-blue-800 hover:shadow-inner"
									: "text-blue-900 dark:text-white dark:hover:text-blue-400 hover:bg-slate-400/20 shadow-none hover:shadow-md"
							}`}
							onClick={() => {
								setMyTask(2);
							}}>
							<MdAssignment className="hidden md:block lg:block" />
							<span>Assigned Tasks</span>
						</span>
						{(user as DecodedToken).role == "admin" && (
							<span
								className={`text-sm md:text-base p-1 md:p-2 lg:p-3 rounded-xl  hover:shadow-gray-900 shadow-gray-600 font-bold  cursor-pointer flex items-center justify-start gap-3 transition-all duration-300 ${
									myTask == 3
										? "bg-slate-200 text-blue-600 hover:text-blue-800 hover:shadow-inner"
										: "text-blue-900 dark:text-white dark:hover:text-blue-400 hover:bg-slate-400/20 shadow-none hover:shadow-md"
								}`}
								onClick={() => {
									setMyTask(3);
								}}>
								<MdAssignment className="hidden md:block lg:block" />
								<span>View All Tasks</span>
							</span>
						)}
						<span
							className={
								"relative z-20 text-sm md:text-base bg-blue-600 hover:text-blue-800 text-white hover:bg-slate-100 p-1 md:p-2 md:px-3 sm:rounded-full rounded-3xl shadow hover:shadow-gray-900 hover:shadow-md shadow-gray-600 cursor-pointer transition duration-150"
							}>
							<span
								className="flex items-center justify-start gap-3"
								onClick={() => {
									setFilterMenu(!filterMenu);
								}}>
								{renderFilterIcon()}
								<span className="hidden md:block lg:block">Filter</span>
							</span>
							{filterMenu && <FilterMenu onClose={closeFilterMenu} setFilter={setFilter} filter={filter}/>}
						</span>
					</div>
					<div className="flex items-center justify-end">
						<CreateTask />
					</div>
				</div>
				<div className="row-span-11 w-full overflow-scroll">
					<div className="overflow-scroll h-full pb-3 px-0 md:px-6 lg:px-12 shadow-4xl">
						<TaskList myTask={myTask} filter={filter}/>
					</div>
				</div>
			</div>
		</div>
	);
};

const Header: React.FC<{ user: DecodedToken | UserProfile }> = ({ user }) => {
	return (
		<div className="row-span-1 flex items-center justify-between px-4 md:px-6 lg:px-12 border border-b-2 border-slate-400 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 transition duration-150">
			<h1 className="text-base md:text-3xl font-bold select-none">
				Welcome, {user.name}!
			</h1>
			<div className="flex items-center">
				<Logout />
				<ThemeButton />
			</div>
		</div>
	);
};
export default Home;
