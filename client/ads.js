// Ad-related variables
let currentAds = [];
let waitingAdBanner, chatAdBanner;
let waitingAdCloseBtn, chatAdCloseBtn;
let waitingAdImage, waitingAdTitle, waitingAdContent;
let chatAdImage, chatAdTitle, chatAdContent;

// Initialize ad elements
function initializeAds() {
  waitingAdBanner = document.getElementById('waiting-ad-banner');
  chatAdBanner = document.getElementById('chat-ad-banner');
  waitingAdCloseBtn = document.getElementById('waiting-ad-close');
  chatAdCloseBtn = document.getElementById('chat-ad-close');
  waitingAdImage = document.getElementById('waiting-ad-image');
  waitingAdTitle = document.getElementById('waiting-ad-title');
  waitingAdContent = document.getElementById('waiting-ad-content');
  chatAdImage = document.getElementById('chat-ad-image');
  chatAdTitle = document.getElementById('chat-ad-title');
  chatAdContent = document.getElementById('chat-ad-content');

  console.log('AdManager initialized:', {
    waitingAdBanner: !!waitingAdBanner,
    chatAdBanner: !!chatAdBanner,
    waitingAdCloseBtn: !!waitingAdCloseBtn,
    chatAdCloseBtn: !!chatAdCloseBtn
  });

  // Close button event listeners
  if (waitingAdCloseBtn) {
    waitingAdCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideWaitingAd();
    });
  }

  if (chatAdCloseBtn) {
    chatAdCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideChatAd();
    });
  }

  // Click event listeners for ad content
  if (waitingAdBanner) {
    waitingAdBanner.addEventListener('click', () => {
      handleAdClick(currentAds[0]); // Assuming first ad for waiting
    });
  }

  if (chatAdBanner) {
    chatAdBanner.addEventListener('click', () => {
      handleAdClick(currentAds[1] || currentAds[0]); // Use second ad or first if only one
    });
  }
}

// Fetch ads from server
async function fetchAds() {
  try {
    const response = await fetch('/api/auth/ads');
    const data = await response.json();
    currentAds = data.ads || [];
    return currentAds;
  } catch (error) {
    console.error('Failed to fetch ads:', error);
    return [];
  }
}

// Show ad in waiting overlay
function showWaitingAd(ad) {
  if (!waitingAdBanner || !ad) {
    console.log('Cannot show waiting ad:', { waitingAdBanner: !!waitingAdBanner, ad: !!ad });
    return;
  }

  console.log('Showing waiting ad:', ad.title);
  console.log('Ad banner element:', waitingAdBanner);
  console.log('Ad data:', ad);

  waitingAdImage.src = ad.imageUrl || '';
  waitingAdTitle.textContent = ad.title || '';
  waitingAdContent.textContent = ad.content || '';

  // Force visibility with multiple approaches
  waitingAdBanner.style.display = 'block';
  waitingAdBanner.style.visibility = 'visible';
  waitingAdBanner.style.opacity = '1';
  waitingAdBanner.style.zIndex = '10000';

  console.log('Ad banner display style:', waitingAdBanner.style.display);
  console.log('Ad banner computed style:', window.getComputedStyle(waitingAdBanner).display);
  console.log('Ad banner bounding rect:', waitingAdBanner.getBoundingClientRect());
}

// Hide waiting ad
function hideWaitingAd() {
  if (waitingAdBanner) {
    console.log('Hiding waiting ad');
    waitingAdBanner.style.display = 'none';
  }
}

// Show ad during chat
function showChatAd(ad) {
  if (!chatAdBanner || !ad) {
    console.log('Cannot show chat ad:', { chatAdBanner: !!chatAdBanner, ad: !!ad });
    return;
  }

  console.log('Showing chat ad:', ad.title);
  chatAdImage.src = ad.imageUrl || '';
  chatAdTitle.textContent = ad.title || '';
  chatAdContent.textContent = ad.content || '';
  chatAdBanner.style.display = 'block';
}

// Hide chat ad
function hideChatAd() {
  if (chatAdBanner) {
    console.log('Hiding chat ad');
    chatAdBanner.style.display = 'none';
  }
}

// Handle ad click - track click and open target URL
async function handleAdClick(ad) {
  if (!ad) return;

  try {
    // Track the click
    await fetch(`/api/auth/ads/${ad._id}/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Open target URL in new tab
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank');
    }
  } catch (error) {
    console.error('Failed to track ad click:', error);
    // Still open URL even if tracking fails
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank');
    }
  }
}

// Export functions for use in main script
window.AdManager = {
  initializeAds,
  fetchAds,
  showWaitingAd,
  hideWaitingAd,
  showChatAd,
  hideChatAd,
  currentAds: []
};

// Initialize ads when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing AdManager');
  initializeAds();
});
