import { MessageCircle, Heart, Share2, Clock, Tag, Eye, Send } from "lucide-react"
import { Link } from "react-router"
import { useState, useEffect } from "react"
import RequestService from "../../Dahboard/User/Services/RequestService";
import Categoryservice from "../../Dahboard/Admin/Services/Categoryservice";




interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  timeAgo: string;
  category: string;
  title: string;
  description: string;
  status: "Looking For" | "Offering";
  responses: number;
  views: number;
  isLiked: boolean;
  likes: number;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      console.log('Fetching approved requests...');
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('User not authenticated, skipping fetch');
        setActivities([]);
        setLoading(false);
        return;
      }
      
      const [requests, categoriesData] = await Promise.all([
        RequestService.getApprovedRequests('REQUEST'),
        Categoryservice.getCategories()
      ]);

      console.log('Requests:', requests);
      console.log('Categories:', categoriesData);

      const categoryMap = new Map(categoriesData.map(cat => [cat.id, cat]));

      const allRequests = requests
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

      console.log('Approved requests:', allRequests);

      const formattedActivities: ActivityItem[] = allRequests.map(req => ({
        id: req.id,
        user: {
          name: req.username || 'Anonymous',
          avatar: '',
          initials: getInitials(req.username || 'Anonymous')
        },
        timeAgo: getTimeAgo(req.createdAt),
        category: categoryMap.get(req.categoryId)?.name || 'General',
        title: req.title,
        description: req.description,
        status: req.type === 'REQUEST' ? 'Looking For' : 'Offering',
        responses: 0,
        views: req.views,
        likes: req.likes || 0,
        isLiked: currentUser ? (req.likedBy?.includes(currentUser.id) || false) : false
      }));

      console.log('Formatted activities:', formattedActivities);
      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const toggleLike = async (id: string) => {
    if (!currentUser) {
      alert('Please login to like posts');
      return;
    }
    
    const activity = activities.find(a => a.id === id);
    if (!activity) return;

    const wasLiked = activity.isLiked;
    const newLikedState = !wasLiked;
    const newLikesCount = wasLiked ? activity.likes - 1 : activity.likes + 1;

    setActivities(prevActivities => prevActivities.map(a => 
      a.id === id ? { 
        ...a, 
        isLiked: newLikedState,
        likes: newLikesCount
      } : a
    ));

    try {
      if (wasLiked) {
        await RequestService.unlikeRequest(id);
      } else {
        await RequestService.likeRequest(id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setActivities(prevActivities => prevActivities.map(a => 
        a.id === id ? { 
          ...a, 
          isLiked: wasLiked,
          likes: activity.likes
        } : a
      ));
    }
  };

  const handleRespond = (id: string) => {
    if (!currentUser) {
      alert('Please login to respond');
      return;
    }
    setRespondingTo(respondingTo === id ? null : id);
    setResponseText('');
  };

  const submitResponse = async (id: string) => {
    if (!responseText.trim()) return;
    
    console.log('Submitting response to:', id, responseText);
    
    setActivities(prevActivities => prevActivities.map(a => 
      a.id === id ? { ...a, responses: a.responses + 1 } : a
    ));
    
    // TODO: Implement response submission API call
    setRespondingTo(null);
    setResponseText('');
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Tutoring": "bg-blue-100 text-blue-700 border-blue-200",
      "Tech Help": "bg-purple-100 text-purple-700 border-purple-200",
      "Gardening": "bg-green-100 text-green-700 border-green-200",
      "Home Repair": "bg-orange-100 text-orange-700 border-orange-200",
      "Pet Care": "bg-pink-100 text-pink-700 border-pink-200"
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "Looking For": "bg-amber-50 text-amber-700 border-amber-200",
      "Offering": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Completed": "bg-gray-50 text-gray-700 border-gray-200"
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="bg-gray-100">
        <div className=" w-[85%] mx-auto py-15">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Recent Activity
          </h2>
          <p className="text-gray-600 text-sm mt-1">Latest requests and offers from your community</p>
        </div>
        <Link 
          to=""
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
        >
          View All
        </Link>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading activities...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-600">
            {!localStorage.getItem('authToken') 
              ? 'Please login to see recent activities.' 
              : 'No approved activities yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden hover:shadow-lg"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                    {activity.user.initials}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                      {activity.user.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activity.timeAgo}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
              <div className="mb-3">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${getCategoryColor(activity.category)}`}>
                  <Tag className="w-3 h-3" />
                  {activity.category}
                </span>
              </div>
              <Link to={`/request/${activity.id}`} className="block mb-4 group/link">
                <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover/link:text-blue-600 transition-colors">
                  {activity.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {activity.description}
                </p>
              </Link>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleLike(activity.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      activity.isLiked 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-all ${
                        activity.isLiked ? 'fill-red-600' : ''
                      }`} 
                    />
                    <span className="text-sm font-medium">{activity.likes}</span>
                  </button>
                  <button 
                    onClick={() => handleRespond(activity.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Respond</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">{activity.responses}</span>
                    <span className="hidden sm:inline">responses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">{activity.views}</span>
                    <span className="hidden sm:inline">views</span>
                  </div>
                </div>
              </div>
              {respondingTo === activity.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write your response..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setRespondingTo(null)}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => submitResponse(activity.id)}
                      disabled={!responseText.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      Send Response
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      )}
      {!loading && activities.length > 0 && (
      <div className="mt-6 text-center">
        <button className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium">
          Load More Activities
        </button>
      </div>
      )}
    </div>
    </div>
    
  )
}

export default RecentActivity