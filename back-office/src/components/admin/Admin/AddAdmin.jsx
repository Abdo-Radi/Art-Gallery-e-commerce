import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addAdmin } from "../../../redux/slices/admin";
import { useDispatch } from "react-redux";

const AddAdmin = ({ onCancel }) => {
  const schema = z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      username: z.string(),
      email: z.string().email(),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
      confirmPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(addAdmin(data));
    onCancel();
  };

  return (
    <div className="overflow-y-auto h-5/6 no-scrollbar mx-4 w-96 md:mx-0 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="sticky top-0 bg-white flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Add Admin</h3>
        <button onClick={onCancel}>
          <i className="ri-close-circle-line text-lg"></i>
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              First name <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("firstName")}
              type="text"
              placeholder="Enter admin's first name"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.firstName && <span>{errors.firstName.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Last name <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("lastName")}
              type="text"
              placeholder="Enter admin's last name"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.lastName && <span>{errors.lastName.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Username <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("username")}
              type="text"
              placeholder="Enter admin's username"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.username && <span>{errors.username.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Email <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter admin's email address"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.email && <span>{errors.email.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Password <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter admin's password"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.password && <span>{errors.password.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Confirm password <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm admin's password"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.confirmPassword && (
                <p>{errors.confirmPassword.message}</p>
              )}
            </p>
          </div>
          <button
            type="submit"
            className="flex w-full justify-center bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Add Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
