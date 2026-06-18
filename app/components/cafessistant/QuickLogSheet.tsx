import { useState, useRef, useEffect } from "react";
import { X, Camera, Coffee, MapPin, FileText } from "lucide-react";
import { StarRating } from "./StarRating";
import { AINotesHelper } from "./AINotesHelper";
import { useConfigurables } from "~/modules/configurables";

interface QuickLogSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LogFormData) => Promise<void>;
}

export interface LogFormData {
  shopName: string;
  city: string;
  country: string;
  address: string;
  rating: number;
  tastingNotes: string;
  photoFile?: File;
}

export function QuickLogSheet({ open, onClose, onSubmit }: QuickLogSheetProps) {
  const { config } = useConfigurables();
  const primaryColor = config?.brandColor?.primary ?? "#2C1A0E";
  const accentColor = config?.brandColor?.accent ?? "#C97C3A";
  const bgColor = config?.backgroundColor ?? "#F5F0E8";
  const surfaceColor = config?.surfaceColor ?? "#EDE6D6";
  const textSecondary = config?.textSecondaryColor ?? "#7A6F65";
  const enablePhoto = config?.enablePhotoUpload !== false;

  const [form, setForm] = useState<LogFormData>({
    shopName: "",
    city: "",
    country: "",
    address: "",
    rating: 0,
    tastingNotes: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shopNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm({ shopName: "", city: "", country: "", address: "", rating: 0, tastingNotes: "" });
      setPhotoPreview(null);
      setError("");
      setTimeout(() => shopNameRef.current?.focus(), 300);
    }
  }, [open]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, photoFile: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shopName.trim()) { setError("Shop name is required"); return; }
    if (!form.city.trim()) { setError("City is required"); return; }
    if (!form.rating) { setError("Please select a star rating"); return; }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to log visit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ backgroundColor: bgColor, maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: `${primaryColor}33` }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5" style={{ color: accentColor }} />
            <h2
              className="text-xl font-semibold"
              style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
            >
              Log a visit
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: surfaceColor }}
            aria-label="Close"
          >
            <X className="w-4 h-4" style={{ color: primaryColor }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-8 space-y-4">
          {/* Star Rating — large tap targets, top of form */}
          <div
            className="rounded-2xl p-4 flex flex-col items-center gap-2"
            style={{ backgroundColor: surfaceColor }}
          >
            <p className="text-sm font-medium" style={{ color: textSecondary }}>How was it?</p>
            <StarRating value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} size="lg" />
            <p className="text-xs" style={{ color: `${textSecondary}99` }}>
              {form.rating === 0 ? "Tap to rate" : ["", "Poor", "Fair", "Good", "Great", "Outstanding"][form.rating]}
            </p>
          </div>

          {/* Shop name */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: primaryColor }}>
              <Coffee className="w-4 h-4 inline mr-1.5" />
              Coffee shop name *
            </label>
            <input
              ref={shopNameRef}
              type="text"
              placeholder="e.g. Onibus Coffee"
              value={form.shopName}
              onChange={(e) => setForm((f) => ({ ...f, shopName: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2"
              style={{
                backgroundColor: surfaceColor,
                color: primaryColor,
                border: `1.5px solid ${accentColor}44`,
              }}
            />
          </div>

          {/* City + Country row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: primaryColor }}>
                <MapPin className="w-4 h-4 inline mr-1" />
                City *
              </label>
              <input
                type="text"
                placeholder="e.g. Tokyo"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-base focus:outline-none"
                style={{
                  backgroundColor: surfaceColor,
                  color: primaryColor,
                  border: `1.5px solid ${accentColor}44`,
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>Country</label>
              <input
                type="text"
                placeholder="e.g. Japan"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-base focus:outline-none"
                style={{
                  backgroundColor: surfaceColor,
                  color: primaryColor,
                  border: `1.5px solid ${accentColor}44`,
                }}
              />
            </div>
          </div>

          {/* Address (optional) */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>Address (optional)</label>
            <input
              type="text"
              placeholder="Street address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-base focus:outline-none"
              style={{
                backgroundColor: surfaceColor,
                color: primaryColor,
                border: `1.5px solid ${accentColor}44`,
              }}
            />
          </div>

          {/* Tasting notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium" style={{ color: primaryColor }}>
                <FileText className="w-4 h-4 inline mr-1.5" />
                Tasting notes (optional)
              </label>
              <AINotesHelper
                shopName={form.shopName}
                rating={form.rating}
                onSuggestion={(notes) => setForm((f) => ({ ...f, tastingNotes: notes }))}
                accentColor={accentColor}
                textSecondaryColor={textSecondary}
              />
            </div>
            <textarea
              placeholder="Notes on flavour, vibe, what you ordered..."
              value={form.tastingNotes}
              onChange={(e) => setForm((f) => ({ ...f, tastingNotes: e.target.value }))}
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-base focus:outline-none resize-none"
              style={{
                backgroundColor: surfaceColor,
                color: primaryColor,
                border: `1.5px solid ${accentColor}44`,
                lineHeight: "1.6",
              }}
            />
          </div>

          {/* Photo upload */}
          {enablePhoto && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>
                <Camera className="w-4 h-4 inline mr-1.5" />
                Photo (optional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden h-32">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhotoPreview(null); setForm((f) => ({ ...f, photoFile: undefined })); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium"
                  style={{ backgroundColor: surfaceColor, border: `1.5px dashed ${accentColor}66`, color: textSecondary }}
                >
                  <Camera className="w-4 h-4" />
                  Add a photo
                </button>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl py-4 text-base font-semibold transition-all duration-150 active:scale-98 disabled:opacity-60"
            style={{
              backgroundColor: accentColor,
              color: "#fff",
              boxShadow: `0 4px 20px ${accentColor}44`,
            }}
          >
            {submitting ? "Logging..." : "Log it"}
          </button>
        </form>
      </div>
    </>
  );
}
