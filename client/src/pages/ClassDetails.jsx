import {
  FaRegCalendar,
  FaClock,
  FaPersonDress,
  FaLocationDot,
} from "react-icons/fa6";
import { useNavigate, useParams, useRevalidator } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import { handleCancelation } from "../api/cancelationAcitvity";
import { useState, useContext } from "react";
import CapacityBadge from "../components/Activities/CapacityBadge";
import LocationMap from "../components/Activities/LocationMap";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../components/context/AuthProvider";
import clsx from "clsx";
import EditActivity from "../components/AdminProfile/EditActivity";
import userIcon from "../assets/logos/avatar.jpg";

export default function ClassDetails() {
  const { id } = useParams();
  const { user, setUser } = useContext(AuthContext);

  const activity = useLoaderData();

  const [openSlots, setOpenSlots] = useState(
    activity.capacity - activity.registeredUsers.length
  );

  const revalidator = useRevalidator();

  const navigate = useNavigate();

  const handleBooking = () => {
    axios
      .put(
        `http://localhost:8080/activities/${id}`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        setOpenSlots(
          response.data.activity.capacity -
            response.data.activity.registeredUsers.length
        );
        notify();
        setUser((prev) => {
          return {
            ...prev,
            classesRegistered: [
              ...prev.classesRegistered,
              response.data.activity,
            ],
            activeMembership: response.data.user.activeMembership,
          };
        });
        revalidator.revalidate();
        // console.log("Data from api", response);
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status.toString() === "403") {
          navigate("/login");
        }
      });
  };

  const notify = () =>
    toast.success("Booked Successfully", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  //transforming dates and times
  const startTime = new Date(activity.startTime);
  const formattedStartTime = startTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC", //TO DO: backend must save dates with UTC+1
  });
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedStartDate = startTime.toLocaleDateString("de-DE", options);
  const startMilliseconds = startTime.getTime();

  //calculate duration based on start and end date in milliseconds
  const endTime = new Date(activity.endTime);
  const formattedEndTime = endTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC", //TO DO: backend must save dates with UTC+1
  });
  const endMilliseconds = endTime.getTime();
  const duration = (endMilliseconds - startMilliseconds) / (1000 * 60);

  //colors for conditional capacity badge
  const capacityColors = {
    0: "badge-error",
    1: "badge-error",
    2: "badge-error",
    3: "badge-warning",
    4: "badge-warning",
  };

  const registeredUsers = activity?.registeredUsers;

  //TO DO: upload images for all types and create more types

  // check if user is admin
  const isAdmin = user && user.role === "admin";

  return (
    <div className="flex md:flex-row flex-col-reverse justify-center items-start">
      <ToastContainer
        position="top-center"
        autoClose={1500}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <div className="flex md:flex-row flex-col-reverse justify-center   ">
        <div className="Kurs-Informationen card bg-white shadow-xl flex flex-col p-4 m-2 min-w-96">
          {/* To Do: block für Kursinformationen erstellen */}
          <h1 className="text-2xl font-bold mb-4">{activity.title}</h1>
          <div className="carousel carousel-center rounded-box w-96 self-center">
            {activity.type?.images.map((image) => {
              return (
                <div className="carousel-item">
                  <img
                    src={image.url}
                    alt="Pizza"
                    key={image._id}
                    className="object-center	w-96"
                  />
                </div>
              );
            })}
          </div>
          <p className="mt-4">{activity.description}</p>
          <div className="flex gap-2 m-2">
            <FaLocationDot className="text-2xl" />
            <p className="font-bold">Location</p>
          </div>
          <LocationMap
            className="w-4/5 self-center"
            location={activity.location}
          />
        </div>
        <aside className="card w-96 bg-white shadow-2xl flex flex-col p-4 m-2 self-start">
          <h1 className="text-2xl font-bold mb-4 lg:hidden">
            {activity.title}
          </h1>
          <div>
            <div className="flex gap-2 m-2">
              <FaRegCalendar className="text-2xl" />
              <p className="font-bold">Date</p>
            </div>
            <p>{formattedStartDate}</p>
          </div>
          <div>
            <div className="flex gap-2 m-2">
              <FaClock className="text-2xl" />
              <p className="font-bold">Time</p>
            </div>
            <p>
              {formattedStartTime} - {formattedEndTime} ({duration} Min.)
            </p>
          </div>

          <div>
            <div className="flex gap-2 m-2">
              <FaPersonDress className="text-2xl" />
              <p className="font-bold">Capacity</p>
            </div>
            <CapacityBadge openSlots={openSlots} />
          </div>

          <div className="avatar self-center mt-3 sm:flex gap-2">
            <div className="grid grid-rows-2 mt-5">
              <p className="font-bold">Instructor:</p>
              <p>
                {activity.instructor.firstNameactivity.instructor.image.url}
              </p>
            </div>
            <div className="w-24 mask mask-hexagon">
              <img src={activity.instructor.image.url} />
            </div>
          </div>
          <div className="grid grid-cols-2">
            {user?.role !== "admin" && (
              <>
                {!user ||
                !user.classesRegistered.find((activity) => {
                  return activity._id === id;
                }) ? (
                  <button
                    className="btn btn-primary mr-3 self-center mt-2"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                    disabled={openSlots <= 0}
                  >
                    Book Now
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary mr-3 self-center mt-2"
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                    disabled={openSlots <= 0}
                  >
                    Cancel Booking
                  </button>
                )}
              </>
            )}

            <button
              className="btn btn-neutral mr-3 self-center mt-2"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>

          <dialog id="my_modal_1" className="modal">
            <div
              className={clsx(
                "modal-box",
                user?.activeMembership === null && "hidden"
              )}
            >
              <div className="card-body items-center text-center">
                <h3 className="font-bold text-lg">Booking Overview</h3>
              </div>

              <div className="grid grid-cols-2">
                <div>
                  <div className="flex gap-2">
                    <FaRegCalendar className="text-2xl" />
                    <p className="font-bold">Date</p>
                  </div>
                  <p>{formattedStartDate}</p>
                </div>

                <div>
                  <div className="flex gap-2">
                    <FaClock className="text-2xl" />
                    <p className="font-bold">Time</p>
                  </div>
                  <p>
                    {formattedStartTime} - {formattedEndTime} ({duration} Min.)
                  </p>
                </div>

                <div className="mt-5">
                  <div className="flex gap-2">
                    <FaPersonDress className="text-2xl" />
                    <p className="font-bold">Capacity </p>
                  </div>
                  <CapacityBadge openSlots={openSlots} className="m-2" />
                </div>

                <div className="avatar mt-1">
                  <span className="font-bold mt-10">Instructor</span>
                  <p className="mt-10">: {activity.instructor.firstName}</p>
                  <div className="w-24 mask mask-hexagon">
                    <img src={activity.instructor.image.url} />
                  </div>
                </div>
              </div>

              <div className="modal-action">
                <form method="dialog">
                  {!user ||
                  !user.classesRegistered.find((activity) => {
                    return activity._id === id;
                  }) ? (
                    <button
                      className="btn btn-primary mr-3 self-center mt-2"
                      onClick={() => {
                        handleBooking();
                      }}
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary mr-3 self-center mt-2"
                      onClick={() => {
                        handleCancelation(id, setUser, setOpenSlots);
                        // window.location.reload();
                      }}
                    >
                      Cancel Booking
                    </button>
                  )}

                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
            <div
              className={clsx(
                "modal-box",
                user?.activeMembership?.status === "active" && "hidden"
              )}
            >
              <div className="w-full mx-auto">
                <div className="flex flex-col p-5 rounded-lg shadow bg-white">
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-block p-4 bg-yellow-50 rounded-full">
                      <svg
                        className="w-12 h-12 fill-current text-yellow-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
                      </svg>
                    </div>
                    <h2 className="mt-2 font-semibold text-gray-800">
                      Warning! No credits available
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      You dont have an any more credits available with your
                      current membership plan. In order to book a class, please
                      purchase another membership plan.
                    </p>
                  </div>
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded-md">
                        Cancel
                      </button>

                      <button
                        onClick={() => navigate("/membershipPlans")}
                        className="flex-1 px-4 py-2 ml-2 bg-primary hover:bg-success text-white text-sm font-medium rounded-md"
                      >
                        Purchase Membership Plan
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={clsx(
                "modal-box",
                user?.activeMembership !== null && "hidden"
              )}
            >
              <div className="w-full mx-auto">
                <div className="flex flex-col p-5 rounded-lg shadow bg-white">
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-block p-4 bg-yellow-50 rounded-full">
                      <svg
                        className="w-12 h-12 fill-current text-yellow-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
                      </svg>
                    </div>
                    <h2 className="mt-2 font-semibold text-gray-800">
                      No active membership plan
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      You dont have an active membership plan. In order to book
                      a class, please purchase one of the available membership
                      plans
                    </p>
                  </div>
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded-md">
                        Cancel
                      </button>

                      <button
                        onClick={() => navigate("/membershipPlans")}
                        className="flex-1 px-4 py-2 ml-2 bg-primary hover:bg-success text-white text-sm font-medium rounded-md"
                      >
                        Purchase Membership Plan
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </dialog>
          {user?.role !== "admin" && (
            <button
              className="btn btn-primary w-4/5 self-center m-2"
              disabled={openSlots > 0}
            >
              Waitlist
            </button>
          )}
          {user && user.role === "admin" && (
            <div>
              <h3 className="font-bold mt-10">Registered Users</h3>
              {!registeredUsers ? "no users registered" : ""}
              <table className="table p-2 m-2">
                <tbody>
                  {registeredUsers.map((student) => {
                    return (
                      <tr key={student._id}>
                        <th>
                          <div className="w-10 rounded-full">
                            <img
                              alt="Tailwind CSS Navbar component"
                              src={userIcon}
                            />
                          </div>
                        </th>
                        <td>
                          <div>{student.lastName}</div>
                        </td>
                        <td>{student.firstName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </aside>
      </div>
      {user && user.role === "admin" && <EditActivity activity={activity} />}
      <div></div>
    </div>
  );
}
