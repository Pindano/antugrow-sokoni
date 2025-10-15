const UserProductListings = () => {
    const { user } = useAuth()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        loadUserProducts()
    }, [user, filter])

    const loadUserProducts = async () => {
        if (!user) return

        setLoading(true)
        try {
            const filters = { user_id: user.id }
            if (filter !== 'all') {
                filters.status = filter
            }

            const { data, error } = await getUserProductListings(user.id, filters)
            if (error) {
                console.error('Error loading products:', error)
            } else {
                setProducts(data || [])
            }
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        }
        return `px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`
    }

    if (loading) {
        return <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Product Listings</h2>
                <div className="flex space-x-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <button
                        onClick={loadUserProducts}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">No products found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {product.image_url && (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <span className={getStatusBadge(product.status)}>
                                        {product.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                                <p className="text-gray-800 mb-2">{product.description}</p>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-bold text-green-600">
                                        KES {product.price} / {product.unit}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {product.quantity} {product.unit} available
                                    </span>
                                </div>
                                {product.farms && (
                                    <p className="text-sm text-gray-600">
                                        From: {product.farms.farm_name}, {product.farms.location}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Listed: {new Date(product.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default UserProductListings;
