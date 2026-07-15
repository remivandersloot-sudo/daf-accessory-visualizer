type AccessoryCardProps = {
  name: string;
  image: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function AccessoryCard({
  name,
  image,
  checked,
  onChange,
}: AccessoryCardProps) {
  return (
  <div
    onClick={() => onChange(!checked)}  
style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      boxSizing: "border-box",

      border: checked
        ? "2px solid #0b63ce"
        : "1px solid #d7dee8",

      borderRadius: "16px",
      padding: "16px",
      backgroundColor: checked ? "#dbeafe" : "white",

      boxShadow: checked
        ? "0 10px 24px rgba(11, 99, 206, 0.16)"
        : "0 6px 18px rgba(30, 55, 80, 0.08)",

      cursor: "pointer",
      transition: "all .2s ease",
    }}
  >
    <div
      style={{
        height: "190px",
        borderRadius: "12px",
        backgroundColor: "#f6f8fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={image}
        alt={name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>

    <h3
      style={{
        margin: "16px 0 12px",
        fontSize: "18px",
        minHeight: "44px",
      }}
    >
      {name}
    </h3>
<p
  style={{
    margin: "0",
    marginTop: "auto",
    paddingTop: "12px",
    color: checked ? "#0b63ce" : "#7b8794",
    fontWeight: 700,
    textAlign: "center",
}}
>
  {checked ? "✓ Geselecteerd" : "Klik om te selecteren"}
</p>
   
  </div>
);
}