import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/SideBar";

const EditImage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    const checkAccess = async () => {
      try {
        await axios.patch(
          `http://hizkiajonathanbudiana.my.id/cuisines/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else if (error.response?.status === 403) {
          navigate("/homecms");
        }
        console.error(error);
      }
    };
    checkAccess();
  }, [navigate, id]);

  const handleChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }
    if (!imageFile) {
      return;
    }

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", imageFile);

      await axios.patch(
        `http://hizkiajonathanbudiana.my.id/cuisines/${id}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/homecms");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Upload failed:", err.response?.data || err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 p-4">
        <h3 className="mb-4">Edit Cuisine Image</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Image File</label>
            <input
              name="image"
              type="file"
              onChange={handleChange}
              className="form-control"
              required
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Updating…" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditImage;
