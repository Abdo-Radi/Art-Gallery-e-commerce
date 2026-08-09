import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  clearExhibitionDetail,
  getExhibitionById,
  getExhibitions,
} from "@/redux/slices/exhibition";
import { getArtworks } from "@/redux/slices/artwork";
import { addItemToCart } from "@/redux/slices/cart";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*
  Gallery-wide copy. These are not per-exhibition fields in the database —
  edit them here to match the real venue.
*/
const GALLERY = {
  hours: "Open daily, 10:00 — 19:00",
  addressLines: ["Horizons Gallery", "Boulevard Mohammed V", "Casablanca"],
  accessibility: "Step-free access throughout the ground floor.",
  email: "support@artgallery.com",
};

const FAQS = [
  {
    q: "Do I need to book in advance?",
    a: "Tickets are limited per exhibition, and popular shows sell out. Booking online guarantees your entry and is the fastest way in on the day.",
  },
  {
    q: "How do I show my ticket at the door?",
    a: "Your booking is attached to your Horizons account. Sign in at the entrance desk and our team will find it for you.",
  },
  {
    q: "Can I buy tickets for more than one person?",
    a: "Yes. Add the exhibition to your cart, then increase the quantity from the cart page before checking out.",
  },
  {
    q: "Can I take photographs?",
    a: "Photography without flash is welcome in all our exhibition rooms, for personal use. Tripods and commercial shoots need prior approval.",
  },
  {
    q: "Are the artworks on view for sale?",
    a: "Many are. Anything currently available to collect is listed in the online collection, with the price shown on the artwork's page.",
  },
];

const LOW_STOCK_THRESHOLD = 20;

const labelCls =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-stone";

