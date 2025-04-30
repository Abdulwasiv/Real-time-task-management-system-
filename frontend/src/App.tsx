import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Dashboard/index.tsx";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import NotFound from "./pages/NotFound.tsx";

const App = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>  
      }
			/>
			<Route
				path="/signup"
				element={<Register />}
			/>
			<Route
				path="/signin"
				element={<Login />}
			/>
			<Route
				path="*"
				element={<NotFound />}
			/>
		</Routes>
	);
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const token = localStorage.getItem("token");

	if (!token) {
		return <Navigate to="/signin" />;
	}

	return children;
};

export default App;
