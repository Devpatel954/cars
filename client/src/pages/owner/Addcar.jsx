// src/pages/owner/AddCar.jsx
import React, { useRef, useState } from "react"
import Title from "../../components/owner/Title"

const initialState = {
  brand: "",
  model: "",
  year: "",
  fuelType: "",
  transmission: "",
  seats: "",
  pricePerDay: "",
  location: "",
  description: "",
}

const AddCar = () => {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [images, setImages] = useState([]) // File[]
  const [previews, setPreviews] = useState([]) // data URLs
  const [submitting, setSubmitting] = useState(false)
  const dropRef = useRef(null)
  const fileInputRef = useRef(null)

  const currency = import.meta.env.VITE_CURRENCY || "$"

  // ----------------- helpers -----------------
  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.brand.trim()) e.brand = "Brand is required"
    if (!form.model.trim()) e.model = "Model is required"
    if (!form.year || Number.isNaN(+form.year) || +form.year < 1990 || +form.year > new Date().getFullYear() + 1) {
      e.year = "Enter a valid year"
    }
    if (!form.fuelType) e.fuelType = "Fuel type is required"
    if (!form.transmission) e.transmission = "Transmission is required"
    if (!form.seats || +form.seats < 2 || +form.seats > 15) e.seats = "Seats must be between 2 and 15"
    if (!form.pricePerDay || +form.pricePerDay <= 0) e.pricePerDay = "Enter a valid price"
    if (!form.location.trim()) e.location = "Location is required"
    if (!form.description.trim() || form.description.length < 10) e.description = "Add a brief description (10+ chars)"
    if (images.length === 0) e.images = "Please upload at least 1 image"
    return e
  }

  const toPreviewURLs = (files) =>
    Promise.all(
      [...files].map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.readAsDataURL(file)
          })
      )
    )

  // ----------------- image handlers -----------------
  const onFilesPicked = async (fileList) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"]
    const accepted = [...fileList].filter((f) => allowed.includes(f.type))
    if (accepted.length === 0) return
    const prev = images
    const nextFiles = [...prev, ...accepted].slice(0, 6) // cap at 6 images
    setImages(nextFiles)
    const newPreviews = await toPreviewURLs(accepted)
    setPreviews((p) => [...p, ...newPreviews].slice(0, 6))
    if (errors.images) setErrors((prev) => ({ ...prev, images: undefined }))
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropRef.current?.classList.remove("ring-2", "ring-primary/60")
    if (e.dataTransfer?.files?.length) onFilesPicked(e.dataTransfer.files)
  }
  const onDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropRef.current?.classList.add("ring-2", "ring-primary/60")
  }
  const onDragLeave = () => {
    dropRef.current?.classList.remove("ring-2", "ring-primary/60")
  }

  const removeImageAt = (idx) => {
    setImages((arr) => arr.filter((_, i) => i !== idx))
    setPreviews((arr) => arr.filter((_, i) => i !== idx))
  }

  // ----------------- submit -----------------
  const onSubmit = async (e) => {
    e.preventDefault()
    const eMap = validate()
    setErrors(eMap)
    if (Object.keys(eMap).length) return

    try {
      setSubmitting(true)
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('You must be logged in')
      }

      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (images.length > 0) {
        fd.append('image', images[0]) // Use first image
      }

      // POST to backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
      const res = await fetch(`${apiUrl}/api/owner/add-car`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: fd,
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to upload car")
      }

      // reset on success
      setForm(initialState)
      setImages([])
      setPreviews([])
      setErrors({})
      alert("Car added successfully 🎉")
    } catch (err) {
      console.error(err)
      alert(`Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  // ----------------- UI -----------------
  return (
    <div className="flex-1 px-4 pt-10 md:px-10">
      <Title title="Add New Car" SubTitle="Upload car details and photos" />

      <form onSubmit={onSubmit} className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Left column */}
        <div className="md:col-span-2 grid gap-6">
          {/* Basic info */}
          <div className="rounded-xl border border-borderColor p-4 md:p-6">
            <h2 className="text-lg font-semibold">Car Details</h2>
            <p className="text-sm text-gray-500">Core information about the car</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600">Brand *</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setField("brand", e.target.value)}
                  placeholder="e.g., Toyota"
                  className="mt-1 w-full rounded-md border border-borderColor px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.brand && <p className="mt-1 text-xs text-red-600">{errors.brand}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-600">Model *</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => setField("model", e.target.value)}
                  placeholder="e.g., Corolla"
                  className="mt-1 w-full rounded-md border border-borderColor px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.model && <p className="mt-1 text-xs text-red-600">{errors.model}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-600">Year *</label>
                <input
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={(e) => setField("year", e.target.value)}
                  placeholder="e.g., 2020"
                  className="mt-1 w-full rounded-md border border-borderColor px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-600">Fuel Type *</label>
                <select
                  value={form.fuelType}
                  onChange={(e) => setField("fuelType", e.target.value)}
                  className="mt-1 w-full rounded-md border border-borderColor px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Select fuel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
                {errors.fuelType && <p className="mt-1 text-xs text-red-600">{errors.fuelType}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-600">Transmission *</label>
                <select
                  value={form.transmission}
                  onChange={(e) => setField("transmission", e.target.value)}
                  className="mt-1 w-full rounded-md border border-borderColor px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Select transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
                {errors.transmission && <p className="mt-1 text-xs text-red-600">{errors.transmission}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-600">Seats *</label>
                <input
                  type="number"
                  min="2"
                  max="15"
                  value={form.seats}
                  onChange={(e) => setField("seats", e.target.value)}
                  placeholder="e.g., 5"
                  className="mt-1 w-full rounded-md border border-borderColor px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.seats && <p className="mt-1 text-xs text-red-600">{errors.seats}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-600">Price / Day ({currency}) *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.pricePerDay}
                  onChange={(e) => setField("pricePerDay", e.target.value)}
                  placeholder="e.g., 60"
                  className="mt-1 w-full rounded-md border border-borderColor px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.pricePerDay && <p className="mt-1 text-xs text-red-600">{errors.pricePerDay}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600">Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  placeholder="City, State"
                  className="mt-1 w-full rounded-md border border-borderColor px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600">Description *</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Condition, features, restrictions, etc."
                  className="mt-1 w-full rounded-md border border-borderColor px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-5 py-2.5 text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Add Car"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initialState)
                setImages([])
                setPreviews([])
                setErrors({})
              }}
              className="rounded-lg border border-borderColor px-5 py-2.5 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right column - Uploader */}
        <div className="rounded-xl border border-borderColor p-4 md:p-6">
          <h2 className="text-lg font-semibold">Photos</h2>
          <p className="text-sm text-gray-500">PNG, JPG, or WEBP up to 6 files</p>

          <div
            ref={dropRef}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-borderColor p-6 text-center hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h10a4 4 0 100-8h-1M7 15l4-4 4 4" />
            </svg>
            <p className="mt-2 text-sm">Drag & drop images here, or click to browse</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && onFilesPicked(e.target.files)}
            />
          </div>
          {errors.images && <p className="mt-2 text-xs text-red-600">{errors.images}</p>}

          {/* Previews */}
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {previews.map((src, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-md border border-borderColor">
                  <img src={src} alt={`preview-${idx}`} className="h-32 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImageAt(idx)}
                    className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default AddCar
