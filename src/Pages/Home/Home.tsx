import WelcomePage from "../../shares/Components.tsx/Welcome"
import CommunityImpact from "./Components/communityImpact"
import GettingStarted from "./Components/GetStarted"
import ReadyToHelp from "./Components/ReadyToHelp"
import RecentActivity from "./Components/RecentActivity"


const Home = () => {
  return (
    <div >
    <WelcomePage/>
    <GettingStarted/>
    <RecentActivity/>
    <CommunityImpact/>
    <ReadyToHelp/>
    </div>
  )
}

export default Home