const UserContext = createContext({});

const UserProvider = ({children}) => {
    const [userID, setUserID] = useState("");
    const [authenticatedUser, setAuthenticatedUser] = useState(false);
    const [authenticatedAdmin, setAuthenticatedAdmin] = useState(false);

    const login = (user) => {
      setCurrentUser(user)
    }

    const logout = () => {
      setCurrentUser(null)
    }

    return (
        <UserContext.Provider 
          value={{currentUser, login, logout}}>
            { children }
        </UserContext.Provider>
      )
  }

export { UserContext, UserProvider }
