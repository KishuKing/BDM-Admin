import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails, approveUser } from "../services/api";
import ImagePreviewModal from "../components/ImagePreviewModal";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getUserDetails(id);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user Details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );

  if (!user) return <div className="text-center p-12">User not found.</div>;

  // --- DATA MAPPING ACCORDING TO YOUR JSON ---
  const doctorName = user.personalInfo?.name || "N/A";
  const doctorAge = user.personalInfo?.age || "N/A";
  const doctorGender = user.personalInfo?.gender || "N/A";

  // Directly using the strings from your JSON response
  const profilePic = user.profileImage || "https://via.placeholder.com/150";
  const certificateUrl = user.certificateImage;

  const isPending = user.verified === false;

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this doctor?"))
      return;
    setActionLoading(true);
    try {
      await approveUser(id);
      navigate("/doctors");
    } catch (error) {
      alert("Failed to approve.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Profile Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={profilePic}
            alt={doctorName}
            className="size-32 rounded-2xl object-cover ring-4 ring-primary/10"
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {doctorName}
              </h1>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full w-fit mx-auto md:mx-0">
                {user.experienceYears} Years Exp
              </span>
            </div>
            <p className="text-primary font-medium text-lg">
              {user.specializations?.join(" • ")}
            </p>

            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  mail
                </span>{" "}
                {user.user?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  person
                </span>{" "}
                {doctorAge} yrs, {doctorGender}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  payments
                </span>{" "}
                Fee: ₹{user.consultationFee}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Professional Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                description
              </span>{" "}
              Bio & Qualifications
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Bio
                </label>
                <p className="text-slate-700 dark:text-slate-300 mt-1">
                  {user.bio || "No bio provided"}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Qualifications
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.qualifications?.map((q, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                apartment
              </span>{" "}
              Affiliations
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {user.affiliations?.map((aff, i) => (
                <div
                  key={i}
                  className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {aff.name}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      location_on
                    </span>{" "}
                    {aff.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
          <h3 className="text-lg font-bold mb-4">Medical Certificate</h3>
          {certificateUrl ? (
            <div
              className="group relative rounded-xl overflow-hidden cursor-pointer border-2 border-slate-100 dark:border-slate-800"
              onClick={() => setIsModalOpen(true)}>
              <img
                src={certificateUrl}
                alt="Certificate"
                className="w-full h-auto min-h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl">
                  zoom_in
                </span>
              </div>
            </div>
          ) : (
            <div className="h-48 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 italic">
              No Certificate Provided
            </div>
          )}
        </div>
      </div>

      {/* Verification Actions */}
      {isPending && (
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
            Go Back
          </button>
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="px-10 py-2.5 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90 shadow-lg flex items-center gap-2 transition-all active:scale-95">
            {actionLoading ? "Verifying..." : "Approve & Verify Doctor"}
          </button>
        </div>
      )}

      {isModalOpen && (
        <ImagePreviewModal
          url={certificateUrl}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
