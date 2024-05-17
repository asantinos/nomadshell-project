import React, { useEffect, useState } from "react";
import axios from "axios";

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

            {/* TODO: Add pie chart with users planType */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {users.map((user, index) => (
                    <UserCard key={index} user={user} />
                ))}
            </div>
        </div>
    );
};

export default Users;
