import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getArtworkById } from "../../redux/artworkSlice";
import { ToastContainer, toast } from "react-toastify";

function SingleArtwork() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    dispatch(getArtworkById(id))
      .then((response) => {
        setArtwork(response.payload);
      })
      .catch((error) => {
        console.error("Error fetching artwork:", error);
      });
  }, [dispatch, id]);

  const addToCart = () => {
    // Add logic for adding to cart
    toast("Added to cart");
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(id))
      .then((response) => {
        toast(response.payload.message);
      })
      .catch((error) => {
        console.error("Error adding to wishlist:", error);
      });
  };

  if (!artwork) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="overflow-hidden h-96">
            <div className="flex justify-center items-center h-full">
              <img
                src={artwork.image}
                alt="Artwork"
                className="object-cover h-full"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">{artwork.title}</h2>
            <div className="text-2xl font-bold mb-4">{artwork.price} USD</div>
            <div className="mb-4">
              <p className="text-lg mb-2">{artwork.description}</p>
            </div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={addToCart}
                className="btn bg-red-600 text-white px-4 py-2 rounded-md"
                type="button"
              >
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="btn bg-gray-800 text-white px-4 py-2 rounded-md"
                type="button"
              >
                Add to Wishlist
              </button>
            </div>
            <ul className="text-lg">
              <li className="mb-2">
                Available: <span>In stock</span>
              </li>
              <li className="mb-2">
                Category: <span>{artwork.category}</span>
              </li>
              <li className="mb-2">
                Shipping Area: <span>All over the country</span>
              </li>
              <li className="mb-2">
                Shipping Fee: <span>Free</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SingleArtwork;
