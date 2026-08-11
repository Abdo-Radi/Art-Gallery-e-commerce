import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { getArtists } from "../../../redux/slices/artist";
import { getCategories } from "../../../redux/slices/category";
import { addArtwork } from "../../../redux/slices/artwork";

const AddArtwork = ({ onCancel }) => {
  const dispatch = useDispatch();

  const { list: categories } = useSelector((state) => state.categories);
  const { list: artists } = useSelector((state) => state.artists);

  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");

  const errorMessage = "Field cannot be empty";

  const schema = z.object({
    title: z.string().nonempty(errorMessage),
    artist: z.string().nonempty(errorMessage),
    category: z.string().nonempty(errorMessage),
    price: z.number(),
    description: z.string().nonempty(errorMessage),
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
    // The Artwork model requires an image; block submit until one is uploaded.
    if (!imageUrl) {
      setImageError("Please upload an image");
      return;
    }

    const artworkData = {
      ...data,
      price: parseFloat(data.price),
      image: imageUrl,
    };

    dispatch(addArtwork(artworkData));
    onCancel();
  };

  useEffect(() => {
    // Only fetch what we don't already have — the lists are shared app-wide,
    // so reopening this modal shouldn't refetch them every time.
    if (!artists?.length) dispatch(getArtists({ limit: 1000 }));
    if (!categories?.length) dispatch(getCategories());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Catalogue</p>
          <h3 className="modal-title">Add artwork</h3>
        </div>
        <button onClick={onCancel} className="btn-icon" title="Close" aria-label="Close">
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
            Title <span className="text-danger">*</span>
          </label>
          <input
            {...register("title")}
            type="text"
            placeholder="Title"
            className="input-field"
          />
          {errors.title && <span className="field-error">{errors.title.message}</span>}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Artist <span className="text-danger">*</span>
          </label>
          <select {...register("artist")} defaultValue="" className="select-field">
            <option value="" disabled>
              Select an artist
            </option>
            {artists &&
              artists.map((artist, key) => (
                <option key={key} value={artist._id}>
                  {artist.firstName} {artist.lastName}
                </option>
              ))}
          </select>
          {errors.artist && <span className="field-error">{errors.artist.message}</span>}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Category <span className="text-danger">*</span>
          </label>
          <select {...register("category")} defaultValue="" className="select-field">
            <option value="" disabled>
              Select a category
            </option>
            {categories &&
              categories.map((category, key) => (
                <option key={key} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
          {errors.category && (
            <span className="field-error">{errors.category.message}</span>
          )}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Price <span className="text-danger">*</span>
          </label>
          <input
            {...register("price", { valueAsNumber: true })}
            defaultValue={0}
            type="number"
            placeholder="Price"
            className="input-field"
          />
          {errors.price && <span className="field-error">{errors.price.message}</span>}
        </div>

        <div>
          <label className="label-cap mb-2 block">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            {...register("description")}
            type="text"
            placeholder="Description"
            className="textarea-field"
            cols="30"
            rows="5"
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
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1">
            Save artwork
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArtwork;
