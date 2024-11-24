import { loginLoginAccessToken, usersReadUserMe } from "@/client/services.gen";
import { LoginLoginAccessTokenData, UserPublic } from "@/client/types.gen";
import { useAuthStore } from "@/states/auth-state";
import React from "react";

export interface IAuthContext {
  loading: boolean;
  sessionToken?: string | null;
  sessionUser?: UserPublic | null;
  login: (credentials: LoginLoginAccessTokenData) => Promise<UserPublic | null>;
  logout: () => void;
  refreshSessionUser: () => Promise<UserPublic | null>;
}

export const AuthContext = React.createContext({} as IAuthContext);

export function useAuthContext() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return ctx;
}

export type AuthProviderProps = React.PropsWithChildren;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  const [sessionToken, setSessionToken] = React.useState<string | null>(() =>
    localStorage.getItem("sessionToken")
  );
  const [sessionUser, setSessionUser] = React.useState<UserPublic | null>(() =>
    JSON.parse(localStorage.getItem("sessionUser") || "null")
  );

  React.useEffect(() => {
    if (sessionToken) {
      const userFromLocalStorage = localStorage.getItem("sessionUser");
      if (userFromLocalStorage) {
        setSessionUser(JSON.parse(userFromLocalStorage));
      } else {
        refreshSessionUser();
      }
    } else {
      logout();
    }
  }, [sessionToken]);

  const refreshSessionUser = async (): Promise<UserPublic | null> => {
    setLoading(true);
    try {
      const response = await usersReadUserMe({
        headers: {
          "Authorization": `Bearer ${sessionToken}`,
        },
      });
      if (response.data) {
        setSessionUser(response.data);
        localStorage.setItem("sessionUser", JSON.stringify(response.data));
        return response.data;
      } else {
        setSessionUser(null);
        localStorage.removeItem("sessionUser");
        return null;
      }
    } catch (error) {
      setSessionUser(null);
      localStorage.removeItem("sessionUser");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    data: LoginLoginAccessTokenData
  ): Promise<UserPublic | null> => {
    try {
      const response = await loginLoginAccessToken({
        body: data.body,
      });
      if (response.data) {
        const { access_token } = response.data;
        setSessionToken(access_token);
        localStorage.setItem("sessionToken", access_token);
        useAuthStore.getState().setToken(access_token);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem("sessionToken");
    useAuthStore.getState().setToken("");
    localStorage.removeItem("sessionUser");
    setSessionToken(null);
    setSessionUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        sessionToken,
        sessionUser,
        login,
        logout,
        refreshSessionUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
