const StatsCard = ({ title, value, icon, bg }) => {
  return (
    <div className={`p-5 rounded-xl shadow bg-white border-l-4 ${bg}`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <h3 className="text-gray-600 font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
};

export default StatsCard;
