import { createContext, useContext, useState, useEffect } from "react";
import { getProductListings } from "../lib/supabase";
import toast from "react-hot-toast";

const productContext = createContext();

const CART_STORAGE_KEY = "cartItems";
const MIN_QTY = 50;

export const ProductProvider = ({ children }) => {
    // You can add state and functions related to products here
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState(null);

    // 1. Initialize cartItems state using data from localStorage
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem(CART_STORAGE_KEY);
            // Parse stored JSON data, or return an empty array if nothing is found
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error reading cart from localStorage:", error);
            return [];
        }
    });

    // --- Synchronization Effect ---
    // 2. Save cartItems to localStorage whenever cartItems changes
    useEffect(() => {
        try {
            // Stringify the cart array and store it using the defined key
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Error writing cart to localStorage:", error);
        }
    }, [cartItems]); // Dependency array: runs whenever cartItems changes

    // --- Product Fetching Effect ---
    useEffect(() => {
        fetchProducts();
    }, []);

    // --- Cart Manipulation Functions ---

    const addProductToCart = (product) => {
        setCartItems((prevCart) => {
            // 1. Check if the product already exists in the cart (for logic integrity)
            const existingItem = prevCart.find(
                (item) => item.product.id === product.id,
            );

            if (existingItem) {
                toast(
                    "Item already in basket. Updating quantity to the minimum.",
                    {
                        icon: "🧺",
                    },
                );
                return prevCart.map((item) =>
                    item.product.id === product.id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity === MIN_QTY
                                      ? MIN_QTY
                                      : item.quantity,
                          } // Adjust this logic as needed
                        : item,
                );
            }

            // 3. If item is new, add it with MIN_QTY
            const newItem = {
                product: product,
                quantity: MIN_QTY, // Initial order is 5 kgs
            };
            console.log(
                `Added new product ${product.name} with ${MIN_QTY} kgs.`,
            );

            toast.success(`${product.name} added to your basket!`, {
                duration: 3000,
            });
            return [...prevCart, newItem];
        });
    };

    const increaseQuantity = (productId) => {
        // 1. Find the product's max available quantity from the main products list
        const productData = products.find((p) => p.id === productId);

        if (!productData) {
            console.error(`Product with ID ${productId} not found.`);
            return;
        }

        const maxQuantity = productData.quantity; // This is the total available stock

        setCartItems((prevCart) =>
            prevCart.map((item) => {
                if (item.product.id === productId) {
                    // Check if the current quantity is already at or above the max
                    if (item.quantity >= maxQuantity) {
                        toast.error(
                            `Only ${maxQuantity} ${item.product.unit}s are available in stock.`,
                            { duration: 2000 },
                        );
                        // Return the item unchanged, preventing the increase
                        return item;
                    }

                    // 2. Increase the quantity by 1, knowing it won't exceed maxQuantity
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            }),
        );
    };

    const decreaseQuantity = (productId) => {
        setCartItems((prevCart) =>
            prevCart.map((item) => {
                if (item.product.id === productId) {
                    // Ensure quantity does not drop below the minimum (MIN_QTY)
                    const newQuantity = Math.max(MIN_QTY, item.quantity - 1);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }),
        );
    };

    const setQuantity = (productId, value) => {
        const productData = products.find((p) => p.id === productId);

        if (!productData) {
            console.error(`Product with ID ${productId} not found.`);
            return;
        }

        const maxQuantity = productData.quantity;
        let newQuantity = Number(value);

        // Guard rails
        if (Number.isNaN(newQuantity)) return;

        if (newQuantity < MIN_QTY) {
            newQuantity = MIN_QTY;
        }

        if (newQuantity > maxQuantity) {
            toast.error(
                `Only ${maxQuantity} ${productData.unit}s are available in stock.`,
                { duration: 2000 },
            );
            newQuantity = maxQuantity;
        }

        setCartItems((prevCart) =>
            prevCart.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item,
            ),
        );
    };

    const removeProductFromCart = (productId) => {
        console.log(`Removing product with ID: ${productId} from cart.`);
        setCartItems((prevCart) =>
            prevCart.filter((item) => item.product.id !== productId),
        );
        toast.success(`Item discarded from your basket.`, { duration: 3000 });
    };

    const sendReminderEmail = (productId) => {
        // Implement email sending logic here
    };

    // --- Product Fetching Logic ---
    const fetchProducts = async () => {
        setLoadingProducts(true);
        setError(null);
        try {
            const data = await getProductListings();
            setProducts(data);
        } catch (err) {
            console.error("Error loading products:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setLoadingProducts(false);
        }
    };

    const values = {
        products,
        loadingProducts,
        error,
        cartItems,
        MIN_QTY,
        fetchProducts,
        addProductToCart,
        sendReminderEmail,
        removeProductFromCart,
        increaseQuantity,
        decreaseQuantity,
        setQuantity,
    };

    return (
        <productContext.Provider value={values}>
            {children}
        </productContext.Provider>
    );
};

export const useProductContext = () => {
    return useContext(productContext);
};
