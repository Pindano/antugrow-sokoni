// hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from 'react'
import { 
    supabase, 
    signUpUser, 
    signInUser, 
    signOutUser, 
    getCurrentUser,
    resetPassword,
    updatePassword,
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    getUserFarms,
    setupAuthListener
} from '../lib/supabase'

// Create Auth Context
const AuthContext = createContext()

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [farms, setFarms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Initialize auth state
    useEffect(() => {
        let mounted = true

        // Get initial session
        const initializeAuth = async () => {
            try {
                const { data: user, error } = await getCurrentUser()
                
                if (error) {
                    console.error('Error getting initial user:', error)
                    setError(error.message)
                } else if (user && mounted) {
                    setUser(user)
                    await loadUserData(user.id)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
                setError(error.message)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        initializeAuth()

        // Set up auth listener
        const { data: { subscription } } = setupAuthListener(async (event, session) => {
            if (!mounted) return

            if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user)
                setError(null)
                await loadUserData(session.user.id)
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
                setProfile(null)
                setFarms([])
                setError(null)
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                setUser(session.user)
            }
        })

        return () => {
            mounted = false
            subscription?.unsubscribe()
        }
    }, [])

    // Load user profile and farms
    const loadUserData = async (userId) => {
        try {
            // Load user profile
            const { data: profileData, error: profileError } = await getUserProfile(userId)
            if (profileError) {
                console.error('Error loading profile:', profileError)
            } else if (profileData) {
                setProfile(profileData)
                if (profileData.farms) {
                    setFarms(profileData.farms)
                }
            }

            // Load farms separately if not included in profile
            if (!profileData?.farms) {
                const { data: farmsData, error: farmsError } = await getUserFarms(userId)
                if (farmsError) {
                    console.error('Error loading farms:', farmsError)
                } else if (farmsData) {
                    setFarms(farmsData)
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error)
            setError(error.message)
        }
    }

    // Sign up function
    const signUp = async (email, password, userData) => {
        try {
            setLoading(true)
            setError(null)
            
            const { data, error } = await signUpUser(email, password, userData)
            
            if (error) {
                setError(error.message)
                return { error }
            }

            // If user is created and confirmed, create profile
            if (data.user && data.user.email_confirmed_at) {
                const profileData = {
                    full_name: userData.full_name,
                    phone: userData.phone,
                    email: email,
                    location: userData.location || null,
                    bio: userData.bio || null
                }
                
                const { error: profileError } = await createUserProfile(data.user.id, profileData)
                if (profileError) {
                    console.error('Error creating profile:', profileError)
                }
            }

            return { data }
        } catch (error) {
            setError(error.message)
            return { error }
        } finally {
            setLoading(false)
        }
    }

    // Sign in function
    const signIn = async (email, password) => {
        try {
            setLoading(true)
            setError(null)
            
            const { data, error } = await signInUser(email, password)
            
            if (error) {
                setError(error.message)
                return { error }
            }

            return { data }
        } catch (error) {
            setError(error.message)
            return { error }
        } finally {
            setLoading(false)
        }
    }

    // Sign out function
    const signOut = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const { error } = await signOutUser()
            
            if (error) {
                setError(error.message)
                return { error }
            }

            return { success: true }
        } catch (error) {
            setError(error.message)
            return { error }
        } finally {
            setLoading(false)
        }
    }

    // Update profile function
    const updateProfile = async (updates) => {
        try {
            setError(null)
            
            if (!user) {
                throw new Error('User not authenticated')
            }

            const { data, error } = await updateUserProfile(user.id, updates)
            
            if (error) {
                setError(error.message)
                return { error }
            }

            setProfile(data)
            return { data }
        } catch (error) {
            setError(error.message)
            return { error }
        }
    }

    // Reset password function
    const resetUserPassword = async (email) => {
        try {
            setError(null)
            
            const { data, error } = await resetPassword(email)
            
            if (error) {
                setError(error.message)
                return { error }
            }

            return { data }
        } catch (error) {
            setError(error.message)
            return { error }
        }
    }

    // Update password function
    const updateUserPassword = async (newPassword) => {
        try {
            setError(null)
            
            const { data, error } = await updatePassword(newPassword)
            
            if (error) {
                setError(error.message)
                return { error }
            }

            return { data }
        } catch (error) {
            setError(error.message)
            return { error }
        }
    }

    // Refresh user data
    const refreshUserData = async () => {
        if (user) {
            await loadUserData(user.id)
        }
    }

    // Get primary farm
    const getPrimaryFarm = () => {
        return farms.find(farm => farm.is_primary) || farms[0] || null
    }

    // Check if user is authenticated
    const isAuthenticated = !!user

    // Check if user has completed profile
    const hasCompleteProfile = profile && profile.full_name && profile.phone

    const value = {
        // Auth state
        user,
        profile,
        farms,
        loading,
        error,
        isAuthenticated,
        hasCompleteProfile,
        
        // Auth functions
        signUp,
        signIn,
        signOut,
        resetUserPassword,
        updateUserPassword,
        
        // Profile functions
        updateProfile,
        refreshUserData,
        
        // Farm functions
        getPrimaryFarm,
        
        // Utility functions
        clearError: () => setError(null),
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    
    return context
}

// Higher-order component for protected routes
export const withAuth = (WrappedComponent) => {
    return function AuthenticatedComponent(props) {
        const { isAuthenticated, loading } = useAuth()
        
        if (loading) {
            return <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        }
        
        if (!isAuthenticated) {
            return <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                    <p>Please sign in to access this page.</p>
                </div>
            </div>
        }
        
        return <WrappedComponent {...props} />
    }
}

// Hook for protected operations
export const useProtectedOperation = () => {
    const { isAuthenticated, user } = useAuth()
    
    const executeIfAuthenticated = async (operation) => {
        if (!isAuthenticated || !user) {
            throw new Error('Authentication required')
        }
        
        return await operation()
    }
    
    return { executeIfAuthenticated, isAuthenticated, user }
}
