import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { clearArtworkDetail, getArtworkById } from "@/redux/slices/artwork";
import { addItemToCart } from "@/redux/slices/cart";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ArtworkDetail = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const { artworkDetail } = useSelector((state) => state.artworks);
  const { data: userData } = useSelector((state) => state.currentUser);

  useEffect(() => {
    dispatch(getArtworkById(id));
    return () => {
      dispatch(clearArtworkDetail());
    };
  }, [dispatch, id]);

  const showToastMessage = (message) => {
    toast(message, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const addToCart = () => {
    if (!userData) {
      showToastMessage("Please login to add items to your cart!");
      return;
    }
    dispatch(
      addItemToCart({
        customer: userData._id,
        product: id,
        productType: "Artwork",
        quantity: 1,
      })
    ).then((res) => {
      showToastMessage(res.payload?.message ?? res.payload ?? "Something went wrong");
    });
  };

  return (
    <>
      {artworkDetail && (
        <section className="w-full px-4 md:px-6 lg:px-20 py-12 grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
          <div className="grid gap-4 md:gap-10 items-start">
            <img
              alt={artworkDetail.title}
              className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
              height="600"
              src={artworkDetail.image}
              width="600"
            />
          </div>
          <div className="grid gap-4 md:gap-10 items-start">
            <div className="grid gap-2">
              <h1 className="font-bold text-3xl">{artworkDetail.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                by {artworkDetail.artist?.firstName}{" "}
                {artworkDetail.artist?.lastName}
              </p>
              <p>{artworkDetail.category?.name}</p>
              <p className="font-semibold text-2xl">{artworkDetail.price} DH</p>
            </div>
            <div className="grid gap-4 text-sm leading-loose">
              {artworkDetail.description}
            </div>
            <Button size="lg" onClick={addToCart}>
              Add to Cart
            </Button>
          </div>
        </section>
      )}
      <ToastContainer />
    </>
  );
};

export default ArtworkDetail;
