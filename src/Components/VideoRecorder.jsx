import React, { useState, useRef, useEffect } from "react";

const VideoRecorder = ({ userId }) => {
    const [recording, setRecording] = useState(false);
    const [detectionLog, setDetectionLog] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animationRef = useRef(null);

    const initCamera = async () => {
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            videoRef.current.srcObject = streamRef.current;
            return true; // Return success status
        } catch (err) {
            console.error("Camera error:", err);
            return false;
        }
    };

    const detectBinUsage = () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

        if (window.previousFrame) {
            const motion = detectMotion(frame, window.previousFrame);
            if (motion > 0.2) {
                setDetectionLog(prev => [...prev, `Motion detected at ${new Date().toLocaleTimeString()}`]);
            }
        }
        window.previousFrame = frame;

        animationRef.current = requestAnimationFrame(detectBinUsage);
    };

    const detectMotion = (currentFrame, previousFrame) => {
        let diff = 0;
        for (let i = 0; i < currentFrame.data.length; i += 4) {
            diff += Math.abs(currentFrame.data[i] - previousFrame.data[i]);
        }
        return diff / (currentFrame.width * currentFrame.height * 255);
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        cancelAnimationFrame(animationRef.current);
    };

    const startDetection = async () => {
        const cameraStarted = await initCamera();
        if (cameraStarted) {
            setRecording(true);
            setDetectionLog([]);
            detectBinUsage();
        }
    };

    const stopDetection = () => {
        setRecording(false);
        stopCamera();
        sendDetectionLog();
    };

    const sendDetectionLog = async () => {
        try {
            await fetch("https://backend-build.onrender.com/api/bin/detections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    detections: detectionLog,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (err) {
            console.error("Failed to save detections:", err);
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="bin-detector">
            <video 
                ref={videoRef} 
                autoPlay 
                muted 
                style={{ display: recording ? 'block' : 'none' }} 
                width="640" 
                height="480" 
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <div className="controls">
                {recording ? (
                    <button onClick={stopDetection}>Stop Monitoring</button>
                ) : (
                    <button onClick={startDetection}>Start Monitoring Bin</button>
                )}
            </div>

            <div className="detection-log">
                <h3>Detection Events:</h3>
                <ul>
                    {detectionLog.map((log, i) => (
                        <li key={i}>{log}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VideoRecorder;