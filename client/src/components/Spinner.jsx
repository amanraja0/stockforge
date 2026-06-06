const Spinner = ({ large = false }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`border-4 border-blue-500 border-t-transparent rounded-full animate-spin ${
          large ? "w-14 h-14" : "w-10 h-10"
        }`}
      />
    </div>
  );
};

export default Spinner;
