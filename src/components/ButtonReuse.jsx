const ButtonReuse = ({ isLoading, name, type }) => {
  return (
    <button type={`${type}`} className="btn btn-primary" disabled={isLoading}>
      {isLoading ? `${name}ing` : `${name}`}
    </button>
  );
};
export default ButtonReuse;
