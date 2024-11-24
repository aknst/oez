import { useAuthContext } from "@/context/auth-context";
import { FullPageLoader } from "@/pages/misc/FullLoaderPage";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const { loading, sessionUser } = useAuthContext();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!sessionUser) {
    const loginRedirectUrl = `/login?callbackUrl=${encodeURIComponent(
      location.pathname
    )}`;
    return <Navigate to={loginRedirectUrl} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
