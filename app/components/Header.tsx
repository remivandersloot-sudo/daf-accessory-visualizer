export default function Header() {
  return (
  <header
    style={{
      marginBottom: "32px",
      padding: "32px",
      borderRadius: "18px",
      background:
        "linear-gradient(135deg, #0b2f57 0%, #0d5ea6 100%)",
      color: "white",
      boxShadow: "0 12px 30px rgba(15, 47, 87, 0.18)",
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: "14px",
        fontWeight: 700,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        opacity: 0.8,
      }}
    >
      AI Truck Customization
    </p>

    <h1
      style={{
        margin: "10px 0 12px",
        fontSize: "38px",
        lineHeight: 1.1,
      }}
    >
      DAF Accessory Visualizer
    </h1>

    <p
      style={{
        margin: 0,
        maxWidth: "900px",
        fontSize: "18px",
        lineHeight: 1.6,
        opacity: 0.92,
      }}
    >
      Upload een foto van jouw DAF-truck en bekijk hoe geselecteerde
      accessoires eruit kunnen zien.
    </p>
  </header>
);
}