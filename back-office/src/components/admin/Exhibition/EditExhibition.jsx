import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { editExhibition } from "../../../redux/slices/exhibition";
import axios from "axios";

const EditExhibition = ({ exhibition, onCancel }) => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(""); // Initialize with existing image URL if available

  const schema = z.object({
    name: z.string().nonempty("Field cannot be empty"),
    description: z.string().nonempty("Field cannot be empty"),
    date: z.string().nonempty("Field cannot be empty"),
    quantity: z.number().min(0),
    price: z.number().min(0),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bg6v1o5p"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxzfk8kss/image/upload", // Replace with your Cloudinary API endpoint
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setImageUrl(response.data.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const onSubmit = (data) => {
    const exhibitionData = {
      ...data,
      image: imageUrl,
    };

    dispatch(editExhibition({ id: exhibition._id, body: exhibitionData }));
    onCancel();
  };

  return (
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Programme</p>
          <h3 className="modal-title">Edit exhibition</h3>
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
            defaultValue={exhibition.name}
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
            defaultValue={new Date(exhibition.date).toISOString().split("T")[0]}
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
            defaultValue={exhibition.quantity}
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
            defaultValue={exhibition.price}
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
            defaultValue={exhibition.description}
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

export default EditExhibition;
