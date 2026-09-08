import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { addTicket } from "../../../redux/slices/ticket";
import { useEffect } from "react";
import { getExhibitions } from "../../../redux/slices/exhibition";

const AddTicket = ({ onCancel }) => {
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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await dispatch(addTicket(data));
    onCancel();
  };

  useEffect(() => {
    // Only fetch when we don't already have the list — reopening this modal
    // shouldn't refetch every exhibition each time.
    if (!exhibitions?.length) dispatch(getExhibitions({ limit: 1000 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Programme</p>
          <h3 className="modal-title">Add ticket</h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="btn-icon"
          title="Close"
          aria-label="Close"
        >
          <i className="ri-close-line text-xl" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
        <div className="modal-body space-y-5">
          <div>
            <label className="label-cap mb-2 block">
              Exhibition <span className="text-danger">*</span>
            </label>
            <select
              {...register("exhibition")}
              defaultValue=""
              className="select-field"
            >
              <option value="" disabled>
                Select an exhibition
              </option>
              {exhibitions?.map((exhibition) => (
                <option key={exhibition._id} value={exhibition._id}>
                  {exhibition.name}
                </option>
              ))}
            </select>
            {!exhibitions?.length && (
              <span className="field-hint">
                No exhibitions yet — add one under Programme → Exhibitions.
              </span>
            )}
            {errors.exhibition && (
              <span className="field-error">{errors.exhibition.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-cap mb-2 block">
                Price <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="input-field pr-12 tabular-nums"
                />
                <span className="field-unit">DH</span>
              </div>
              {errors.price && (
                <span className="field-error">{errors.price.message}</span>
              )}
            </div>

            <div>
              <label className="label-cap mb-2 block">
                Quantity <span className="text-danger">*</span>
              </label>
              <input
                {...register("quantity", { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="0"
                className="input-field tabular-nums"
              />
              {errors.quantity && (
                <span className="field-error">{errors.quantity.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1"
          >
            {isSubmitting ? "Saving…" : "Save ticket"}
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTicket;
