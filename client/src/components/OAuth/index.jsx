import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "@redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import GoogleFill from "@icons/google-fill";

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        try {
            const result = await signInWithPopup(auth, provider);

            const response = await axios.post("/api/auth/google", {
                avatar: result.user.photoURL,
                name: result.user.displayName.split(" ")[0],
                surname: result.user.displayName.split(" ")[1],
                email: result.user.email,
            });

            dispatch(signInSuccess(response.data));
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button
            onClick={handleGoogleClick}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-2xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
            <GoogleFill color={"#222"} size={24} />
            <span>Sign in with Google</span>
        </button>
    );
};

export default OAuth;
