import React from "react";

function SplashScreen() {
  const emojis = ["😊", "😢", "😮", "🎧", "🎵", "💃", "🕺", "🥰", "😎", "🎶", "🤩", "🎤"];

  return (
    <div style={styles.container}>
      {/* Background Floating Emojis */}
      <div style={styles.emojiBackground}>
        {Array.from({ length: 40 }).map((_, index) => {
          const randomEmoji = emojis[index % emojis.length];
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const size = Math.random() * 20 + 20;

          return (
            <span
              key={index}
              style={{
                position: "absolute",
                top: `${top}%`,
                left: `${left}%`,
                fontSize: `${size}px`,
                opacity: 0.15,
                userSelect: "none",
              }}
            >
              {randomEmoji}
            </span>
          );
        })}
      </div>

      {/* Glowy Pink Title */}
      <h1 style={styles.title}>Moodify</h1>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#000000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    overflow: "hidden",
  },
  emojiBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    pointerEvents: "none",
  },
  title: {
    fontSize: "5rem",
    fontWeight: "bold",
    color: "#ff69b4",
    textShadow: "0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 40px #ff1493, 0 0 80px #ff1493",
    letterSpacing: "4px",
    zIndex: 2,
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
};

export default SplashScreen;