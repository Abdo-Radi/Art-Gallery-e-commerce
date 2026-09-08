import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { editCategory } from "../../../redux/slices/category";

const EditCategory = ({ category, onCancel }) => {
  const errorMessage = "Field cannot be empty";

  const schema = z.object({
    name: z.string().nonempty(errorMessage),
    description: z.string().nonempty(errorMessage),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category.name,
      description: category.description,
    },
  });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    await dispatch(editCategory({ id: category._id, body: data }));
    onCancel();
  };

  return (
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Taxonomy</p>
          <h3 className="modal-title">Edit category</h3>
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
              Name <span className="text-danger">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. Abstract"
              className="input-field"
            />
            {errors.name && (
              <span className="field-error">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="label-cap mb-2 block">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="How this category is used across the collection"
              className="textarea-field resize-none"
              rows="4"
            />
            {errors.description && (
              <span className="field-error">{errors.description.message}</span>
            )}
          </div>
        </div>

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

export default EditCategory;
