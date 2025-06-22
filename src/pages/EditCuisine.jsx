import CuisineForm from "../components/CuisineForm";
import Sidebar from "../components/SideBar";

const EditCuisine = () => {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 p-4">
        <CuisineForm />
      </div>
    </div>
  );
};

export default EditCuisine;
