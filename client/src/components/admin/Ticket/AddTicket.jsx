import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTicket } from "../../../redux/slices/ticket";

const AddTicket = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    exhibitionId: "",
    price: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const schema = z.object({
    exhibitionId: z.string().min(1, "Exhibition ID is required"),
    price: z.string().min(1, "Price ID is required"),
    quantity: z.string().min(1, "Quantity ID is required"),
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
    dispatch(createTicket(data));
    onCancel(); // Close the form after submission
  };

  return (
    <div className="overflow-y-auto h-5/6 no-scrollbar mx-4 w-96 md:mx-0 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="sticky top-0 bg-white flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Add Ticket</h3>
        <button onClick={onCancel}>
          <i className="ri-close-circle-line text-lg"></i>
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Exhibition ID <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("exhibitionId")}
              value={formData.exhibitionId}
              onChange={handleChange}
              type="text"
              placeholder="Enter exhibition ID"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.exhibitionId && (
                <span>{errors.exhibitionId.message}</span>
              )}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Price <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("price")}
              value={formData.price}
              onChange={handleChange}
              type="number"
              placeholder="Enter price"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.price && <span>{errors.price.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Quantity <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("quantity")}
              value={formData.quantity}
              onChange={handleChange}
              type="number"
              placeholder="Enter quantity"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.quantity && <span>{errors.quantity.message}</span>}
            </p>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Add Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTicket;
