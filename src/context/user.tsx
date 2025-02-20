import { createContext, type ReactNode, useState } from "react";

type UserContextProps = {
  userName: string | null;
  token: string | null;
  onLogout: () => void;
  onLogin: ({ userName, token }: { userName: string; token: string }) => void;
};

export const UserContext = createContext<UserContextProps | null>(null);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const onLogin = ({
    userName,
    token,
  }: {
    userName: string;
    token: string;
  }) => {
    setUserName(userName);
    setToken(token);
  };

  const onLogout = () => {
    setToken(null);
    setUserName(null);
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        token,
        onLogin,
        onLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
