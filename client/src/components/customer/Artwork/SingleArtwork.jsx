import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addProductToCart,
  getArtworkById,
} from "../../../redux/slices/artwork";
import { ToastContainer, toast } from "react-toastify";
import { getCategories } from "../../../redux/slices/category";
import "react-toastify/dist/ReactToastify.css";

function SingleArtwork() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const artwork = useSelector((state) => state.artworks.singleArtwork);
  const error = useSelector((state) => state.artworks.error);
  const categories = useSelector((state) => state.category.categories)
  useEffect(() => {
    dispatch(getArtworkById(id));
    dispatch(getCategories());
  }, [dispatch, id]);


  const handleAddToWishlist = () => {
    toast("Added to wishlist");
  };
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown Category";
  };
const addToCart = () => {
    dispatch(addProductToCart(id)).then((response) => {
      toast(response.payload.data);
    });
};
  if (error) {
    return (
      <div className="text-red-600 text-center mt-4">{`Error: ${error}`}</div>
    );
  }

  if (!artwork) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg p-6">
          <div className="overflow-hidden h-96 rounded-lg">
            <div className="flex justify-center items-center h-full bg-gray-100">
              <img
                src={artwork.image}
                alt="Artwork"
                className="object-cover h-full w-full"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {artwork.title}
            </h2>
            <div className="text-3xl font-semibold text-red-600 mb-4">
              {artwork.price} USD
            </div>
            <div className="mb-4">
              <p className="text-lg text-gray-700">{artwork.description}</p>
            </div>
            <div className="flex justify-between items-center mb-4 space-x-4">
              <button
                onClick={addToCart}
                className="btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
                type="button"
              >
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="btn bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md transition duration-300"
                type="button"
              >
                Add to Wishlist
              </button>
            </div>
            <ul className="text-lg text-gray-600">
              <li className="mb-2">
                <strong>Available:</strong> <span>In stock</span>
              </li>
              <li className="mb-2">
                <strong>Category:</strong>{" "}
                <span>{getCategoryName(artwork.category)}</span>
              </li>
              <li className="mb-2">
                <strong>Shipping Area:</strong>{" "}
                <span>All over the country</span>
              </li>
              <li className="mb-2">
                <strong>Shipping Fee:</strong> <span>{artwork.price > 1000? "FREE" :  "50"}</span>

              </li>
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SingleArtwork;
