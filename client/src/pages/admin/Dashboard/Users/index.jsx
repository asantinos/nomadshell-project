import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@nextui-org/react";
import axios from "axios";

import DeleteButton from "@components/Button/DeleteButton";

const UserCard = ({ user }) => {
    return (
        <div className="bg-white border rounded-3xl p-4">
            <div className="flex items-center">
                <img
                    className="w-10 h-10 rounded-2xl mr-4"
                    src={user.avatar}
                    alt={user.name}
                />
                <div>
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-gray-500 truncate w-32">{user.email}</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-500">{user.role}</p>
            </div>
        </div>
    );
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(new Set());

    useEffect(() => {
        axios
            .get("/api/users/all")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold">Users</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-white border rounded-3xl p-4">
                    <h2 className="text-lg font-semibold">Total Users</h2>
                    <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <div className="bg-white border rounded-3xl p-4">
                    <h2 className="text-lg font-semibold">Total Admins</h2>
                    <p className="text-3xl font-bold">
                        {users.filter((user) => user.role === "admin").length}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white border rounded-3xl p-4">
                    <h2 className="text-lg font-semibold">Free</h2>
                    <p className="text-3xl font-bold">
                        {
                            users.filter((user) => user.planType === "free")
                                .length
                        }
                    </p>
                </div>

                <div className="bg-white border rounded-3xl p-4">
                    <h2 className="text-lg font-semibold">Explorer</h2>
                    <p className="text-3xl font-bold">
                        {
                            users.filter((user) => user.planType === "explorer")
                                .length
                        }
                    </p>
                </div>
                <div className="bg-white border rounded-3xl p-4">
                    <h2 className="text-lg font-semibold">Adventurer</h2>
                    <p className="text-3xl font-bold">
                        {
                            users.filter(
                                (user) => user.planType === "adventurer"
                            ).length
                        }
                    </p>
                </div>
                <div className="bg-white border rounded-3xl p-4">
                    <h2 className="text-lg font-semibold">Nomad</h2>
                    <p className="text-3xl font-bold">
                        {
                            users.filter((user) => user.planType === "nomad")
                                .length
                        }
                    </p>
                </div>
            </div>

            <h2 className="text-lg font-semibold mt-8">All Users</h2>

            <div className="flex justify-end">
                <DeleteButton />
            </div>

            <Table
                aria-label="Users Table"
                selectionMode="multiple"
                color="default"
                selectedKeys={selectedUsers}
                onSelectionChange={setSelectedUsers}
                onChange={console.log(selectedUsers)}
                className="mt-2"
            >
                <TableHeader>
                    <TableColumn className="uppercase font-bold">Name</TableColumn>
                    <TableColumn className="uppercase font-bold">Role</TableColumn>
                    <TableColumn className="uppercase font-bold">Plan Type</TableColumn>
                    <TableColumn className="uppercase font-bold">Actions</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No users found">
                    {users.map((user, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="flex items-center">
                                    <img
                                        className="w-9 h-9 rounded-2xl mr-4"
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <div>
                                        <h2 className="font-semibold">
                                            {user.name} {user.surname}
                                        </h2>
                                        <p className="text-xs text-gray-400 truncate w-32">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.planType}</TableCell>
                            <TableCell>
                                <button className="btn">Edit</button>
                                <button className="btn">Delete</button>
                            </TableCell>
                        </TableRow>
                    ))}
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
