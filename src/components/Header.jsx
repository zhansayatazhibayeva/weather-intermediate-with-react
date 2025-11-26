export function Header() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "1290px",
          marginLeft: "100px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <div style={{ display: "flex" }}>
          <img src="/public/logo.svg" />
        </div>
        <div>
          <p
            style={{
              background: "#D3D3D3",
              borderRadius: "10px",
              padding: "10px",
              color: "white",
            }}
          >
            Units
          </p>
        </div>
      </div>
    </>
  );
}
