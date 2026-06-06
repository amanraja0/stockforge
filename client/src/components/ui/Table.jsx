const Table = ({ children }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full">{children}</table>
    </div>
  );
};

export default Table;
