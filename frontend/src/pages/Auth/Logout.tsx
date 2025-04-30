import { useNavigate } from "react-router-dom";
import { logoutButtonStyle } from "../../utils/formStyles";
import { HiOutlineLogout } from "react-icons/hi";

const Logout = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/signin"); 
	};

	return <button onClick={handleLogout} className={logoutButtonStyle}>
	<span className="relative z-10 flex items-center gap-2">
		Log Out <HiOutlineLogout />
	</span>
	</button>;
};

export default Logout;