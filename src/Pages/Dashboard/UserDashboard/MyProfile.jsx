import React, { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";


const MyProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="bg-neutral/80 p-6 rounded-xl shadow-md">
        <p><strong>Name:</strong> {user?.displayName || "N/A"}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Photo:</strong></p>
        {user?.photoURL && <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mt-2"/>}
      </div>
    </div>
  );
};

export default MyProfile;
