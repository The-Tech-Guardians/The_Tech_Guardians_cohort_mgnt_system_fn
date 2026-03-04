import { useState, useEffect } from "react";
import { FiTrendingUp, FiMessageCircle, FiCheckCircle, FiStar, FiPlus, FiX } from "react-icons/fi";
import { Loader2, AlertCircle, ChevronRight, Heart, Eye, MapPin } from "lucide-react";
import RequestService from "../Services/RequestService";
import Responseservice from "../Services/Responseservice";
import UserService from "../Services/UserService";
import CreateOfferModal from "../../../../shares/ui/RequestModel";
import type { RequestType, ResponseType } from "../Services/Types/types";
import { toast } from "../../../../shares/utils/toast";

const UserDashboardHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myRequests, setMyRequests] = useState<RequestType[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [totalResponses, setTotalResponses] = useState(0);
  const [error, setError] = useState("");
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});

  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(null);
  const [responses, setResponses] = useState<ResponseType[]>([]);
  const [responseContent, setResponseContent] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState<{ id: string; name: string }[]>([]);
  const [responseLikedBy, setResponseLikedBy] = useState<Record<string, { id: string; name: string }[]>>({});
  const [responseAuthors, setResponseAuthors] = useState<Record<string, string>>({});
  const [likedResponses, setLikedResponses] = useState<Set<string>>(new Set());

  const currentUser = (() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return { id: "", name: "User", createdAt: new Date().toISOString() };
      }
    }
    return { id: "", name: "User", createdAt: new Date().toISOString() };
  })();

  useEffect(() => {
    fetchMyRequests();
    fetchMyResponses();
  }, []);

  const fetchMyRequests = async () => {
    setIsLoadingRequests(true);
    setError("");
    try {
      const response = await RequestService.getMyRequests();
      setMyRequests(response.requests || []);
      
      const counts: Record<string, number> = {};
      await Promise.all(
        (response.requests || []).map(async (req) => {
          try {
            const responses = await Responseservice.getResponsesByRequest(req.id);
            counts[req.id] = responses.length;
          } catch {
            counts[req.id] = 0;
          }
        })
      );
      setResponseCounts(counts);
    } catch {
      setError("Failed to load your requests. Please try again.");
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const fetchMyResponses = async () => {
    try {
      const responses = await Responseservice.getMyResponses();
      setTotalResponses(responses.length);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleViewRequest = async (request: RequestType) => {
    setSelectedRequest(request);
    setIsLoadingResponses(true);
    try {
      const [fetchedResponses, likedBy] = await Promise.all([
        Responseservice.getResponsesByRequest(request.id),
        RequestService.getRequestLikedBy(request.id),
      ]);
      setResponses(fetchedResponses as ResponseType[]);
      setLikedByUsers(likedBy);
      
      const responseLikes: Record<string, { id: string; name: string }[]> = {};
      const authors: Record<string, string> = {};
      
      const liked = new Set<string>();
      for (const resp of fetchedResponses) {
        const [users, author] = await Promise.all([
          Responseservice.getResponseLikedBy(resp.id),
          UserService.getUserById(resp.userId)
        ]);
        responseLikes[resp.id] = users;
        authors[resp.id] = author?.name || 'Unknown User';
        if (resp.likedBy.includes(currentUser.id)) {
          liked.add(resp.id);
        }
      }
      
      setResponseLikedBy(responseLikes);
      setResponseAuthors(authors);
      setLikedResponses(liked);
    } catch (err) {
      console.error("Failed to fetch responses:", err);
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !responseContent.trim()) return;

    setIsSubmittingResponse(true);
    try {
      const newResponse = await Responseservice.createResponse({
        requestId: selectedRequest.id,
        content: responseContent.trim(),
      });
     
      setResponses([...responses, newResponse as ResponseType]);
      setResponseContent("");
      toast.success("Your response has been submitted successfully!");
    } catch (err: unknown) {
      console.error("Failed to submit response:", err);
      toast.error("Failed to submit response. Please try again.");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const handleLikeResponse = async (responseId: string) => {
    try {
      const isLiked = likedResponses.has(responseId);
      const newLikes = isLiked
        ? await Responseservice.unlikeResponse(responseId)
        : await Responseservice.likeResponse(responseId);

      setResponses(prev =>
        prev.map(r => r.id === responseId ? { ...r, likes: newLikes } : r)
      );

      setLikedResponses(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(responseId);
        } else {
          newSet.add(responseId);
        }
        return newSet;
      });

      const users = await Responseservice.getResponseLikedBy(responseId);
      setResponseLikedBy(prev => ({ ...prev, [responseId]: users }));

      toast.success(isLiked ? "Like removed" : "Response liked!");
    } catch (err: unknown) {
      console.error("Failed to update like:", err);
      toast.error("Failed to update like. Please try again.");
    }
  };

  const activeRequestsCount = myRequests.filter((r) => r.status === "APPROVED").length;
  const pendingRequestsCount = myRequests.filter((r) => r.status === "PENDING").length;
  const completedRequestsCount = myRequests.filter((r) => r.status === "REJECTED").length;
  const totalLikes = myRequests.reduce((sum, req) => sum + req.likes, 0);
  const averageRating = myRequests.length > 0 ? (totalLikes / myRequests.length).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">User Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your requests and community interactions.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2C7A7B] text-white px-6 py-3 rounded-xl hover:bg-[#235E5F] shadow-sm transition-all flex items-center gap-2 font-semibold"
        >
          <FiPlus size={20} />
          New Request
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6  shadow-sm border border-gray-100 flex justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2C7A7B] to-[#235E5F] flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {currentUser?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{currentUser?.name || "User"}</h3>
            <div className="sm:flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FiStar className="text-[#F59E0B]" size={16} />
                <b className="text-gray-900">{averageRating}</b> Rating
              </span>
              <span className="hidden sm:block">|</span>
              <span>
                Joined{" "}
                {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition">
          Edit Profile
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 font-medium">Active Requests</p>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="text-gray-600" size={24} />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900">{activeRequestsCount}</p>
          <p className="text-sm text-gray-500 mt-2">{pendingRequestsCount} pending</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 font-medium">Total Responses</p>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FiMessageCircle className="text-gray-600" size={24} />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900">{totalResponses}</p>
          <p className="text-sm text-gray-500 mt-2">Contributions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 font-medium">Completed</p>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="text-gray-600" size={24} />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900">{completedRequestsCount}</p>
          <p className="text-sm text-gray-500 mt-2">Fulfilled</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 font-medium">Avg. Rating</p>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FiStar className="text-gray-600" size={24} />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
          <p className="text-sm text-gray-500 mt-2">Community Score</p>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Your Recent Requests</h2>
          <button className="text-[#2C7A7B] text-sm font-semibold hover:underline">View All</button>
        </div>

        {isLoadingRequests ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#2C7A7B] mb-2" />
            <p className="text-gray-400">Loading your requests...</p>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No requests found. Start by creating one!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {myRequests.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => handleViewRequest(request)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap gap-2 items-center">
                      <h3 className="font-bold text-gray-900 group-hover:text-[#2C7A7B] transition-colors">
                        {request.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          request.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{request.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                      <span>📍 {request.location}</span>
                      <span>❤️ {request.likes} Likes</span>
                      <span>👁️ {responseCounts[request.id] || 0} Responses</span>
                      <span>📅 {new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateOfferModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchMyRequests();
            setIsModalOpen(false);
          }}
        />
      )}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedRequest.type === "OFFER"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {selectedRequest.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedRequest.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : selectedRequest.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{selectedRequest.title}</h2>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{selectedRequest.description}</p>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{selectedRequest.location}</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {selectedRequest.likes} likes
                  {likedByUsers.length > 0 && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({likedByUsers.map(u => u.name).join(", ")})
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {responses.length} responses
                </span>
                <span>Posted: {new Date(selectedRequest.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Responses ({responses.length})</h3>
                
                {isLoadingResponses ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#2C7A7B]" />
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleSubmitResponse} className="mb-6">
                      <textarea
                        value={responseContent}
                        onChange={(e) => setResponseContent(e.target.value)}
                        placeholder="Write your response..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent resize-none"
                        rows={3}
                        disabled={isSubmittingResponse}
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingResponse || !responseContent.trim()}
                        className="mt-2 px-4 py-2 bg-[#2C7A7B] text-white rounded-lg hover:bg-[#235E5F] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmittingResponse ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Response"
                        )}
                      </button>
                    </form>

                    <div className="space-y-4">
                      {responses.map((response) => (
                        <div key={response.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#2C7A7B] flex items-center justify-center text-white text-sm font-bold">
                              {responseAuthors[response.id]?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-gray-900">{responseAuthors[response.id] || 'Unknown User'}</span>
                                <span className="text-xs text-gray-400">{new Date(response.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="text-gray-700">{response.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 ml-11">
                            <button
                              onClick={() => handleLikeResponse(response.id)}
                              className="flex items-center gap-1 hover:text-red-500 transition-colors"
                            >
                              <Heart
                                className={`w-3 h-3 ${likedResponses.has(response.id) ? 'fill-red-500 text-red-500' : ''}`}
                              />
                              {response.likes}
                            </button>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {response.likes} {response.likes === 1 ? 'view' : 'views'}
                              {responseLikedBy[response.id]?.length > 0 && (
                                <span className="ml-1">
                                  ({responseLikedBy[response.id].map(u => u.name).join(", ")})
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                      {responses.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No responses yet. Be the first to respond!</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardHome;
