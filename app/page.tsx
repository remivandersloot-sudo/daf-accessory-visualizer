"use client";

import { useState } from "react";
import Header from "./components/Header";
import UploadPanel from "./components/UploadPanel";
import AccessorySelector from "./components/AccessorySelector";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    if (!selectedImage) {
      alert("Upload eerst een truckfoto.");
      return;
    }

    if (selectedAccessories.length === 0) {
      alert("Selecteer minimaal één accessoire.");
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedImage(null);

      const formData = new FormData();

      formData.append("image", selectedImage);
      formData.append(
        "accessories",
        JSON.stringify(selectedAccessories)
      );

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();

      let result: {
        image?: string;
        error?: string;
      };

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          `De server gaf geen geldige reactie terug. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.error ?? `De server gaf foutcode ${response.status}.`
        );
      }

      if (!result.image) {
        throw new Error("OpenAI heeft geen afbeelding teruggestuurd.");
      }

      setGeneratedImage(result.image);
    } catch (error) {
      console.error("Generate request failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "De visualisatie kon niet worden gemaakt."
      );
    } finally {
      setIsGenerating(false);
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
            gridTemplateColumns:
              "minmax(0, 1.35fr) minmax(420px, 1fr)",
            gap: "32px",
            alignItems: "start",
            marginTop: "32px",
          }}
        >
          <UploadPanel onImageSelected={setSelectedImage} />

          <AccessorySelector
            onSelectionChange={setSelectedAccessories}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            marginTop: "48px",
            padding: "12px 18px",
            background: isGenerating
              ? "#8ca3ba"
              : "linear-gradient(135deg, #0b63ce 0%, #084c9e 100%)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 700,
            fontFamily: "Arial, sans-serif",
            cursor: isGenerating ? "not-allowed" : "pointer",
            boxShadow: isGenerating
              ? "none"
              : "0 8px 20px rgba(11, 99, 206, 0.22)",
            opacity: isGenerating ? 0.8 : 1,
          }}
        >
          {isGenerating
            ? "Visualisatie wordt gemaakt..."
            : "Maak visualisatie"}
        </button>

        {isGenerating && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px 20px",
              backgroundColor: "#e8f1fb",
              border: "1px solid #b8d0e8",
              borderRadius: "12px",
              color: "#17324d",
              fontWeight: 600,
            }}
          >
            De AI verwerkt de truckfoto en geselecteerde accessoires. Dit kan
            enkele minuten duren.
          </div>
        )}

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