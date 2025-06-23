import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toastify from "toastify-js";

const CuisineForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formInput, setFormInput] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imgUrl: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please Login first");
      navigate("/login");
    }

    (async () => {
      try {
        await axios.get("https://hizkiajonathanbudiana.my.id/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (
          !isEdit &&
          localStorage.getItem("id") !== id &&
          localStorage.getItem("role").toLocaleLowerCase() !== "admin"
        ) {
          showToast("Not authorized");
          navigate("/homecms");
        }

        const catRes = await axios.get(
          "https://hizkiajonathanbudiana.my.id/pub/categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(catRes.data.categories);

        // conditional if edit form
        if (isEdit) {
          const cuisRes = await axios.get(
            `https://hizkiajonathanbudiana.my.id/cuisines/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = cuisRes.data.postDetails || {};
          setFormInput((prev) => ({
            ...prev,
            name: data.name || "",
            description: data.description || "",
            price: data.price || "",
            categoryId: data.categoryId || "",
            imgUrl: data.imgUrl || "",
          }));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          showToast("Please Login first");
          localStorage.clear();
          navigate("/login");
        } else {
          console.error(error.response);
        }
      }
    })();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormInput((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      if (isEdit) {
        await axios.put(
          `https://hizkiajonathanbudiana.my.id/cuisines/${id}`,
          formInput,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        const fd = new FormData();
        fd.append("name", formInput.name);
        fd.append("description", formInput.description);
        fd.append("price", formInput.price);
        fd.append("categoryId", formInput.categoryId);
        fd.append("image", formInput.image);
        await axios.post("https://hizkiajonathanbudiana.my.id/cuisines", fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      isEdit
        ? showToast("Success Edit", "success")
        : showToast("Success Add", "success");
      setIsLoading(false);
      navigate("/homecms");
    } catch (error) {
      setIsLoading(false);

      if (Array.isArray(error.response?.data?.error)) {
        error.response?.data?.error.map((error) => {
          showToast(error);
        });
      } else {
        showToast(error.response?.data?.error);
      }

      console.error("Status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  };

  return (
    <div className="d-flex">
      <div className="flex-grow-1 p-4">
        <h3 className="mb-4">{isEdit ? "Edit Cuisine" : "Add New Cuisine"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              value={formInput.name}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Nasi Goreng"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formInput.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Describe the cuisine"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              name="price"
              type="number"
              value={formInput.price}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 75000"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              name="categoryId"
              value={formInput.categoryId}
              onChange={handleChange}
              className="form-select"
            >
              <option value="" disabled>
                Choose…
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {isEdit ? (
            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                name="imgUrl"
                value={formInput.imgUrl}
                onChange={handleChange}
                className="form-control"
                placeholder="httpss://..."
              />
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label">Image File</label>
              <input
                name="image"
                type="file"
                onChange={handleChange}
                className="form-control"
              />
            </div>
          )}

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/homecms")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading
                ? isEdit
                  ? "Updating…"
                  : "Adding…"
                : isEdit
                ? "Update"
                : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CuisineForm;
