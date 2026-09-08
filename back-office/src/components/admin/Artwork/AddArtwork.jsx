import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { getArtists } from "../../../redux/slices/artist";
import { getCategories } from "../../../redux/slices/category";
import { addArtwork } from "../../../redux/slices/artwork";
import ImageField from "../ImageField";

const AddArtwork = ({ onCancel }) => {
  const dispatch = useDispatch();

  const { list: categories } = useSelector((state) => state.categories);
  const { list: artists } = useSelector((state) => state.artists);

  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);

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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

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

    await dispatch(addArtwork(artworkData));
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
    <div className="modal-card-wide">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Catalogue</p>
          <h3 className="modal-title">Add artwork</h3>
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
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="e.g. Coastal Light"
                  className="input-field"
                />
                {errors.title && (
                  <span className="field-error">{errors.title.message}</span>
                )}
              </div>

              <div>
                <label className="label-cap mb-2 block">
                  Artist <span className="text-danger">*</span>
                </label>
                <select
                  {...register("artist")}
                  defaultValue=""
                  className="select-field"
                >
                  <option value="" disabled>
                    Select an artist
                  </option>
                  {artists?.map((artist) => (
                    <option key={artist._id} value={artist._id}>
                      {artist.firstName} {artist.lastName}
                    </option>
                  ))}
                </select>
                {!artists?.length && (
                  <span className="field-hint">
                    No artists yet — add one under People → Artists.
                  </span>
                )}
                {errors.artist && (
                  <span className="field-error">{errors.artist.message}</span>
                )}
              </div>

              <div>
                <label className="label-cap mb-2 block">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  {...register("category")}
                  defaultValue=""
                  className="select-field"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {!categories?.length && (
                  <span className="field-hint">
                    No categories yet — add one under Catalogue → Categories.
                  </span>
                )}
                {errors.category && (
                  <span className="field-error">{errors.category.message}</span>
                )}
              </div>

              <div>
                <label className="label-cap mb-2 block">
                  Price <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("price", { valueAsNumber: true })}
                    defaultValue={0}
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

            {/* Image + description */}
            <div className="space-y-5">
              <ImageField
                label="Image"
                required
                value={imageUrl}
                onChange={uploadImage}
                uploading={uploading}
                error={imageError}
                hint="JPG or PNG, landscape or square works best"
              />

              <div>
                <label className="label-cap mb-2 block">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Medium, dimensions, and a line about the work"
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

        <div className="modal-foot">
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="btn-primary flex-1"
          >
            {isSubmitting ? "Saving…" : "Save artwork"}
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
