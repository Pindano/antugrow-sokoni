// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to upload images
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

// Helper function to insert product listing
export const insertProductListing = async (productData) => {
    try {
        const { data, error } = await supabase
            .from('product_listings')
            .insert([productData])
            .select()
            .single()

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

// Helper function to get product listings
export const getProductListings = async (filters = {}) => {
    try {
        let query = supabase
            .from('product_listings')
            .select('*')

        // Apply filters
        if (filters.status) {
            query = query.eq('status', filters.status)
        }
        if (filters.category) {
            query = query.eq('category', filters.category)
        }
        if (filters.location) {
            query = query.ilike('location', `%${filters.location}%`)
        }

        // Order by created_at desc by default
        query = query.order('created_at', { ascending: false })

        const { data, error } = await query

        if (error) {
            console.error('Error fetching products:', error)
            return { error }
        }

        return { data }
    } catch (error) {
        console.error('Fetch error:', error)
        return { error }
    }
}

export const validateApprovalToken = async (token, action) => {
    try {
        const { data, error } = await supabase
            .from('approval_tokens')
            .select(`
        *,
        product_listings (
          id,
          name,
          farmer_name,
          category,
          status
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
        const { data, error } = await supabaseAdmin
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

// New helper function to reject product using stored procedure
export const rejectProductWithToken = async (token, reason = null, adminId = null) => {
    try {
        const { data, error } = await supabaseAdmin
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