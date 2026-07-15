"use client";

import { useState } from "react";
import Header from "./components/Header";
import UploadPanel from "./components/UploadPanel";
import AccessorySelector from "./components/AccessorySelector";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  async function handleGenerate() {
    if (!selectedImage) {
      alert("Upload eerst een truckfoto.");
      return;
    }

    if (selectedAccessories.length === 0) {
      alert("Selecteer minimaal één accessoire.");
      return;
    }

    const formData = new FormData();

formData.append("image", selectedImage);

formData.append(
  "accessories",
  JSON.stringify(selectedAccessories)
);
const accessoryImages: Record<string, string> = {
  lightbar: "/accessories/lightbar.png",
  airhorns: "/accessories/airhorns.png",
  "led-logo": "/accessories/led-logo.png",
  sunvisor: "/accessories/sunvisor.png",
};

for (const accessoryId of selectedAccessories) {
  const imagePath = accessoryImages[accessoryId];

  if (!imagePath) {
    continue;
  }

  const referenceResponse = await fetch(imagePath);
  const referenceBlob = await referenceResponse.blob();

  formData.append(
    "referenceImages",
    referenceBlob,
    `${accessoryId}.png`
  );
}
const response = await fetch("/api/generate", {
  method: "POST",
  body: formData,
});

const result = await response.json();

if (result.image) {
  setGeneratedImage(result.image);
} else {
  alert(result.error ?? "Er is iets misgegaan.");
}
  }

  return (
    <div
  style={{
    minHeight: "100vh",
    background:
  "linear-gradient(180deg, #dce5ef 0%, #edf2f7 55%, #d5e0ec 100%)",
  }}
>
  <main
    style={{
      maxWidth: "1440px",
      margin: "0 auto",
      padding: "48px 24px 64px",
      fontFamily: "Arial, sans-serif",
      color: "#102033",
    }}
  >
      <Header />

      <hr />

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.35fr) minmax(420px, 1fr)",
    gap: "32px",
    alignItems: "start",
    marginTop: "32px",
  }}
>
  <UploadPanel
    onImageSelected={setSelectedImage}
  />

  <AccessorySelector
    onSelectionChange={setSelectedAccessories}
  />
</div>

      <br />
      <br />

      <button
  onClick={handleGenerate}
  style={{
  marginTop: "24px",
  padding: "12px 18px",
  background:
    "linear-gradient(135deg, #0b63ce 0%, #084c9e 100%)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: 700,
  fontFamily: "Arial, sans-serif",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(11, 99, 206, 0.22)",
}}
>
  Maak visualisatie
</button>

<div
  style={{
    marginTop: "24px",
    padding: "18px 22px",
    backgroundColor: "white",
    borderRadius: "14px",
    border: "1px solid #ccd7e2",
    boxShadow: "0 6px 18px rgba(30, 55, 80, 0.08)",
  }}
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "24px",
    }}
  >
    <div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#6b7b8c",
          marginBottom: "5px",
        }}
      >
        Truckfoto
      </div>

      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#17324d",
        }}
      >
        {selectedImage
          ? selectedImage.name
          : "Nog geen truckfoto geselecteerd"}
      </div>
    </div>

    <div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#6b7b8c",
          marginBottom: "5px",
        }}
      >
        Accessoires
      </div>

      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#17324d",
        }}
      >
        {selectedAccessories.length > 0
          ? selectedAccessories.join(", ")
          : "Nog geen accessoires geselecteerd"}
      </div>
    </div>
  </div>
</div>
{generatedImage && (
  <div
    style={{
      marginTop: "32px",
      background: "white",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    }}
  >
    <h2>✨ AI Visualisatie</h2>

    <img
      src={generatedImage}
      alt="AI visualisatie"
      style={{
        width: "100%",
        borderRadius: "12px",
      }}
    />
  </div>
)}
</main>
</div>
  );
}