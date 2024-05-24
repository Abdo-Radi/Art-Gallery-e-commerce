import Hero from "../../components/customer/Hero";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getArtworks } from "../../redux/slices/artwork";
import { getExhibitions } from "../../redux/slices/exhibition";
import Contact from "../../components/customer/Contact";

const Home = () => {
  const dispatch = useDispatch();
  const { list: artworks } = useSelector((state) => state.artworks);

  const { list: exhibitions } = useSelector((state) => state.exhibitions);

  useEffect(() => {
    dispatch(getArtworks());
    dispatch(getExhibitions());
  }, []);

  return (
    <main className="px-8 lg:px-24 text-black">
      <Hero />
      <hr className="my-12 h-0.5 border-t-0 bg-stroke" />
      <section>
        <h1 className="mb-5 text-title-lg font-medium">Latest artworks</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {artworks.slice(0, 4).map((artwork, i) => (
            <div key={i} className="bg-white">
              <img src={artwork.image} alt="" />
              <div className="p-3">
                <p>{artwork.title}</p>
                <p className="text-body">
                  {artwork.artist.firstName} {artwork.artist.lastName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <hr className="my-12 h-0.5 border-t-0 bg-stroke" />
      <section>
        <h1 className="mb-5 text-title-lg font-medium">Trending exhibitions</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {exhibitions.slice(0, 4).map((exhibition, i) => (
            <div key={i} className="flex flex-col space-y-2 bg-white p-3">
              <p className="font-medium text-">{exhibition.name}</p>
              <p>{exhibition.description}</p>
              <p className="text-body">
                {new Date(exhibition.date).toDateString()}
              </p>
              <button className="w-36 bg-primary text-white py-2 px-4">
                Buy Tickets
              </button>
            </div>
          ))}
        </div>
      </section>
      <hr className="my-12 h-0.5 border-t-0 bg-stroke" />
      <Contact />
    </main>
  );
};

export default Home;
