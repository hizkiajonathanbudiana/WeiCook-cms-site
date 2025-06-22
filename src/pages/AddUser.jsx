import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import ButtonReuse from "../components/ButtonReuse";

const AddUser = () => {
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

  const [formInput, setFormInput] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          showToast("Please Login first");
          navigate("/login");
        }

        await axios.get("http://hizkiajonathanbudiana.my.id/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          showToast("Please Login first");

          navigate("/login");
        }
        if (error.response?.status === 403) {
          localStorage.clear();
          showToast("Only Admin Allowed");
          navigate("/homecms");
        }
        console.log(error.response);
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      await axios.post(
        `http://hizkiajonathanbudiana.my.id/register`,
        formInput,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/homecms");
    } catch (error) {
      setIsLoading(false);

      error?.response?.data?.error.map((el) => showToast(el));
    } finally {
      showToast("Success Add User", "success");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex">
        <Sidebar />

        <div className="p-4 w-100">
          <h3 className="mb-4">Add New Staff</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., ganteng_01"
                name="username"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., ganteng01@gmail.com"
                name="email"
                onChange={handleChange}
              ></input>
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., ganteng012345"
                name="password"
                onChange={handleChange}
              ></input>
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g., 0000000000"
                name="phoneNumber"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Adress</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Jl. Ganteng "
                name="address"
                onChange={handleChange}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/homecms")}
              >
                Cancel
              </button>
              <ButtonReuse isLoading={isLoading} name="Add" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddUser;
