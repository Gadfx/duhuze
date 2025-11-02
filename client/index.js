import { io } from 'socket.io-client';
import html2canvas from 'html2canvas';

// Global State
let peer;
const myVideo = document.getElementById('my-video');
const strangerVideo = document.getElementById('video');
const button = document.getElementById('send');
const nextBtn = document.getElementById('next');
const stopBtn = document.getElementById('stop');
const muteBtn = document.getElementById('mute');
const online = document.getElementById('online');
let remoteSocket;
let type;
let roomid;
let localStream;
let audioContext;
let gainNode;
let isMuted = false;
let volume = 1;
let strangerInfo = null;
const findingUserOverlay = document.getElementById('finding-user-overlay');



// starts media capture
function start() {
  // If we already have a local stream, just add to peer if needed
  if (localStream) {
    // Always ensure local video is showing
    myVideo.srcObject = localStream;
    if (peer) {
      localStream.getTracks().forEach(track => peer.addTrack(track, localStream));
    }
    return;
  }

  navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000,
      channelCount: 2,
      latency: 0.01,
      volume: 1.0
    },
    video: {
      width: { ideal: 1920, min: 1280 },
      height: { ideal: 1080, min: 720 },
      frameRate: { ideal: 60, min: 30 },
      facingMode: 'user'
    }
  })
    .then(stream => {
      localStream = stream;
      // Always show local video for preview
      myVideo.srcObject = stream;
      if (peer) {
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
      }
      // Set up audio context for volume control with optimized settings
      audioContext = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'interactive',
        sampleRate: 48000
      });
      const source = audioContext.createMediaStreamSource(stream);
      gainNode = audioContext.createGain();
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = volume;

      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    })
    .catch(ex => {
      console.log(ex);
    });
}

// Check authentication on page load
window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login if not authenticated
    window.location.href = '/login.html';
  } else {
    // Start camera immediately for preview
    start();
    // Initialize ads
    if (window.AdManager) {
      window.AdManager.initializeAds();
    }
  }
});

// connect ot server
const token = localStorage.getItem('token');
const socket = io('http://localhost:8000', {
  auth: {
    token: token
  }
});

// Handle admin kick event
socket.on('user-kicked', (data) => {
  alert('You have been kicked by an admin. Reason: ' + (data.reason || 'No reason provided'));
  socket.disconnect();
  localStorage.removeItem('token');
  location.href = '/login.html';
});

// Handle admin ban event
socket.on('user-banned', (data) => {
  alert('You have been banned by an admin. Reason: ' + (data.reason || 'No reason provided'));
  socket.disconnect();
  localStorage.removeItem('token');
  location.href = '/login.html';
});

// Handle ads data from server
socket.on('ads-data', (data) => {
  if (window.AdManager && data.ads) {
    // Store ads for later use
    window.AdManager.currentAds = data.ads;
    console.log('Received ads data:', data.ads); // Debug log
    // Show waiting ad if in waiting state
    if (findingUserOverlay.classList.contains('show') && data.ads.length > 0) {
      console.log('Showing waiting ad'); // Debug log
      window.AdManager.showWaitingAd(data.ads[0]);
    }
    // Show chat ad if connected
    if (remoteSocket && data.ads.length > 1) {
      console.log('Showing chat ad'); // Debug log
      window.AdManager.showChatAd(data.ads[1]);
    }
  }
});

// Fetch ads when starting search
function fetchAdsForDisplay() {
  fetch('/api/auth/ads')
    .then(response => response.json())
    .then(data => {
      if (window.AdManager && data.ads) {
        window.AdManager.currentAds = data.ads;
        console.log('Fetched ads data:', data.ads);
        // Show waiting ad if in waiting state
        if (findingUserOverlay.classList.contains('show') && data.ads.length > 0) {
          window.AdManager.showWaitingAd(data.ads[0]);
        }
        // Show chat ad if connected
        if (remoteSocket && data.ads.length > 1) {
          window.AdManager.showChatAd(data.ads[1]);
        }
      }
    })
    .catch(error => {
      console.error('Failed to fetch ads:', error);
    });
}


