import { WHIPClient } from 'whip-whep/whip';

import {WS_API_URL, SOURCE_URL, CAM_URL, GO2RTC_API} from './config';

window.addEventListener("DOMContentLoaded", async function() {
  var canvas = document.querySelector("canvas"),
      context = canvas.getContext("2d"),
      videostream = document.querySelector('#videostream'),
      canvasCam = document.querySelector('#canvasCam'),
      canvasSource= document.querySelector('#canvasSource')
  ;


  async function PeerConnection(media, selector) {
    const pc = new RTCPeerConnection();

    const localTracks = [];

    if (/camera|microphone/.test(media)) {
        const tracks = await getMediaTracks('user', {
            video: media.indexOf('camera') >= 0,
            audio: media.indexOf('microphone') >= 0,
        });
        tracks.forEach(track => {
            pc.addTransceiver(track, {direction: 'sendonly'});
            if (track.kind === 'video') localTracks.push(track);
        });
    }

    if (/video|audio/.test(media)) {
        const tracks = ['video', 'audio']
            .filter(kind => media.indexOf(kind) >= 0)
            .map(kind => pc.addTransceiver(kind, {direction: 'recvonly'}).receiver.track);
        localTracks.push(...tracks);
    }

    document.getElementById(selector).srcObject = new MediaStream(localTracks);

    return pc;
}

async function getMediaTracks(media, constraints) {
    try {
        const stream = media === 'user'
            ? await navigator.mediaDevices.getUserMedia(constraints)
            : await navigator.mediaDevices.getDisplayMedia(constraints);
        return stream.getTracks();
    } catch (e) {
        console.warn(e);
        return [];
    }
}

async function connect(media, location, selector) {
    const pc = await PeerConnection(media, selector);
    const url = new URL('api/ws' + location, WS_API_URL);
    const ws = new WebSocket('ws' + url.toString().substring(4));


    ws.addEventListener('open', () => {
        pc.addEventListener('icecandidate', ev => {
            if (!ev.candidate) return;
            const msg = {type: 'webrtc/candidate', value: ev.candidate.candidate};
            ws.send(JSON.stringify(msg));
        });

        pc.createOffer().then(offer => pc.setLocalDescription(offer)).then(() => {
            const msg = {type: 'webrtc/offer', value: pc.localDescription.sdp};
            ws.send(JSON.stringify(msg));
        });
    });

    ws.addEventListener('message', ev => {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'webrtc/candidate') {
            pc.addIceCandidate({candidate: msg.value, sdpMid: '0'});
        } else if (msg.type === 'webrtc/answer') {
            pc.setRemoteDescription({type: 'answer', sdp: msg.value});
        }
    });
}

const media = new URLSearchParams(location.search).get('media');
// creating canvases of streams that needed to be merged
connect(media || 'video+audio', SOURCE_URL, 'canvasSource'); // second argument is stream url, third - html selector name (id);
connect(media || 'video+audio', CAM_URL, 'canvasCam');


async function testStreamMerge() {
  let streamtest;

    streamtest = canvas.captureStream();
    videostream.srcObject = streamtest;
    console.log('streamtest check', streamtest);
    console.log('streamtest.getVideoTracks()[0]', streamtest?.getVideoTracks()[0]);
    streamtest.getTracks().forEach((track) => console.log('track', track));
    // Create peer connection
    const pc = new RTCPeerConnection({ bundlePolicy: "max-bundle" });

    //Send all tracks
    for (const track of streamtest.getTracks()) {
        pc.addTransceiver(track, { direction: 'sendonly' });
    }

    // Create WHIP client
    const whip = new WHIPClient();

    // Start publishing
    await whip.publish(pc, GO2RTC_API);
    console.log("Streaming started successfully!");

  requestAnimationFrame(drawcanvas);
}

testStreamMerge();


function drawcanvas(){

    // caculate size and position of small corner-vid (you may change it as you like)
    context.drawImage(canvasCam, 0, 0, canvas.width, canvas.height); // bg vidoe
    context.drawImage(canvasSource, 10, 10, 40, 40); // small video in the left corner
    // do the same thing again at next screen paint
    requestAnimationFrame( drawcanvas );
  }

}, false);

