import React from "react";

function Footer() {
    return (
        <footer className="mt-10 bg-black text-white py-20">
            <div className="p-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-4xl font-bold">Nomadshell</h3>
                        <p className="text-lg mt-4">
                            Find great places to stay, swap homes and travel
                            better together.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-4xl font-bold">Contact</h3>
                        <p className="text-lg mt-4">
                            1234 Nomadshell St.
                            <br />
                            Nomadshell, NS 12345
                            <br />
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
