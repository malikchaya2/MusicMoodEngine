// <!--
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// PDX-License-Identifier: MIT-0 (For details, see https://github.com/awsdocs/amazon-rekognition-developer-guide/blob/master/LICENSE-SAMPLECODE.)
// -->
// Changes have been made to this file

var AKI = "AKIA34IFIVPZELDNIRNL"
var SAK = "YXAb5nzID0MkOXg8+efCpRaKV0b9xNBy8AueY7Pk"
var APIK = 'm34q5pjbKla27qff01SqP7LRvP5hZQcK9rRULlgm'
var REG = 'us-east-1'

AWS.config.update({
  accessKeyId: AKI,
  secretAccessKey: SAK,
  "region": REG 
}); 

var apigClient = apigClientFactory.newClient({
  accessKey: AKI,
  secretKey: SAK,
  apiKey: APIK,
});


var s3 = new AWS.S3();

window.onload=function(){
    document.getElementById("fileToUpload").addEventListener("change", function (event) {
    ProcessImage();
    }, false);
}
  //Calls DetectFaces API and shows estimated ages of detected faces
  function DetectFaces(imageData) {
    AWS.region = "RegionToUse";
    var rekognition = new AWS.Rekognition();
    var params = {
      Image: {
        Bytes: imageData
      },
      Attributes: [
        'ALL',
      ]
    };
    rekognition.detectFaces(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
       console.log(data);
       var table = "<table><tr><th>Low</th><th>High</th></tr>";
        // show each face and build out estimated age table
        for (var i = 0; i < data.FaceDetails.length; i++) {
          table += '<tr><td>' + data.FaceDetails[i].AgeRange.Low +
            '</td><td>' + data.FaceDetails[i].AgeRange.High + '</td></tr>';
        }
        table += "</table>";
        document.getElementById("opResult").innerHTML = table;
      }
    });
  }
  function test(thing){
      console.log('')

  }
  //Loads selected image and unencodes image bytes for Rekognition DetectFaces API
  function ProcessImage(imgGotten) {
    //AnonLog();
    var control = document.getElementById("fileToUpload");
    // var file = control.files[0];
    var file = img; 

    // Load base64 encoded image 
    // var reader = new FileReader();
    // reader.onload = (function (theFile) {
    //   return function (e) {
        var img = document.createElement('img');
        var image = null;
        img.src = imgGotten;
        var jpg = true;
        try {
          image = atob(imgGotten.split("data:image/jpeg;base64,")[1]);

        } catch (e) {
          jpg = false;
        }
        if (jpg == false) {
          try {
            image = atob(imgGotten.split("data:image/png;base64,")[1]);
          } catch (e) {
            alert("Not an image file Rekognition can process");
            return;
          }
        }
        //unencode image bytes for Rekognition DetectFaces API 
        var length = image.length;
        imageBytes = new ArrayBuffer(length);
        var ua = new Uint8Array(imageBytes);
        for (var i = 0; i < length; i++) {
          ua[i] = image.charCodeAt(i);
        }

        addImageToS3(imageBytes)

    }



function addImageToS3(imageFile){ // adds the image file to s3 bucket

  //creates a random string to be used as the image name in S3.
  var randomImgName = new String(Math.random().toString(36).substr(2, 5))+".jpg"
  var params = {Bucket: 'cloudclassimgs', Key: randomImgName, Body: imageFile};
  s3.upload(params, function(err, data) {
        if(err){
            console.log(err)
        }
        else{ // on success, call API Gateway moodUpload POST method
          postImageNameToLambda(randomImgName)
          // console.log(data);  log the data returned from S3 Upload
        }
  });
}


function postImageNameToLambda(imgName){ // calls API Gateway to send the image name to Lambda
  apigClient.moodUploadPost({}, imgName, {})
  .then(function(result){
    //console.log(result)  result returns JSON with some number of artist/title/spotify song URIs
    parseSongInfoResult(result)

  }).catch( function(err){
    console.log(err) // API call was not successful
  });

}
  /*
  below one-line function further encrypts the image name, but currently unnecessary 
  String.prototype.hashCode = function(){ var hash = 5381; if (this.length === 0) return hash; for (var i = 0; i < this.length; i++) { var character = this.charCodeAt(i); hash = ((hash<<5)+hash)^character; } return hash; } 
  */ 

function parseSongInfoResult(songInfo){

    var tmp = songInfo['data']['body'].split(':')
    var tmp2 = tmp[2]
    var URI = tmp2.replace('\\', "").replace("\"", "")
    console.log("THE URI IS : " + URI)
    var widge = document.getElementById("spotify_widget")
    var frame = '<iframe src="https://open.spotify.com/embed/playlist/'+URI+'" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
    widge.innerHTML = frame;

  }


  // })(file);
    // reader.readAsDataURL(file);
  
  //Provides anonymous log on to AWS services
  function AnonLog() {
    
    // Configure the credentials provider to use your identity pool
    AWS.config.region = '--------'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: '--------',
    });
    // Make the call to obtain credentials
    AWS.config.credentials.get(function () {
      // Credentials will be available when this function is called.
      var accessKeyId = AWS.config.credentials.accessKeyId;
      var secretAccessKey = AWS.config.credentials.secretAccessKey;
      var sessionToken = AWS.config.credentials.sessionToken;
    });
  }