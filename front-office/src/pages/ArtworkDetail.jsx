import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getArtworkById } from "@/redux/slices/artwork";
import { Button } from "@/components/ui/button";

const ArtworkDetail = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const { artworkDetail } = useSelector((state) => state.artworks);

  useEffect(() => {
    dispatch(getArtworkById(id));
  }, []);

  return (
    artworkDetail && (
      <section className="w-full px-4 md:px-6 lg:px-20 py-12 grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
        <div className="grid gap-4 md:gap-10 items-start">
          <img
            alt="Artwork"
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
              by {artworkDetail.artist.firstName}{" "}
              {artworkDetail.artist.lastName}
            </p>
            <p>{artworkDetail.category.name}</p>
            <p className="font-semibold text-2xl">{artworkDetail.price} DH</p>
          </div>
          <div className="grid gap-4 text-sm leading-loose">
            {artworkDetail.description}
          </div>
          <Button size="lg">Add to Cart</Button>
        </div>
      </section>
    )
  );
};

export default ArtworkDetail;
