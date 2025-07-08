import { useNavigate } from "react-router-dom";

import { FaArrowLeftLong } from "react-icons/fa6";

import { TailSpin } from "react-loader-spinner";

import Header from "../Header";

import UserContext from "../../context/UserContext";

import "./index.css";

const Profile = () => {
  const navigate = useNavigate();

  const onClickBackButton = () => {
    navigate("/comments");
  };

  return (
    <UserContext.Consumer>
      {(value) => {
        const { userData } = value;
        const { id, name, email, address, phone } = userData;

        if (!name) {
          return (
            <div className="loader-container">
              <TailSpin color="#0b69ff" height="50" width="50" />
            </div>
          );
        }

        const initial = name
          .split(" ")
          .map((each) => each[0])
          .join("");

        const { city, street, suite } = address;
        const Address = [city, street, suite];
        const fullAddress = Address.join(" ");

        return (
          <>
            <Header />
            <div className="user-profile-container">
              <div className="button-container">
                <button
                  type="button"
                  className="profile-back-button"
                  onClick={onClickBackButton}
                >
                  <FaArrowLeftLong className="arrow-icon" />
                </button>
                <span className="welcome-message">Welcome, {name}</span>
              </div>
              <div className="profile-form-container">
                <div className="details-logo-container">
                  <div className="box">{initial}</div>
                  <div className="name-email-container">
                    <h2 className="name">{name}</h2>
                    <p className="email">{email}</p>
                  </div>
                </div>
                <div className="profile-details-container">
                  <div className="input-field-container">
                    <label htmlFor="userId" className="label">
                      User ID
                    </label>
                    <input
                      id="userId"
                      type="text"
                      className="input-field"
                      value={id}
                    />
                  </div>
                  <div className="input-field-container">
                    <label htmlFor="name" className="label">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="input-field"
                      value={name}
                    />
                  </div>
                  <div className="input-field-container">
                    <label htmlFor="email" className="label">
                      Email ID
                    </label>
                    <input
                      id="email"
                      type="text"
                      className="input-field"
                      value={email}
                    />
                  </div>
                  <div className="input-field-container">
                    <label htmlFor="Address" className="label">
                      Address
                    </label>
                    <input
                      id="Address"
                      type="text"
                      className="input-field"
                      value={fullAddress}
                    />
                  </div>
                  <div className="input-field-container">
                    <label htmlFor="phone" className="label">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="text"
                      className="input-field"
                      value={phone}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }}
    </UserContext.Consumer>
  );
};

export default Profile;
