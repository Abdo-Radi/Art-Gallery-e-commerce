import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addAdmin } from "../../../redux/slices/admin";
import { useDispatch } from "react-redux";

const AddAdmin = ({ onCancel }) => {
  const schema = z
    .object({
      firstName: z.string().min(1, { message: "Field cannot be empty" }),
      lastName: z.string().min(1, { message: "Field cannot be empty" }),
      username: z.string().min(1, { message: "Field cannot be empty" }),
      email: z.string().email(),
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
    dispatch(addAdmin(data));
    onCancel();
  };

  return (
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Access</p>
          <h3 className="modal-title">Add admin</h3>
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

        <div>
          <label className="label-cap mb-2 block">
            Password <span className="text-danger">*</span>
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="Enter admin's password"
            className="input-field"
          />
          {errors.password && (
            <span className="field-error">{errors.password.message}</span>
          )}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Confirm password <span className="text-danger">*</span>
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm admin's password"
            className="input-field"
          />
          {errors.confirmPassword && (
            <span className="field-error">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1">
            Save admin
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
