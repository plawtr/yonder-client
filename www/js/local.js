// Generated by CoffeeScript 1.7.1
var fillAd, fillBucket, getAd, getAdWithGPS, getBucket, getBucketWithGPS, getBusinessForm, getPassbook, getStripeForm, killMeNow, onGPSAdSuccess, onGPSBucketSuccess, onGPSError, onLoad, onPictureFail, onTransferFail, onTransferSuccess, roundDistanceForAds, roundDistanceOfAd, selectPhoto, shareAdSocially, startApp, uploadPhoto;

angular.module('scupr', ['ionic']);

startApp = function() {
  return getBucketWithGPS();
};

onLoad = function() {
  return document.addEventListener("deviceready", onDeviceReady, false);
};

getBucket = function(position) {
  return $.get("http:scupr-staging.herokuapp.com/ads", position, function(data) {
    return fillBucket(data);
  });
};

getAd = function(position) {
  return $.get("http:scupr-staging.herokuapp.com/ads/" + window.currentAdId, position, function(data) {
    return fillAd(data);
  });
};

fillBucket = function(data) {
  var source, template;
  source = $("#bucket-template").html();
  template = Handlebars.compile(source);
  $('#bucket').html(template(roundDistanceForAds(data)));
  return window.scrollTo(0, 0);
};

fillAd = function(data) {
  var source, template;
  source = $("#ad-template").html();
  template = Handlebars.compile(source);
  $('#bucket').html(template(roundDistanceOfAd(data)));
  return window.scrollTo(0, 0);
};

Handlebars.registerHelper('createBucket', function(ad) {
  return new Handlebars.SafeString("<a class='item item-thumbnail-left' data-id=\"" + ad.id + "\" href=\"#\" onclick=\"getAdWithGPS();\">\n <img src= \"" + ad.bucket_image + "\"/>\n <h2>" + ad.business_name + " &middot " + ad.distance + "m</h2>\n <p style=\"margin: 0 0 0px\">" + ad.caption + "</p>\n <p>" + ad.updated_ago + "</p>\n </a>");
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

selectPhoto = function() {
  var photoOptions;
  event.preventDefault();
  photoOptions = {
    quality: 30,
    destinationType: navigator.camera.DestinationType.FILE_URI,
    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
  };
  return navigator.camera.getPicture(uploadPhoto, onPictureFail, photoOptions);
};

onPictureFail = function(message) {
  event.preventDefault();
  return console.log('Failed because: ' + message);
};

uploadPhoto = function(imageURI) {
  var ft, input, options, params, _i, _len, _ref;
  spinnerplugin.show({
    'overlay': true
  });
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
  return ft.upload(imageURI, encodeURI("http:scupr-staging.herokuapp.com/business/new"), onTransferSuccess, onTransferFail, options);
};

onTransferSuccess = function(r) {
  spinnerplugin.hide();
  console.log("Code = " + r.responseCode);
  console.log("Response = " + r.response);
  console.log("Sent = " + r.bytesSent);
  window.localStorage.setItem("business", r.response);
  return navigator.notification.alert("Successfully uploaded", getBucketWithGPS(), "Business and Ad Details");
};

onTransferFail = function(error) {
  navigator.notification.alert("Code = " + error.code, $.noop, "An error has occurred");
  console.log("upload error source " + error.source);
  return console.log("upload error target " + error.target);
};

shareAdSocially = function() {
  return window.plugins.socialsharing.share("Hey, check out " + ($('h2')[0].textContent) + " away from me right now: " + ($('p')[0].textContent) + " #Уonder!", 'Уonder!', $('img')[0].src);
};

getBusinessForm = function() {
  return navigator.geolocation.getCurrentPosition(function(position) {
    var cookie, noEmptyFieldsOrButtons, source, template;
    cookie = JSON.parse(window.localStorage.getItem("business"));
    noEmptyFieldsOrButtons = false;
    if (cookie === null) {
      cookie = {
        business: {
          radius: 500,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      };
      noEmptyFieldsOrButtons = true;
    }
    source = $("#form-template").html();
    template = Handlebars.compile(source);
    $('#bucket').html(template(cookie));
    $('#ad_tags').inputosaurus({
      width: '200px',
      allowDuplicates: false,
      inputDelimiters: [',', ';', ' '],
      outputDelimiter: [' '],
      change: function(ev) {
        return $('#widget1_reflect').val(ev.target.value);
      }
    });
    if (noEmptyFieldsOrButtons === true) {
      $("#stripe")[0].style.display = 'none';
      $(".item-divider")[2].style.display = 'none';
      $(".item-thumbnail-left")[0].style.display = 'none';
      return $("#log-out")[0].style.display = 'none';
    }
  }, onGPSError);
};

killMeNow = function() {
  window.localStorage.setItem("business", null);
  return getBucketWithGPS();
};

getPassbook = function() {
  return Passbook.downloadPass('https://s3.amazonaws.com/scupr/pass/new.pkpass');
};

getStripeForm = function() {
  var source, template;
  event.preventDefault();
  source = $("#stripe-template").html();
  template = Handlebars.compile(source);
  return $('#bucket').html(template());
};
