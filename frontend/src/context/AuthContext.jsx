import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token"));

 const login = (userData, jwt) => {
   setUser(userData);
   setToken(jwt);

   localStorage.setItem("token", jwt);
   localStorage.setItem("user", JSON.stringify(userData));
 };


   const logout = () => {
     setUser(null);
     setToken(null);
     
     localStorage.removeItem("token");
     localStorage.removeItem("user");
   };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
