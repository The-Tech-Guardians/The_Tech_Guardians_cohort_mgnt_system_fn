import { Search, Heart, Trophy, Plus } from "lucide-react"
import { Link } from "react-router"
import { useState } from "react"
import CreateOfferModal from "../../../shares/ui/RequestModel";



const GettingStarted = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const actions = [
    {
      icon: Plus,
      title: "Post a Request",
      description: "Ask for help you need",
      onClick: () => setIsModalOpen(true),
      isModal: true,
      gradient: "from-[#2C7A7B] to-[#234E52]",
      hoverGradient: "hover:from-[#235E5F] hover:to-[#1A3E41]",
      iconBg: "bg-[#2C7A7B]/10",
      iconColor: "text-[#2C7A7B]"
    },
    {
      icon: Search,
      title: "Discover",
      description: "Browse service requests",
      link: "/discover",
      gradient: "from-[#10B981] to-[#059669]",
      hoverGradient: "hover:from-[#059669] hover:to-[#047857]",
      iconBg: "bg-[#10B981]/10",
      iconColor: "text-[#10B981]"
    },
    {
      icon: Heart,
      title: "Connect",
      description: "Message other members",
      link: "/messages",
      gradient: "from-[#EC4899] to-[#DB2777]",
      hoverGradient: "hover:from-[#DB2777] hover:to-[#BE185D]",
      iconBg: "bg-[#EC4899]/10",
      iconColor: "text-[#EC4899]"
    },
    {
      icon: Trophy,
      title: "Build Rep",
      description: "Climb the leaderboard",
      link: "/leaderboard",
      gradient: "from-[#F59E0B] to-[#D97706]",
      hoverGradient: "hover:from-[#D97706] hover:to-[#B45309]",
      iconBg: "bg-[#F59E0B]/10",
      iconColor: "text-[#F59E0B]"
    }
  ]

  return (
    <>
      <div className="w-[85%] mx-auto py-15">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Getting Started
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            action.isModal ? (
              <button
                key={index}
                onClick={action.onClick}
                className="group relative text-left"
              >
                <div className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-full">
                 
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className={`${action.iconBg} rounded-xl p-3 w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                      {action.description}
                    </p>
                  </div>

                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ) : (
             
              
                <div className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <div className={`${action.iconBg} rounded-xl p-3 w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                      {action.description}
                    </p>
                  </div>

                  
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              
            )
          ))}
        </div>
      

      </div>
<CreateOfferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default GettingStarted