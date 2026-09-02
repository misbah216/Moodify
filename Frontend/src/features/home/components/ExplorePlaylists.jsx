import { useState } from "react";

const lockedPlaylists = [
  { name: "Bus Wale Bhaiya Ki Playlist" },
  { name: "Papa Ki Playlist" },
  { name: "2 AM Hostel Playlist" },
  { name: "Auto Wale Bhaiya Ki Playlist" },
];

function ExplorePlaylists() {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState([]);

  const handlePlaylistClick = (playlistName) => {
    if (unlocked.includes(playlistName)) {
      alert(`${playlistName} already unlocked! Playing songs...`);
      return;
    }

    const options = {
      key: "rzp_test_TXAeUta7HIC6Fa",
      amount: 2000, 
      currency: "INR",
      name: "Moodify",
      description: `Unlock ${playlistName}`,
      handler: async function (response) {
        await fetch("http://localhost:3000/payment/unlock", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
        playlistName: playlistName,
        paymentId: response.razorpay_payment_id,
        }),
      });
  setUnlocked((prev) => [...prev, playlistName]);
},
      prefill: {
        name: "",
        email: "",
      },
      theme: {
        color: "#ff3d9a",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ position: "absolute",left:'20px', top:"20px", zIndex:100  }}>
     <button
    onClick={() => setOpen(!open)}
    style={{
    background: "transparent",
    border: "2px solid #ff007f",
    color: "#ffffff",
    borderRadius: "25px",
    padding: "10px 24px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 0 12px #ff007f, inset 0 0 8px rgba(255, 0, 127, 0.4)",
    transition: "all 0.3s ease-in-out"
    }}
  >
  Explore More Playlists
  </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a1a1a",
            border: "1px solid #ff3d9a",
            borderRadius: "10px",
            padding: "10px",
            width: "240px",
            zIndex: 50,
          }}
        >
          {lockedPlaylists.map((pl, idx) => (
            <div
              key={idx}
              onClick={() => handlePlaylistClick(pl.name)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 6px",
                borderBottom:
                  idx !== lockedPlaylists.length - 1
                    ? "1px solid #333"
                    : "none",
                color: "#fff",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <span>{pl.name}</span>
              <span style={{ color: unlocked.includes(pl.name) ? "#4ade80" : "#ff3d9a" }}>
                {unlocked.includes(pl.name) ? "🔓" : "🔒"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExplorePlaylists;