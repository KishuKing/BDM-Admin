import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVendorDetails, approveVendor } from "../services/api";
import ImagePreviewModal from "../components/ImagePreviewModal";

const VendorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getVendorDetails(id);
        setVendor(data);
      } catch (error) {
        console.error("Failed to fetch vendor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );

  if (!vendor)
    return (
      <div className="text-center p-12 text-slate-500">
        Vendor record not found.
      </div>
    );

  const handleApprove = async () => {
    if (!window.confirm("Approve this vendor for the platform?")) return;
    setActionLoading(true);
    try {
      await approveVendor(id);
      navigate("/vendors");
    } catch (error) {
      alert("Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="size-32 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-primary">
              store
            </span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {vendor.shopName}
            </h1>
            <p className="text-primary font-medium text-lg">
              Contact: {vendor.name}
            </p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  mail
                </span>{" "}
                {vendor.email}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  location_on
                </span>{" "}
                {vendor.location?.address}, {vendor.location?.city}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pharmacy Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
              <span className="material-symbols-outlined text-primary">
                badge
              </span>{" "}
              Professional Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Drug License Number
                </label>
                <p className="text-slate-700 dark:text-slate-300 font-mono text-lg">
                  {vendor.drugLicenseNumber}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Pharmacist Name
                </label>
                <p className="text-slate-700 dark:text-slate-300">
                  {vendor.pharmacistDetails?.name}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Pharmacist Reg No.
                </label>
                <p className="text-slate-700 dark:text-slate-300">
                  {vendor.pharmacistDetails?.registrationNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* License Image Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
            Uploaded License
          </h3>
          {vendor.certificateImage ? (
            <div
              className="group relative rounded-xl overflow-hidden cursor-pointer border-2 border-slate-100 dark:border-slate-800"
              onClick={() => setIsModalOpen(true)}>
              <img
                src={vendor.certificateImage}
                className="w-full h-auto object-cover"
                alt="License"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl">
                  zoom_in
                </span>
              </div>
            </div>
          ) : (
            <div className="h-40 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 italic">
              No Image Provided
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!vendor.verified && (
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
            Back
          </button>
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="px-10 py-2.5 bg-primary text-white rounded-lg font-bold shadow-lg active:scale-95 transition-all">
            {actionLoading ? "Processing..." : "Verify & Approve Store"}
          </button>
        </div>
      )}

      {isModalOpen && (
        <ImagePreviewModal
          url={vendor.certificateImage}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default VendorProfile;
