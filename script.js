
window.addEventListener("DOMContentLoaded", async function() {

    var canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d"),
        video = document.querySelector('video'),
        videostream = document.querySelector('#videostream'),
        videoObj = {
            video: {
                width: 400,
                height: 250,
                require: ['width', 'height']
            }
        }
    ;

    navigator.mediaDevices.getUserMedia(videoObj).then((stream) => {
        video.srcObject = stream;
        // videostream.srcObject = canvas.captureStream();
        video.onplay = function() {
            let streamtest = canvas.captureStream();
            videostream.srcObject = streamtest;
        };
        
        // console.log(video.srcObject, videostream.srcObject, streamtest, streamtest.getVideoTracks()[0]); 

        // video.crossOrigin = "Anonymous";
        // img.crossOrigin = "Anonymous";

        requestAnimationFrame(drawcanvas);

        
    }).catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    function drawcanvas(){

        const img = new Image();
        img.src = './robo.gif';
        img.onload = () => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            context.drawImage(img, 10, 10, 40, 40);
        };

        requestAnimationFrame(drawcanvas);
    }

}, false);