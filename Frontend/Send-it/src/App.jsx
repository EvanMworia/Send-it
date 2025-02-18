import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./Layout/BaseLayout";
import { Dashboard, PageNotFound, AdminDashboard } from "./screens";
import Signup from "./components/Authentication/Signup";
import Login from "./components/Authentication/Login";
import History from "./components/History/History";
import Notification from "./components/Notification/Notification";
import Profile from "./components/Profile/Profile";
import Location from "./components/Location/Location";
import Delivery from "./components/Delivery/Delivery";
import Process from "./components/AdminPages/Process/Process";
import AdminHistory from "./components/AdminPages/AdminHistory/AdminHistory";
import Status from "./components/AdminPages/StatusUpdate/Status";
import Delete from "./components/AdminPages/Delete/Delete";
import AdminRoute from "./components/AdminRoute/AdminRoute";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/history" element={<History />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/location" element={<Location />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/status/:id" element={<Status />} />
            <Route path="/status/:id" element={<Delete />} />
            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            {/* <Route
              path="/delivery"
              element={
                <AdminRoute>
                  <Delivery />
                </AdminRoute>
              }
            /> */}
            <Route
                path="/processing"
                element={
                  <AdminRoute>
                    <Process />
                  </AdminRoute>
                }
            />
            <Route
                path="/adminhistory"
                element={
                  <AdminRoute>
                    <AdminHistory />
                  </AdminRoute>
                }
            />
            <Route
                path="/status/:id"
                element={
                  <AdminRoute>
                    <Status/>
                  </AdminRoute>
                }
            />
            <Route
                path="/delete/:id"
                element={
                  <AdminRoute>
                    <Delete/>
                  </AdminRoute>
                }
            />
          </Route>
        </Routes>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button>
      </Router>
    </>
  );
}

export default App;