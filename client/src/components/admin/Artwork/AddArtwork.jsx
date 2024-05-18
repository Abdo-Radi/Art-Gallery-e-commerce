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
              placeholder="Title"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.title && <span>{errors.title.message}</span>}
            </p>
          </div>

          <div className="mb-4.5 relative z-20 bg-transparent dark:bg-form-input">
            <label className="mb-2.5 block text-black dark:text-white">
              Artist <span className="text-meta-1">*</span>
            </label>
            <select
              {...register("artist")}
              defaultValue=""
              className="relative z-20 w-full appearance-none border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
            >
              <option
                value=""
                disabled
                className="text-body dark:text-bodydark"
              >
                Select an artist
              </option>
              {artists &&
                artists.map((artist, key) => (
                  <option
                    key={key}
                    value={artist._id}
                    className="text-body dark:text-bodydark"
                  >
                    {artist.firstName} {artist.lastName}
                  </option>
                ))}
            </select>
            <p className="text-sm text-meta-1">
              {errors.artist && <span>{errors.artist.message}</span>}
            </p>
          </div>

          <div className="mb-4.5 relative z-20 bg-transparent dark:bg-form-input">
            <label className="mb-2.5 block text-black dark:text-white">
              Category <span className="text-meta-1">*</span>
            </label>
            <select
              {...register("category")}
              defaultValue=""
              className="relative z-20 w-full appearance-none border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
            >
              <option
                value=""
                disabled
                className="text-body dark:text-bodydark"
              >
                Select a category
              </option>
              {categories &&
                categories.map((category, key) => (
                  <option
                    key={key}
                    value={category._id}
                    className="text-body dark:text-bodydark"
                  >
                    {category.name}
                  </option>
                ))}
            </select>
            <p className="text-sm text-meta-1">
              {errors.category && <span>{errors.category.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Price <span className="text-meta-1">*</span>
            </label>
            <input
              {...register("price", { valueAsNumber: true })}
              defaultValue={0}
              type="number"
              placeholder="Price"
              className="w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <p className="text-sm text-meta-1">
              {errors.price && <span>{errors.price.message}</span>}
            </p>
          </div>

          <div className="mb-3">
            <label className="mb-2.5 block text-black dark:text-white">
              Description <span className="text-meta-1">*</span>
            </label>
            <textarea
              {...register("description")}
              type="text"
              placeholder="Description"
              className="m-0 w-full border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              cols="30"
              rows="5"
            />
            <p className="text-sm text-meta-1">
              {errors.description && <span>{errors.description.message}</span>}
            </p>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Image <span className="text-meta-1">*</span>
            </label>
            <input
              type="file"
              onChange={uploadImage}
              className="w-full cursor-pointer border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
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
