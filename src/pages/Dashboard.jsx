import { useContext } from "react";
import DashboardOverview from "../components/Dashboard/DashboardOverview/DashboardOverview";
import { ThemeContext } from "../ThemeContext";

const Dashboard = ({ navigate}) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
    return (
      <div className="container-fluid">
        {/* <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button> */}
        <DashboardOverview navigate = {navigate}/>
      </div>
    );
  };
  
  export default Dashboard;