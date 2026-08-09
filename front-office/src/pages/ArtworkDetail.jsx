import { Link, useParams } from "react-router-dom";
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
      showToastMessage(
        res.payload?.message ?? res.payload ?? "Something went wrong"
      );
    });
  };

  return (
    <>
      {artworkDetail && (
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-20">
          <Link
            to="/artworks"
            className="group text-[11px] font-semibold uppercase tracking-[0.18em] text-stone transition-colors hover:text-klein"
          >
            <span className="mr-2 inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to the collection
          </Link>

          <div className="mt-10 grid items-start gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            <figure>
              <div className="frame">
                <img
                  alt={artworkDetail.title}
                  className="aspect-[4/5] w-full object-cover"
                  src={artworkDetail.image}
                />
              </div>
              <figcaption className="mt-6 font-display text-sm italic text-stone">
                {artworkDetail.title} — {artworkDetail.artist?.firstName}{" "}
                {artworkDetail.artist?.lastName}
              </figcaption>
            </figure>

            <div className="lg:sticky lg:top-24">
              <p className="eyebrow">
                {artworkDetail.category?.name ?? "Artwork"}
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold italic leading-tight sm:text-5xl">
                {artworkDetail.title}
              </h1>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-stone">
                {artworkDetail.artist?.firstName} {artworkDetail.artist?.lastName}
              </p>

              <p className="mt-8 max-w-prose text-base leading-relaxed text-stone">
                {artworkDetail.description}
              </p>

              {/* Museum label */}
              <dl className="mt-10 border-t border-line">
                <div className="flex items-baseline justify-between border-b border-line py-3.5">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                    Artist
                  </dt>
                  <dd className="text-sm">
                    {artworkDetail.artist?.firstName}{" "}
                    {artworkDetail.artist?.lastName}
                  </dd>
                </div>
                {artworkDetail.category?.name && (
                  <div className="flex items-baseline justify-between border-b border-line py-3.5">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                      Style
                    </dt>
                    <dd className="text-sm">{artworkDetail.category.name}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-b border-line py-3.5">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                    Availability
                  </dt>
                  <dd
                    className={`text-sm capitalize ${
                      artworkDetail.status === "sold"
                        ? "text-stone"
                        : "text-klein"
                    }`}
                  >
                    {artworkDetail.status}
                  </dd>
                </div>
              </dl>

              <div className="mt-10 flex flex-wrap items-center gap-8">
                <p className="font-display text-4xl tabular-nums">
                  {artworkDetail.price} <span className="text-2xl">DH</span>
                </p>
                <Button
                  size="lg"
                  onClick={addToCart}
                  disabled={artworkDetail.status === "sold"}
                  className="px-10 text-[12px] font-semibold uppercase tracking-[0.15em]"
                >
                  {artworkDetail.status === "sold" ? "Sold" : "Add to cart"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
      <ToastContainer />
    </>
  );
};

export default ArtworkDetail;
