import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { 
    insertProductListing, 
    uploadProductImage, 
    getUserFarms,
    createFarm 
} from '../../lib/supabase'

const ProductListingForm = ({ onSuccess }) => {
    const { user, farms, getPrimaryFarm, refreshUserData } = useAuth()
    const [loading, setLoading] = useState(false)
    const [showFarmForm, setShowFarmForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        unit: '',
        quantity: '',
        harvest_date: '',
        farm_id: '',
        image: null
    })
    
    const [newFarmData, setNewFarmData] = useState({
        farm_name: '',
        location: '',
        farm_size: '',
        farm_type: '',
        description: ''
    })

    const categories = [
        'Vegetables', 'Fruits', 'Grains', 'Legumes', 'Herbs', 
        'Dairy', 'Meat', 'Eggs', 'Other'
    ]

    const units = ['kg', 'g', 'lbs', 'pieces', 'bunches', 'bags', 'crates', 'liters']

    useEffect(() => {
        const primaryFarm = getPrimaryFarm()
        if (primaryFarm) {
            setFormData(prev => ({ ...prev, farm_id: primaryFarm.id }))
        }
    }, [farms, getPrimaryFarm])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setFormData(prev => ({ ...prev, image: file }))
    }

    const handleFarmInputChange = (e) => {
        const { name, value } = e.target
        setNewFarmData(prev => ({ ...prev, [name]: value }))
    }

    const handleCreateFarm = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data, error } = await createFarm({
                ...newFarmData,
                farm_size: parseFloat(newFarmData.farm_size) || null,
                is_primary: farms.length === 0 // Make first farm primary
            })

            if (error) {
                alert('Error creating farm: ' + error.message)
                return
            }

            await refreshUserData()
            setFormData(prev => ({ ...prev, farm_id: data.id }))
            setShowFarmForm(false)
            setNewFarmData({
                farm_name: '',
                location: '',
                farm_size: '',
                farm_type: '',
                description: ''
            })
            alert('Farm created successfully!')
        } catch (error) {
            console.error('Error creating farm:', error)
            alert('Error creating farm')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = null

            // Upload image if provided
            if (formData.image) {
                const { data: imageData, error: imageError } = await uploadProductImage(
                    formData.image,
                    formData.image.name
                )

                if (imageError) {
                    alert('Error uploading image: ' + imageError.message)
                    setLoading(false)
                    return
                }

                imageUrl = imageData.publicUrl
            }

            // Prepare product data
            const productData = {
                name: formData.name,
                category: formData.category,
                description: formData.description,
                price: parseFloat(formData.price),
                unit: formData.unit,
                quantity: parseFloat(formData.quantity),
                harvest_date: formData.harvest_date || null,
                farm_id: formData.farm_id || null,
                image_url: imageUrl,
                status: 'pending' // Products start as pending approval
            }

            const { data, error } = await insertProductListing(productData)

            if (error) {
                alert('Error creating product listing: ' + error.message)
                return
            }

            alert('Product listing created successfully! It will be reviewed for approval.')
            
            // Reset form
            setFormData({
                name: '',
                category: '',
                description: '',
                price: '',
                unit: '',
                quantity: '',
                harvest_date: '',
                farm_id: getPrimaryFarm()?.id || '',
                image: null
            })

            // Clear file input
            const fileInput = document.querySelector('input[type="file"]')
            if (fileInput) fileInput.value = ''

            if (onSuccess) onSuccess(data)

        } catch (error) {
            console.error('Error creating product listing:', error)
            alert('Error creating product listing')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Create Product Listing</h2>

                {farms.length === 0 && !showFarmForm && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 mb-2">You need to add a farm before creating product listings.</p>
                        <button
                            onClick={() => setShowFarmForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Add Farm
                        </button>
                    </div>
                )}

                {showFarmForm && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold mb-4">Add New Farm</h3>
                        <form onSubmit={handleCreateFarm}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Farm Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="farm_name"
                                        value={newFarmData.farm_name}
                                        onChange={handleFarmInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={newFarmData.location}
                                        onChange={handleFarmInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                        placeholder="City, County"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Farm Size (acres)
                                    </label>
                                    <input
                                        type="number"
                                        name="farm_size"
                                        value={newFarmData.farm_size}
                                        onChange={handleFarmInputChange}
                                        step="0.1"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Farm Type
                                    </label>
                                    <select
                                        name="farm_type"
                                        value={newFarmData.farm_type}
                                        onChange={handleFarmInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Organic">Organic</option>
                                        <option value="Conventional">Conventional</option>
                                        <option value="Mixed">Mixed</option>
                                        <option value="Dairy">Dairy</option>
                                        <option value="Livestock">Livestock</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={newFarmData.description}
                                    onChange={handleFarmInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                    placeholder="Describe your farm..."
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Farm'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowFarmForm(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {farms.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Farm *
                            </label>
                            <div className="flex items-center space-x-2">
                                <select
                                    name="farm_id"
                                    value={formData.farm_id}
                                    onChange={handleInputChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                    required
                                >
                                    <option value="">Select Farm</option>
                                    {farms.map((farm) => (
                                        <option key={farm.id} value={farm.id}>
                                            {farm.farm_name} - {farm.location}
                                            {farm.is_primary ? ' (Primary)' : ''}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowFarmForm(true)}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                    Add Farm
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                            placeholder="Describe your product, quality, growing conditions, etc."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Unit *
                            </label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                required
                            >
                                <option value="">Select Unit</option>
                                {units.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Quantity Available *
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                step="0.1"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Harvest Date
                            </label>
                            <input
                                type="date"
                                name="harvest_date"
                                value={formData.harvest_date}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Product Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || farms.length === 0}
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    >
                        {loading ? 'Creating Listing...' : 'Create Product Listing'}
                    </button>
                </form>
            </div>
        </div>
    )
}
export default ProductListingForm;