// disconnectin event
socket.on('disconnected', () => {
  location.href = `/?disconnect`
})

// next button click
nextBtn.onclick = () => {
  if (remoteSocket) {
    // Disconnect current peer
    if (peer) {
      peer.close();
      peer = null;
    }
    // Clear videos
    myVideo.srcObject = null;
    strangerVideo.srcObject = null;
    // Show finding user overlay
    findingUserOverlay.classList.add('show');
    // Change button text to "Start"
    nextBtn.innerHTML = '<span class="btn-text">Start</span>';
    // Emit next
    socket.emit('next');
    remoteSocket = null;
    type = null;
    strangerInfo = null;
    // Fetch ads for waiting state
    fetchAdsForDisplay();
  } else {
    // Start new connection
    socket.emit('start', (person) => {
      type = person;
      // Hide the old modal if it exists
      const modal = document.querySelector('.modal');
      if (modal) modal.style.display = 'none';
      // Only change to "Next" when actually connected to someone
      // For now, keep as "Start" while searching
    });
    // Show finding user overlay immediately when starting
    findingUserOverlay.classList.add('show');
    // Fetch ads for waiting state
    fetchAdsForDisplay();
  }
}

// stop button click
stopBtn.onclick = () => {
  socket.emit('disconnect');
  location.href = '/';
}

// mute/unmute button click
muteBtn.onclick = () => {
  isMuted = !isMuted;
  if (localStream) {
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !isMuted;
    });
  }
  muteBtn.innerHTML = isMuted ? '<span class="btn-icon">🔊</span><span class="btn-text">Unmute</span>' : '<span class="btn-icon">🔇</span><span class="btn-text">Mute</span>';
}



// Report modal functionality - initialized when DOM is ready
let reportModal, reportReasonSelect, reportDetailsTextarea, reportSubmitBtn, reportCancelBtn, reportCloseBtn;

function initializeReportModal() {
  reportModal = document.getElementById('report-modal');
  reportReasonSelect = document.getElementById('report-reason');
  reportDetailsTextarea = document.getElementById('report-details');
  reportSubmitBtn = document.querySelector('.report-modal-submit');
  reportCancelBtn = document.querySelector('.report-modal-cancel');
  reportCloseBtn = document.querySelector('.report-modal-close');

  // report stranger button click (new button next to stranger's name)
  const reportStrangerBtn = document.getElementById('report-stranger');
  if (reportStrangerBtn) {
    reportStrangerBtn.onclick = () => {
      // Reset form
      if (reportReasonSelect) reportReasonSelect.value = '';
      if (reportDetailsTextarea) reportDetailsTextarea.value = '';
      if (reportSubmitBtn) {
        reportSubmitBtn.disabled = false;
        reportSubmitBtn.textContent = 'Submit Report';
      }

      // Show modal
      if (reportModal) reportModal.classList.add('show');
    };
  }

  // Modal event listeners
  if (reportCloseBtn) {
    reportCloseBtn.onclick = () => {
      reportModal.classList.remove('show');
    };
  }

  if (reportCancelBtn) {
    reportCancelBtn.onclick = () => {
      reportModal.classList.remove('show');
    };
  }

  if (reportModal) {
    reportModal.onclick = (e) => {
      if (e.target === reportModal) {
        reportModal.classList.remove('show');
      }
    };
  }

  if (reportSubmitBtn) {
    reportSubmitBtn.onclick = async () => {
      const reason = reportReasonSelect.value;
      const details = reportDetailsTextarea.value.trim();

      if (!reason) {
        alert('Please select a reason for reporting.');
        return;
      }

      if (!strangerInfo || !strangerInfo.id) {
        alert('Unable to report user at this time. No user connected.');
        return;
      }

      // Disable button and show loading
      reportSubmitBtn.disabled = true;
      reportSubmitBtn.textContent = 'Submitting...';

      try {
        // Capture screenshot
        const canvas = await html2canvas(document.body);
        const screenshotDataUrl = canvas.toDataURL('image/png');

        socket.emit('report-user', {
          reportedUserId: strangerInfo.id,
          reason: reason,
          details: details,
          roomId: roomid,
          screenshot: screenshotDataUrl
        });

        alert('User reported successfully. Thank you for helping keep our community safe.');
        reportModal.classList.remove('show');
      } catch (error) {
        console.error('Screenshot capture failed:', error);
        socket.emit('report-user', {
          reportedUserId: strangerInfo.id,
          reason: reason,
          details: details,
          roomId: roomid
        });
        alert('User reported successfully. Thank you for helping keep our community safe.');
        reportModal.classList.remove('show');
      }
    };
  }
}

