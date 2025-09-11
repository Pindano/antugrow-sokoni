export const products = [
    {
        id: "purple-passion-fruits",
        name: "Purple Passion Fruits",
        shortDescription: "Locally harvested purple passion fruits with intense tropical flavor and aroma",
        description:
            "Premium purple passion fruits grown in ideal highland conditions. Known for their distinctive wrinkled purple skin and intensely aromatic, sweet-tart pulp. Rich in vitamins A and C, fiber, and antioxidants. Perfect for fresh eating, juices, desserts, or cocktails.",
        price: 200,
        inStock: false,
        unit: "kg",
        category: "fruits",
        stockStatus: "available",
        images: ["/passion3.jpg", "/passion2.jpg", "/passion-one.jpg"],
        badges: ["Local", "Antioxidants", "Aromatic", "Premium"],
        location: "Nyeri, Kenya",
        contactPhone: "+254 705 573 427",
        rating: 4.9,
        cropHistory:
            "Cultivated in highland farms at 1,800m altitude for over 10 years, using traditional vine training methods",
        isOrganic: true,
        pesticidesUsed: "None - natural pest management using beneficial insects and companion planting",
        tasteProfile: "Intensely aromatic with sweet-tart flavor, tropical notes of guava and citrus",
        harvestDate: "03-Sept-2025",
        shelfLife: "7-10 days at room temperature, 2-3 weeks when refrigerated",
        nutritionalHighlights: [
            "Very high in Vitamin C",
            "Rich in Vitamin A",
            "High in Dietary Fiber",
            "Packed with Antioxidants",
        ],
        bulkPricing: {
            enabled: true,
            minimumQuantity: 50,
            pricePerKg: 180,
            unit: "kg",
        },
        features: [
            "Highland grown at optimal altitude",
            "Distinctive wrinkled purple skin",
            "Intensely aromatic tropical flavor",
            "Rich in vitamins and antioxidants",
            "Perfect for juices and desserts",
            "Traditional vine cultivation methods",
        ],
    },
    // {
    //     id: "mango-kent",
    //     name: "Kent Mangoes",
    //     price: 120,
    //     unit: "kg",
    //     description: "Sweet and juicy Kent mangoes, perfect for eating fresh or making smoothies",
    //     shortDescription: "Sweet, juicy Kent mangoes with rich tropical flavor",
    //     category: "fruits",
    //     inStock: true,
    //     rating: 4.8,
    //     reviewCount: 89,
    //     features: [
    //         "Sweet and fiber-free flesh",
    //         "Rich in vitamins A and C",
    //         "Perfect for smoothies and desserts",
    //         "Naturally ripened",
    //         "Available year-round",
    //         "Bulk discounts available",
    //     ],
    //     images: ["/fresh-kent-mangoes.png", "/sliced-mango.png", "/mango-smoothie.png"],
    //     badges: ["Sweet", "Fiber-Free", "Year-Round"],
    // },
    // {
    //     id: "avocado-hass",
    //     name: "Hass Avocados",
    //     price: 200,
    //     unit: "kg",
    //     description: "Creamy Hass avocados, perfect for salads, toast, and healthy meals",
    //     shortDescription: "Creamy, nutritious Hass avocados for healthy eating",
    //     category: "fruits",
    //     inStock: true,
    //     rating: 4.7,
    //     reviewCount: 156,
    //     features: [
    //         "Creamy, buttery texture",
    //         "High in healthy fats",
    //         "Perfect for salads and toast",
    //         "Rich in potassium and fiber",
    //         "Hand-picked for quality",
    //         "Ready to eat or ripen at home",
    //     ],
    //     images: ["/fresh-hass-avocados.png", "/sliced-avocado.png", "/avocado-toast.png"],
    //     badges: ["Healthy Fats", "Hand-Picked", "Versatile"],
    // },
]

export const getProductById = (id) => {
    return products.find((product) => product.id === id)
}

export const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category)
}

export const getAllProducts = () => {
    return products
}
