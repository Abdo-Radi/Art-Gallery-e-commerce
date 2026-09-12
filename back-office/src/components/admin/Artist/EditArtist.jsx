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
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: artist.firstName,
      lastName: artist.lastName,
      username: artist.username,
      email: artist.email,
    },
  });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const result = await dispatch(editArtist({ id: artist._id, body: data }));
    if (editArtist.rejected.match(result)) {
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
          <h3 className="modal-title">Edit artist</h3>
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
                placeholder="Yassine"
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
                placeholder="Bennani"
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
              placeholder="yassine_art"
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
              placeholder="artist@example.com"
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

export default EditArtist;
