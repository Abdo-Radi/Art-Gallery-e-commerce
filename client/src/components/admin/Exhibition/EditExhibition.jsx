import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { editExhibition } from "../../../redux/features/exhibition"; // Import the editExhibition action

const EditExhibition = ({ exhibition, onCancel }) => {
  const [formData, setFormData] = useState({
    name: exhibition.name,
    description: exhibition.description,
    date: exhibition.date,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const schema = z.object({
    name: z.string(),
    description: z.string(),
    date: z.string(), // You might want to refine this to validate date format
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
    dispatch(editExhibition({ body:data, id: exhibition._id })); // Dispatch the editExhibition action with form data and exhibition id
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Name <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("name")}
              value={formData.name}
              onChange={handleChange}
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
              Description <span className="text-meta-1">*</span>
            </label>
            <textarea
              {...register("description")}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter exhibition description"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
            <p className="text-sm text-meta-1">
              {errors.description && <span>{errors.description.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Date <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("date")}
              value={formData.date}
              onChange={handleChange}
              type="date"
              placeholder="Enter exhibition date"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.date && <span>{errors.date.message}</span>}
            </p>
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
