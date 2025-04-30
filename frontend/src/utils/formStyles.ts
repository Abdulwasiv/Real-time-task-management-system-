import { FieldError } from "react-hook-form";

export const labelStyle =
	"peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6";
export const inputStyle = (error: FieldError | undefined) =>
	`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-slate-400 ${
		error ? "border-red-500" : "border-gray-300"
	} appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`;

export const buttonStyle =
	"before:ease relative h-12 w-40 overflow-hidden border border-blue-500 bg-blue-500 text-white   transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-blue-500 hover:before:-translate-x-40 mb-5";

export const logoutButtonStyle =
	"relative flex rounded-xl h-full py-1 px-2 md:p-2 lg:py-3 lg:px-4 items-center justify-center overflow-hidden bg-blue-600 font-medium text-white shadow-md transition-all duration-300 before:absolute before:rounded-xl before:inset-0 before:border-0 before:border-red-500 before:duration-100 before:ease-linear hover:bg-white hover:shadow-blue-900 hover:before:border-[25px]";

export const menuButtonStyleGreen =
	`text-green-500 hover:before:bg-green-500 border-green-500 relative h-fit mx-3 overflow-hidden border border-green-500 
	bg-green-500/10 px-3 text-green-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-green-500 before:transition-all before:duration-500 hover:text-white hover:shadow-green-500 hover:before:left-0 hover:before:w-full`
export const menuButtonStyleRed =
	`text-red-500 hover:before:bg-red-500 border-red-500 relative h-fit mx-3 overflow-hidden border border-red-500 
	bg-red-500/10 px-3 text-green-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-red-500 before:transition-all before:duration-500 hover:text-white hover:shadow-red-500 hover:before:left-0 hover:before:w-full`
export const menuButtonStyleBlue =
	`text-blue-500 hover:before:bg-blue-500 border-blue-500 relative h-fit mx-3 overflow-hidden border border-blue-500 
	bg-blue-500/10 px-3 text-blue-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-blue-500 before:transition-all before:duration-500 hover:text-white hover:shadow-blue-500 hover:before:left-0 hover:before:w-full`
