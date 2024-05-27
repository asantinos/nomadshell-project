import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    Pagination,
    Chip,
    Tooltip,
    Accordion,
    AccordionItem,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import axios from "axios";
import Chart from "react-apexcharts";

import EyeOpen from "@icons/eye-open";
import DeleteButton from "@components/Button/DeleteButton";
import AddButton from "@components/Button/AddButton";

import Pencil from "@icons/pencil";
import Search from "@icons/search";

const Bookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [selectedBookings, setSelectedBookings] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const pages = Math.ceil(bookings.length / rowsPerPage);

    const list = useAsyncList({
        async load() {
            try {
                const response = await axios.get("/api/bookings/all");
                setBookings(response.data);
                setIsLoading(false);
                return { items: response.data };
            } catch (error) {
                console.error(error);
            }
        },
        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a, b) => {
                    let first = a[sortDescriptor.column];
                    let second = b[sortDescriptor.column];
                    let cmp =
                        (parseInt(first) || first) <
                        (parseInt(second) || second)
                            ? -1
                            : 1;

                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1;
                    }

                    return cmp;
                }),
            };
        },
    });

    const filteredBookings = useMemo(() => {
        if (!searchQuery) {
            return list.items;
        }

        return list.items.filter(
            (booking) =>
                booking.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                booking.owner.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                booking.owner.surname
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
    }, [list.items, searchQuery]);

    const paginationBookings = useMemo(() => {
        return filteredBookings.slice(
            (page - 1) * rowsPerPage,
            page * rowsPerPage
        );
    }, [filteredBookings, page]);

    const handleDeleteSelected = () => {
        try {
            const bookingsIdsToDelete = Array.from(selectedBookings);

            bookingsIdsToDelete.forEach(async (bookingId) => {
                await axios.delete(`/api/bookings/delete/${bookingId}`);

                setBookings((prevBookings) => {
                    return prevBookings.filter(
                        (booking) => booking._id !== bookingId
                    );
                });

                setSelectedBookings(new Set());
                list.reload();
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Pie Chart
    // const [planTypeData, setPlanTypeData] = useState([]);

    // useEffect(() => {
    //     const type = bookings.map((booking) => booking.type);
    //     const counts = {};
    //     type.forEach((type) => {
    //         counts[type] = (counts[type] || 0) + 1;
    //     });
    //     setPlanTypeData(Object.entries(counts));
    // }, [bookings]);

    // // Pie Chart options
    // const pieChartOptions = {
    //     labels: planTypeData.map(
    //         ([type]) => type.charAt(0).toUpperCase() + type.slice(1)
    //     ),
    //     legend: {
    //         position: "right",
    //     },
    // };

    // // Pie Chart series
    // const pieChartSeries = planTypeData.map(([_, count]) => count);

    return (
        <>
            <h1 className="text-3xl font-bold">Bookings</h1>

            <div>
                <div className="grid grid-cols-1 mt-4 md:mt-8">
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Total Bookings
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {bookings.length}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2 md:gap-4 mt-2 md:mt-4">
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Apartment
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {
                                bookings.filter(
                                    (booking) => booking.type === "Apartment"
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Farmhouse
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {
                                bookings.filter(
                                    (booking) => booking.type === "Farmhouse"
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Bungalow
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {
                                bookings.filter(
                                    (booking) => booking.type === "Bungalow"
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Cottage
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {
                                bookings.filter(
                                    (booking) => booking.type === "Cottage"
                                ).length
                            }
                        </p>
                    </div>
                </div>

                {/* <Accordion className="mt-4 border rounded-3xl px-4">
                    <AccordionItem
                        key="1"
                        aria-label="Charts"
                        title={
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Bookings Type Distribution
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
                </Accordion> */}
            </div>

            <h2 className="text-lg font-semibold mt-8">All Bookings</h2>

            <div className="flex items-center justify-between mt-4">
                <div className="relative w-64">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by home or user"
                        className="border rounded-2xl p-2 pl-10 placeholder:text-sm"
                    />
                    <Search
                        size={20}
                        color="gray"
                        className="absolute top-3 left-3"
                    />
                </div>

                <div>
                    <DeleteButton
                        className={`${
                            selectedBookings.size === 0 ? "hidden" : ""
                        }`}
                        onClick={() => {
                            handleDeleteSelected();
                        }}
                    />
                </div>
            </div>

            <Table
                aria-label="Bookings Table"
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
                selectionMode="multiple"
                color="default"
                selectedKeys={selectedBookings}
                onSelectionChange={setSelectedBookings}
                className="mt-2"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="default"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
            >
                <TableHeader>
                    <TableColumn
                        key="user"
                        allowsSorting
                        className="uppercase font-bold"
                    >
                        User
                    </TableColumn>
                    <TableColumn
                        key="home"
                        allowsSorting
                        className="hidden md:table-cell
                            uppercase font-bold"
                    >
                        Home
                    </TableColumn>
                    <TableColumn
                        key="checkIn"
                        allowsSorting
                        className="hidden md:table-cell uppercase font-bold"
                    >
                        Check In
                    </TableColumn>
                    <TableColumn
                        key="checkOut"
                        allowsSorting
                        className="hidden md:table-cell uppercase font-bold"
                    >
                        Check Out
                    </TableColumn>
                    <TableColumn
                        key="totalPrice"
                        allowsSorting
                        className="hidden md:table-cell uppercase font-bold"
                    >
                        Total Price
                    </TableColumn>
                </TableHeader>
                <TableBody
                    items={paginationBookings}
                    isLoading={isLoading}
                    loadingState={<Spinner label="Loading..." />}
                    emptyContent="No bookings found"
                >
                    {(booking) => (
                        <TableRow key={booking._id}>
                            <TableCell className="hidden md:table-cell">
                                {booking.user.name}
                            </TableCell>
                            <TableCell>{booking.home.title}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                {booking.checkIn}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {booking.checkOut}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {booking.totalPrice}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
};

export default Bookings;
