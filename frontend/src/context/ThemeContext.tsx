import React, { useState, useEffect, createContext, useContext } from "react";

const ThemeToggleContext = createContext<
	| {
			theme: string;
			toggleTheme: () => void;
	  }
	| undefined
>(undefined);

const ThemeProvider: React.FC<React.PropsWithChildren<unknown>> = ({
	children,
}) => {
	const [theme, setTheme] = useState<string>("light");

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};
	useEffect(() => {
		const isDarkMode =
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;
		setTheme(isDarkMode ? "dark" : "light");
	}, []);
	useEffect(() => {
		document.documentElement.className = theme === "dark" ? "dark" : "";
	}, [theme]);

	return (
		<ThemeToggleContext.Provider value={{ theme, toggleTheme }}>
			<div
				className={`flex flex-col min-h-screen bg-gradient-to-tr from-blue-50 to-blue-200 dark:from-slate-950 dark:to-slate-900 text-black dark:text-white`}>
				{children}
			</div>
		</ThemeToggleContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeToggleContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

export default ThemeProvider;
