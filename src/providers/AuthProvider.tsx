import React, {
  useState,
  useCallback,
  useEffect,
  ReactNode,
  createContext,
} from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";
import User from "@/lib/user";

export interface AuthContextType {
    user: User | null;
    login: (accessToken: string, userData: User) => void;
    logout: () => void;
    accessToken: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (accessToken: string, userData: User) => {
    setAccessToken(accessToken);
    setUser(userData);
  };

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    navigate("/");
  }, [navigate]);

  const generateNewToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await API.post<{ accessToken: string; user: User }>(
        "/auth/refresh-token",
        {},
        { withCredentials: true } // Include cookies in the request
      );
      const { accessToken, user } = response.data;
      login(accessToken, user);

      return accessToken;
    } catch (error) {
      console.error("Failed to generate new token:", error);
      alert("Session expired or failed to authenticate. Please log in again.");
      logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    if (accessToken === null) {
      generateNewToken();
    }

    const requestInterceptor = API.interceptors.request.use(
      (config) => {
        if (accessToken) {
          //   console.log("setting authorization");
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newAccessToken = await generateNewToken();
          if (newAccessToken) {
            originalRequest.headers["Authorization"] =
              `Bearer ${newAccessToken}`;
            return API(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.request.eject(requestInterceptor);
      API.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, generateNewToken, logout, user]);

  //   useEffect(() => {
  //     // Configure STOMP client
  //     if (accessToken) {
  //       console.log("access-token for websockets: -", accessToken);
  //       const client = new Client({
  //         brokerURL: "ws://localhost:5003/ws/notifications", // Update with your WebSocket URL
  //         connectHeaders: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         onConnect: () => {
  //           console.log("Connected to WebSocket");
  //           client.subscribe("/topic/return-to", (message) => {
  //             if (message.body) {
  //               console.log(message.body);
  //               //   setMessages((prevMessages) => [...prevMessages, message.body]);
  //             }
  //           });
  //         },
  //         onStompError: (frame) => {
  //           console.error("Broker reported error: " + frame.headers["message"]);
  //           console.error("Additional details: " + frame.body);
  //         },
  //       });

  //       client.activate();

  //       // Cleanup on component unmount
  //       return () => {
  //         client.deactivate();
  //       };
  //     }
  //   }, [accessToken]);

  //   useEffect(() => {
  //     const ws = new WebSocket("ws://localhost:5003/ws/notifications"); // Replace with your WebSocket server URL

  //     ws.onopen = () => {
  //       console.log("WebSocket connected");
  //     };

  //     ws.onmessage = (event) => {
  //       const message: any = JSON.parse(event.data);
  //       console.log(message);
  //       //   setMessages((prevMessages) => [...prevMessages, message]);
  //     };

  //     ws.onclose = () => {
  //       console.log("WebSocket disconnected");
  //     };

  //     return () => {
  //       ws.close();
  //     };
  //   }, []);

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    accessToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {user && accessToken && children}
    </AuthContext.Provider>
  );
};
