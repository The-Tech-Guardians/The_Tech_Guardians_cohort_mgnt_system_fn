


import { X, Search, Sparkles, Loader2, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import RequestService from "../../Pages/Dahboard/User/Services/RequestService";
import Categoryservice, { type Category } from "../../Pages/Dahboard/Admin/Services/Categoryservice";

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateOfferModal = ({ isOpen, onClose, onSuccess }: CreateOfferModalProps) => {
  const [offerType, setOfferType] = useState<"REQUEST" | "OFFER">("OFFER");
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setCategoryError("");
    try {
      const fetchedCategories = await Categoryservice.getCategories();
      setCategories(fetchedCategories);
      
      if (fetchedCategories.length === 0) {
        setCategoryError("No categories available. Please contact the administrator.");
      }
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      setCategoryError(err.message || "Failed to load categories. Please try again.");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim() || !description.trim() || !categoryId || !location.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await RequestService.createRequest({
        title: title.trim(),
        description: description.trim(),
        type: offerType,
        location: location.trim(),
        categoryId: categoryId,
      });

      setSuccess(`${offerType === "REQUEST" ? "Request" : "Offer"} created successfully! Waiting for admin approval.`);
      
      // Reset form
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setCategoryId("");
        setLocation("");
        setOfferType("OFFER");
        
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error("Failed to create request:", err);
      setError(err.message || "Failed to create request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-1000 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New {offerType === "REQUEST" ? "Request" : "Offer"}</h2>
            <p className="text-sm text-gray-600 mt-1">Share what you need or what you can offer</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              What would you like to do?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setOfferType("REQUEST")}
                disabled={isSubmitting}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                  offerType === "REQUEST"
                    ? "border-[#2C7A7B] bg-[#2C7A7B]/5 shadow-md"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                } disabled:opacity-50`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-3 rounded-full ${
                    offerType === "REQUEST" 
                      ? "bg-[#2C7A7B]/10" 
                      : "bg-gray-200"
                  }`}>
                    <Search className={`w-6 h-6 ${
                      offerType === "REQUEST" 
                        ? "text-[#2C7A7B]" 
                        : "text-gray-600"
                    }`} />
                  </div>
                  <span className={`font-semibold ${
                    offerType === "REQUEST" 
                      ? "text-[#2C7A7B]" 
                      : "text-gray-700"
                  }`}>
                    I Need Help
                  </span>
                </div>
                {offerType === "REQUEST" && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-[#2C7A7B] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOfferType("OFFER")}
                disabled={isSubmitting}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                  offerType === "OFFER"
                    ? "border-[#F59E0B] bg-[#F59E0B]/5 shadow-md"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                } disabled:opacity-50`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-3 rounded-full ${
                    offerType === "OFFER" 
                      ? "bg-[#F59E0B]/10" 
                      : "bg-gray-200"
                  }`}>
                    <Sparkles className={`w-6 h-6 ${
                      offerType === "OFFER" 
                        ? "text-[#F59E0B]" 
                        : "text-gray-600"
                    }`} />
                  </div>
                  <span className={`font-semibold ${
                    offerType === "OFFER" 
                      ? "text-[#F59E0B]" 
                      : "text-gray-700"
                  }`}>
                    I Can Help
                  </span>
                </div>
                {offerType === "OFFER" && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-[#F59E0B] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-900">
              Category <span className="text-red-500">*</span>
            </label>
            
            {isLoadingCategories ? (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <Loader2 className="w-4 h-4 animate-spin text-[#2C7A7B]" />
                <span className="text-sm text-gray-700">Loading categories... This may take 30 seconds if the server is waking up.</span>
              </div>
            ) : categoryError ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700">{categoryError}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fetchCategories}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-[#2C7A7B] text-white rounded-lg hover:bg-[#235E5F] transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Loading Categories
                </button>
              </div>
            ) : (
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white disabled:opacity-50"
                required
                disabled={isSubmitting}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Title */}
          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={offerType === "REQUEST" ? "What do you need help with?" : "What can you help with?"}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Location */}
          <div className="space-y-3">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-900">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Downtown, Kigali"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about your request or offer..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent outline-none transition-all resize-none bg-gray-50 hover:bg-white disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Be clear and detailed to get better responses
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingCategories || !!categoryError}
              className="flex-1 px-6 py-3 bg-[#2C7A7B] text-white rounded-xl hover:bg-[#235E5F] transition-colors font-semibold shadow-lg shadow-[#2C7A7B]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                `Post ${offerType === "REQUEST" ? "Request" : "Offer"}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOfferModal;