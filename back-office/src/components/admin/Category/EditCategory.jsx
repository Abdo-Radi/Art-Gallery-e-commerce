import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { editCategory, getCategories } from "../../../redux/slices/category";

const EditCategory = ({ category, onCancel }) => {
  const { name, description } = category;

  const errorMessage = "Field cannot be empty";

  const schema = z.object({
    name: z.string().nonempty(errorMessage),
    description: z.string().nonempty(errorMessage),
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
    dispatch(editCategory({ id: category._id, body: data }));
    onCancel();
  };

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Taxonomy</p>
          <h3 className="modal-title">Edit category</h3>
        </div>
        <button onClick={onCancel} className="btn-icon" title="Close" aria-label="Close">
          <i className="ri-close-line text-xl" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="modal-body space-y-5">
        <div>
          <label className="label-cap mb-2 block">
            Name <span className="text-danger">*</span>
          </label>
          <input
            {...register("name")}
            defaultValue={name}
            type="text"
            placeholder="Name"
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
            defaultValue={description}
            placeholder="Enter description"
            className="textarea-field"
            rows="4"
          />
          {errors.description && (
            <span className="field-error">{errors.description.message}</span>
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

export default EditCategory;
