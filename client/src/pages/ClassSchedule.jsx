import { useLoaderData, useSearchParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import ActivityCard from "../components/Activities/ActivityCard";
import { AuthContext } from "../components/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import axiosClient from "../api/axiosClient.jsx";

export default function ClassSchedule() {
  const response = useLoaderData();
  const activities = response.activities;
  const { user } = useContext(AuthContext);
  const activitytypes = response.activitytypes;
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);

  //Instructor getting for filter
  useEffect(() => {
    axiosClient
      .get("/instructors")
      .then((response) => {
        console.log(response.data);
        setInstructors(response.data);
      })
      .catch((error) => {
        console.log(error);
        setUser(null);
      });
  }, []);

  //array of weekdays for the grid columns
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  //functionality to make sure to filter based on week or trainer
  const [searchParams, setSearchParams] = useSearchParams();
  const [trainer, setTrainer] = useState("");
  const [skip, setSkip] = useState(0);
  const [worktouttype, setWorkouttype] = useState("");

  //function to take care of trainer filter
  const handleTrainer = (e) => {
    console.log(e.target.value);
    setTrainer(e.target.value);
    setSearchParams(`instructor=${e.target.value}`);
  };

  // //function to take care of activitytyp /workouttype filter
  // const handleType = (e) => {
  //   setWorkouttype(e.target.value);
  //   setTrainer("");
  //   setSearchParams(`type=${e.target.value}`);
  // };

  //pagination based on week logic
  const handleNext = () => {
    setSkip((prev) => {
      const newSkip = prev + 7;
      setSearchParams(`skip=${prev + 7}`);
      return newSkip;
    });
  };
  const handlePrev = () => {
    setSkip((prev) => {
      const newSkip = prev - 7;
      setSearchParams(`skip=${prev - 7}`);
      return newSkip;
    });
  };

  return (
    <div className="flex gap-3 flex-col items-center p-5">
      <h1 className="text-3xl mb-6">Find your next class here</h1>
      <div className="flex flex-col md:flex-row w-full gap-2 md:justify-center items-center">
        <div className="join">
          <button className="join-item btn" onClick={handlePrev}>
            «
          </button>
          <button className="join-item btn">
            {response.weekstart} - {response.weekend}
          </button>
          <button className="join-item btn" onClick={handleNext}>
            »
          </button>
        </div>

        <select
          className="select select-secondary w-full max-w-xs"
          onChange={handleTrainer}
          value={trainer}
        >
          <option value="All">Pick trainer</option>

          {instructors.map((instructor) => {
            return (
              <option key={instructor.firstName} value={instructor._id}>
                {instructor.firstName}
              </option>
            );
          })}
        </select>
        {/* <select
          className="select select-secondary w-full max-w-xs"
          onChange={handleType}
          value={worktouttype}
        >
          <option selected disabled>
            Pick Class
          </option>
          <option>All</option>
          {activitytypes.map((type) => {
            if (!type) {
              return;
            }
            return <option>{type}</option>;
          })}
        </select> */}
        {user?.role === "admin" && (
          <button
            className="text-4xl text-secondary"
            onClick={() => navigate("/createActivity")}
          >
            <FaCirclePlus />
          </button>
        )}
      </div>
      <div className="grid lg:grid-cols-7 grid-cols-1 gap-4 md:w-full">
        {weekdays.map((day) => {
          return (
            <div className="flex flex-col gap-2 items-center" key={day}>
              <h3>{day}</h3>
              {activities[day.toLowerCase()]?.map((activity) => {
                return (
                  <ActivityCard
                    activity={activity}
                    key={activity._id}
                    role={user?.role}
                    isBooked={activity.registeredUsers.includes(user?._id)}
                    // TO DO: check the classesRegistered Array for the activity._id
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
