import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserMemberships() {
  const navigate = useNavigate()

  const [userMembership, setUserMembership] = useState(null);
  
  useEffect(() => {
    getUser("http://localhost:8080/users/profile");
  }, []);

  const getUser = async (url) => {
    try {
      const response = await axios.get(url, { withCredentials: true });
      setUserMembership(response.data.activeMembership);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      if (error.response.status.toString() === "403") {
        navigate("/login");
      }
    }
  };

  const formatPurchasedDate = userMembership?.purchaseDate.split("T");

  return (
    <>
      <div className="card-body items-center text-center">
        <h2 className="card-title">Your active membership</h2>
      </div>

      {!userMembership ? (
        <p>Loading...</p>
      ) : (
        <div className="card w-96 bg-neutral text-neutral-content mx-auto mb-12">
          <div className="card-body items-center text-center">
            <h2 className="card-title">{userMembership.plan.title}</h2>
            <p>Date purchased: {formatPurchasedDate[0]}</p>
            {/* To Do: determine the expiry date of the membership plan and replace the hardcoded string TBD*/}
            <p>Date expiry: TBD</p>
            <div className="card-actions justify-end">
              <p className="btn btn-primary">Status: {userMembership.status}</p>
              <p className="btn btn-ghost">
                Credits remaining: {10 - userMembership.usedCredits}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
