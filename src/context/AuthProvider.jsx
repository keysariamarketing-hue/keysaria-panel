import PropTypes from "prop-types";
import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [nav, setNav] = useState(false);
  const [header, setHeader] = useState(false);
  const [persist, setPersist] = useState(true);
  const [adminAuth, setAdminAuth] = useState({});

  console.log("Admin Auth Result : ", adminAuth);

  return (
    <AuthContext.Provider
      value={{
        adminAuth,
        setAdminAuth,
        nav,
        setNav,
        header,
        setHeader,
        persist,
        setPersist,
      }}
    >
      <>{children}</>
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
