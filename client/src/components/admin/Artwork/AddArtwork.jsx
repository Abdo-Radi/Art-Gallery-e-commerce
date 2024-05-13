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

  const { categories } = useSelector((state) => state.category);
  const { list: artists } = useSelector((state) => state.artists);

  const [imageUrl, setImageUrl] = useState("");

  const errorMessage = "Field cannot be empty";

  const schema = z.object({
    title: z.string().nonempty(errorMessage),
    artist: z.string().nonempty(errorMessage),
    category: z.string().nonempty(errorMessage),
    price: z.string().nonempty(errorMessage),
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
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const onSubmit = (data) => {
    const artworkData = {
      ...data,
      price: parseFloat(data.price),
      image: imageUrl, //
    };

    dispatch(addArtwork(artworkData));
    onCancel();
  };

  useEffect(() => {
    dispatch(getArtists());
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div className="overflow-y-auto h-5/6 no-scrollbar mx-4 w-96 md:mx-0 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="sticky top-0 bg-white flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark z-9999">
        <h3 className="font-medium text-black dark:text-white">Add Artwork</h3>
        <button onClick={onCancel}>
          <i className="ri-close-circle-line text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Title <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="Enter title"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            />
            {errors.title && (
              <p className="text-sm text-meta-1">{errors.title.message}</p>
            )}
          </div>

          <div className="mb-4.5 relative z-20">
            <label className="mb-2.5 block text-black dark:text-white">
              Artist <span className="text-meta-1">*</span>
            </label>
            <select
              {...register("artist")}
              className="relative z-20 w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="" disabled>
                Select an artist
              </option>
              {artists.map((artist) => (
                <option key={artist._id} value={artist._id}>
                  {artist.firstName} {artist.lastName}
                </option>
              ))}
            </select>
            {errors.artist && (
              <p className="text-sm text-meta-1">{errors.artist.message}</p>
            )}
          </div>

          <div className="mb-4.5 relative z-20">
            <label className="mb-2.5 block text-black dark:text-white">
              Category <span className="text-meta-1">*</span>
            </label>
            <select
              {...register("category")}
              className="relative z-20 w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-meta-1">{errors.category.message}</p>
            )}
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Price <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("price")}
              type="text"
              placeholder="Enter price"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            />
            {errors.price && (
              <p className="text-sm text-meta-1">{errors.price.message}</p>
            )}
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Upload Image <span className="text-meta-1">*</span>
            </label>
            <input
              type="file"
              onChange={uploadImage}
              className="w-full border-[1.5px] border-stroke bg-transparent outline-none transition file:border-0 file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 dark:border-form-strokedark dark:bg-form-input"
            />
          </div>

          <div className="mb-3">
            <label className="mb-2.5 block text-black dark:text-white">
              Description <span className="text-meta-1">*</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="Enter description"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
              rows="4"
            />
            {errors.description && (
              <p className="text-sm text-meta-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex w-full justify-center bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Add Artwork
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArtwork;
