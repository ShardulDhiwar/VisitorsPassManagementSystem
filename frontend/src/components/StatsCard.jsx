// const StatsCard = ({ title, value, icon, bg }) => {
//   return (
//     <div className={`p-6 rounded-xl shadow-lg bg-white border-l-4 ${bg} hover:shadow-xl transition-shadow duration-300`}>
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-gray-600 font-medium text-sm">{title}</h3>
//         <div className="text-3xl opacity-80">{icon}</div>
//       </div>
//       <p className="text-4xl font-bold text-gray-800">{value}</p>
//     </div>
//   );
// };

// export default StatsCard;

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="text-gray-400">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatsCard;