import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  MdOutlineAttachMoney,
  MdOutlineBarChart,
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineLogin,
  MdOutlineMessage,
  MdOutlinePeople,
  MdOutlineSettings,
  MdOutlineShoppingBag,
  MdHistory,
  MdOutlineSystemUpdateAlt,
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [user, setUser] = useState(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);
  }, []);

  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    navigate('/');
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span className="sidebar-brand-text">Send-It</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            {user?.Role === 'User' && (
              <li className="menu-item">
                <NavLink to="/" className="menu-link" activeclassname="active">
                  <span className="menu-link-icon">
                    <MdOutlineGridView size={18} />
                  </span>
                  <span className="menu-link-text">Home</span>
                </NavLink>
              </li>
            )}
            {user?.Role === 'User' && (
              <li className="menu-item">
                <NavLink to="/history" className="menu-link" activeclassname="active">
                  <span className="menu-link-icon">
                    <MdHistory size={20} />
                  </span>
                  <span className="menu-link-text">History</span>
                </NavLink>
              </li>
            )}  
            {user?.Role === 'User' && (
              <li className="menu-item">
                <NavLink to="/profile" className="menu-link" activeclassname="active">
                  <span className="menu-link-icon">
                    <MdOutlinePeople size={20} />
                  </span>
                  <span className="menu-link-text">Profile</span>
                </NavLink>
            </li>
            )}
            {user?.Role === 'User' && (
              <li className="menu-item">
                <NavLink to="/notification" className="menu-link" activeclassname="active">
                  <span className="menu-link-icon">
                    <MdOutlineMessage size={20} />
                  </span>
                  <span className="menu-link-text">Notification</span>
                </NavLink>
            </li>
            )}
            {user?.Role === 'Admin' && (
              <li className="menu-item">
                <NavLink to="/dashboard" className="menu-link" activeclassname="active">
                  <span className="menu-link-icon">
                    <MdOutlineGridView size={18} />
                  </span>
                  <span className="menu-link-text">Dashboard</span>
                </NavLink>
              </li>
            )}
           {(user?.Role === 'User' || user?.Role === 'Admin') && (
           <li className="menu-item">
              <NavLink to="/delivery" className="menu-link" activeClassName="active">
               <span className="menu-link-icon">
                <MdOutlineShoppingBag size={18} />
              </span>
                <span className="menu-link-text">Delivery Form</span>
               </NavLink>
            </li>
            )}

            {user?.Role === 'Admin' && (
              <li className="menu-item">
                <NavLink to="/processing" className="menu-link" activeclassname="active">
                  <span className="menu-link-icon">
                    <MdOutlineSettings size={18} />
                  </span>
                  <span className="menu-link-text">Parcel Processsing</span>
                </NavLink>
              </li>
            )}
            {user?.Role === 'Admin' && (
              <li className="menu-item">
                <NavLink to="/adminhistory" className="menu-link" activeclassname="active">
                  <span className="menu-link-icon">
                    <MdHistory size={18} />
                  </span>
                  <span className="menu-link-text">Parcel History</span>
                </NavLink>
              </li>
            )}
            
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              {isLoggedIn ? (
                <NavLink to="/login" onClick={handleLogout} className="menu-link" activeclassname="active">
                  <span className="menu-link-icon">
                    <MdOutlineLogout size={20} />
                  </span>
                  <span className="menu-link-text">Logout</span>
                </NavLink>
              ) : (
                <NavLink to="/login" onClick={handleLogin} className="menu-link" activeclassname="active">
                  <span className="menu-link-icon">
                    <MdOutlineLogin size={20} />
                  </span>
                  <span className="menu-link-text">Login</span>
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;