const ExhibitionDetail = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const { exhibitionDetail, list: exhibitions } = useSelector(
    (state) => state.exhibitions
  );
  const { list: artworks } = useSelector((state) => state.artworks);
  const { data: userData } = useSelector((state) => state.currentUser);

  useEffect(() => {
    dispatch(getExhibitionById(id));
    return () => {
      dispatch(clearExhibitionDetail());
    };
  }, [dispatch, id]);

  // Feeds the "Other exhibitions" and "Also from the gallery" sections.
  useEffect(() => {
    dispatch(getExhibitions());
    dispatch(getArtworks());
  }, [dispatch]);

  const showToastMessage = (message) => {
    toast(message, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const addToCart = () => {
    if (!userData) {
      showToastMessage("Please login to buy tickets!");
      return;
    }
    dispatch(
      addItemToCart({
        customer: userData._id,
        product: id,
        productType: "Exhibition",
        quantity: 1,
      })
    ).then((res) => {
      showToastMessage(
        res.payload?.message ?? res.payload ?? "Something went wrong"
      );
    });
  };

  if (!exhibitionDetail) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 md:px-6 lg:px-8">
        <p className="font-display text-lg italic text-stone">
          Loading exhibition…
        </p>
        <ToastContainer />
      </div>
    );
  }

  /* ——— Derived from the exhibition's own data ——— */

  const eventDate = new Date(exhibitionDetail.date);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfEvent = new Date(eventDate);
  startOfEvent.setHours(0, 0, 0, 0);
  const daysUntil = Math.round((startOfEvent - startOfToday) / 86400000);

  const status =
    daysUntil > 0
      ? {
          text: daysUntil === 1 ? "Opens tomorrow" : `Opens in ${daysUntil} days`,
          tone: "upcoming",
        }
      : daysUntil === 0
      ? { text: "On view today", tone: "today" }
      : { text: "Past exhibition", tone: "past" };

  const statusCls =
    status.tone === "past"
      ? "border-stone/30 text-stone"
      : "border-klein/40 bg-klein/5 text-klein";

  // Typeset the first sentence as an editorial lead-in — the gallery's own
  // words, just at a larger size.
  const [lead, ...restSentences] = String(exhibitionDetail.description).split(
    /(?<=\.)\s+/
  );
  const body = restSentences.join(" ");

  const soldOut = exhibitionDetail.quantity <= 0;
  const lowStock = !soldOut && exhibitionDetail.quantity <= LOW_STOCK_THRESHOLD;

  const otherExhibitions = exhibitions
    .filter((exhibition) => exhibition._id !== id)
    .slice(0, 3);

  const collectionArtworks = artworks.slice(0, 3);

  const visitInfo = [
    {
      label: "Date",
      value: eventDate.toDateString(),
      note: status.text,
    },
    {
      label: "Opening hours",
      value: GALLERY.hours,
      note: "Last entry 30 minutes before closing",
    },
    {
      label: "Admission",
      value: `${exhibitionDetail.price} DH`,
      note: soldOut
        ? "Sold out"
        : `${exhibitionDetail.quantity} tickets remaining`,
    },
    {
      label: "Getting here",
      value: GALLERY.addressLines.join(", "),
      note: GALLERY.accessibility,
    },
  ];

  /* ——— Add to calendar (.ics, no dependency) ——— */

  const addToCalendar = () => {
    const pad = (n) => String(n).padStart(2, "0");
    const asDay = (d) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const escape = (text = "") =>
      String(text)
        .replace(/([,;\\])/g, "\\$1")
        .replace(/\n/g, "\\n");

    const dayAfter = new Date(startOfEvent);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Horizons Gallery//Exhibitions//EN",
      "BEGIN:VEVENT",
      `UID:${exhibitionDetail._id}@horizons-gallery`,
      `DTSTAMP:${asDay(new Date())}T000000Z`,
      `DTSTART;VALUE=DATE:${asDay(startOfEvent)}`,
      `DTEND;VALUE=DATE:${asDay(dayAfter)}`,
      `SUMMARY:${escape(exhibitionDetail.name)} — Horizons Gallery`,
      `DESCRIPTION:${escape(exhibitionDetail.description)}`,
      `LOCATION:${escape(GALLERY.addressLines.join(", "))}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const url = URL.createObjectURL(
      new Blob([ics], { type: "text/calendar;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exhibitionDetail.name.replace(/[^\w-]+/g, "-")}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* ——— Hero ——— */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-20">
        <Link
          to="/exhibitions"
          className="group text-[11px] font-semibold uppercase tracking-[0.18em] text-stone transition-colors hover:text-klein"
        >
          <span className="mr-2 inline-block transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back to exhibitions
        </Link>

        <div className="mt-10 grid items-start gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <figure>
            <div className="frame">
              <img
                alt={exhibitionDetail.name}
                className="aspect-[4/3] w-full object-cover"
                src={exhibitionDetail.image}
              />
            </div>
            <figcaption className="mt-6 font-display text-sm italic text-stone">
              {exhibitionDetail.name}, {eventDate.getFullYear()}
            </figcaption>
          </figure>

          <div className="lg:sticky lg:top-24">
            <div className="flex flex-wrap items-center gap-4">
              <p className="eyebrow">Exhibition</p>
              <span
                className={`border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusCls}`}
              >
                {status.text}
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold italic leading-tight sm:text-5xl">
              {exhibitionDetail.name}
            </h1>
            <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-stone">
              {eventDate.toDateString()}
            </p>

            {/* The description is typeset in full in the "About" section below. */}

            {/* Museum label */}
            <dl className="mt-10 border-t border-line">
              <div className="flex items-baseline justify-between border-b border-line py-3.5">
                <dt className={labelCls}>Date</dt>
                <dd className="text-sm">{eventDate.toDateString()}</dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-line py-3.5">
                <dt className={labelCls}>Tickets left</dt>
                <dd className="text-sm tabular-nums">
                  {exhibitionDetail.quantity}
                  {lowStock && (
                    <span className="ml-2 text-klein">Selling fast</span>
                  )}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-line py-3.5">
                <dt className={labelCls}>Ticket price</dt>
                <dd className="text-sm tabular-nums">
                  {exhibitionDetail.price} DH
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-8">
              <p className="font-display text-4xl tabular-nums">
                {exhibitionDetail.price} <span className="text-2xl">DH</span>
              </p>
              <Button
                size="lg"
                onClick={addToCart}
                disabled={soldOut}
                className="px-10 text-[12px] font-semibold uppercase tracking-[0.15em]"
              >
                {soldOut ? "Sold out" : "Book a ticket"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ——— About the exhibition ——— */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-20">
            <div>
              <p className="eyebrow">About</p>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                The exhibition
              </h2>
            </div>
            <div className="max-w-prose">
              <p className="font-display text-2xl font-semibold leading-snug sm:text-[28px]">
                {lead}
              </p>
              {body && (
                <p className="mt-6 text-base leading-relaxed text-stone">
                  {body}
                </p>
              )}
              <p className="mt-6 text-base leading-relaxed text-stone">
                Shown at Horizons from {eventDate.toDateString()}.{" "}
                {GALLERY.hours}. Tickets are {exhibitionDetail.price} DH and can
                be booked online or bought at the door while they last.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Plan your visit ——— */}
      <section className="border-t border-line bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Practical</p>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                Plan your visit
              </h2>
            </div>
            <Button
              variant="outline"
              onClick={addToCalendar}
              className="h-11 border-stone/30 px-6 text-[11px] font-semibold uppercase tracking-[0.18em] hover:border-klein hover:text-klein"
            >
              Add to calendar
            </Button>
          </div>

          <dl className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {visitInfo.map((info) => (
              <div key={info.label} className="bg-paper p-7">
                <dt className={labelCls}>{info.label}</dt>
                <dd className="mt-3 font-display text-lg font-semibold leading-snug">
                  {info.value}
                </dd>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  {info.note}
                </p>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-sm text-stone">
            Questions before you come?{" "}
            <a
              className="text-klein underline-offset-4 hover:underline"
              href={`mailto:${GALLERY.email}`}
            >
              {GALLERY.email}
            </a>
          </p>
        </div>
      </section>

      {/* ——— Visitor FAQ ——— */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-20">
            <div>
              <p className="eyebrow">Good to know</p>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                Visitor questions
              </h2>
            </div>
            <div className="border-t border-line">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-8 py-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-lg font-semibold">
                      {faq.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative h-4 w-4 shrink-0 text-klein"
                    >
                      <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="max-w-prose pb-5 text-sm leading-relaxed text-stone">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Also from the gallery ——— */}
      {collectionArtworks.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-24">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Take something home</p>
                <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                  Also from the gallery
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">
                  Original works available to collect right now.
                </p>
              </div>
              <Link
                to="/artworks"
                className="group hidden shrink-0 text-[12px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:text-klein sm:block"
              >
                All artworks
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {collectionArtworks.map((artwork) => (
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
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg font-semibold italic transition-colors group-hover:text-klein">
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
          </div>
        </section>
      )}

      {/* ——— Other exhibitions ——— */}
      {otherExhibitions.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-24">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Keep looking</p>
                <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                  Other exhibitions
                </h2>
              </div>
              <Link
                to="/exhibitions"
                className="group hidden shrink-0 text-[12px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:text-klein sm:block"
              >
                View all
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {otherExhibitions.map((exhibition) => (
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
                    <div className="mt-1 flex items-baseline justify-between gap-4">
                      <h3 className="truncate font-display text-lg font-semibold italic transition-colors group-hover:text-klein">
                        {exhibition.name}
                      </h3>
                      <p className="whitespace-nowrap font-display text-lg tabular-nums">
                        {exhibition.price} DH
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— Booking CTA ——— */}
      <section className="bg-klein text-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-16 md:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold leading-snug sm:text-4xl">
              {soldOut
                ? "This one is sold out."
                : `See ${exhibitionDetail.name} in person.`}
            </h2>
            <p className="mt-3 text-paper/70">
              {soldOut
                ? "Browse our other exhibitions — there is always something on the walls."
                : `${exhibitionDetail.quantity} tickets left at ${exhibitionDetail.price} DH each.`}
            </p>
          </div>
          {soldOut ? (
            <Button
              asChild
              size="lg"
              className="shrink-0 bg-paper px-8 text-[12px] font-semibold uppercase tracking-[0.15em] text-ink hover:bg-paper/90"
            >
              <Link to="/exhibitions">See what else is on</Link>
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={addToCart}
              className="shrink-0 bg-paper px-8 text-[12px] font-semibold uppercase tracking-[0.15em] text-ink hover:bg-paper/90"
            >
              Book a ticket
            </Button>
          )}
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default ExhibitionDetail;
