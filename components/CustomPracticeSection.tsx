"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { api } from "@/src/lib/api";

export default function CustomPracticeSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("text");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image (jpg, png, webp).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }

    setError(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePhotoSubmit = async () => {
    if (!session) {
      router.push("/register");
      return;
    }
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      const base64Image = (await toBase64(image)).split(",")[1];
      const res = await api.post("/practice/custom-start-image", {
        imageBase64: base64Image,
        context,
      });
      router.push(`/practice/session/${res.data.sessionId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to analyze photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-white max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-[#0B0909] text-center mb-10">Custom Topic Practice</h2>
      
      <div className="flex justify-center gap-4 mb-8">
        {["text", "voice", "photo"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-bold capitalize ${activeTab === tab ? "bg-[#2E4540] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
        {activeTab === "photo" && (
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-[#2E4540] transition"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
              ) : (
                <p className="text-gray-500">Click to upload or drag & drop a photo (JPG, PNG, WebP, max 5MB)</p>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>

            <textarea 
              value={context} 
              onChange={(e) => setContext(e.target.value)}
              placeholder="Add context (optional) - e.g., 'this is from my vacation'"
              className="w-full p-4 rounded-xl border border-gray-200"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button 
              onClick={handlePhotoSubmit}
              disabled={loading || !image}
              className="w-full bg-[#B5B9F0] text-[#0B0909] py-4 rounded-full font-bold hover:bg-[#a1a5e0] transition disabled:opacity-50"
            >
              {loading ? "Analyzing your photo..." : "Create Practice Session from This Photo"}
            </button>
          </div>
        )}
        {/* Placeholder for other tabs */}
        {activeTab !== "photo" && <p className="text-center text-gray-500">{activeTab} input coming soon</p>}
      </div>
    </section>
  );
}
