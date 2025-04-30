import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import ThemeProvider from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<AuthProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</AuthProvider>
		</ThemeProvider>
	</StrictMode>
);
