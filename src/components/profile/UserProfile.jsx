
import { useAuth } from '../../hooks/useAuth'





const UserProfile = () => {
    const { user, profile, farms, updateProfile, refreshUserData, getPrimaryFarm } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        full_name: profile?.full_name || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        bio: profile?.bio || ''
    })

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                location: profile.location || '',
                bio: profile.bio || ''
            })
        }
    }, [profile])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { error } = await updateProfile(formData)
        
        if (!error) {
            setIsEditing(false)
            await refreshUserData()
        }
    }

    const primaryFarm = getPrimaryFarm()

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Bio
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 text-sm">Full Name</label>
                                <p className="text-gray-900 font-medium">{profile?.full_name || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm">Email</label>
                                <p className="text-gray-900 font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm">Phone Number</label>
                                <p className="text-gray-900 font-medium">{profile?.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm">Location</label>
                                <p className="text-gray-900 font-medium">{profile?.location || 'Not provided'}</p>
                            </div>
                        </div>
                        
                        {profile?.bio && (
                            <div>
                                <label className="block text-gray-600 text-sm">Bio</label>
                                <p className="text-gray-900">{profile.bio}</p>
                            </div>
                        )}

                        {primaryFarm && (
                            <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Primary Farm</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <p><span className="font-medium">Name:</span> {primaryFarm.farm_name}</p>
                                    <p><span className="font-medium">Location:</span> {primaryFarm.location}</p>
                                    <p><span className="font-medium">Size:</span> {primaryFarm.farm_size} {primaryFarm.farm_size_unit}</p>
                                    <p><span className="font-medium">Type:</span> {primaryFarm.farm_type}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Farms Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Your Farms ({farms.length})</h3>
                {farms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {farms.map((farm) => (
                            <div key={farm.id} className={`p-4 border rounded-lg ${farm.is_primary ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold">{farm.farm_name}</h4>
                                    {farm.is_primary && (
                                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Primary</span>
                                    )}
                                </div>
                                <p className="text-gray-600 text-sm">{farm.location}</p>
                                <p className="text-gray-600 text-sm">{farm.farm_size} {farm.farm_size_unit}</p>
                                <p className="text-gray-600 text-sm">{farm.farm_type}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">You haven't added any farms yet.</p>
                )}
            </div>
        </div>
    )
}

export default UserProfile;
