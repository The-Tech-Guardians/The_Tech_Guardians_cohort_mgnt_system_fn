import { Users, TrendingUp, Star } from "lucide-react"

const CommunityImpact = () => {
  const stats = [
    {
      icon: Users,
      value: "1,245",
      label: "Active Members",
      color: "text-[#2C7A7B]",
      bgColor: "bg-[#2C7A7B]/10",
      gradient: "from-[#2C7A7B] to-[#234E52]"
    },
    {
      icon: TrendingUp,
      value: "2,956",
      label: "Requests Completed",
      color: "text-[#10B981]",
      bgColor: "bg-[#10B981]/10",
      gradient: "from-[#10B981] to-[#059669]"
    },
    {
      icon: Star,
      value: "4.7★",
      label: "Community Rating",
      color: "text-[#F59E0B]",
      bgColor: "bg-[#F59E0B]/10",
      gradient: "from-[#F59E0B] to-[#D97706]"
    }
  ]

  return (
    <div className="w-[85%] mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        Community Impact
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden" >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <div className="relative z-10 flex items-center gap-5">
              <div className={`${stat.bgColor} rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
            <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-300`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommunityImpact