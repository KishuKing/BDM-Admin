import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingDoctors } from "../services/api";

const DoctorVerification = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Table state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getPendingDoctors();
      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch pending doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Safe filtering: Checks if personalInfo and name exist before calling toLowerCase
  const filteredData = doctors.filter((item) => {
    const doctorName = item.personalInfo?.name || "";
    return doctorName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Doctor Verifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review and approve pending doctor registrations
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          {/* Table Header & Search */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Pending Doctors
            </h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-64 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Doctor Info
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Reg. Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {currentData.length > 0 ? (
                  currentData.map((doctor) => {
                    // Extract data safely
                    const name = doctor.personalInfo?.name || "Unknown";
                    const specializations =
                      doctor.specializations?.join(", ") || "N/A";

                    return (
                      <tr
                        key={doctor._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Profile Image Avatar */}
                            {doctor.profileImage?.url &&
                            doctor.profileImage.url !== "default-avatar-url" ? (
                              <img
                                src={doctor.profileImage.url}
                                alt={name}
                                className="size-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                {name.substring(0, 2)}
                              </div>
                            )}
                            <div>
                              <span className="text-sm font-medium block">
                                {name}
                              </span>
                              <span className="text-xs text-slate-500">
                                {doctor.qualifications?.join(", ")}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-[150px] truncate"
                          title={specializations}>
                          {specializations}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {doctor.experienceYears
                            ? `${doctor.experienceYears} Years`
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(doctor.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.verified ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                            {doctor.verified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              console.log("Navigating with ID:", doctor._id);
                              navigate(`/doctor/${doctor._id}`);
                            }} // This passes the MongoDB ID to the URL
                            className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                            Review Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      No pending verifications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} entries
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800" : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800" : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorVerification;
