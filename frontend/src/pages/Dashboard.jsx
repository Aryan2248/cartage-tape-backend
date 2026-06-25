import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        Welcome {user?.name}
      </h1>

      <p>{user?.email}</p>

      <p>{user?.role}</p>
    </div>
  );
};

export default Dashboard;