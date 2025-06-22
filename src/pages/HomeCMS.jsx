import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/SideBar";
import ButtonReuse from "../components/ButtonReuse";
import Toastify from "toastify-js";

const HomeCMS = () => {
  const [cuisines, setCuisines] = useState([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [idUser, setIdUser] = useState("");
  const [roleUser, setRoleUser] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [formInput, setFormInput] = useState({
    search: "",
    filter: "",
    sort: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

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
        zIndex: 9999,
      },
    }).showToast();
  };

  const fetchDataCuisines = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      const { data: user } = await axios.get(
        "https://hizkiajonathanbudiana.my.id/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("id", user.user.id);
      localStorage.setItem("username", user.user.username);
      localStorage.setItem("role", user.user.role);

      setIdUser(user.user.id);
      setRoleUser(user.user.role);

      const { data } = await axios.get(
        `https://hizkiajonathanbudiana.my.id/cuisines?search=${formInput.search}&filter=${formInput.filter}&page=${currentPage}&sort=${formInput.sort}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data: dataCategories } = await axios.get(
        "https://hizkiajonathanbudiana.my.id/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCuisines(data.data);
      setTotalPage(data.totalPage);
      setCategories(dataCategories.categories);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      showToast("Success showing data", "success");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataCuisines();
  }, [currentPage, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDataCuisines();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleAction = async (act, id, authorId) => {
    try {
      const token = localStorage.getItem("token");

      if (act === "delete") {
        if (roleUser.toLowerCase() !== "admin" && authorId !== idUser) {
          throw new Error("DELETE");
        }
        await axios.delete(
          `https://hizkiajonathanbudiana.my.id/cuisines/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showToast(`Success deleted post id ${id}`);
        fetchDataCuisines();
      }

      if (act === "edit") {
        if (roleUser.toLowerCase() !== "admin" && authorId !== idUser) {
          throw new Error("EDIT");
        }
        return navigate(`/cuisines/edit/${id}`);
      }

      if (act === "upload") {
        if (roleUser.toLowerCase() !== "admin" && authorId !== idUser) {
          throw new Error("UPLOAD");
        } else {
          setUploadingId(id);
          setShowUploadModal(true);
        }
      }
    } catch (error) {
      if (error.message === "DELETE") {
        showToast(
          "Not Authorized, only can delete post that were created by your own"
        );
      }

      if (error.message === "UPLOAD") {
        showToast(
          "Not Authorized, only can upload post that were created by your own"
        );
      }

      if (error.message === "EDIT") {
        showToast(
          "Not Authorized, only can edit post that were created by your own"
        );
      }

      if (error.response?.status === 403) {
        showToast("Not Authorized");
      }

      if (error.response?.status === 500) {
        showToast("Internal Server Error");
      }

      console.log(error.response);
    }
  };

  const handleFile = async (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();

    if (!uploadFile) return;

    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", uploadFile);

      await axios.patch(
        `https://hizkiajonathanbudiana.my.id/cuisines/${uploadingId}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      showToast(err.response?.data?.error);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Upload failed:", err.response?.data || err.message);
      }
    } finally {
      showToast("Image uploaded!", "success");
      setIsLoading(false);
      setShowUploadModal(false);
      fetchDataCuisines();
    }
  };

  const shorten = (text, max = 15) =>
    text.length > max ? text.slice(0, max) + "..." : text;
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
                <h1 className="h4">Cuisines List</h1>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/cuisines/add")}
                >
                  New Cuisine
                </button>
              </div>
              <p className="text-muted">Find dish.</p>

              <form onSubmit={handleSubmit}>
                <div className="row g-2 mt-3">
                  <div className="col-md-5">
                    <input
                      className="form-control"
                      placeholder="Search..."
                      name="search"
                      value={formInput.search}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <select
                      className="form-select"
                      name="filter"
                      value={formInput.filter}
                      onChange={handleChange}
                    >
                      <option value="">Filter by all Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <select
                      className="form-select"
                      name="sort"
                      value={formInput.sort}
                      onChange={handleChange}
                    >
                      <option value="">Sort by all</option>
                      <option value="DESC">Newest Post</option>
                      <option value="ASC">Oldest Post</option>
                    </select>
                  </div>

                  <div className="col-md-1">
                    <ButtonReuse
                      isLoading={isLoading}
                      name="Find"
                      type="submit"
                    />
                  </div>
                </div>
              </form>
            </header>

            <div className="card shadow-sm">
              <div className="card-body p-0">
                <table className="table mb-0 table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>id</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Image</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Creator</th>
                      <th>Updated At</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuisines.map((el) => (
                      <tr>
                        <td>{el.id}</td>
                        <td>{shorten(el.name)}</td>
                        <td>{shorten(el.description)}</td>
                        <td>
                          <img
                            src={el.imgUrl}
                            style={{ width: "20px", height: "20px" }}
                          />
                          {shorten(el.imgUrl)}
                        </td>
                        <td>{el.Category?.name}</td>
                        <td>Rp {el.price}</td>
                        <td>{el.User?.username}</td>
                        <td>{formatDate(el.updatedAt)}</td>
                        <td>{formatDate(el.createdAt)}</td>

                        <td>
                          <button
                            className="btn btn-sm btn-info text-white me-1"
                            onClick={() =>
                              handleAction("upload", el.id, el.User?.id)
                            }
                          >
                            <i className="fa-solid fa-image"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() =>
                              handleAction("edit", el.id, el.User?.id)
                            }
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleAction("delete", el.id, el.User?.id)
                            }
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav className="mt-4 d-flex justify-content-center">
                  <ul className="pagination">
                    {Array.from({ length: totalPage }, (_, i) => (
                      <li key={i} className="page-item">
                        <button
                          className={
                            currentPage === i + 1
                              ? "page-link btn btn-dark"
                              : "page-link btn btn-secondary"
                          }
                          onClick={async () => {
                            setCurrentPage(i + 1);
                          }}
                          disabled={currentPage === i + 1}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showUploadModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleFileSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">Upload New Image</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowUploadModal(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFile}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="submit"
                      className="btn btn-secondary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Uploading" : "Upload"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </>
  );
};

export default HomeCMS;
