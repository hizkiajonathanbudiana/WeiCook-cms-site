import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

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

  const fetchData = async () => {
    try {
      setIsLoading(true);

      if (localStorage.getItem("addCuisine") === "success") {
        showToast("Success Add Cuisine", "success");
        localStorage.removeItem("addCuisine");
      }

      if (localStorage.getItem("editCuisine") === "success") {
        showToast("Success Edit Cuisine", "success");
        localStorage.removeItem("editCuisine");
      }

      const token = localStorage.getItem("token");

      await axios.get("https://hizkiajonathanbudiana.my.id/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = await axios.get(
        "https://hizkiajonathanbudiana.my.id/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(data.categories);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        showToast("Please login first");
        navigate("/login");
      }
      console.log(error.response);
    } finally {
      showToast("Success showing categories", "success");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        {isLoading && (
          <div
            className="position-fixed top-50 start-50 translate-middle"
            style={{ zIndex: 2000 }}
          >
            <div className="spinner-border" role="status"></div>
          </div>
        )}

        <main className="flex-grow-1 p-4">
          <div className="container-fluid">
            <header className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4">Categories List</h1>
              </div>
            </header>

            <div className="card shadow-sm">
              <div className="card-body p-0">
                <table className="table mb-0 table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>id</th>
                      <th>Name</th>
                      <th>Updated At</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((el) => (
                      <tr>
                        <td>{el.id}</td>
                        <td>{el.name}</td>
                        <td>{formatDate(el.updatedAt)}</td>
                        <td>{formatDate(el.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CategoriesPage;
