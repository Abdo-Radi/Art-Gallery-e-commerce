import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { addExhibition } from "../../../redux/slices/exhibition"; // Import the addExhibition action

const AddExhibition = ({ onCancel }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");

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
    formState: { errors },
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
    }
  };

  const onSubmit = (data) => {
    // The Exhibition model requires an image; block submit until one is uploaded.
    if (!imageUrl) {
      setImageError("Please upload an image");
      return;
    }

    const exhibitionData = {
      ...data,
      image: imageUrl,
    };

    dispatch(addExhibition(exhibitionData));
    onCancel();
  };

  return (
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Programme</p>
          <h3 className="modal-title">Add exhibition</h3>
        </div>
        <button onClick={onCancel} className="btn-icon" aria-label="Close">
          <i className="ri-close-line text-xl" />
        </button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="modal-body space-y-5"
      >
        <div>
          <label className="label-cap mb-2 block">
            Name <span className="text-danger">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Exhibition name"
            className="input-field"
          />
          {errors.name && (
            <span className="field-error">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Date <span className="text-danger">*</span>
          </label>
          <input
            {...register("date")}
            type="date"
            placeholder="Exhibition date"
            className="input-field"
          />
          {errors.date && (
            <span className="field-error">{errors.date.message}</span>
          )}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Ticket quantity <span className="text-danger">*</span>
          </label>
          <input
            {...register("quantity", { valueAsNumber: true })}
            type="number"
            placeholder="Number of tickets"
            className="input-field tabular-nums"
          />
          {errors.quantity && (
            <span className="field-error">{errors.quantity.message}</span>
          )}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Ticket price <span className="text-danger">*</span>
          </label>
          <input
            {...register("price", { valueAsNumber: true })}
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
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            {...register("description")}
            placeholder="Short description"
            className="textarea-field"
            rows="4"
          />
          {errors.description && (
            <span className="field-error">{errors.description.message}</span>
          )}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Image <span className="text-danger">*</span>
          </label>
          <input type="file" onChange={uploadImage} className="file-field" />
          {imageError && <span className="field-error">{imageError}</span>}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Exhibition"
              className="mt-3 h-32 w-full border border-line object-cover"
            />
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1">
            Save exhibition
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
