import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArtists } from "../../../redux/slices/artist";
import { getCategories } from "../../../redux/slices/category";
import { editArtwork } from "../../../redux/slices/artwork";
import ImageField from "../ImageField";
import axios from "axios";

const EditArtwork = ({ artwork, onCancel }) => {
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  const { list: categories } = useSelector((state) => state.categories);
  const { list: artists } = useSelector((state) => state.artists);

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
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: artwork.title,
      artist: artwork.artist?._id ?? "",
      category: artwork.category?._id ?? "",
      price: artwork.price,
      description: artwork.description,
    },
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
    const artworkData = {
      ...data,
      price: parseFloat(data.price),
      image: imageUrl,
    };

    const result = await dispatch(editArtwork({ id: artwork._id, body: artworkData }));
    if (editArtwork.rejected.match(result)) {
      setError("root.serverError", {
        message: result.payload ?? result.error.message,
      });
      return;
    }
    onCancel();
  };

  useEffect(() => {
    // Only fetch what we don't already have — the lists are shared app-wide.
    if (!artists?.length) dispatch(getArtists({ limit: 1000 }));
    if (!categories?.length) dispatch(getCategories());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // A native select mounted before its options exist silently drops its value,
  // so re-apply the artwork's own values once each list has arrived. (Blocking
  // the whole form on this instead would hang forever when a list is legitimately
  // empty — e.g. no categories have been created yet.)
  useEffect(() => {
    if (artists?.length) setValue("artist", artwork.artist?._id ?? "");
  }, [artists, setValue, artwork]);

  useEffect(() => {
    if (categories?.length) setValue("category", artwork.category?._id ?? "");
  }, [categories, setValue, artwork]);

  return (
    <div className="modal-card-wide">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Catalogue</p>
          <h3 className="modal-title">Edit artwork</h3>
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
                <select {...register("artist")} className="select-field">
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
                <select {...register("category")} className="select-field">
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
                value={imageUrl || artwork.image}
                onChange={uploadImage}
                uploading={uploading}
                error={imageError}
                currentLabel={imageUrl ? "New image" : "Current image"}
                hint="Leave as is to keep the current image"
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

export default EditArtwork;
