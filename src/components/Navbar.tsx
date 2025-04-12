type NavbarProps = {
  current: string;
  onNavigate: (view: string) => void;
};

export function Navbar({ current, onNavigate }: NavbarProps) {
  return (
    <>
      <nav className="header-bar">
        <span className="header-title">PETGAS Ecosystem Manager</span>
        <button
          className={`nav-btn${current === "dashboard" ? " active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </button>
        <div style={{ flexGrow: 1 }} />
        <button
          className={`nav-btn${current === "newlead" ? " active" : ""}`}
          onClick={() => onNavigate("newlead")}
        >
          Nuevo Lead
        </button>
        <img
          src="https://petgas.com.do/wp-content/uploads/2025/03/cropped-cropped-favi.png"
          alt="PETGAS Logo"
          className="logo-img glowing-logo"
        />
      </nav>
      <div className="info-bar">
        <img
          src="https://petgas.com.do/wp-content/uploads/2025/03/cropped-cropped-favi.png"
          alt="PETGAS Logo"
          className="logo-img"
          style={{ width: 28, height: 28, marginRight: 8 }}
        />
        PETGAS - Plataforma inteligente para captar, segmentar y optimizar leads para reciclaje de plásticos y venta de plantas de pirólisis.
      </div>
    </>
  );
}
