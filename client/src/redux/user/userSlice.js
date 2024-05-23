import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signOutUserStart: (state) => {
            state.loading = true;
        },
        signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signOutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserNomadPoints: (state, action) => {
            state.currentUser = {
                user: {
                    ...state.currentUser.user,
                    nomadPoints: action.payload,
                },
            };
        },
        // TODO : Solve subscribeUser, not working
        subscribeUser: (state, action) => {
            state.currentUser = {
                user: {
                    ...state.currentUser.user,
                    planType: action.payload,
                    nomadPoints:
                        action.payload === "explorer"
                            ? state.currentUser.user.nomadPoints + 3000
                            : action.payload === "adventurer"
                            ? state.currentUser.user.nomadPoints + 6500
                            : action.payload === "nomad"
                            ? state.currentUser.user.nomadPoints + 10000
                            : state.currentUser.user.nomadPoints + 0,
                },
            };
        },
        toggleFavorite: (state, action) => {
            state.currentUser = {
                user: {
                    ...state.currentUser.user,
                    favorites: [
                        ...state.currentUser.user.favorites,
                        action.payload,
                    ],
                },
            };
        },
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserFailure,
    updateUserSuccess,
    updateUserStart,
    deleteUserFailure,
    deleteUserSuccess,
    deleteUserStart,
    signOutUserFailure,
    signOutUserSuccess,
    signOutUserStart,
    updateUserNomadPoints,
    subscribeUser,
    toggleFavorite,
} = userSlice.actions;

export default userSlice.reducer;
