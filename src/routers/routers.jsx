import { createBrowserRouter, redirect } from "react-router";
import Login from "../pages/Login";
import HomeCMS from "../pages/HomeCMS";
import AddCuisine from "../pages/AddCuisine";
import EditCuisine from "../pages/EditCuisine";
import AddUser from "../pages/AddUser";
import EditImage from "../pages/EditImage";
import CategoriesPage from "../pages/CategoriesPage";
import Toastify from "toastify-js";
//

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

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/homecms",
    element: <HomeCMS />,
    loader: () => {
      if (!localStorage.token) {
        showToast("Please login first");
        return redirect("/");
      }
    },
  },
  {
    path: "/cuisines/add",
    element: <AddCuisine />,
    loader: () => {
      if (!localStorage.token) {
        showToast("Please login first");
        return redirect("/");
      }
    },
  },
  {
    path: "/cuisines/edit/:id",
    element: <EditCuisine />,
    loader: () => {
      if (!localStorage.token) {
        showToast("Please login first");
        return redirect("/");
      }
    },
  },
  {
    path: "/add-user",
    element: <AddUser />,
    loader: () => {
      if (!localStorage.token) {
        showToast("Please login first");
        return redirect("/");
      }
    },
  },
  {
    path: "/cuisines/upload/:id",
    element: <EditImage />,
    loader: () => {
      if (!localStorage.token) {
        showToast("Please login first");
        return redirect("/");
      }
    },
  },
  {
    path: "/categories",
    element: <CategoriesPage />,
    loader: () => {
      if (!localStorage.token) {
        showToast("Please login first");
        return redirect("/");
      }
    },
  },
]);

export default Router;
