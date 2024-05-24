import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { editTicket } from "../../../redux/slices/ticket";
import { useEffect } from "react";
import { getExhibitions } from "../../../redux/slices/exhibition";

const EditTicket = ({ ticket, onCancel }) => {
  const dispatch = useDispatch();

  const { list: exhibitions } = useSelector((state) => state.exhibitions);

  const errorMessage = "Field cannot be empty";

  const schema = z.object({
    exhibition: z.string().nonempty(errorMessage),
    price: z.number(),
    quantity: z.number(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    dispatch(editTicket({ id: ticket._id, body: data }));
    onCancel();
  };

  useEffect(() => {
    dispatch(getExhibitions());
  }, []);

  return (
    <div className="mx-4 w-96 md:mx-0 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="sticky top-0 bg-white flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Edit Ticket</h3>
        <button onClick={onCancel}>
          <i className="ri-close-circle-line text-lg"></i>
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6.5">
          <div className="mb-4.5 relative z-20 bg-transparent dark:bg-form-input">
            <label className="mb-2.5 block text-black dark:text-white">
              Exhibition <span className="text-meta-1">*</span>
            </label>
            <select
              {...register("exhibition")}
              defaultValue={ticket.exhibition._id}
              className="relative z-20 w-full appearance-none border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
            >
              <option
                value=""
                disabled
                className="text-body dark:text-bodydark"
              >
                Select an exhibition
              </option>
              {exhibitions &&
                exhibitions.map((exhibition, key) => (
                  <option
                    key={key}
                    value={exhibition._id}
                    className="text-body dark:text-bodydark"
                  >
                    {exhibition.name}
                  </option>
                ))}
            </select>
            <p className="text-sm text-meta-1">
              {errors.exhibition && <span>{errors.exhibition.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Price <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("price", { valueAsNumber: true })}
              defaultValue={ticket.price}
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
              {...register("quantity", { valueAsNumber: true })}
              defaultValue={ticket.quantity}
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
            Edit Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTicket;
