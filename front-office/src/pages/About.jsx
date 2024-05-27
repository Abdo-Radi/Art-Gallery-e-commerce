import about from "@/assets/img/about.jpg";
import alice from "@/assets/img/Alice-Johnson.jpg"
import michael from "@/assets/img/Michael-Brown.jpg"
import samanta from "@/assets/img/Samantha-Lee.jpeg"
import abdo from "@/assets/img/abdo.jpg"
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CardContent, Card } from "@/components/ui/card";

const About = () => {
    const [showTeam, setShowTeam] = useState(false);
    const teamRef = useRef(null);

    const scrollToTeam = () => {
        teamRef.current.scrollIntoView({ behavior: "smooth" });
    };

    const comments = [
        {
            name: "David Chang",
            comment: "Visiting this gallery was a truly inspiring experience. The collection is breathtaking, and the atmosphere is so welcoming.",
            image: alice,
        },
        {
            name: "Michael Brown",
            comment: "A hidden gem in the city! The staff is incredibly knowledgeable and friendly. I can't wait to come back.",
            image: michael,
        },
        {
            name: "Samantha Lee",
            comment: "An amazing gallery with a fantastic selection of artworks. It's a perfect place to spend an afternoon.",
            image: samanta,
        },
    ];

    return (
        <>
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 lg:px-20">
                    <div className="grid items-center gap-6 lg:grid-cols-[1fr_1fr] lg:gap-12 xl:grid-cols-[1fr_1fr]">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                                    About Our Gallery
                                </h1>
                                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                    At our art gallery, we are passionate about showcasing the
                                    incredible talent and creativity of artists from around the
                                    world. Our mission is to provide a platform for these artists
                                    to share their unique perspectives and to inspire and
                                    captivate our visitors.
                                </p>
                                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                    Founded in 2024, our gallery has hosted numerous exhibitions
                                    and has been a hub for art enthusiasts and collectors alike.
                                    We believe in the transformative power of art and strive to
                                    create an inclusive and welcoming space for all.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link
                                    to="/artworks"
                                    className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Explore Artworks
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowTeam(true);
                                        scrollToTeam();
                                    }}
                                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                                >
                                    Our Team
                                </button>
                            </div>
                        </div>
                        <img
                            alt="About Image"
                            className="mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last lg:w-[700px] lg:h-[500px]"
                            src={about}
                        />
                    </div>
                </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 lg:px-20">
                    <div className="space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                What Our Lovely Clients Say
                            </h2>
                            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                Hear from our satisfied visitors and clients.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {comments.map((comment, i) => (
                                <Card key={i} className="h-full w-full">
                                    <img
                                        alt={comment.name}
                                        className="aspect-[4/3] w-full overflow-hidden rounded-t-lg object-cover"
                                        height="300"
                                        src={comment.image}
                                        width="400"
                                    />
                                    <CardContent className="p-4">
                                        <h3 className="text-lg font-semibold">{comment.name}</h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {comment.comment}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section
                ref={teamRef}
                className={`w-full py-12 md:py-24 lg:py-32 ${showTeam ? "" : "hidden"}`}
            >
                <div className="container px-4 md:px-6 lg:px-20">
                    <div className="space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Our Team
                            </h2>
                            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                Meet the passionate individuals behind our gallery.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    name: "Abdellah Radi",
                                    role: "CEO",
                                    image: abdo,
                                },
                                {
                                    name: "Mohamed Elmahfoudi",
                                    role: "Manager",
                                    image: "path/to/mohamed_elmahfoudi.jpg",
                                },
                                {
                                    name: "Yassin Lajnaoudi",
                                    role: "Art Director",
                                    image: "path/to/yassin_lajnaoudi.jpg",
                                },
                            ].map((member, i) => (
                                <Card key={i} className="h-full w-full">
                                    <img
                                        alt={member.name}
                                        className="aspect-[4/3] w-full overflow-hidden rounded-t-lg object-cover"
                                        height="300"
                                        src={member.image}
                                        width="400"
                                    />
                                    <CardContent className="p-4">
                                        <h3 className="text-lg font-semibold">{member.name}</h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {member.role}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;
