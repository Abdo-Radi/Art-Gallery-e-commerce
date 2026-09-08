import { useRef } from "react";

/**
 * Image picker with preview and upload feedback.
 *
 * Replaces the raw `<input type="file">`, which showed the browser's own
 * "No file chosen" chrome, gave no confirmation that the upload had finished,
 * and no way to see what had actually been attached.
 *
 * Presentational only — the parent still owns the upload handler, so `onChange`
 * receives the native change event exactly as before.
 */
const ImageField = ({
  label = "Image",
  required = false,
  value,
  onChange,
  uploading = false,
  error,
  hint = "JPG or PNG",
  currentLabel = "Uploaded",
}) => {
  const inputRef = useRef(null);
  const openPicker = () => inputRef.current?.click();

  return (
    <div>
      <label className="label-cap mb-2 block">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="sr-only"
      />

      {value ? (
        <div className="border border-line bg-surface/50 p-2">
          <img
            src={value}
            alt="Selected preview"
            className="h-36 w-full object-cover"
          />
          <div className="flex items-center justify-between gap-3 px-1 pt-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-success">
              <i className="ri-check-line text-sm" />
              {currentLabel}
            </span>
            <button
              type="button"
              onClick={openPicker}
              disabled={uploading}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-klein transition-colors hover:text-klein-deep"
            >
              {uploading ? "Uploading…" : "Replace"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="upload-zone"
        >
          {uploading ? (
            <>
              <i className="ri-loader-4-line animate-spin text-2xl text-klein" />
              <span className="text-sm text-ink">Uploading…</span>
            </>
          ) : (
            <>
              <i className="ri-image-add-line text-2xl text-stone" />
              <span className="text-sm font-medium text-ink">
                Choose an image
              </span>
              <span className="text-xs text-stone">{hint}</span>
            </>
          )}
        </button>
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
};

export default ImageField;
