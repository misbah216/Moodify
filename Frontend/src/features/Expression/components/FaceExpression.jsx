import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";

function FaceExpression({ currentExpression, onMoodChange, isDetected, onDetectAgain, onExpressionChange, cleanupRef }) {
  const videoRef = useRef(null);
  const animationRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Click to detect");

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (cleanupRef) cleanupRef.current = stopCamera;

    if (!isDetected) {
      init({ landmarkerRef, videoRef, streamRef, setExpression: updateExpression });
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
      if (cleanupRef) cleanupRef.current = null;
    };
  }, [cleanupRef, isDetected]);

  useEffect(() => () => {
    if (landmarkerRef.current) {
      landmarkerRef.current.close();
    }
  }, []);

  useEffect(() => {
    if (currentExpression === null) setExpression("Click to detect");
  }, [currentExpression]);

  const updateExpression = (value) => {
    setExpression(value);
    onExpressionChange?.(value);
  };

  const handleMoodChange = (newMood) => {
    if (!newMood) return;

    const cleanMood = newMood.split(" ")[0].toLowerCase();
    const validMoods = ["happy", "sad", "surprised"];

    if (validMoods.includes(cleanMood) && onMoodChange) {
      onMoodChange(cleanMood);
      onDetectAgain?.(true);
    }
  };

  const handleDetectMood = () => {
    detect({
      landmarkerRef,
      videoRef,
      animationRef,
      setExpression: updateExpression,
      onMoodChange: handleMoodChange,
    });
  };

  const handleDetectAgain = () => {
    stopCamera();
    onDetectAgain?.(false);
  };

  return (
    <div
      className="face-expression"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
        width: "100%",
        boxSizing: "border-box",
        minWidth: 0,
        backgroundColor: 'black',
        color: "#ffffff",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      {isDetected ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: "#121212",
            padding: "18px 20px",
            border: "1px solid rgba(255, 105, 180, 0.35)",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(255, 105, 180, 0.15)",
          }}
        >
          <div style={{ color: "#ffffff", fontWeight: "600" }}>
            Detected Mood: <span style={{ color: "#ff69b4", textTransform: "capitalize" }}>{currentExpression ?? expression}</span>
          </div>
          <button
            type="button"
            onClick={handleDetectAgain}
            style={{
              position: "relative",
              zIndex: 10,
              pointerEvents: "auto",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid #ff69b4",
              backgroundColor: "#d81b60",
              color: "#ffffff",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Detect Again
          </button>
        </div>
      ) : (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          width: "100%",
          boxSizing: "border-box",
          minWidth: 0,
          backgroundColor: "#121212",
          padding: "24px",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(255, 105, 180, 0.15)",
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: "16px",
            overflow: "hidden",
            border: "2px solid #ff69b4",
            boxShadow: "0 0 15px rgba(255, 105, 180, 0.3)",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="480"
            style={{
              display: "block",
              width: "100%",
              maxWidth: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          className="face-expression__controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "1.2rem",
            fontWeight: "600",
            color: "#ffffff",
          }}
        >
          <span>Detected Mood:</span>
          <span
            style={{
              color: "#ff69b4",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            {currentExpression ?? expression}
          </span>
        </div>

        <button
          type="button"
          onClick={handleDetectMood}
          style={{
            position: "relative",
            zIndex: 999,
            pointerEvents: "auto",
            padding: "12px 32px",
            borderRadius: "50px",
            border: "none",
            backgroundColor: "#ff69b4",
            color: "#ffffff",
            fontSize: "0.95rem",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 15px rgba(255, 105, 180, 0.4)",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Detect Expression 🎧
        </button>
      </div>
      )}
    </div>
  );
}

export default FaceExpression;