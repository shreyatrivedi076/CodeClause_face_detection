// Load the face-api.js modules
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  ]).then(startFaceDetection);
  
  // Function to start face detection
  async function startFaceDetection() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const faceBox = document.createElement('div');
    faceBox.className = 'face-box';
    const videoContainer = document.getElementById('video-container');
    videoContainer.appendChild(faceBox);
  
    // Access user media (camera)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      video.srcObject = stream;
  
      video.addEventListener('play', () => {
        // Setup the canvas context for drawing
        const context = canvas.getContext('2d');
        setInterval(async () => {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
  
          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, detections);
          faceapi.draw.drawFaceLandmarks(canvas, detections);
  
        }, 100);
      });
    } catch (err) {
      console.error('Error accessing camera: ', err);
    }
  }
  