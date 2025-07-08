import { Link } from "react-router-dom";

import UserContext from "../../context/UserContext";
import "./index.css";

const Header = () => (
  <UserContext.Consumer>
    {(value) => {
      const { userData } = value;
      const { name } = userData;

      if (!name) {
        return null;
      }

      const initial = name
        .split(" ")
        .map((each) => each[0])
        .join("");

      return (
        <div className="header-container">
          <div className="header-content-container">
            <div className="header-heading">
              <span className="icon">S</span>WIFT
            </div>
            <div className="profile-container">
              <Link to="/" className="link-item-container">
                <div className="profile-icon">{initial}</div>
                <p className="profile-name">{name}</p>
              </Link>
            </div>
          </div>
        </div>
      );
    }}
  </UserContext.Consumer>
);

export default Header;
