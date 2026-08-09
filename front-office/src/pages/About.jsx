import about from "@/assets/img/about.jpg";
import alice from "@/assets/img/Alice-Johnson.jpg";
import michael from "@/assets/img/Michael-Brown.jpg";
import samanta from "@/assets/img/Samantha-Lee.jpeg";
import abdo from "@/assets/img/abdo.jpg";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Neutral SVG avatar for team members without a photo.
const placeholderAvatar = (initials) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="400" height="500" fill="#E7E4DC"/><circle cx="200" cy="190" r="70" fill="#A3A29F"/><path d="M60 500c0-80 62-130 140-130s140 50 140 130" fill="#A3A29F"/><text x="200" y="470" font-family="Georgia, serif" font-style="italic" font-size="36" fill="#FBFAF7" text-anchor="middle">${initials}</text></svg>`
    )}`;

const About = () => {
    const [showTeam, setShowTeam] = useState(false);
    const teamRef = useRef(null);

    // Scroll after the section is actually visible: scrollIntoView on a
    // display:none element is a no-op, so it must run post-render.
    useEffect(() => {
        if (showTeam && teamRef.current) {
            teamRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [showTeam]);

    const comments = [
        {
            name: "Alice Johnson",
            comment:
                "Visiting this gallery was a truly inspiring experience. The collection is breathtaking, and the atmosphere is so welcoming.",
            image: alice,
        },
        {
            name: "Michael Brown",
            comment:
                "A hidden gem in the city! The staff is incredibly knowledgeable and friendly. I can't wait to come back.",
            image: michael,
        },
        {
            name: "Samantha Lee",
            comment:
                "An amazing gallery with a fantastic selection of artworks. It's a perfect place to spend an afternoon.",
            image: samanta,
        },
    ];

    return (
        <main>
            {/* ——— Statement ——— */}
            <section className="mx-auto max-w-7xl px-4 pb-20 pt-14 md:px-6 lg:px-8 lg:pb-28 lg:pt-20">
                <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
                    <div>
                        <p className="eyebrow">About the gallery</p>
                        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.08] sm:text-6xl">
                            Founded for artists.
                            <br />
                            Open to <em className="not-italic text-klein">everyone</em>.
                        </h1>
                        <div className="mt-8 max-w-md space-y-5 text-base leading-relaxed text-stone">
                            <p>
                                At Horizons, we are passionate about showcasing the incredible
                                talent and creativity of artists from around the world. Our
                                mission is to provide a platform for these artists to share
                                their unique perspectives — and to inspire and captivate our
                                visitors.
                            </p>
                            <p>
                                Founded in 2024, the gallery has hosted numerous exhibitions
                                and become a hub for art enthusiasts and collectors alike. We
                                believe in the transformative power of art, and strive to
                                create an inclusive, welcoming space for all.
                            </p>
                        </div>
                        <div className="mt-10 flex flex-wrap items-center gap-6">
                            <Button asChild size="lg" className="px-8 text-[12px] font-semibold uppercase tracking-[0.15em]">
                                <Link to="/artworks">Explore artworks</Link>
                            </Button>
                            <button
                                onClick={() => {
                                    setShowTeam(true);
                                    teamRef.current?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="group text-[12px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:text-klein"
                            >
                                Meet the team
                                <span className="ml-2 inline-block transition-transform group-hover:translate-y-1">
                                    ↓
                                </span>
                            </button>
                        </div>
                    </div>
                    <figure>
                        <div className="frame">
                            <img
                                alt="Inside the Horizons gallery"
                                className="aspect-[4/3] w-full object-cover"
                                src={about}
                            />
                        </div>
                        <figcaption className="mt-6 font-display text-sm italic text-stone">
                            The main room, Horizons gallery
                        </figcaption>
                    </figure>
                </div>
            </section>

            {/* ——— Visitors ——— */}
            <section className="border-y border-line bg-secondary/50">
                <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-24">
                    <p className="eyebrow">Guest book</p>
                    <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
                        What our visitors say
                    </h2>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {comments.map((comment) => (
                            <figure
                                key={comment.name}
                                className="flex flex-col justify-between border border-line bg-paper p-8"
                            >
                                <blockquote className="font-display text-lg italic leading-relaxed">
                                    “{comment.comment}”
                                </blockquote>
                                <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-5">
                                    <img
                                        alt={comment.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={comment.image}
                                    />
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                                        {comment.name}
                                    </span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ——— Team ——— */}
            <section
                ref={teamRef}
                className={`mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8 lg:py-28 ${
                    showTeam ? "" : "hidden"
                }`}
            >
                <p className="eyebrow">The people</p>
                <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
                    Our team
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">
                    The passionate individuals behind the gallery.
                </p>
                <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            name: "Abdellah Radi",
                            role: "CEO",
                            image: abdo,
                        },
                        {
                            name: "Mohamed Elmahfoudi",
                            role: "Manager",
                            image: placeholderAvatar("ME"),
                        },
                        {
                            name: "Yassin Lajnaoudi",
                            role: "Art Director",
                            image: placeholderAvatar("YL"),
                        },
                    ].map((member) => (
                        <div key={member.name} className="group">
                            <div className="overflow-hidden border border-line bg-secondary">
                                <img
                                    alt={member.name}
                                    className="aspect-[4/5] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                                    src={member.image}
                                />
                            </div>
                            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
                                <h3 className="font-display text-lg font-semibold">
                                    {member.name}
                                </h3>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-klein">
                                    {member.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default About;
