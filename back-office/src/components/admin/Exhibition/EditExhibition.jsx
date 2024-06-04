import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editExhibition } from "../../../redux/slices/exhibition";
import axios from "axios";

const EditExhibition = ({ exhibition, onCancel }) => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(""); // Initialize with existing image URL if available

  const schema = z.object({
    name: z.string().nonempty("Field cannot be empty"),
    description: z.string().nonempty("Field cannot be empty"),
    date: z.string().nonempty("Field cannot be empty"), // Optionally refine to validate date format
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bg6v1o5p"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxzfk8kss/image/upload", // Replace with your Cloudinary API endpoint
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
      setImageUrl(response.data.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const onSubmit = (data) => {
    console.log(imageUrl);
    const exhibitionData = {
      ...data,
      image: imageUrl,
    };

    dispatch(editExhibition({ id: exhibition._id, body: exhibitionData }));
    onCancel();
  };

  return (
    <div className="overflow-y-auto h-5/6 no-scrollbar mx-4 w-96 md:mx-0 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="sticky top-0 bg-white flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Edit Exhibition
        </h3>
        <button onClick={onCancel}>
          <i className="ri-close-circle-line text-lg"></i>
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Name <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("name")}
              defaultValue={exhibition.name}
              type="text"
              placeholder="Enter exhibition name"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.name && <span>{errors.name.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Date <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("date")}
              defaultValue={
                new Date(exhibition.date).toISOString().split("T")[0]
              }
              type="date"
              placeholder="Enter exhibition date"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.date && <span>{errors.date.message}</span>}
            </p>
          </div>

          <div className="mb-3">
            <label className="mb-2.5 block text-black dark:text-white">
              Description <span className="text-meta-1">*</span>
            </label>
            <textarea
              {...register("description")}
              defaultValue={exhibition.description}
              placeholder="Enter description"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
              rows="4"
            />
            {errors.description && (
              <p className="text-sm text-meta-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Image <span className="text-meta-1">*</span>
            </label>
            <input
              type="file"
              onChange={uploadImage}
              className="w-full cursor-pointer border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Edit Exhibition
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExhibition;
