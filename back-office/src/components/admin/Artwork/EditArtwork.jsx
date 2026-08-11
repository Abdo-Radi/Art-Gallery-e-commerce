import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArtists } from "../../../redux/slices/artist";
import { getCategories } from "../../../redux/slices/category";
import { editArtwork } from "../../../redux/slices/artwork";
import axios from "axios";

const EditArtwork = ({ artwork, onCancel }) => {
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState("");

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
    formState: { errors },
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

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxzfk8kss/image/upload",
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
    const artworkData = {
      ...data,
      price: parseFloat(data.price),
      image: imageUrl,
    };

    dispatch(editArtwork({ id: artwork._id, body: artworkData }));
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
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Catalogue</p>
          <h3 className="modal-title">Edit artwork</h3>
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
            defaultValue={artwork.title}
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
            <span className="mt-1.5 block text-xs text-stone">
              No artists yet — add one under People → Artists.
            </span>
          )}
          {errors.artist && <span className="field-error">{errors.artist.message}</span>}
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
            <span className="mt-1.5 block text-xs text-stone">
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
          <input
            {...register("price", { valueAsNumber: true })}
            defaultValue={artwork.price}
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
            defaultValue={artwork.description}
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

export default EditArtwork;
