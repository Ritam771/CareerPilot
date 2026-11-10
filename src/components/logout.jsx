
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { logoutUser } from "../services/auth";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    logoutUser();

    navigate("/", { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-lg px-4 py-2
      text-sm font-semibold text-red-600 transition
      hover:bg-red-50 hover:text-red-700"
    >
      <FiLogOut size={18} />
      <span>Logout</span>
    </button>
  );
}

export default Logout;
