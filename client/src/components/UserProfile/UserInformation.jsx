import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UserInformation() {
  const navigate = useNavigate()
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser("http://localhost:8080/users/profile");
  }, []);

  const getUser = async (url) => {
    try {
      const response = await axios.get(url, { withCredentials: true });
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      if (error.response.status.toString() === "403") {
        navigate("/login");
      }
    }
  };

  const formatRegisterDate = user?.dateOfRegistration.split("T");
  const formatDateOfBirth = user?.dateOfBirth.split("T");

  return (
    <>
      {!user ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white max-w-3xl shadow overflow-hidden sm:rounded-lg mt-7 mx-auto">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details and informations about your account
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  First name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.firstName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.lastName}
                </dd>
              </div>
              <div className="bg-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Date of birth
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDateOfBirth[0]}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">E-mail</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
              <div className="bg-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Member since
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatRegisterDate[0]}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.address}
                </dd>
              </div>
              <div className="bg-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Phone number
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.phone}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
      <div className="text-center">
        <Link
          to={"/userProfile/details/update"}
          className="btn btn-primary mt-5 mb-3 mx-auto"
        >
          Update Profile
        </Link>
      </div>
    </>
  );
}
