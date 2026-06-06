const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-500 active:scale-95 transition px-4 py-2 rounded-xl font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
