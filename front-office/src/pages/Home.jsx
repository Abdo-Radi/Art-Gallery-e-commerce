import hero from "@/assets/img/hero.jpg";
import about from "@/assets/img/about.jpg";
import { Link } from "react-router-dom";
import { CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getArtworks } from "@/redux/slices/artwork";
import { getExhibitions } from "@/redux/slices/exhibition";

const Home = () => {
  const dispatch = useDispatch();

  const { list: artworks } = useSelector((state) => state.artworks);
  const { list: exhibitions } = useSelector((state) => state.exhibitions);

  useEffect(() => {
    dispatch(getArtworks());
    dispatch(getExhibitions());
  }, []);
  return (
    <main>
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 lg:px-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_450px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Discover the Beauty of Art
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Immerse yourself in a world of captivating artworks, where
                  creativity and emotion come together to inspire and captivate.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link className="inline-flex h-10 items-center justify-center rounded-md  px-8 text-sm font-medium  shadow transition-colors bg-primary text-primary-foreground hover:bg-primary/90  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
                  Explore Gallery
                </Link>
                <Link className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300">
                  Learn More
                </Link>
              </div>
            </div>
            <img
              alt="Hero Image"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              height="450"
              src={hero}
              width="450"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 lg:px-20">
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Featured Artworks
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover our curated selection of stunning artworks from
                talented artists.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artworks.slice(0, 3).map((artwork, i) => (
                <Card key={i} className="h-full w-full">
                  <img
                    alt="Artwork 1"
                    className="aspect-[4/3] w-full overflow-hidden rounded-t-lg object-cover"
                    height="300"
                    src={artwork.image}
                    width="400"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{artwork.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      by {artwork.artist.firstName} {artwork.artist.lastName}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 lg:px-20">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  About Our Gallery
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  At our art gallery, we are passionate about showcasing the
                  incredible talent and creativity of artists from around the
                  world. Our mission is to provide a platform for these artists
                  to share their unique perspectives and to inspire and
                  captivate our visitors.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link className="inline-flex h-10 items-center justify-center rounded-md  px-8 text-sm font-medium  shadow transition-colors bg-primary text-primary-foreground hover:bg-primary/90  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
                  Learn More
                </Link>
                <Link className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300">
                  Contact Us
                </Link>
              </div>
            </div>
            <img
              alt="About Image"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="310"
              src={about}
              width="550"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 lg:px-20">
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Trending Exhibitions
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Check out our latest and most popular art exhibitions.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exhibitions.slice(0, 3).map((exhibition, i) => (
                <Card key={i} className="h-full w-full">
                  <img
                    alt="Artwork 1"
                    className="aspect-[4/3] w-full overflow-hidden rounded-t-lg object-cover"
                    height="300"
                    src={exhibition.image}
                    width="400"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{exhibition.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {new Date(exhibition.date).toDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 lg:px-20">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Explore Our Full Collection
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Browse our extensive collection of unique and captivating
                artworks from talented artists around the world.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium  shadow transition-colors bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              href="#"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6 lg:px-20">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Contact Us
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Get in touch with us for any inquiries or to learn more about
                our gallery and upcoming events.
              </p>
            </div>
            <div className="w-full max-w-md">
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter your message" />
                </div>
                <Button className="w-full" type="submit">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
