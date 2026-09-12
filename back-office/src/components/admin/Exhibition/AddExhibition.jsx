import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { addExhibition } from "../../../redux/slices/exhibition";
import ImageField from "../ImageField";

const AddExhibition = ({ onCancel }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);

  const errorMessage = "Field cannot be empty";

  const schema = z.object({
    name: z.string().nonempty(errorMessage),
    description: z.string().nonempty(errorMessage),
    date: z.string().date(),
    quantity: z.number().min(0),
    price: z.number(),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bg6v1o5p");

    setUploading(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxzfk8kss/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setImageUrl(response.data.secure_url);
      setImageError("");
    } catch (error) {
      console.error("Image upload failed:", error);
      setImageError("Image upload failed, please try again");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    // The Exhibition model requires an image; block submit until one is uploaded.
    if (!imageUrl) {
      setImageError("Please upload an image");
      return;
    }

    const exhibitionData = {
      ...data,
      image: imageUrl,
    };

    const result = await dispatch(addExhibition(exhibitionData));
    if (addExhibition.rejected.match(result)) {
      setError("root.serverError", {
        message: result.payload ?? result.error.message,
      });
      return;
    }
    onCancel();
  };

  return (
    <div className="modal-card-wide">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Programme</p>
          <h3 className="modal-title">Add exhibition</h3>
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="modal-form"
      >
        <div className="modal-body">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Details */}
            <div className="space-y-5">
              <div>
                <label className="label-cap mb-2 block">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="e.g. Digital Dreams Expo"
                  className="input-field"
                />
                {errors.name && (
                  <span className="field-error">{errors.name.message}</span>
                )}
              </div>

              <div>
                <label className="label-cap mb-2 block">
                  Opening date <span className="text-danger">*</span>
                </label>
                <input {...register("date")} type="date" className="input-field" />
                {errors.date && (
                  <span className="field-error">{errors.date.message}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-cap mb-2 block">
                    Tickets <span className="text-danger">*</span>
                  </label>
                  <input
                    {...register("quantity", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="input-field tabular-nums"
                  />
                  {errors.quantity && (
                    <span className="field-error">
                      {errors.quantity.message}
                    </span>
                  )}
                </div>

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
              </div>
            </div>

            {/* Image + description */}
            <div className="space-y-5">
              <ImageField
                label="Poster image"
                required
                value={imageUrl}
                onChange={uploadImage}
                uploading={uploading}
                error={imageError}
                hint="JPG or PNG, landscape works best"
              />

              <div>
                <label className="label-cap mb-2 block">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  {...register("description")}
                  placeholder="What the exhibition is about"
                  className="textarea-field resize-none"
                  rows="5"
                />
                {errors.description && (
                  <span className="field-error">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>
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
            disabled={isSubmitting || uploading}
            className="btn-primary flex-1"
          >
            {isSubmitting ? "Saving…" : "Save exhibition"}
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExhibition;
