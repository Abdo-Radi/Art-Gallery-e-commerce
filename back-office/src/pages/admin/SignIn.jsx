import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../api/axiosInstance";

const SignIn = () => {
  const schema = z.object({
    identifier: z.string().nonempty("Required field"),
    password: z.string().nonempty("Required field"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const showErrorMessage = (message) => {
    toast.error(message);
  };

  const login = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/login",
        { ...data, accountType: "admin" },
        { withCredentials: true }
      );
      const token = response.data.token;

      localStorage.setItem("token", token);
      navigate("/admin");
    } catch (error) {
      showErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="h-5/6 p-6.5 flex flex-col justify-center mx-4 w-96 md:mx-0 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="font-medium text-title-lg mb-9 text-black dark:text-white">
          Sign In to Horizons
        </h3>
        <form onSubmit={handleSubmit(login)}>
          <div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Identifier <span className="text-meta-1">*</span>
              </label>
              <input
                {...register("identifier")}
                type="text"
                placeholder="Enter your email or username"
                className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <p className="text-sm text-meta-1">
                {errors.identifier && <span>{errors.identifier.message}</span>}
              </p>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Password <span className="text-meta-1">*</span>
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <p className="text-sm text-meta-1">
                {errors.password && <span>{errors.password.message}</span>}
              </p>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </div>
  );
};

export default SignIn;
