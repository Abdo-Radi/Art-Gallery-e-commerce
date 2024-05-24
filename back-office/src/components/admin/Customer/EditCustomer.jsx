import * as z from "zod";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editCustomer } from "../../../redux/slices/customer";

const EditCustomer = ({ customer, onCancel }) => {
  const schema = z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      username: z.string(),
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
    // Only include password fields if they're not empty
    const editedCustomer = {
      ...data,
      password: data.password ? data.password : undefined,
      confirmPassword: data.confirmPassword ? data.confirmPassword : undefined,
    };

    dispatch(editCustomer({ id: customer._id, body: editedCustomer }));
    onCancel();
  };

  return (
    <div className="overflow-y-auto h-5/6 no-scrollbar mx-4 w-96 md:mx-0 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="sticky top-0 bg-white flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Edit Customer
        </h3>
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
              defaultValue={customer.firstName}
              type="text"
              placeholder="Enter the first name"
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
              defaultValue={customer.lastName}
              type="text"
              placeholder="Enter the last name"
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
              defaultValue={customer.username}
              type="text"
              placeholder="Enter the username"
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
              defaultValue={customer.email}
              type="email"
              placeholder="Enter the email address"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.email && <span>{errors.email.message}</span>}
            </p>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Edit Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer;
