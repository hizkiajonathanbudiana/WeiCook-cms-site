import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import Toastify from "toastify-js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const formOnSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      console.log("email & Password", email, password);

      const { data } = await axios.post(
        "http://localhost:3000/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(data);

      localStorage.setItem("token", data.access_token);
      showToast("Welcome Back", "success");
      navigate("/homecms");
    } catch (error) {
      showToast(error?.response?.data?.error);
    }
  };

  return (
    <>
      <div className="bg-light d-flex align-items-center justify-content-center vh-100">
        <div className="card shadow-sm" style={{ width: "25rem" }}>
          <div className="card-body p-4">
            <h3 className="text-center mb-4">Login</h3>
            <h5 className="text-center mb-4">(Staff/Admin)</h5>
            <form onSubmit={formOnSubmitHandler}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                />
                <label>Email</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                />
                <label>Password</label>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
            <div className="text-center mt-3">
              <a href="./index.html" className="small">
                ← Back to Menu List
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
