
import { useState } from "react"
import { supabase, uploadProductImage, insertProductListing } from "../lib/supabase.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, Plus, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Navigation } from "./Navigation"

export default function ListProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    quantity: "",
    unit: "",
    category: "",
    location: "",
    farmerName: "",
    farmLocation: "",
    farmSize: "",
    farmSizeUnit: "",
    irrigationMethod: "",
    waterSource: "",
    contactPhone: "",
    contactEmail: "",
    images: [],
  })

  const [badges, setBadges] = useState([])
  const [newBadge, setNewBadge] = useState("")

  const [pests, setPests] = useState([])
  const [newPest, setNewPest] = useState("")

  const [pesticides, setPesticides] = useState([])
  const [newPesticide, setNewPesticide] = useState("")

  const [insecticides, setInsecticides] = useState([])
  const [newInsecticide, setNewInsecticide] = useState("")

  const [fertilizers, setFertilizers] = useState([])
  const [newFertilizer, setNewFertilizer] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null
  const [submitMessage, setSubmitMessage] = useState("")

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addBadge = () => {
    if (newBadge.trim() && !badges.includes(newBadge.trim())) {
      setBadges((prev) => [...prev, newBadge.trim()])
      setNewBadge("")
    }
  }

  const removeBadge = (badgeToRemove) => {
    setBadges((prev) => prev.filter((badge) => badge !== badgeToRemove))
  }

  const addPest = () => {
    if (newPest.trim() && !pests.includes(newPest.trim())) {
      setPests((prev) => [...prev, newPest.trim()])
      setNewPest("")
    }
  }

  const removePest = (pestToRemove) => {
    setPests((prev) => prev.filter((p) => p !== pestToRemove))
  }

  const addPesticide = () => {
    if (newPesticide.trim() && !pesticides.includes(newPesticide.trim())) {
      setPesticides((prev) => [...prev, newPesticide.trim()])
      setNewPesticide("")
    }
  }

  const removePesticide = (pesticideToRemove) => {
    setPesticides((prev) => prev.filter((p) => p !== pesticideToRemove))
  }

  const addInsecticide = () => {
    if (newInsecticide.trim() && !insecticides.includes(newInsecticide.trim())) {
      setInsecticides((prev) => [...prev, newInsecticide.trim()])
      setNewInsecticide("")
    }
  }

  const removeInsecticide = (insecticideToRemove) => {
    setInsecticides((prev) => prev.filter((i) => i !== insecticideToRemove))
  }

  const addFertilizer = () => {
    if (newFertilizer.trim() && !fertilizers.includes(newFertilizer.trim())) {
      setFertilizers((prev) => [...prev, newFertilizer.trim()])
      setNewFertilizer("")
    }
  }

  const removeFertilizer = (fertilizerToRemove) => {
    setFertilizers((prev) => prev.filter((f) => f !== fertilizerToRemove))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      shortDescription: "",
      description: "",
      price: "",
      quantity: "",
      unit: "",
      category: "",
      location: "",
      farmerName: "",
      farmLocation: "",
      farmSize: "",
      farmSizeUnit: "",
      irrigationMethod: "",
      waterSource: "",
      contactPhone: "",
      contactEmail: "",
      images: [],
    })
    setBadges([])
    setPests([])
    setPesticides([])
    setInsecticides([])
    setFertilizers([])
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus(null)
    setSubmitMessage("")

    try {
      // Validate required fields - All fields are required except description, badges, and contact email
      const requiredFieldsMap = {
        name: 'Product Name',
        category: 'Category',
        shortDescription: 'Short Description',
        price: 'Price',
        quantity: 'Quantity',
        unit: 'Unit',
        location: 'Product Location',
        farmerName: 'Farmer Name',
        farmLocation: 'Farm Location',
        farmSize: 'Farm Size',
        farmSizeUnit: 'Farm Size Unit',
        irrigationMethod: 'Irrigation Method',
        waterSource: 'Water Source',
        contactPhone: 'Contact Phone',
        images: 'Product Images'
      }

      // Check required arrays (at least one item required)
      const requiredArrays = {
        pests: 'Pests & Diseases',
        pesticides: 'Pesticides Used',
        insecticides: 'Insecticides Used',
        fertilizers: 'Fertilizers Used'
      }

      const missingFields = []

      // Check form data fields
      Object.entries(requiredFieldsMap).forEach(([field, label]) => {
        if (field === 'images') {
          if (!formData[field] || formData[field].length === 0) {
            missingFields.push(label)
          }
        } else if (!formData[field] || formData[field].toString().trim() === '') {
          missingFields.push(label)
        }
      })

      // Check required arrays
      Object.entries(requiredArrays).forEach(([arrayName, label]) => {
        const arrayData = eval(arrayName) // pests, pesticides, insecticides, fertilizers
        if (!arrayData || arrayData.length === 0) {
          missingFields.push(label)
        }
      })

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      }

      // Upload images first
      let imageUrls = []
      if (formData.images.length > 0) {
        setSubmitMessage("Uploading images...")

        for (let i = 0; i < formData.images.length; i++) {
          const file = formData.images[i]
          const fileName = `${formData.name.replace(/\s+/g, '_')}_${i + 1}.${file.name.split('.').pop()}`

          const { data: uploadData, error: uploadError } = await uploadProductImage(file, fileName)

          if (uploadError) {
            throw new Error(`Failed to upload image ${i + 1}: ${uploadError.message}`)
          }

          imageUrls.push(uploadData.publicUrl)
        }
      }

      // Prepare data for database
      const productData = {
        // Farmer Information
        farmer_name: formData.farmerName,
        farm_location: formData.farmLocation,
        farm_size: parseFloat(formData.farmSize) || 0,
        farm_size_unit: formData.farmSizeUnit,
        irrigation_method: formData.irrigationMethod,
        water_source: formData.waterSource,

        // Product Information
        name: formData.name,
        short_description: formData.shortDescription,
        description: formData.description || '',
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        category: formData.category,
        location: formData.location,

        // Contact Information
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail || '',

        // Arrays as JSON
        badges: badges,
        pests: pests,
        pesticides: pesticides,
        insecticides: insecticides,
        fertilizers: fertilizers,

        // Images
        images: imageUrls,

        // Set expiry date to 30 days from now
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      setSubmitMessage("Saving product...")

      // Insert into database with pending status
      const { data, error } = await insertProductListing(productData)

      if (error) {
        throw new Error(`Failed to save product: ${error.message}`)
      }

      setSubmitStatus("success")
      setSubmitMessage(`Your product has been submitted successfully! We'll review it and get back to you soon.`)
      resetForm()
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (error) {
      console.error("Submission failed", error)
      setSubmitStatus("error")
      setSubmitMessage(error.message || "Failed to submit product listing. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const dismissMessage = () => {
    setSubmitStatus(null)
    setSubmitMessage("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Navigation showBackButton={true} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">List Your Product</h1>
          <p className="text-xl text-gray-600">Share your fresh farm products with our community</p>
        </div>

        {/* Success/Error Message */}
        {submitStatus && (
          <Alert className={`mb-6 ${submitStatus === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            {submitStatus === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <div className="flex items-start justify-between w-full">
              <AlertDescription className={submitStatus === 'success' ? 'text-green-800' : 'text-red-800'}>
                {submitMessage}
              </AlertDescription>
              <button
                onClick={dismissMessage}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Alert>
        )}

        {/* Farmer Information Section */}
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Farmer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="farmerName">Farmer Name *</Label>
                  <Input
                    id="farmerName"
                    value={formData.farmerName}
                    onChange={(e) => handleInputChange("farmerName", e.target.value)}
                    placeholder="e.g., John Kamau"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmLocation">Farm Location *</Label>
                  <Input
                    id="farmLocation"
                    value={formData.farmLocation}
                    onChange={(e) => handleInputChange("farmLocation", e.target.value)}
                    placeholder="e.g., Kiambu County, Ruiru"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="farmSize"
                      type="number"
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange("farmSize", e.target.value)}
                      placeholder="5"
                      className="flex-1"
                      required
                    />
                    <Select value={formData.farmSizeUnit} onValueChange={(value) => handleInputChange("farmSizeUnit", value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="hectares">Hectares</SelectItem>
                        <SelectItem value="sqm">Sq. Meters</SelectItem>
                        <SelectItem value="sqft">Sq. Feet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="irrigationMethod">Irrigation Method *</Label>
                  <Select value={formData.irrigationMethod} onValueChange={(value) => handleInputChange("irrigationMethod", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select irrigation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drip">Drip Irrigation</SelectItem>
                      <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                      <SelectItem value="furrow">Furrow Irrigation</SelectItem>
                      <SelectItem value="basin">Basin Irrigation</SelectItem>
                      <SelectItem value="rainfed">Rain-fed (No Irrigation)</SelectItem>
                      <SelectItem value="manual">Manual Watering</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterSource">Water Source *</Label>
                <Select value={formData.waterSource} onValueChange={(value) => handleInputChange("waterSource", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borehole">Borehole</SelectItem>
                    <SelectItem value="well">Well</SelectItem>
                    <SelectItem value="river">River</SelectItem>
                    <SelectItem value="lake">Lake</SelectItem>
                    <SelectItem value="rainwater">Rainwater Harvesting</SelectItem>
                    <SelectItem value="municipal">Municipal Water</SelectItem>
                    <SelectItem value="spring">Natural Spring</SelectItem>
                    <SelectItem value="dam">Dam</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Information Section */}
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Fresh Organic Tomatoes"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="grains">Grains & Cereals</SelectItem>
                      <SelectItem value="herbs">Herbs & Spices</SelectItem>
                      <SelectItem value="dairy">Dairy Products</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  placeholder="Brief description for product cards"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed description of your product, growing methods, quality, etc."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity Available *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    placeholder="50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (KSh) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">per kg</SelectItem>
                      <SelectItem value="piece">per piece</SelectItem>
                      <SelectItem value="bunch">per bunch</SelectItem>
                      <SelectItem value="bag">per bag</SelectItem>
                      <SelectItem value="liter">per liter</SelectItem>
                      <SelectItem value="dozen">per dozen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Product Location (Where to pick up) *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Kangemi Market"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Product Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="e.g., Organic, Fresh, Local"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBadge())}
                  />
                  <Button type="button" onClick={addBadge} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {badge}
                      <button
                        type="button"
                        onClick={() => removeBadge(badge)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farming Practices Section */}
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Farming Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Fertilizers Used *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newFertilizer}
                    onChange={(e) => setNewFertilizer(e.target.value)}
                    placeholder="e.g., NPK, Compost, Urea"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFertilizer())}

                  />
                  <Button type="button" onClick={addFertilizer} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fertilizers.map((fertilizer, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {fertilizer}
                      <button
                        type="button"
                        onClick={() => removeFertilizer(fertilizer)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pests & Diseases *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newPest}
                    onChange={(e) => setNewPest(e.target.value)}
                    placeholder="e.g., Aphids, Powdery Mildew"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPest())}
                  />
                  <Button type="button" onClick={addPest} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pests.map((pest, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {pest}
                      <button
                        type="button"
                        onClick={() => removePest(pest)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pesticides Used *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newPesticide}
                    onChange={(e) => setNewPesticide(e.target.value)}
                    placeholder="e.g., Copper Sulfate, Neem Oil"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPesticide())}
                  />
                  <Button type="button" onClick={addPesticide} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pesticides.map((pesticide, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {pesticide}
                      <button
                        type="button"
                        onClick={() => removePesticide(pesticide)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Insecticides Used *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newInsecticide}
                    onChange={(e) => setNewInsecticide(e.target.value)}
                    placeholder="e.g., Pyrethrin, Diatomaceous Earth"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInsecticide())}
                  />
                  <Button type="button" onClick={addInsecticide} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insecticides.map((insecticide, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {insecticide}
                      <button
                        type="button"
                        onClick={() => removeInsecticide(insecticide)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Images Section */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Contact Information & Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    placeholder="+254 700 123 456"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product Images *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload product images</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB each (max 5 images)</p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    multiple
                    onChange={(e) => handleInputChange("images", Array.from(e.target.files))}
                    className="hidden"
                    id="imageUpload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => document.getElementById("imageUpload").click()}
                  >
                    Choose Files
                  </Button>
                </div>

                <div className="flex gap-2 flex-wrap mt-2">
                  {formData.images.length > 0 &&
                    formData.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={URL.createObjectURL(img) || "/placeholder.svg"}
                          alt="preview"
                          className="h-20 w-20 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, index) => index !== i),
                            }))
                          }
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                </div>

              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    "Submit Product Listing"
                  )}
                </Button>

                {submitStatus === 'error' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    Try Again
                  </Button>
                )}

                {submitStatus !== 'error' && (
                  <Button type="button" variant="outline" className="flex-1 bg-transparent">
                    Save as Draft
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
