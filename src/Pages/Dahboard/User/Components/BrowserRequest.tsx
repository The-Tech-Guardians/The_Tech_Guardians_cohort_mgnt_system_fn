import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Heart, Eye, Loader2, AlertCircle } from "lucide-react";
import type { Category } from "../../Admin/Services/Categoryservice";
import Categoryservice from "../../Admin/Services/Categoryservice";
import RequestService from "../Services/RequestService";
import Responseservice from "../Services/Responseservice";
import UserService from "../Services/UserService";
import type { RequestType, ResponseType } from "../Services/Types/types";
import { toast } from "../../../../shares/utils/toast";




const BrowserRequest = () => {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  
  const [selectedType, setSelectedType] = useState<"ALL" | "REQUEST" | "OFFER">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "APPROVED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(null);
  const [responses, setResponses] = useState<ResponseType[]>([]);
  const [responseContent, setResponseContent] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [responseLikedBy, setResponseLikedBy] = useState<Record<string, { id: string; name: string }[]>>({});
  const [responseAuthors, setResponseAuthors] = useState<Record<string, string>>({});
  const [likedResponses, setLikedResponses] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
    fetchRequests();
  }, []);

 

  const filterRequests = useCallback(() => {
    let filtered = [...requests];

    if (selectedType !== "ALL") {
      filtered = filtered.filter(req => req.type === selectedType);
    }

    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(req => req.categoryId === selectedCategory);
    }

    if (selectedStatus !== "ALL") {
      filtered = filtered.filter(req => req.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        req.title.toLowerCase().includes(query) ||
        req.description.toLowerCase().includes(query) ||
        req.location.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(filtered);
  }, [requests, selectedType, selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    filterRequests();
  }, [filterRequests]);

  const fetchCategories = async () => {
    try {
      const cats = await Categoryservice.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log('Fetching all requests...');
      const [requestsData, offersData] = await Promise.all([
        RequestService.getAllRequests("REQUEST"),
        RequestService.getAllRequests("OFFER"),
      ]);
      
      console.log('Requests fetched:', requestsData.length, 'requests,', offersData.length, 'offers');
      const allRequests = [...requestsData, ...offersData];
      console.log('Total requests:', allRequests);
      setRequests(allRequests);
      
      const counts: Record<string, number> = {};
      await Promise.all(
        allRequests.map(async (req) => {
          try {
            const responses = await Responseservice.getResponsesByRequest(req.id);
            counts[req.id] = responses.length;
          } catch {
            counts[req.id] = 0;
          }
        })
      );
      setResponseCounts(counts);
    } catch (err: unknown) {
      console.error("Failed to fetch requests:", err);
      setError("Failed to load requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (requestId: string) => {
    try {
      const likes = await RequestService.likeRequest(requestId);
      toast.success(`You liked this request! Total likes: ${likes}`);
      fetchRequests();
    } catch (err: unknown) {
      console.error("Failed to like request:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to like request";
      toast.error(errorMsg);
    }
  };

  const handleViewRequest = async (request: RequestType) => {
    setSelectedRequest(request);
    try {
      const fetchedResponses = await Responseservice.getResponsesByRequest(request.id);
      setResponses(fetchedResponses as ResponseType[]);
      
      const responseLikes: Record<string, { id: string; name: string }[]> = {};
      const authors: Record<string, string> = {};
      const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
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
     
      // Add the new response to the list immediately
      setResponses([...responses, newResponse as ResponseType]);
      setResponseContent("");
      toast.success("Your response has been submitted successfully!");
    } catch (err: unknown) {
      console.error("Failed to submit response:", err);
      alert("Failed to submit response");
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
        isLiked ? newSet.delete(responseId) : newSet.add(responseId);
        return newSet;
      });

      const users = await Responseservice.getResponseLikedBy(responseId);
      setResponseLikedBy(prev => ({ ...prev, [responseId]: users }));

      toast.success(isLiked ? "Like removed" : "Response liked!");
    } catch (err) {
      console.error("Failed to like response:", err);
      toast.error("Failed to update like. Please try again.");
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Browse Requests & Offers</h1>
          <p className="text-gray-500">Discover what people need or what they can offer</p>
        </div>
      </div>

   
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
       
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
            />
          </div>

       
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as "ALL" | "REQUEST" | "OFFER")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
          >
            <option value="ALL">All Types</option>
            <option value="REQUEST">Requests Only</option>
            <option value="OFFER">Offers Only</option>
          </select>

      
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as "ALL" | "APPROVED")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
          >
            <option value="ALL">All Approved</option>
            <option value="APPROVED">Approved Only</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredRequests.length} of {requests.length} requests
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-xl p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#2C7A7B] mr-2" />
          <span className="text-gray-600">Loading requests...</span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">
          No requests found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => handleViewRequest(request)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.type === "OFFER"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {request.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : request.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {request.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{getCategoryName(request.categoryId)}</span>
              </div>

              <h3 className="font-bold text-lg mb-2 line-clamp-2">{request.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{request.description}</p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{request.location}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button 
                    className="flex items-center gap-1 hover:text-[#2C7A7B]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(request.id);
                    }}
                  >
                    <Heart className="w-4 h-4" />
                    {request.likes}
                  </button>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {responseCounts[request.id] || 0}
                  </span>
                </div>
                <button className="text-[#2C7A7B] text-sm font-medium hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
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
                  <span className="text-xs text-gray-500">{getCategoryName(selectedRequest.categoryId)}</span>
                </div>
                <h2 className="text-2xl font-bold">{selectedRequest.title}</h2>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
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
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {responses.length} responses
                </span>
                <span>Posted: {new Date(selectedRequest.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Responses ({responses.length})</h3>
                
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeResponse(response.id);
                          }}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowserRequest;