import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { data, isLoading, isError } = useMe();
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-4">
        <div className="skeleton-glass h-24 w-full" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="skeleton-glass h-36 w-full" />
          <div className="skeleton-glass h-36 w-full" />
        </div>
      </div>
    );
  }
  if (isError || !data) return <Navigate to="/login" replace />;
  return <Outlet />;
}

