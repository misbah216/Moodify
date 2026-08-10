import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
let stream;
function FaceExpression() {
  const videoRef = useRef(null);
  const animationRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");

   const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const landmarker = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            },

            runningMode: "VIDEO",

            numFaces: 1,

            outputFaceBlendshapes: true,
          }
        );

        // Start camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        videoRef.current.srcObject = stream;

        videoRef.current.onloadeddata = () => {
          detect(landmarker);
        };
      } catch (error) {
        console.error("MediaPipe Error:", error);
        setExpression("Error ❌");
      }
    };

const detect = (landmarker) => {
    const video = videoRef.current;

    if (!video || video.readyState < 2) {
      animationRef.current = requestAnimationFrame(() => {
        detect(landmarker);
      });

      return;
    }

    
    const result = landmarker.detectForVideo(
      video,
      performance.now()
    );

    if (result.faceBlendshapes?.length > 0) {
      const categories =
        result.faceBlendshapes[0].categories;

      
      const getScore = (name) => {
        const item = categories.find(
          (c) => c.categoryName === name
        );

        return item?.score || 0;
      };

     

      const smileLeft = getScore("mouthSmileLeft");
      const smileRight = getScore("mouthSmileRight");

      const smile = Math.max(
        smileLeft,
        smileRight
      );

      

      const eyeWideLeft = getScore("eyeWideLeft");
      const eyeWideRight = getScore("eyeWideRight");

      const eyesWide = Math.max(
        eyeWideLeft,
        eyeWideRight
      );

      const jawOpen = getScore("jawOpen");


      const mouthFrownLeft =
        getScore("mouthFrownLeft");

      const mouthFrownRight =
        getScore("mouthFrownRight");

      const frown = Math.max(
        mouthFrownLeft,
        mouthFrownRight
      );

      const browDownLeft =
        getScore("browDownLeft");

      const browDownRight =
        getScore("browDownRight");

      
      if (
        eyesWide > 0.2 &&
        jawOpen > 0.15
      ) {
        setExpression("Surprised 😮");
      }

      
      else if (
        frown > 0.15 ||
        (browDownLeft > 0.2 &&
          browDownRight > 0.2)
      ) {
        setExpression("Sad 😢");
      }

      
      else if (smile > 0.25) {
        setExpression("Happy 😊");
      }

      
      else {
        setExpression("Neutral 😐");
      }
    } else {
      setExpression("No face detected 👤");
    }

    
    animationRef.current = requestAnimationFrame(() => {
      detect(landmarker);
    });
  };

  useEffect(() => {
    
    init();

    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
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
      <button onClick={detect}>Detect Expression</button>
    </div>
  );
}

export default FaceExpression;