import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";

function FaceExpression() {
  const videoRef = useRef(null);
  const animationRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");


  useEffect(() => {
    
    init({landmarkerRef, videoRef, streamRef , setExpression});

    
    return () => {
      if (landmarkerRef.current){
        landmarkerRef.current.close();
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
    };
  }, []);

  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="640"
        style={{
          maxWidth: "100%",
          borderRadius: "15px",
        }}
      />

      <h2>{expression}</h2>
      <button onClick={() => detect({landmarkerRef, videoRef, animationRef , setExpression})}>Detect Expression</button>
    </div>
  );
}

export default FaceExpression;