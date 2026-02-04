import { createContext, useContext, useState, useEffect } from "react";
import { getProductListings } from "../lib/supabase";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
const UserContext = createContext();

const CART_STORAGE_KEY = "cartItems";
const MIN_QTY = 50;

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loadingUserProfile, setLoadingUserProfile] = useState(true);

    const getUserProfile = async () => {
        setLoadingUserProfile(true);
        const { data, error } = await supabase
            .from("users")
            .select(`*`)
            .single();
        if (error) {
            console.error("Error fetching user profile:", error);
        } else {
            setUserProfile(data);
        }
        setLoadingUserProfile(false);
    };

    const authChange = () => {
        // This subscription is persistent, so its callback will fire on initial load and subsequent changes.
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setLoadingUserProfile(true); // Set loading true at the start of event handling

                if (
                    event === "SIGNED_IN" ||
                    event === "USER_UPDATED" ||
                    event === "INITIAL_SESSION"
                ) {
                    if (session?.user) {
                        getUserProfile();
                    }
                } else if (event === "SIGNED_OUT") {
                    navigate("/"); // Redirect to login on sign out
                }
                // setLoadingUserProfile(false); // Set loading false after event handling
            },
        );

        // Cleanup function for useEffect
        return () => {
            authListener?.subscription?.unsubscribe();
        };
    };

    useEffect(() => {
        if (!userProfile) {
            getUserProfile();
        }
    }, []);

    useEffect(() => {
        // Only subscribe to auth changes once when the provider mounts
        const unsubscribe = authChange();
        return () => {
            // Unsubscribe when the provider unmounts
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []); // Empty dependency array ensures it runs only once

    const values = { userProfile, loadingUserProfile };

    return (
        <UserContext.Provider value={values}>{children}</UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
