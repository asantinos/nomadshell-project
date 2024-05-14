import Footer from "@components/Footer";
import Gift from "@icons/gift";
import Button from "@components/Button";
import IconChip from "@components/IconChip";

function Home() {
    return (
        <>
            <main className="h-content">
                {/* MAIN BANNER */}
                <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 p-6 py-0 sm:py-3 gap-x-20">
                    <div>
                        <div className="text-5xl sm:text-7xl font-extrabold leading-tight">
                            <h2>Host.</h2>
                            <h2>Travel.</h2>
                            <h2>Relax.</h2>
                            <h2>Explore.</h2>
                        </div>
                        <p className="text-lg text-justify mt-8">
                            Find great places to stay, swap homes and travel
                            better together.
                        </p>
                        <p className="text-lg text-justify mt-4">
                            Nomadshell is a community of travelers and hosts who
                            believe that traveling shouldn't come at the expense
                            of living. We're here to help you find your next
                            adventure, wherever that may be.
                        </p>

                        <IconChip
                            background={"gradient-radial"}
                            icon={<Gift color="#000" size={24} />}
                        >
                            Get $50 off your first trip
                        </IconChip>

                        <div className="mt-8 flex justify-center sm:justify-start">
                            <Button
                                onClick={() => {
                                    window.location.href = "/signup";
                                }}
                                className="border-primary-dark bg-primary-dark hover:border-primary-light hover:bg-primary-light text-white font-bold"
                            >
                                Get Started
                            </Button>
                            <Button className="ml-4 border-gray-light text-gray-light hover:border-gray-dark hover:text-gray-dark">
                                Learn More
                            </Button>
                        </div>
                    </div>

                    <div className="hidden md:block h-banner-image overflow-hidden rounded-3xl">
                        <img
                            src="https://images.unsplash.com/photo-1671340525263-868bc444810b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Nomadshell Banner"
                            className="h-full w-full object-cover hover:scale-105 transition duration-500 ease"
                        />
                    </div>
                </section>

                {/* ADVANTAGES CARDS */}
                <section className="mt-10 bg-gray-lighter">
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="h-96 bg-neutral-200 rounded-2xl"></div>
                            <div className="h-96 bg-neutral-200 rounded-2xl"></div>
                            <div className="h-96 bg-neutral-200 rounded-2xl"></div>
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section className="mt-10">
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="text-center">
                            <h3 className="text-4xl font-bold">Testimonials</h3>
                            <p className="text-lg mt-4">
                                What our users are saying about Nomadshell
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="h-96 bg-neutral-200 rounded-2xl"></div>
                            <div className="h-96 bg-neutral-200 rounded-2xl"></div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-10 bg-gradient-radial text-center py-20">
                    <h3 className="text-4xl font-bold">
                        Ready to start your adventure?
                    </h3>
                    <p className="text-lg mt-4">
                        Join Nomadshell and start exploring the world today.
                    </p>
                    <button
                        onClick={() => {
                            window.location.href = "/signup";
                        }}
                        className="mt-8 border border-black hover:bg-black hover:text-white font-bold py-4 px-8 rounded-3xl transition duration-200 ease-in-out"
                    >
                        Get Started
                    </button>
                </section>

                {/* PROMOTED DESTINATIONS */}
                <section className="mt-10">
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="text-center">
                            <h3 className="text-4xl font-bold">
                                Promoted Destinations
                            </h3>
                            <p className="text-lg mt-4">
                                Check out some of our favorite destinations
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="h-96 bg-neutral-200 rounded-2xl"></div>
                            <div className="h-96 bg-neutral-200 rounded-2xl"></div>
                            <div className="h-96 bg-neutral-200 rounded-2xl"></div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}

export default Home;
