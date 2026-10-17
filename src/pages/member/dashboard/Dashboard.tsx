import useUserData from "hooks/getUserData";
import StoreDashboard from "../../store/dashboard/StoreDashboard";
import SupplierDashboard from "../../supplier/dashboard/SupplierDashboard";

const Dashboard = () => {
  const { entity_type } = useUserData();
  return (
    <>{entity_type === "STORE" ? <StoreDashboard /> : <SupplierDashboard />}</>
  );
};

export default Dashboard;
