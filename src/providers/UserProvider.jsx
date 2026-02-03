import { createContext, useContext, useState, useEffect } from "react";
import { getProductListings } from "../lib/supabase";
import toast from "react-hot-toast";

const UserContext = createContext();

const CART_STORAGE_KEY = "cartItems";
const MIN_QTY = 50;

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState({});
    const [loadingUserProfile, setLoadingUserProfile] = useState(false);

    const values = { userProfile, loadingUserProfile };

    return (
        <UserContext.Provider value={values}>{children}</UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
