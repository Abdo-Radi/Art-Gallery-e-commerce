import hero from "@/assets/img/hero.jpg";
import about from "@/assets/img/about.jpg";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getArtworks } from "@/redux/slices/artwork";
import { getExhibitions } from "@/redux/slices/exhibition";

const Home = () => {
  const dispatch = useDispatch();

  const { list: artworks } = useSelector((state) => state.artworks);
  const { list: exhibitions } = useSelector((state) => state.exhibitions);

  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    dispatch(getArtworks());
    dispatch(getExhibitions());
  }, [dispatch]);

  return (
    <main>
      {/* ——— Hero ——— */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-14 md:px-6 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow animate-fade-up">
              Contemporary art gallery — est. 2024
            </p>
            <h1
              className="mt-6 animate-fade-up font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              Where art finds
              <br />
              its <em className="not-italic text-klein">horizon</em>.
            </h1>
            <p
              className="mt-7 max-w-md animate-fade-up text-base leading-relaxed text-stone"
              style={{ animationDelay: "160ms" }}
            >
              Original works by living artists — to browse, to collect, and to
              stand in front of. Every piece ships from the gallery; every
              exhibition is open to you.
            </p>
            <div
              className="mt-10 flex animate-fade-up flex-wrap items-center gap-6"
              style={{ animationDelay: "240ms" }}
            >
              <Button asChild size="lg" className="px-8 text-[12px] font-semibold uppercase tracking-[0.15em]">
                <Link to="/artworks">Explore the gallery</Link>
              </Button>
              <Link
                to="/exhibitions"
                className="group text-[12px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:text-klein"
              >
                Current exhibitions
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>

          <figure className="animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="frame">
              <img
                alt="Featured artwork from the current collection"
                className="aspect-[4/5] w-full object-cover"
                src={hero}
              />
            </div>
            <figcaption className="mt-6 flex items-baseline justify-between">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-stone">
                From the current collection
              </span>
              <span className="font-display text-sm italic text-stone">
                Horizons, 2026
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ——— What we do ——— */}
      <section className="border-y border-line">
        <div className="mx-auto grid max-w-7xl divide-y divide-line px-4 md:px-6 lg:grid-cols-3 lg:divide-x lg:divide-y-0 lg:px-8">
          {[
            {
              title: "Original artworks",
              text: "One-of-a-kind pieces, straight off the gallery wall.",
            },
            {
              title: "Living artists",
              text: "Every sale supports the artist behind the work.",
            },
            {
              title: "Open exhibitions",
              text: "Book tickets online and see the collection in person.",
            },
          ].map((item) => (
            <div key={item.title} className="py-8 lg:px-10 lg:first:pl-0 lg:last:pr-0">
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ——— Featured artworks ——— */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
              Featured artworks
            </h2>
          </div>
          <Link
            to="/artworks"
            className="group hidden text-[12px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:text-klein sm:block"
          >
            View all
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.slice(0, 3).map((artwork) => (
            <Link
              key={artwork._id}
              to={`/artworks/${artwork._id}`}
              className="group block"
            >
              <div className="overflow-hidden border border-line bg-secondary">
                <img
                  alt={artwork.title}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  src={artwork.image}
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                <div>
                  <h3 className="font-display text-lg font-semibold italic transition-colors group-hover:text-klein">
                    {artwork.title}
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                    {artwork.artist?.firstName} {artwork.artist?.lastName}
                  </p>
                </div>
                <p className="whitespace-nowrap font-display text-lg tabular-nums">
                  {artwork.price} DH
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— The gallery ——— */}
      <section className="border-y border-line bg-secondary">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 md:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
          <div className="order-2 lg:order-1">
            <img
              alt="Inside the Horizons gallery"
              className="aspect-[16/11] w-full border border-line object-cover"
              src={about}
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow">The gallery</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              A room where
              <br />
              art can breathe.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-stone">
              We are passionate about showcasing the talent and creativity of
              artists from around the world — providing a platform for their
              unique perspectives, and an inclusive, welcoming space for
              everyone who walks in.
            </p>
            <Link
              to="/about"
              className="group mt-8 inline-block text-[12px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:text-klein"
            >
              Learn more
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Trending exhibitions ——— */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="eyebrow">On view</p>
            <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
              Trending exhibitions
            </h2>
          </div>
          <Link
            to="/exhibitions"
            className="group hidden text-[12px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:text-klein sm:block"
          >
            View all
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {exhibitions.slice(0, 3).map((exhibition) => (
            <Link
              key={exhibition._id}
              to={`/exhibitions/${exhibition._id}`}
              className="group block"
            >
              <div className="overflow-hidden border border-line bg-secondary">
                <img
                  alt={exhibition.name}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  src={exhibition.image}
                />
              </div>
              <div className="mt-5 border-t border-line pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                  {new Date(exhibition.date).toDateString()}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold italic transition-colors group-hover:text-klein">
                  {exhibition.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="bg-klein text-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-16 md:px-6 lg:flex-row lg:items-center lg:px-8">
          <h2 className="font-display text-3xl font-semibold leading-snug sm:text-4xl">
            Begin your collection —
            <br className="hidden sm:block" /> the wall is waiting.
          </h2>
          <Button
            asChild
            size="lg"
            className="bg-paper px-8 text-[12px] font-semibold uppercase tracking-[0.15em] text-ink hover:bg-paper/90"
          >
            <Link to="/artworks">Browse the collection</Link>
          </Button>
        </div>
      </section>

      {/* ——— Contact ——— */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
              Write to us.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-stone">
              A question about a piece, a visit, or a commission — we read
              everything and reply quickly.
            </p>
            <a
              className="mt-8 inline-block font-display text-lg italic text-klein underline-offset-4 hover:underline"
              href="mailto:support@artgallery.com"
            >
              support@artgallery.com
            </a>
          </div>
          <div>
            {messageSent && (
              <p className="mb-6 border border-klein/30 bg-klein/5 px-4 py-3 text-sm text-klein">
                Thank you for your message! We will get back to you soon.
              </p>
            )}
            <form
              className="grid gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                e.target.reset();
                setMessageSent(true);
              }}
            >
              <div className="grid gap-2">
                <Label
                  htmlFor="name"
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone"
                >
                  Name
                </Label>
                <Input id="name" placeholder="Your name" className="h-11 border-line bg-transparent" />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  className="h-11 border-line bg-transparent"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="message"
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's on your mind"
                  rows={5}
                  className="border-line bg-transparent"
                />
              </div>
              <Button
                className="h-11 w-full text-[12px] font-semibold uppercase tracking-[0.15em] sm:w-auto sm:justify-self-start sm:px-10"
                type="submit"
              >
                Send message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
