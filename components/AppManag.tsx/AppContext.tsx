import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { allUsers, OwnadminProp } from "./definition";

interface State {
  isLoggedIn: boolean;
  adminInfo: OwnadminProp;
  allUsers: allUsers[];
}

const initialState: State = {
  isLoggedIn: false,
  adminInfo: {
    id: undefined,
    name: "",
    family: "",
    username: "",
    email: "",
    address: "",
    token: "",
    phoneNumber: 0,
  },
  allUsers: [],
};

type AppContextInterface = State & {
  login: (prop: OwnadminProp) => void;
  logout: () => void;
  dispatch: React.Dispatch<Action>;
};

const initialValue: AppContextInterface = {
  ...initialState,
  login: () => {},
  logout: () => {},
  dispatch: () => {},
};

export const AppContext: React.Context<AppContextInterface> =
  createContext(initialValue);

export const AppManagerContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //usereducer
  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState
  );

  console.log(state);

  //login
  const login = useCallback((adminProp: OwnadminProp): void => {
    console.log(adminProp);
    const token: string = adminProp.token;
    const email: string = adminProp.email;
    localStorage.setItem("admintoken", token);
    localStorage.setItem("adminemail", email);
    console.log("email", email);

    dispatch({ type: "LOGGED IN", payload: { ...adminProp } });
  }, []);

  //logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.clear();

    dispatch({ type: "LOGGED OUT" });
  }, []);

  console.log(state);

  return (
    <AppContext.Provider value={{ login, logout, dispatch, ...state }}>
      {children}
    </AppContext.Provider>
  );
};

type Action =
  | { type: "LOGGED IN"; payload: OwnadminProp }
  | { type: "LOGGED OUT" }
  | { type: "LIST OF USERS"; payload: allUsers[] };

const reducer = (state: State, action: Action): State => {
  const { type } = action;

  switch (type) {
    case "LOGGED IN":
      return {
        ...state,
        isLoggedIn: true,
        adminInfo: action.payload,
      };
      break;
    case "LOGGED OUT":
      return {
        ...state,
        isLoggedIn: false,
      };
    case "LIST OF USERS":
      return {
        ...state,
        isLoggedIn: true,
        allUsers: action.payload,
      };

    default:
      return {
        ...state,
      };
      break;
  }
};

export const useAppContext = () => {
  return useContext(AppContext);
};
