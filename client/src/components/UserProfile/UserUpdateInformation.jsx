import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import userIcon from "../../assets/logos/avatar.jpg";

export default function UserUpdateInformation() {
  const navigate = useNavigate();

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Data from form", data);
    axios
      .put("http://localhost:8080/users/profile", data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Data from api", response.data);
        navigate("/userProfile/details");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formattedDate = user?.dateOfBirth.split("T")[0];

  return (
    <>
      {!user ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray-100 w-96 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex justify-center mb-6">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS Navbar component" src={userIcon} />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-center mb-4">
                Update user profile
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Enter details to update your user profile
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-x-5">
                  <div className="mb-4">
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      First name:
                    </label>
                    <input
                      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      defaultValue={user.firstName}
                      placeholder="First Name"
                    />
                    {errors.firstName?.type === "required" && (
                      <span className="label self-start mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="lastName"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      Last name:
                    </label>
                    <input
                      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      defaultValue={user.lastName}
                      placeholder="Last Name"
                    />
                    {errors.lastName?.type === "required" && (
                      <span className="label self-start mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      Phone number:
                    </label>
                    <input
                      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                      defaultValue={user.phone}
                      placeholder="Phone number"
                    />
                    {errors.phone?.type === "required" && (
                      <span className="label self-start mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="address"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      Address:
                    </label>
                    <input
                      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
                      {...register("address", {
                        required: "Address is required",
                      })}
                      defaultValue={user.address}
                      placeholder="Address"
                    />
                    {errors.address?.type === "required" && (
                      <span className="label self-start mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                        {errors.address.message}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="fullName"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      Date of birth
                    </label>
                    <input
                      type="date"
                      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
                      {...register("dateOfBirth", {
                        required: "First name is required",
                      })}
                      defaultValue={formattedDate}
                      placeholder="Date of birth"
                    />
                    {errors.dateOfBirth?.type === "required" && (
                      <span className="label self-start mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                        {errors.dateOfBirth.message}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-2"
                >
                  Update
                </button>
                <button
                  onClick={() => navigate("/userProfile/details")}
                  className="w-full bg-neutral text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Go back
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
