import * as z from "zod";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editCustomer } from "../../../redux/slices/customer";

const EditCustomer = ({ customer, onCancel }) => {
  // The form has no password inputs, so the schema must not require them —
  // otherwise validation always fails and the form can never be submitted.
  const schema = z.object({
    firstName: z.string().min(1, { message: "Field cannot be empty" }),
    lastName: z.string().min(1, { message: "Field cannot be empty" }),
    email: z.string().email(),
    username: z.string().min(1, { message: "Field cannot be empty" }),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      username: customer.username,
    },
  });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const result = await dispatch(editCustomer({ id: customer._id, body: data }));
    if (editCustomer.rejected.match(result)) {
      setError("root.serverError", {
        message: result.payload ?? result.error.message,
      });
      return;
    }
    onCancel();
  };

  return (
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">People</p>
          <h3 className="modal-title">Edit customer</h3>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-cap mb-2 block">
                First name <span className="text-danger">*</span>
              </label>
              <input
                {...register("firstName")}
                type="text"
                placeholder="Jane"
                className="input-field"
              />
              {errors.firstName && (
                <span className="field-error">{errors.firstName.message}</span>
              )}
            </div>

            <div>
              <label className="label-cap mb-2 block">
                Last name <span className="text-danger">*</span>
              </label>
              <input
                {...register("lastName")}
                type="text"
                placeholder="Doe"
                className="input-field"
              />
              {errors.lastName && (
                <span className="field-error">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="label-cap mb-2 block">
              Username <span className="text-danger">*</span>
            </label>
            <input
              {...register("username")}
              type="text"
              placeholder="janedoe"
              className="input-field"
            />
            {errors.username && (
              <span className="field-error">{errors.username.message}</span>
            )}
          </div>

          <div>
            <label className="label-cap mb-2 block">
              Email <span className="text-danger">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="jane@example.com"
              className="input-field"
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>
        </div>

        {errors.root?.serverError && (
          <p role="alert" className="modal-error">
            {errors.root.serverError.message}
          </p>
        )}

        <div className="modal-foot">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1"
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer;
