import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ThemeButton = () => {
	const { toggleTheme, theme } = useTheme();
	return (
		<div
			className="absolute z-50 bottom-1 left-1 w-fit rounded-full cursor-pointer hover:underline hover:text-white hover:dark:bg-indigo-500 dark:text-indigo-500 hover:bg-orange-400 text-orange-400 bg-zinc-900 transition-colors duration-150 p-2 border border-orange-400 dark:border-indigo-500"
			onClick={toggleTheme}>
			{theme == "dark" ? <FaMoon /> : <FaSun />}
		</div>
	);
};

export default ThemeButton;
