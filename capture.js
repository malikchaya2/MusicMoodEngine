


    //capture

    //camera button
    var imgurl;

    window.onload=function(){
    const player = document.getElementById('videoFrame');
    const constraints = {
        video: {facingMode: "user"},    
    };
    document.getElementById('capture').addEventListener('click', () => {
     
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        context.drawImage(player, 0, 0, canvas.width, canvas.height);
        stopStreamedVideo(player);
        imgurl =  canvas.toDataURL();
        document.getElementById("vidframe").innerHTML = " "; 
        document.getElementById("buttons").innerHTML = " "; 
        document.getElementById("userimg").src = imgurl; 
        document.getElementById("buttons").innerHTML += '<button id="capture"  type="button" class="a btn btn-info btn-block" onClick = "  window.location.reload();"  >Retake</button>  <button id="use"  type="button" class="a btn btn-info btn-block" onclick = send(imgurl); >Use This Image</button>'

    });


       //STREAM 
    //https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        // Attach the video stream to the video element and autoplay.
        player.srcObject = stream;
      }).catch(handleError);
    }
    function send(imgurl){
        alert("got it");
        test("testing");
        ProcessImage(imgurl)
    }
    //https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
    function stopStreamedVideo(player) {
      let stream = player.srcObject;
      let tracks = stream.getTracks();

      tracks.forEach(function(track) {
        track.stop();
      });

      player.srcObject = null;
    }
