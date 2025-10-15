// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

// Sign up new user with email and password
export const signUpUser = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          phone: userData.phone,
        }
      }
    })

    if (error) {
      console.error('Sign up error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Sign up error:', error)
    return { error }
  }
}

// Sign in user
export const signInUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Sign in error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Sign in error:', error)
    return { error }
  }
}

// Sign out user
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      return { error }
    }
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error }
  }
}

// Get current user session
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Get user error:', error)
      return { error }
    }
    return { data: user }
  } catch (error) {
    console.error('Get user error:', error)
    return { error }
  }
}

// Reset password
export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      console.error('Password reset error:', error)
      return { error }
    }
    return { data }
  } catch (error) {
    console.error('Password reset error:', error)
    return { error }
  }
}

// Update password
export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) {
      console.error('Update password error:', error)
      return { error }
    }
    return { data }
  } catch (error) {
    console.error('Update password error:', error)
    return { error }
  }
}

// ============================================================================
// USER PROFILE FUNCTIONS
// ============================================================================

// Create user profile after signup
export const createUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Create profile error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Create profile error:', error)
    return { error }
  }
}

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
                *,
                farms (
                    id,
                    farm_name,
                    location,
                    farm_size,
                    farm_type,
                    is_primary
                )
            `)
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Get profile error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Get profile error:', error)
    return { error }
  }
}

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Update profile error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Update profile error:', error)
    return { error }
  }
}

// ============================================================================
// FARM MANAGEMENT FUNCTIONS
// ============================================================================

// Create a new farm
export const createFarm = async (farmData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'User not authenticated' }

    const { data, error } = await supabase
      .from('farms')
      .insert([{
        ...farmData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Create farm error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Create farm error:', error)
    return { error }
  }
}

// Get user's farms
export const getUserFarms = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get farms error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Get farms error:', error)
    return { error }
  }
}

// Update farm
export const updateFarm = async (farmId, updates) => {
  try {
    const { data, error } = await supabase
      .from('farms')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', farmId)
      .select()
      .single()

    if (error) {
      console.error('Update farm error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Update farm error:', error)
    return { error }
  }
}

// Set primary farm
export const setPrimaryFarm = async (farmId, userId) => {
  try {
    // First, unset all farms as primary for this user
    await supabase
      .from('farms')
      .update({ is_primary: false })
      .eq('user_id', userId)

    // Then set the selected farm as primary
    const { data, error } = await supabase
      .from('farms')
      .update({ is_primary: true })
      .eq('id', farmId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Set primary farm error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Set primary farm error:', error)
    return { error }
  }
}

// Delete farm
export const deleteFarm = async (farmId) => {
  try {
    const { error } = await supabase
      .from('farms')
      .delete()
      .eq('id', farmId)

    if (error) {
      console.error('Delete farm error:', error)
      return { error }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete farm error:', error)
    return { error }
  }
}

// ============================================================================
// ENHANCED PRODUCT LISTING FUNCTIONS
// ============================================================================

// Helper function to upload images (existing)
export const uploadProductImage = async (file, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`${Date.now()}_${fileName}`, file)

    if (error) {
      console.error('Error uploading image:', error)
      return { error }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)

    return { data: { ...data, publicUrl } }
  } catch (error) {
    console.error('Upload error:', error)
    return { error }
  }
}

// Enhanced product listing insertion with user and farm info
export const insertProductListing = async (productData) => {
  try {


    // Get user's primary farm or use provided farm_id


    const { data, error } = await supabase
      .from('product_listings')
      .insert([{
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])


    if (error) {
      console.error('Error inserting product:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Insert error:', error)
    return { error }
  }
}

// Get product listings with enhanced filtering and user info
export const getProductListings = async () => {
  try {
    const { data, error } = await supabase
      .from('product_listings')
      .select('*')
      .eq('status', 'approved')
      .gt('quantity', 0)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    // Add computed inStock field
    return data.map(product => ({
      ...product,
      inStock: product.quantity > 0
    }))

  } catch (error) {
    console.error('Fetch error:', error)
    return []
  }
}
// Get user's product listings
export const getUserProductListings = async (userId, filters = {}) => {
  return getProductListings({ ...filters, user_id: userId })
}

// Update product listing
export const updateProductListing = async (productId, updates) => {
  try {
    const { data, error } = await supabase
      .from('product_listings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select(`
                *,
                farms (
                    id,
                    farm_name,
                    location,
                    farm_size,
                    farm_type
                ),
                user_profiles (
                    full_name,
                    phone,
                    email
                )
            `)
      .single()

    if (error) {
      console.error('Update product error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Update product error:', error)
    return { error }
  }
}

// Delete product listing
export const deleteProductListing = async (productId) => {
  try {
    const { error } = await supabase
      .from('product_listings')
      .delete()
      .eq('id', productId)

    if (error) {
      console.error('Delete product error:', error)
      return { error }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete product error:', error)
    return { error }
  }
}
export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('product_listings')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    // Add computed fields
    return {
      ...data,
      inStock: data.quantity > 0
    }

  } catch (error) {
    console.error('Fetch error:', error)
    return null
  }
}

// ============================================================================
// ANALYTICS AND STATS
// ============================================================================

// Get user statistics
export const getUserStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_stats', { user_id_input: userId })

    if (error) {
      console.error('Get stats error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Get stats error:', error)
    return { error }
  }
}

// ============================================================================
// APPROVAL SYSTEM (Enhanced)
// ============================================================================

export const validateApprovalToken = async (token, action) => {
  try {
    const { data, error } = await supabase
      .from('approval_tokens')
      .select(`
                *,
                product_listings (
                    id,
                    name,
                    category,
                    status,
                    farms (
                        farm_name,
                        location
                    ),
                    user_profiles (
                        full_name,
                        phone
                    )
                )
            `)
      .eq('token', token)
      .eq('action', action)
      .gt('expires_at', new Date().toISOString())
      .is('used_at', null)
      .single()

    if (error) {
      console.error('Token validation error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Token validation error:', error)
    return { error }
  }
}

export const approveProductWithToken = async (token, adminId = null) => {
  try {
    const { data, error } = await supabase
      .rpc('approve_product', {
        token_uuid: token,
        admin_identifier: adminId || 'web_interface'
      })

    if (error) {
      console.error('Approval error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Approval error:', error)
    return { error }
  }
}

export const rejectProductWithToken = async (token, reason = null, adminId = null) => {
  try {
    const { data, error } = await supabase
      .rpc('reject_product', {
        token_uuid: token,
        rejection_reason_text: reason || 'No reason provided',
        admin_identifier: adminId || 'web_interface'
      })

    if (error) {
      console.error('Rejection error:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Rejection error:', error)
    return { error }
  }
}

// ============================================================================
// AUTH LISTENER SETUP
// ============================================================================

// Set up auth state listener
export const setupAuthListener = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}
