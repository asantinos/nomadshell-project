import React, { useState, useMemo, useEffect } from "react";
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
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import axios from "axios";

import DeleteButton from "@components/Button/DeleteButton";

import ChevronDownSmall from "@icons/chevron-down-small";
import VerticalDots from "@icons/vertical-dots";
import Search from "@icons/search";
import Plus from "@icons/plus";

const Users = () => {
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

    // TODO: Finish implementing delete functionality
    // Delete button, delete selected users
    const handleDelete = async () => {
        try {
            await axios.delete("/api/users/delete", {
                data: { selectedUsers },
            });
            setSelectedUsers(new Set());
            list.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold">Users</h1>

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
                        {users.filter((user) => user.role === "admin").length}
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
                            users.filter((user) => user.planType === "explorer")
                                .length
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
                            users.filter((user) => user.planType === "nomad")
                                .length
                        }
                    </p>
                </div>
            </div>

            <h2 className="text-lg font-semibold mt-8">All Users</h2>

            <div className="flex items-center justify-between mt-4">
                <div className="relative w-64">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email"
                        className="w-full border rounded-2xl p-2 pl-10 placeholder:text-sm"
                    />
                    <Search
                        size={20}
                        color="gray"
                        className="absolute top-3 left-3"
                    />
                </div>

                <DeleteButton
                    onClick={() => {
                        console.log(selectedUsers);
                    }}
                />
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
                    <TableColumn className="uppercase font-bold">
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
                                            {user.name} {user.surname}
                                        </h2>
                                        <p className="text-xs text-gray-400 truncate w-20 md:w-32">
                                            {user.email}
                                        </p>
                                        <div className="block mt-1 md:hidden md:mt-0 italic">
                                            {user.role}
                                        </div>
                                        <div className="block mt-1 md:hidden md:mt-0">
                                            <Chip
                                                size="sm"
                                                color={
                                                    user.planType === "free"
                                                        ? "default"
                                                        : user.planType ===
                                                          "explorer"
                                                        ? "info"
                                                        : user.planType ===
                                                          "adventurer"
                                                        ? "success"
                                                        : "warning"
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
                                {user.planType}
                            </TableCell>
                            <TableCell>
                                <VerticalDots />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* TODO: Add pie chart with users planType */}

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {users.map((user, index) => (
                    <UserCard key={index} user={user} />
                ))}
            </div> */}
        </div>
    );
};

export default Users;
