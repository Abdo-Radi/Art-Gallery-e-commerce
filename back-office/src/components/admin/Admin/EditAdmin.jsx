import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { editAdmin } from "../../../redux/slices/admin";

const EditAdmin = ({ admin, onCancel }) => {
  const schema = z.object({
    firstName: z.string().min(1, { message: "Field cannot be empty" }),
    lastName: z.string().min(1, { message: "Field cannot be empty" }),
    username: z.string().min(1, { message: "Field cannot be empty" }),
    email: z.string().email(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: admin.firstName,
      lastName: admin.lastName,
      username: admin.username,
      email: admin.email,
    },
  });

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(editAdmin({ id: admin._id, body: data }));
    onCancel();
  };

  return (
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Access</p>
          <h3 className="modal-title">Edit admin</h3>
        </div>
        <button onClick={onCancel} className="btn-icon" title="Close" aria-label="Close">
          <i className="ri-close-line text-xl" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="modal-body space-y-5">
        <div>
          <label className="label-cap mb-2 block">
            First name <span className="text-danger">*</span>
          </label>
          <input
            {...register("firstName")}
            type="text"
            placeholder="Enter admin's first name"
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
            placeholder="Enter admin's last name"
            className="input-field"
          />
          {errors.lastName && (
            <span className="field-error">{errors.lastName.message}</span>
          )}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Username <span className="text-danger">*</span>
          </label>
          <input
            {...register("username")}
            type="text"
            placeholder="Enter admin's username"
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
            placeholder="Enter admin's email address"
            className="input-field"
          />
          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
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

export default EditAdmin;
