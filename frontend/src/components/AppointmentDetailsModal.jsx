import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  KeyRound,
} from "lucide-react";

const AppointmentDetailsModal = ({ open, onClose, appointment }) => {
  if (!open || !appointment) return null;

  const { visitorId, whomToMeet, purpose, date, hostName, status, _id, pass } = appointment;

  const getStatusColor = (status) => {
    const colors = {
      approved: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      approved: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };
    return icons[status?.toLowerCase()] || <Clock className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-linear-to-r from-gray-900 to-gray-800  px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              Appointment Details
            </h2>
            <p className="text-blue-100 text-sm mt-1">ID: {_id || "N/A"}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* Visitor Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Visitor Information
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <DetailRow
                icon={<User className="w-5 h-5 text-gray-400" />}
                label="Full Name"
                value={visitorId?.name}
              />
              <DetailRow
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                label="Email Address"
                value={visitorId?.email}
              />
              <DetailRow
                icon={<Phone className="w-5 h-5 text-gray-400" />}
                label="Phone Number"
                value={visitorId?.phone}
              />
            </div>
          </div>

          {/* Appointment Details Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Appointment Details
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <DetailRow
                icon={<FileText className="w-5 h-5 text-gray-400" />}
                label="Whom To Meet"
                value={whomToMeet}
              />
              <DetailRow
                icon={<FileText className="w-5 h-5 text-gray-400" />}
                label="Purpose"
                value={purpose}
              />
              <DetailRow
                icon={<Calendar className="w-5 h-5 text-gray-400" />}
                label="Scheduled Date & Time"
                value={
                  date
                    ? new Date(date).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"
                }
              />
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  Status
                </span>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-1.5 ${getStatusColor(
                    status
                  )}`}
                >
                  {getStatusIcon(status)}
                  {status || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Pass Information Section */}
          {pass && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Access Pass
              </h3>
              <div className="bg-linear-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 space-y-3">
                <DetailRow
                  icon={<KeyRound className="w-5 h-5 text-purple-500" />}
                  label="Pass Token"
                  value={pass.token}
                  valueClass="font-mono text-purple-700 font-semibold"
                />
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                    Pass Status
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                      pass.status
                    )}`}
                  >
                    {pass.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value, valueClass = "text-gray-900" }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-gray-600 font-medium flex items-center gap-2">
      {icon}
      {label}
    </span>
    <span className={`font-semibold ${valueClass}`}>{value || "—"}</span>
  </div>
);

export default AppointmentDetailsModal;