// Initialize report modal when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeReportModal);





/// --------- Web rtc related ---------

// Initial button text
nextBtn.innerHTML = '<span class="btn-text">Start</span>';


// Get remote socket

socket.on('remote-socket', (id) => {
  remoteSocket = id;

  // hide the finding user overlay
  findingUserOverlay.classList.remove('show');
  // hide the old modal if it exists
  const modal = document.querySelector('.modal');
  if (modal) modal.style.display = 'none';
  // Change button text to "Next"
  nextBtn.innerHTML = '<span class="btn-text">Next</span>';

  // Fetch ads for chat state
  fetchAdsForDisplay();

  // create a peer conncection with optimized settings
  peer = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
    iceTransportPolicy: 'all',
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
  });

  // on negociation needed
  peer.onnegotiationneeded = async e => {
    webrtc();
  }

  // send ice candidates to remotesocket
  peer.onicecandidate = e => {
    socket.emit('ice:send', { candidate: e.candidate, to: remoteSocket });
  }

  // handle incoming tracks with optimized settings
  peer.ontrack = e => {
    strangerVideo.srcObject = e.streams[0];
    // Fix: Prevent play() interruption errors by checking if already playing
    if (strangerVideo.paused || strangerVideo.readyState < 3) {
      strangerVideo.play().catch(err => {
        console.log('Video play interrupted (expected):', err.message);
      });
    }
    // Optimize video playback
    strangerVideo.setAttribute('playsinline', '');
    strangerVideo.setAttribute('autoplay', '');
    strangerVideo.volume = 1.0;
  }

  // start media capture
  start();

});


// creates offer if 'type' = p1
async function webrtc() {

  if (type == 'p1') {
    const offer = await peer.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    await peer.setLocalDescription(offer);
    socket.emit('sdp:send', { sdp: peer.localDescription });
  }

}


// recive sdp sent by remote socket
socket.on('sdp:reply', async ({ sdp, from }) => {

  // set remote description
  await peer.setRemoteDescription(new RTCSessionDescription(sdp));

  // if type == p2, create answer
  if (type == 'p2') {
    const ans = await peer.createAnswer();
    await peer.setLocalDescription(ans);
    socket.emit('sdp:send', { sdp: peer.localDescription });
  }

  // Add transceivers for better media handling
  peer.addTransceiver('audio', { direction: 'sendrecv' });
  peer.addTransceiver('video', { direction: 'sendrecv' });
});


// recive ice-candidate form remote socket
socket.on('ice:reply', async ({ candidate, from }) => {
  await peer.addIceCandidate(candidate);
});




/// ----------- Handel Messages Logic -----------


// get room id
socket.on('roomid', id => {
  roomid = id;
})

// handel send button click
function sendMessage() {
  // get input and emit
  let input = document.querySelector('input').value.trim();
  if (input === '') return;

  socket.emit('send-message', input, type, roomid);

  // set input in local message box as 'YOU'
  let msghtml = `
  <div class="msg">
  <b>You: </b> <span id='msg'>${input}</span>
  </div>
  `
  document.querySelector('.chat-wrapper')
  .innerHTML += msghtml;

  // scroll to bottom for sender
  document.querySelector('.chat-wrapper').scrollTop = document.querySelector('.chat-wrapper').scrollHeight;

  // clear input
  document.querySelector('input').value = '';
}

