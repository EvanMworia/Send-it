import { MdOutlineMenu } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import "./AreaTop.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../../../../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";
import axios from "axios";

const AreaTop = () => {
  const { openSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);

  const handleInputClick = () => {
    setShowDatePicker(true);
  };

  const handleClickOutside = (event) => {
    if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
          const response = await axios.get(`http://localhost:3000/users/${loggedInUser.id}`);
          const user = response.data;
          setProfilePicture(user.ProfilePicture);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <section className="content-area-top">
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <h2 className="area-top-title">Home</h2>
      </div>
      <div className="area-top-r">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="profile-picture"
            onClick={handleProfileClick}
          />
        ) : (
          <FaUserCircle size={40} className="profile-icon" onClick={handleProfileClick} />
        )}
      </div>
    </section>
  );
};

export default AreaTop;