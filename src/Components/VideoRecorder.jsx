
import React, { useState, useRef, useEffect } from "react";
import hotel1 from '../styles/hotel1.png';
import hotel2 from '../styles/hotel2.png';
import hotel3 from '../styles/hotel3.png';
import hotel4 from '../styles/hotel4.png';


const VideoRecorder = ({ userId, refreshUser }) => {
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

            try {
                const user = JSON.parse(localStorage.getItem("user"))

                if(!user){
                    throw new Error("User Not found")
                }
                const updatedUser ={
                    ...user,
                    score: user.score +1
                }
                const userId = user._id;
                const token = localStorage.getItem('token');

               

                localStorage.setItem('user', JSON.stringify(updatedUser));
                await fetch(`https://backend-build.onrender.com/api/users/${userId}/increment-score`, {
                //await fetch(`http://localhost:5000/api/user/${userId}/increment-score`,{
                method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ increment: 1 }) // Optional: backend can default to +1
                });


                
            } catch (err) {
                console.error("Failed to update user score:", err);
            }
        }
    };

    const stopDetection = () => {
        
        refreshUser();
        
        
        setRecording(false);
        stopCamera();
        sendDetectionLog();
        window.location.reload();

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
        <>
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
                    <button onClick={stopDetection}>Close Camera</button>
                ) : (
                    <button onClick={startDetection}>Recycle</button>
                )}
            </div>

            <div className="detection-log">
                <h3>Get 20 points win a 20% Discount in One Of the Following Partners:</h3>
                <ul>
                    {detectionLog.map((log, i) => (
                        <li key={i}>{log}</li>
                    ))}
                </ul>
            </div>
            <div className="partners-tab">
                <h3>Our Recycling Reward Partners</h3>
                <div className="partner-logos">
                <img src={hotel1} alt="Hotel 1" />
                <img src={hotel2} alt="Hotel 2" />
                <img src={hotel3} alt="Hotel 3" />
                <img src={hotel4} alt="Hotel 4" />
                    
                </div>
            </div>

            

        </div>
        
        </>
    );
};

export default VideoRecorder;