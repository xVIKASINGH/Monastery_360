"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Upload, X, MapPin, DollarSign, Home, User } from "lucide-react";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export default function HotelUploadTestPage() {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    // Calculate remaining slots and append new files up to the limit (5)
    const remainingSlots = Math.max(0, 5 - images.length);
    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    // Deduplicate by name + size to avoid duplicates
    const existingKeySet = new Set(images.map((f) => `${f.name}-${f.size}`));
    const dedupedFilesToAdd = filesToAdd.filter(
      (f) => !existingKeySet.has(`${f.name}-${f.size}`)
    );


    // Append previews for new files only
    const newPreviews = dedupedFilesToAdd.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...dedupedFilesToAdd].slice(0, 5));
    setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 5));

    // Reset the input value so the same file can be selected again if needed
    e.currentTarget.value = "";
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke the URL to free memory
    const toRevoke = imagePreviews[index];
    if (toRevoke) URL.revokeObjectURL(toRevoke);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Cleanup previews on unmount / when previews change, revoke old URLs
  useEffect(() => {
    const prevPreviews = imagePreviews;
    return () => {
      prevPreviews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [imagePreviews]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData();
    
    formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
    formData.append("description", (form.elements.namedItem("description") as HTMLInputElement).value);
    formData.append("address", (form.elements.namedItem("address") as HTMLInputElement).value);
    formData.append("pricePerNight", (form.elements.namedItem("pricePerNight") as HTMLInputElement).value);
    formData.append("closestMonastery", (form.elements.namedItem("closestMonastery") as HTMLInputElement).value);
    formData.append("owner", (form.elements.namedItem("owner") as HTMLInputElement).value);
    formData.append("lat", (form.elements.namedItem("lat") as HTMLInputElement).value);
    formData.append("lng", (form.elements.namedItem("lng") as HTMLInputElement).value);

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await fetch("/api/book-hotel", {
        method: "POST",
        body: formData,
      });
      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (err: unknown) {
      console.error(err);
      setResponse({
        success: false,
        message: "Failed to submit form. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Hotel</h1>
            <p className="text-gray-600">Fill in the details to list your property</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hotel Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Home className="w-4 h-4 mr-2" />
                Hotel Name
              </label>
              <input
                name="name"
                placeholder="Enter hotel name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your hotel"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </label>
              <input
                name="address"
                placeholder="Enter full address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Price and Monastery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Price Per Night
                </label>
                <input
                  name="pricePerNight"
                  type="number"
                  placeholder="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closest Monastery
                </label>
                <input
                  name="closestMonastery"
                  placeholder="Monastery name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Owner */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2" />
                Owner User ID
              </label>
              <input
                name="owner"
                placeholder="Enter owner ID"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  name="lat"
                  placeholder="e.g., 23.2599"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  name="lng"
                  placeholder="e.g., 77.4126"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hotel Images (Max 5)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                <input
                  type="file"
                  id="imageUpload"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600 mb-1">
                    Click to upload images
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG up to 10MB (max 5 images)
                  </span>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Add Hotel"}
            </button>
          </form>

          {/* Response Message */}
          {response && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                response.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  response.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {response.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}