import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";

const Sidebar = () => {
  const navigate = useNavigate();

  const showToast = (message, type = "error") => {
    const bg = "rgba(255, 252, 252, 0.95)";
    const borderColor =
      type === "success"
        ? "rgba(132, 238, 156, 0.95)"
        : "rgba(218, 91, 91, 0.95)";
    const textColor =
      type === "success" ? "rgba(31, 161, 61, 0.95)" : "rgba(255, 0, 0, 0.95)";

    Toastify({
      text: message,
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "bottom",
      position: "left",
      stopOnFocus: true,
      style: {
        background: bg,
        color: textColor,
        border: `1px solid ${borderColor}`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      },
    }).showToast();
  };

  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: 250, minHeight: "100vh" }}
    >
      <h4 className="mb-4">WeiCook</h4>
      <ul className="nav flex-column mb-4">
        <li className="nav-item">
          <a
            href="https://wei-cook-public.vercel.app/"
            className="nav-link btn btn-link text-white"
          >
            Public Site
          </a>
        </li>
        <li className="nav-item">
          <button
            className="nav-link btn btn-link text-white"
            onClick={() => navigate("/homecms")}
          >
            Cuisines
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link btn btn-link text-white"
            onClick={() => navigate("/categories")}
          >
            Categories
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link btn btn-link text-white"
            onClick={() => {
              if (
                localStorage.getItem("role").toLocaleLowerCase() !== "admin"
              ) {
                showToast("Not authorized");
                navigate("/homecms");
              } else {
                navigate("/add-user");
              }
            }}
          >
            Add Staff
          </button>
        </li>
      </ul>

      <button
        className="btn btn-outline-light"
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
