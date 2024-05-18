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

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const pages = Math.ceil(users.length / rowsPerPage);

    const list = useAsyncList({
        async load() {
            try {
                const response = await axios.get("/api/users/all");
                setUsers(response.data);
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

    const filteredUsers = useMemo(() => {
        if (!searchQuery) {
            return list.items;
        }

        return list.items.filter(
            (user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.surname
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [list.items, searchQuery]);

    const paginationUsers = useMemo(() => {
        return filteredUsers.slice(
            (page - 1) * rowsPerPage,
            page * rowsPerPage
        );
    }, [filteredUsers, page]);

    const handleDeleteSelected = () => {
        try {
            const usersIdsToDelete = Array.from(selectedUsers);

            usersIdsToDelete.forEach(async (userId) => {
                await axios.delete(`/api/users/delete/${userId}`);

                setUsers((prevUsers) => {
                    return prevUsers.filter((user) => user._id !== userId);
                });

                setSelectedUsers(new Set());
                list.reload();
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Pie Chart
    const [planTypeData, setPlanTypeData] = useState([]);

    useEffect(() => {
        const planTypes = users.map((user) => user.planType);
        const counts = {};
        planTypes.forEach((type) => {
            counts[type] = (counts[type] || 0) + 1;
        });
        setPlanTypeData(Object.entries(counts));
    }, [users]);

    // Pie Chart options
    const pieChartOptions = {
        labels: planTypeData.map(
            ([type]) => type.charAt(0).toUpperCase() + type.slice(1)
        ),
        colors: ["#6610f2", "#f5a623", "#007bff", "#00b74a"],
        legend: {
            position: "right",
        },
    };

    // Pie Chart series
    const pieChartSeries = planTypeData.map(([_, count]) => count);

    return (
        <>
            <h1 className="text-3xl font-bold">Users</h1>

            <div>
                <div className="grid grid-cols-2 gap-2 md:gap-4 mt-4 md:mt-8">
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Total Users
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {users.length}
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Total Admins
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {
                                users.filter((user) => user.role === "admin")
                                    .length
                            }
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2 md:gap-4 mt-2 md:mt-4">
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Free
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {
                                users.filter((user) => user.planType === "free")
                                    .length
                            }
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Explorer
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {
                                users.filter(
                                    (user) => user.planType === "explorer"
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Adventurer
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {
                                users.filter(
                                    (user) => user.planType === "adventurer"
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-4">
                        <h2 className="text-sm md:text-lg font-semibold truncate">
                            Nomad
                        </h2>
                        <p className="text-2xl md:text-3xl font-bold">
                            {
                                users.filter(
                                    (user) => user.planType === "nomad"
                                ).length
                            }
                        </p>
                    </div>
                </div>

                <Accordion className="mt-4 border rounded-3xl px-4">
                    <AccordionItem
                        key="1"
                        aria-label="Charts"
                        title={
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    User Type Plan Distribution
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

            <h2 className="text-lg font-semibold mt-8">All Users</h2>

            <div className="flex items-center justify-between mt-4">
                <div className="relative w-64">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email"
                        className="border rounded-2xl p-2 pl-10 placeholder:text-sm"
                    />
                    <Search
                        size={20}
                        color="gray"
                        className="absolute top-3 left-3"
                    />
                </div>

                <div className="flex gap-2">
                    <AddButton
                        textA="User"
                        onClick={() => {
                            navigate("/dashboard/users/add");
                        }}
                    />

                    <DeleteButton
                        className={`${
                            selectedUsers.size === 0 ? "hidden" : ""
                        }`}
                        onClick={() => {
                            handleDeleteSelected();
                        }}
                    />
                </div>
            </div>

            <Table
                aria-label="Users Table"
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
                selectionMode="multiple"
                color="default"
                selectedKeys={selectedUsers}
                onSelectionChange={setSelectedUsers}
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
                        key="name"
                        allowsSorting
                        className="uppercase font-bold"
                    >
                        Name
                    </TableColumn>
                    <TableColumn
                        key="role"
                        allowsSorting
                        className="hidden md:table-cell
                            uppercase font-bold"
                    >
                        Role
                    </TableColumn>
                    <TableColumn
                        key="planType"
                        allowsSorting
                        className="hidden md:table-cell uppercase font-bold"
                    >
                        Plan Type
                    </TableColumn>
                    <TableColumn key="actions" className="uppercase font-bold">
                        Actions
                    </TableColumn>
                </TableHeader>
                <TableBody
                    items={paginationUsers}
                    isLoading={isLoading}
                    loadingState={<Spinner label="Loading..." />}
                    emptyContent="No users found"
                >
                    {(user) => (
                        <TableRow key={user._id}>
                            <TableCell>
                                <div className="flex items-center">
                                    <img
                                        className="hidden md:block w-9 h-9 rounded-2xl mr-4"
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <div>
                                        <h2 className="font-semibold">
                                            {user.name} {user.surname}{" "}
                                            <span
                                                className={`md:hidden ml-1 font-normal text-xs text-gray-light
                                                ${
                                                    user.role === "admin" &&
                                                    "font-semibold"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </h2>
                                        <p className="text-xs text-gray-400 truncate md:w-32">
                                            {user.email}
                                        </p>
                                        <div className="block mt-1 md:hidden md:mt-0">
                                            <Chip
                                                variant="dot"
                                                size="sm"
                                                color={
                                                    user.planType === "free"
                                                        ? "success"
                                                        : user.planType ===
                                                          "explorer"
                                                        ? "warning"
                                                        : user.planType ===
                                                          "adventurer"
                                                        ? "primary"
                                                        : user.planType ===
                                                          "nomad"
                                                        ? "secondary"
                                                        : "default"
                                                }
                                            >
                                                {user.planType}
                                            </Chip>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {user.role}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Chip
                                    variant="dot"
                                    size="sm"
                                    color={
                                        user.planType === "free"
                                            ? "success"
                                            : user.planType === "explorer"
                                            ? "warning"
                                            : user.planType === "adventurer"
                                            ? "primary"
                                            : user.planType === "nomad"
                                            ? "secondary"
                                            : "default"
                                    }
                                >
                                    {user.planType}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center gap-2">
                                    <Tooltip
                                        content={`Show ${user.name}'s profile`}
                                        closeDelay={0}
                                    >
                                        <Link
                                            to={`/users/${user._id}`}
                                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                        >
                                            <EyeOpen size={18} />
                                        </Link>
                                    </Tooltip>
                                    <Tooltip
                                        content={`Edit ${user.name}`}
                                        closeDelay={0}
                                    >
                                        <Link
                                            to={`/dashboard/users/edit/${user._id}`}
                                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
};

export default Users;
