// Generated by CoffeeScript 1.7.1
var fail, fillAd, fillBucket, getAd, getAdWithGPS, getBucket, getBucketWithGPS, getBusinessForm, onGPSAdSuccess, onGPSBucketSuccess, onGPSError, onLoad, pictureFail, roundDistanceForAds, roundDistanceOfAd, selectPhoto, startApp, uploadPhoto, win;

angular.module('scupr', ['ionic']);

startApp = function() {
  return getBucketWithGPS();
};

onLoad = function() {
  return document.addEventListener("deviceready", onDeviceReady, false);
};

getBucket = function(position) {
  return $.get("http://scupr-staging.herokuapp.com/ads", position, function(data) {
    return fillBucket(data);
  });
};

getAd = function(position) {
  return $.get("http://scupr-staging.herokuapp.com/ads/" + window.currentAdId, position, function(data) {
    return fillAd(data);
  });
};

fillBucket = function(data) {
  var source, template;
  source = $("#bucket-template").html();
  template = Handlebars.compile(source);
  return $('#bucket').html(template(roundDistanceForAds(data)));
};

fillAd = function(data) {
  var source, template;
  source = $("#ad-template").html();
  template = Handlebars.compile(source);
  $('#bucket').html(template(roundDistanceOfAd(data)));
  return window.scrollTo(0, 0);
};

Handlebars.registerHelper('createBucket', function(ad) {
  return new Handlebars.SafeString("<a class='item item-thumbnail-left' data-id=\"" + ad.id + "\" href=\"#\" onclick=\"getAdWithGPS();\">\n <img src= \"" + ad.bucket_image + "\"/>\n <h2>" + ad.business_name + " &middot " + ad.distance + "m</h2>\n <p>" + ad.caption + "</p>\n </a>");
});

getBucketWithGPS = function() {
  return navigator.geolocation.getCurrentPosition(onGPSBucketSuccess, onGPSError);
};

getAdWithGPS = function() {
  window.currentAdId = $(this.event.target).data('id');
  return navigator.geolocation.getCurrentPosition(onGPSAdSuccess, onGPSError);
};

onGPSBucketSuccess = function(position) {
  return getBucket(position);
};

onGPSAdSuccess = function(position) {
  return getAd(position);
};

onGPSError = function(error) {
  return alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
};

roundDistanceForAds = function(data) {
  var ad, _i, _len, _ref;
  _ref = data.ads;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    ad = _ref[_i];
    ad.distance = Math.round(ad.distance * 1000);
  }
  return data;
};

roundDistanceOfAd = function(data) {
  data.ad.distance = Math.round(data.ad.distance * 1000);
  return data;
};

getBusinessForm = function() {
  var source, template;
  source = $("#form-template").html();
  template = Handlebars.compile(source);
  return $('#bucket').html(template());
};

selectPhoto = function() {
  var photoOptions;
  event.preventDefault();
  photoOptions = {
    quality: 100,
    destinationType: navigator.camera.DestinationType.FILE_URI,
    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
  };
  return navigator.camera.getPicture(uploadPhoto, pictureFail, photoOptions);
};

pictureFail = function(message) {
  event.preventDefault();
  return console.log('Failed because: ' + message);
};

uploadPhoto = function(imageURI) {
  var ft, input, options, params, _i, _len, _ref;
  console.log("point 4");
  console.log(imageURI);
  options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
  options.mimeType = "image/jpeg";
  params = {};
  _ref = $("input");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    input = _ref[_i];
    params[input.name] = input.value;
  }
  options.params = params;
  ft = new FileTransfer();
  return ft.upload(imageURI, encodeURI("http://0.0.0.0:3000/business/new"), win, fail, options);
};

win = function(r) {
  console.log("Code = " + r.responseCode);
  console.log("Response = " + r.response);
  return console.log("Sent = " + r.bytesSent);
};

fail = function(error) {
  alert("An error has occurred: Code = " + error.code);
  console.log("upload error source " + error.source);
  return console.log("upload error target " + error.target);
};
