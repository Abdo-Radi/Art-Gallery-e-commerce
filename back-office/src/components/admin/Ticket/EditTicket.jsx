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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      exhibition: ticket.exhibition?._id ?? "",
      price: ticket.price,
      quantity: ticket.quantity,
    },
  });

  const onSubmit = (data) => {
    dispatch(editTicket({ id: ticket._id, body: data }));
    onCancel();
  };

  useEffect(() => {
    // Only fetch what we don't already have — the list is shared app-wide.
    if (!exhibitions?.length) dispatch(getExhibitions({ limit: 1000 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // A native select mounted before its options exist silently drops its value,
  // so re-apply the ticket's own value once the list has arrived. (Blocking the
  // form on this instead would hang forever when no exhibitions exist yet.)
  useEffect(() => {
    if (exhibitions?.length) setValue("exhibition", ticket.exhibition?._id ?? "");
  }, [exhibitions, setValue, ticket]);

  return (
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Programme</p>
          <h3 className="modal-title">Edit ticket</h3>
        </div>
        <button onClick={onCancel} className="btn-icon" aria-label="Close">
          <i className="ri-close-line text-xl" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="modal-body space-y-5">
        <div>
          <label className="label-cap mb-2 block">
            Exhibition <span className="text-danger">*</span>
          </label>
          <select {...register("exhibition")} className="select-field">
            <option value="" disabled>
              Select an exhibition
            </option>
            {exhibitions &&
              exhibitions.map((exhibition, key) => (
                <option key={key} value={exhibition._id}>
                  {exhibition.name}
                </option>
              ))}
          </select>
          {!exhibitions?.length && (
            <span className="mt-1.5 block text-xs text-stone">
              No exhibitions yet — add one under Programme → Exhibitions.
            </span>
          )}
          {errors.exhibition && (
            <span className="field-error">{errors.exhibition.message}</span>
          )}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Price <span className="text-danger">*</span>
          </label>
          <input
            {...register("price", { valueAsNumber: true })}
            defaultValue={ticket.price}
            type="number"
            placeholder="Price in DH"
            className="input-field tabular-nums"
          />
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
            defaultValue={ticket.quantity}
            type="number"
            placeholder="Number of tickets"
            className="input-field tabular-nums"
          />
          {errors.quantity && (
            <span className="field-error">{errors.quantity.message}</span>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1">
            Save changes
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTicket;
