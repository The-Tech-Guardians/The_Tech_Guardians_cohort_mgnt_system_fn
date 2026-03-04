import { ArrowRight, Users, Heart, Sparkles } from "lucide-react"
import { Link } from "react-router"

const ReadyToHelp = () => {
  return (
    <div className="bg-gradient-to-br from-[#2C7A7B] via-[#1E5A5C] to-[#234E52]">
         <div className="w-[85%] mx-auto py-12">
      <div className="relative  rounded-3xl ">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#F59E0B]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
          <div className="absolute top-8 right-8 hidden lg:flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
              <Users className="w-5 h-5 text-white/80" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
              <Heart className="w-5 h-5 text-white/80" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
              <Sparkles className="w-5 h-5 text-white/80" />
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm font-semibold text-white">Join Our Growing Community</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to Help Your Community?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
              Join thousands of community members who are connecting, helping, and making a difference together.
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Link
                to="/auth"
                className="group bg-white text-[#2C7A7B] px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Sign Up Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to=""
                className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">1,245+</div>
                  <div className="text-sm text-white/70">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">2,956+</div>
                  <div className="text-sm text-white/70">Requests Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">4.7★</div>
                  <div className="text-sm text-white/70">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
    </div>
    </div>
   
  )
}

export default ReadyToHelp