button.onclick = sendMessage;

// allow enter key to send message
document.querySelector('input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// on get message
socket.on('get-message', (input, type) => {

  // set recived message from server in chat box
  const strangerName = strangerInfo?.name || 'Stranger';
  let msghtml = `
  <div class="msg">
  <b>${strangerName}: </b> <span id='msg'>${input}</span>
  </div>
  `
  document.querySelector('.chat-wrapper')
  .innerHTML += msghtml;

  // only scroll to bottom if user is already at bottom, otherwise show notification
  if (isUserAtBottom) {
    document.querySelector('.chat-wrapper').scrollTop = document.querySelector('.chat-wrapper').scrollHeight;
  } else {
    newMessagesCountValue++;
    updateNewMessagesNotification();
  }

})

// Handle user info from server
socket.on('user-info', (data) => {
  strangerInfo = data.stranger;
  if (strangerInfo) {
    // Update the user info display if it exists
    const userNameEl = document.getElementById('stranger-name');
    const userAgeEl = document.getElementById('stranger-age');
    const strangerLabelEl = document.getElementById('stranger-label');
    if (userNameEl) userNameEl.textContent = strangerInfo.name;
    if (userAgeEl) userAgeEl.textContent = strangerInfo.age;
    if (strangerLabelEl && strangerInfo.name && strangerInfo.age !== undefined) {
      const sexIcon = strangerInfo.sex === 'boy' ? '👦' : strangerInfo.sex === 'girl' ? '👧' : '🧑';
      strangerLabelEl.textContent = `${strangerInfo.name}\n${strangerInfo.age} Years Old ${sexIcon}`;
    } else if (strangerLabelEl) {
      strangerLabelEl.textContent = 'Stranger';
    }
  }
});

// Emoji picker functionality
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const chatInput = document.querySelector('.chat-input input');

// New messages notification
const newMessagesNotification = document.getElementById('new-messages-notification');
const newMessagesCount = document.getElementById('new-messages-count');
let newMessagesCountValue = 0;
let isUserAtBottom = true;

// Initialize emoji picker
function initializeEmojiPicker() {
  const emojiCategories = emojiPicker.querySelector('.emoji-categories');

  // Emoji selection
  emojiCategories.addEventListener('click', (e) => {
    if (e.target.tagName === 'DIV' && e.target.textContent.trim()) {
      const emoji = e.target.textContent.trim();
      chatInput.value += emoji;
      chatInput.focus();

      // Hide picker
      emojiPicker.classList.remove('show');
    }
  });
}

emojiBtn.addEventListener('click', () => {
  emojiPicker.classList.toggle('show');
});

document.addEventListener('click', (e) => {
  if (!emojiBtn.contains(e.target) && !emojiPicker.contains(e.target)) {
    emojiPicker.classList.remove('show');
  }
});

// Initialize emoji picker when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeEmojiPicker);

// Track if user is at bottom of chat
const chatWrapper = document.querySelector('.chat-wrapper');
chatWrapper.addEventListener('scroll', () => {
  const isAtBottom = chatWrapper.scrollHeight - chatWrapper.scrollTop <= chatWrapper.clientHeight + 10;
  isUserAtBottom = isAtBottom;
  if (isAtBottom && newMessagesCountValue > 0) {
    newMessagesCountValue = 0;
    updateNewMessagesNotification();
  }
});

// Click notification to scroll to bottom
newMessagesNotification.addEventListener('click', () => {
  chatWrapper.scrollTop = chatWrapper.scrollHeight;
  newMessagesCountValue = 0;
  updateNewMessagesNotification();
  isUserAtBottom = true;
});

function updateNewMessagesNotification() {
  newMessagesCount.textContent = newMessagesCountValue;
  if (newMessagesCountValue > 0) {
    newMessagesNotification.classList.add('show');
  } else {
    newMessagesNotification.classList.remove('show');
  }
}
