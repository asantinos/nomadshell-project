import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionItem } from "@nextui-org/react";
import axios from "axios";
import Chart from "react-apexcharts";

const Nomadpoints = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [nomadPoints, setNomadPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/users/all")
            .then((res) => {
                setUsers(res.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setIsLoading(false);
            });
    }, []);

    // Sum up nomad points from all users
    useEffect(() => {
        if (users.length > 0) {
            const totalNomadPoints = users.reduce(
                (acc, user) => acc + user.nomadPoints,
                0
            );
            setNomadPoints(totalNomadPoints);
        }
    }, [users]);

    // Pie Chart
    const [nomadPointsData, setNomadPointsData] = useState([]);

    useEffect(() => {
        if (users.length > 0) {
            const pointsByPlanType = users.reduce((acc, user) => {
                acc[user.planType] =
                    (acc[user.planType] || 0) + user.nomadPoints;
                return acc;
            }, {});
            setNomadPointsData(Object.entries(pointsByPlanType));
        }
    }, [users]);

    // Pie Chart options
    const pieChartOptions = {
        labels: nomadPointsData.map(
            ([type]) => type.charAt(0).toUpperCase() + type.slice(1)
        ),
        legend: {
            position: "right",
        },
    };

    // Pie Chart series
    const pieChartSeries = nomadPointsData.map(([_, count]) => count);

    return (
        <>
            <h1 className="text-3xl font-bold">Nomad Points</h1>

            <div>
                <div className="grid grid-cols-1 mt-4 md:mt-8">
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Total NP
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {nomadPoints.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-2 md:mt-4">
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Free NP
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {users
                                .reduce(
                                    (acc, user) =>
                                        user.planType === "free"
                                            ? acc + user.nomadPoints
                                            : acc,
                                    0
                                )
                                .toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Explorers NP
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {users
                                .reduce(
                                    (acc, user) =>
                                        user.planType === "explorer"
                                            ? acc + user.nomadPoints
                                            : acc,
                                    0
                                )
                                .toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Adventurers NP
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {users
                                .reduce(
                                    (acc, user) =>
                                        user.planType === "adventurer"
                                            ? acc + user.nomadPoints
                                            : acc,
                                    0
                                )
                                .toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Nomads NP
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {users
                                .reduce(
                                    (acc, user) =>
                                        user.planType === "nomad"
                                            ? acc + user.nomadPoints
                                            : acc,
                                    0
                                )
                                .toLocaleString()}
                        </p>
                    </div>
                </div>

                <Accordion
                    defaultExpandedKeys={["1"]}
                    className="mt-4 border rounded-3xl px-4"
                >
                    <AccordionItem
                        key="1"
                        aria-label="Charts"
                        open
                        title={
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Nomad Points by Plan Type Distribution
                                </h2>
                            </div>
                        }
                    >
                        <Chart
                            options={pieChartOptions}
                            series={pieChartSeries}
                            type="pie"
                            width="100%"
                            height="300"
                        />
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    );
};

export default Nomadpoints;
