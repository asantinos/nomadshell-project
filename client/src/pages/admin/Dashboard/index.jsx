import React from "react";
import { useParams } from "react-router-dom";

import Users from "@pages/admin/Dashboard/Users";
import Homes from "@pages/admin/Dashboard/Homes";

import Sidebar from "@components/Dashboard/Sidebar";
import Footer from "@components/Footer";

function Dashboard() {
    let { section } = useParams();

    let content;
    switch (section) {
        case "users":
            content = <Users />;
            break;
        case "homes":
            content = <Homes />;
            break;
        default:
            content = <Users />;
    }

    return (
        <>
            <main className="h-auto pt-header">
                <section>
                    <div className="p-6 max-w-7xl mx-auto">
                        <div className="flex gap-8 md:gap-16">
                            <Sidebar />

                            <div className="flex-1">{content}</div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Dashboard;
