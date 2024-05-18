import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { editArtist } from "../../../redux/slices/artist";

const EditArtist = ({ artist, onCancel }) => {
  const errorMessage = "Field cannot be empty";

  const schema = z.object({
    firstName: z.string().nonempty(errorMessage),
    lastName: z.string().nonempty(errorMessage),
    username: z.string().nonempty(errorMessage),
    email: z.string().email(),
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
    dispatch(editArtist({ id: artist._id, body: data }));
    onCancel();
  };

  return (
    <div className="overflow-y-auto h-5/6 no-scrollbar mx-4 w-96 md:mx-0 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="sticky top-0 bg-white flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Edit Artist</h3>
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
              defaultValue={artist.firstName}
              type="text"
              placeholder="Enter artist's first name"
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
              defaultValue={artist.lastName}
              type="text"
              placeholder="Enter artist's last name"
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
              defaultValue={artist.username}
              type="text"
              placeholder="Enter artist's username"
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
              defaultValue={artist.email}
              type="email"
              placeholder="Enter artist's email address"
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
            Edit Artist
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArtist;
