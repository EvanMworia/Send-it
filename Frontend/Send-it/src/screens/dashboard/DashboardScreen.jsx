import { TaskBoard} from "../../components";
import AreaTop from "../../components/dashboard/AreaTop/AreaTop";

const Dashboard = () => {
  return (
    <div className="content-area">
      <AreaTop/>
      <TaskBoard/>
    </div>
  );
};

export default Dashboard;