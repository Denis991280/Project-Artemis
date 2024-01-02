import { useForm } from "react-hook-form";
import axios from "axios";

export default function Registration() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("hookdata", data);
    // const formData = new FormData(); // QUESTION: if we don't upload any images, do we need this formData?
    // formData.append("firstName", data.name);
    // formData.append("lastName", data.price);
    // formData.append("phone", data.phone);
    // formData.append("address", data.address);
    // formData.append("dateOfBirth", data.dateOfBirth);
    // formData.append("termsOfUse", data.termsOfUse);
    // formData.append("dataProtectionInfo", data.dataProtectionInfo);

    // console.log("formdata", formData);
    axios
      .post("http://localhost:8080/signup", data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" signup form-control w-full max-w-xs  flex flex-col items-center justify-center"
      >
        {/* register your input into the hook by invoking the "register" function */}
        <label>
          <div className="label self-start">
            <span className="label-text">What is your Name?</span>
          </div>
          <input
            placeholder="First Name"
            className="input input-bordered w-full max-w-xs input-primary "
            {...register("firstName", { required: true })}
          />
          <div className="label self-start">
            <span className="label-text">What is your Last-Name?</span>
          </div>
          <input
            placeholder="Last Name"
            className="input input-bordered w-full max-w-xs input-primary "
            {...register("lastName", { required: true })}
          />
          <div className="label self-start">
            <span className="label-text">What is your Phone Number?</span>
          </div>
          <input
            placeholder="Phonenumber"
            className="input input-bordered w-full max-w-xs input-primary "
            {...register("phone", { required: true })}
          />
          <div className="label self-start">
            <span className="label-text">What is your address?</span>
          </div>
          <input
            placeholder="Address"
            className="input input-bordered w-full max-w-xs input-primary "
            {...register("address", { required: true })}
          />
          <div className="label self-start">
            <span className="label-text">When were you born?</span>
          </div>
          <input
            placeholder="Date of Birth"
            className="input input-bordered w-full max-w-xs input-primary "
            type="date"
            {...register("dateOfBirth", { required: true })}
          />
          <div className="label self-start">
            <span className="label-text">What is your E-Mail?</span>
          </div>
          <input
            placeholder="E-Mail"
            className="input input-bordered w-full max-w-xs input-primary "
            {...register("email", { required: true })}
          />
          <div className="label self-start">
            <span className="label-text">Set a password</span>
          </div>
          <input
            placeholder="Password"
            className="input input-bordered w-full max-w-xs input-primary "
            {...register("password", { required: true })}
          />
          <div className="label cursor-pointer">
            <span className="label-text">AGB Aproval</span>
            <input
              type="checkbox"
              className="toggle toggle-secondary"
              {...register("termsOfUse", { required: true })}
            />
          </div>
          <div className="label cursor-pointer">
            <span className="label-text">Dataprotection read</span>
            <input
              type="checkbox"
              className="toggle toggle-secondary"
              {...register("dataProtectionInfo", { required: true })}
            />
          </div>

          {/* errors will return when field validation fails  */}
          {errors.exampleRequired && <span>This field is required</span>}

          <button className="btn btn-primary">Submit</button>
        </label>
      </form>
    </div>
  );
}