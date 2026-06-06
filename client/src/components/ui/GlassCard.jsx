const GlassCard = ({ children }) => {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition">
      {children}
    </div>
  );
};

export default GlassCard;
