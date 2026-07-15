"use client";

import { ChangeEvent, useState } from "react";

type UploadPanelProps = {
  onImageSelected: (file: File | null) => void;
};

export default function UploadPanel({
  onImageSelected,
}: UploadPanelProps) {

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

   if (!selectedFile) {
  setPreviewUrl(null);
  onImageSelected(null);
  return;
}

    const imageUrl = URL.createObjectURL(selectedFile);

setPreviewUrl(imageUrl);
onImageSelected(selectedFile);
  }

  return (
 <section
  style={{
    width: "100%",
    boxSizing: "border-box",
  }}
><div
  style={{
    marginBottom: "22px",
  }}
>
  <div
    style={{
      fontSize: "13px",
      fontWeight: 700,
      color: "#6b7b8c",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
    }}
  >
    Stap 1
  </div>

  <h2
    style={{
      margin: "4px 0 6px",
      fontSize: "30px",
      color: "#17324d",
    }}
  >
    Upload truckfoto
  </h2>

  <p
    style={{
      margin: 0,
      fontSize: "15px",
      color: "#66788a",
      lineHeight: 1.5,
    }}
  >
    Kies een duidelijke foto waarop de truck goed zichtbaar is.
  </p>
</div>
     <div
  style={{
    padding: "26px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, #0b63ce 0%, #084c9e 100%)",
    boxShadow: "0 10px 26px rgba(11, 99, 206, 0.22)",
  }}
>
      <label
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 18px",
    background: "linear-gradient(135deg, #0b63ce 0%, #084c9e 100%)",
    color: "white",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(11, 99, 206, 0.22)",
  }}
>
  📁 Upload truckfoto

  <input
    type="file"
    accept="image/png,image/jpeg,image/webp"
    onChange={handleImageChange}
    style={{ display: "none" }}
  />
</label>
{previewUrl && (
  <span
    style={{
      color: "white",
      fontWeight: 600,
    }}
  >
    ✅ Truckfoto geselecteerd
  </span>
)}
      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          
          <img
            src={previewUrl}
            alt="Voorbeeld van de geüploade truck"
            style={{
              width: "100%",
              maxWidth: "700px",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
      </div>
    </section>
  );
}