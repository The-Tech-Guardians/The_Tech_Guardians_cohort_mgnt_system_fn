import { Award, Info, Star, TrendingUp, Users } from "lucide-react"
import { Link } from "react-router"

interface LeaderboardEntry {
  rank: number
  name: string
  rating: number
  completed: number
  helped: number
  joinDate: string
}
  const topHelpers: LeaderboardEntry[] = [
    { rank: 1, name: 'Sarah Smith', rating: 4.95, completed: 45, helped: 120, joinDate: '2023-06-15' },
    { rank: 2, name: 'John Doe', rating: 4.87, completed: 38, helped: 95, joinDate: '2023-07-22' },
    { rank: 3, name: 'Emma Wilson', rating: 4.82, completed: 35, helped: 88, joinDate: '2023-08-10' },
    { rank: 4, name: 'Michael Brown', rating: 4.75, completed: 32, helped: 75, joinDate: '2023-09-05' },
    { rank: 5, name: 'Jessica Lee', rating: 4.68, completed: 28, helped: 68, joinDate: '2023-10-12' },
    { rank: 6, name: 'David Johnson', rating: 4.62, completed: 25, helped: 60, joinDate: '2023-11-01' },
    { rank: 7, name: 'Lisa Martinez', rating: 4.58, completed: 22, helped: 52, joinDate: '2024-01-08' },
    { rank: 8, name: 'James Taylor', rating: 4.52, completed: 20, helped: 48, joinDate: '2024-01-15' },
  ]

    const stats = {
    totalMembers: 1245,
    totalRequests: 3847,
    completedRequests: 2956,
    communityRating: 4.71,
  }
const LearderBoard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Community Leaderboard</h1>
          <p className="text-lg opacity-90">Celebrate our top community helpers and their impact</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl px-2 py-4">
            <div className="pb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Total Members
              </h3>
            </div>
            <div className="text-3xl font-bold px-2">{stats.totalMembers.toLocaleString()}</div>
          </div>

          <div className="bg-white rounded-xl px-2 py-4">
            <div className="pb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Award className="w-4 h-4 text-accent" />
                Total Requests
              </h3>
            </div>
            <div className="text-3xl font-bold px-2">{stats.totalRequests.toLocaleString()}</div>
          </div>

          <div className="bg-white rounded-xl px-2 py-4">
            <div className="pb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                Completed
              </h3>
            </div>
            <div className="px-2">
              <div className="text-3xl font-bold">{stats.completedRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((stats.completedRequests / stats.totalRequests) * 100).toFixed(1)}% success rate
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl px-2 py-4">
            <div className="pb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Community Rating
              </h3>
            </div>
            <div className="px-2">
              <div className="text-3xl font-bold flex items-center gap-1">
                {stats.communityRating}
                <span className="text-sm text-muted-foreground">/5.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 p-4 rounded-xl">
          <div className="pb-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Top Community Helpers
            </h3>
          </div>
          <div className="space-y-2">
            {topHelpers.map((helper) => (
              <div
                key={helper.rank}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors border bg-white"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg">
                  {helper.rank === 1 ? '🥇' : helper.rank === 2 ? '🥈' : helper.rank === 3 ? '🥉' : helper.rank}
                </div>

                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${helper.rank}`} className="font-bold hover:underline text-primary">
                    {helper.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(helper.joinDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="font-semibold">{helper.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{helper.completed} completed</p>
                  </div>

                  <div className="hidden sm:block">
                    <div className="font-semibold">{helper.helped}</div>
                    <p className="text-xs text-muted-foreground">people helped</p>
                  </div>

                  <Link to={`/profile/${helper.rank}`} className="text-sm text-primary hover:bg-gray-200 bg-gray-100 px-3 py-1 rounded-md font-medium">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl p-4 bg-gray-50">
          <div className="pb-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Info className="w-5 h-5 text-accent" />
              How to Climb the Leaderboard
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2C7A7B] flex items-center justify-center text-white text-xs">1</span>
                Help Others
              </h4>
              <p className="text-sm text-muted-foreground">
                Respond to service requests and provide valuable help to community members.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F59E0B] flex items-center justify-center text-white text-xs">2</span>
                Get Rated
              </h4>
              <p className="text-sm text-muted-foreground">
                Receive high ratings from people you help to build your reputation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xs">3</span>
                Climb Ranks
              </h4>
              <p className="text-sm text-muted-foreground">
                As your rating and completions grow, you'll climb the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LearderBoard