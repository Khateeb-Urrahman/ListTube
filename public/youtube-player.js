/**
 * YouTube Fullscreen Popup Player for ListTube
 * A lightweight, dependency-free module for playing YouTube videos in a fullscreen modal
 */

(function() {
  'use strict';

  // Create the YouTubePlayer class
  function YouTubePlayer() {
    this.modal = null;
    this.iframe = null;
    this.closeButton = null;
    this.currentThumbnail = null;
  }

  /**
   * Initialize the YouTube player by setting up event listeners
   */
  YouTubePlayer.prototype.init = function() {
    // Listen for click events on the document
    document.addEventListener('click', this.handleThumbnailClick.bind(this));
    
    // Listen for keydown events for Escape key
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  };

  /**
   * Handle click events on thumbnails
   */
  YouTubePlayer.prototype.handleThumbnailClick = function(event) {
    // Check if the clicked element is an img or if the click was on a parent of an img
    let target = event.target;
    
    // If the target is not an img, look for an img within the target
    if (target.tagName !== 'IMG') {
      const img = target.querySelector('img');
      if (img) {
        target = img;
      } else {
        // If no img found, check if any parent is a thumbnail container
        while (target && target !== document) {
          if (target.classList && target.classList.contains('youtube-thumbnail')) {
            // Try to find an img within this container
            const img = target.querySelector('img');
            if (img) {
              target = img;
              break;
            }
          }
          target = target.parentElement;
        }
      }
    }
    
    // If we have an img and it's a YouTube thumbnail, open the player
    if (target.tagName === 'IMG' && this.isYouTubeThumbnail(target)) {
      event.preventDefault();
      this.currentThumbnail = target;
      this.openPlayer(target);
    }
  };

  /**
   * Check if an img element is a YouTube thumbnail
   */
  YouTubePlayer.prototype.isYouTubeThumbnail = function(img) {
    // Check if it has data attributes
    if (img.hasAttribute('data-video-url') || img.hasAttribute('data-video-id')) {
      return true;
    }
    
    // Check if src matches YouTube thumbnail pattern
    if (img.src && img.src.includes('youtube.com/vi/')) {
      return true;
    }
    
    // Check if alt contains YouTube video pattern
    if (img.alt && img.alt.startsWith('YouTube Video: ')) {
      return true;
    }
    
    // Check for global video mapping
    if (typeof window.listtubeVideos !== 'undefined' || document.querySelector('script[type="application/json"][id="listtube-videos"]')) {
      return true;
    }
    
    return false;
  };

  /**
   * Extract YouTube video ID from an img element
   */
  YouTubePlayer.prototype.extractVideoId = function(img) {
    // 1. Check data-video-url or data-video-id attributes
    if (img.hasAttribute('data-video-url')) {
      const url = img.getAttribute('data-video-url');
      return this.extractIdFromUrl(url);
    }
    
    if (img.hasAttribute('data-video-id')) {
      return img.getAttribute('data-video-id');
    }
    
    // 2. Parse thumbnail src for pattern https://img.youtube.com/vi/<VIDEO_ID>/...
    if (img.src && img.src.includes('youtube.com/vi/')) {
      const match = img.src.match(/youtube\.com\/vi\/([^/]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // 3. Extract from alt attribute (pattern: "YouTube Video: <ID>")
    if (img.alt && img.alt.startsWith('YouTube Video: ')) {
      const parts = img.alt.split('YouTube Video: ');
      if (parts.length > 1) {
        return parts[1];
      }
    }
    
    // 4. Check page-level JS store
    // Check window.listtubeVideos object
    if (typeof window.listtubeVideos !== 'undefined' && window.listtubeVideos[img.src]) {
      const url = window.listtubeVideos[img.src];
      return this.extractIdFromUrl(url);
    }
    
    // Check JSON script element
    const jsonScript = document.querySelector('script[type="application/json"][id="listtube-videos"]');
    if (jsonScript) {
      try {
        const videoMap = JSON.parse(jsonScript.textContent);
        if (videoMap[img.src]) {
          const url = videoMap[img.src];
          return this.extractIdFromUrl(url);
        }
      } catch (e) {
        console.error('Error parsing listtube-videos JSON:', e);
      }
    }
    
    return null;
  };

  /**
   * Extract video ID from a YouTube URL
   */
  YouTubePlayer.prototype.extractIdFromUrl = function(url) {
    if (!url) return null;
    
    // Match patterns:
    // https://www.youtube.com/watch?v=<ID>
    // https://youtu.be/<ID>
    // https://www.youtube.com/embed/<ID>
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/embed\/([^?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  /**
   * Open the YouTube player modal
   */
  YouTubePlayer.prototype.openPlayer = function(img) {
    const videoId = this.extractVideoId(img);
    
    if (!videoId) {
      this.showError('Unable to identify YouTube video ID');
      return;
    }
    
    // Create modal if it doesn't exist
    if (!this.modal) {
      this.createModal();
    }
    
    // Set iframe source
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    this.iframe.src = embedUrl;
    
    // Show modal
    this.modal.style.display = 'flex';
    
    // Disable background scrolling
    document.body.style.overflow = 'hidden';
    
    // Set accessibility attributes
    this.modal.setAttribute('aria-hidden', 'false');
    this.iframe.focus();
  };

  /**
   * Create the modal HTML structure
   */
  YouTubePlayer.prototype.createModal = function() {
    // Create modal container
    this.modal = document.createElement('div');
    this.modal.id = 'youtube-player-modal';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-label', 'YouTube Video Player');
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      position: relative;
      width: 90%;
      max-width: 1200px;
      height: 90%;
      max-height: 800px;
    `;
    
    // Create close button
    this.closeButton = document.createElement('button');
    this.closeButton.innerHTML = '&times;';
    this.closeButton.setAttribute('aria-label', 'Close video player');
    this.closeButton.style.cssText = `
      position: absolute;
      top: -40px;
      right: 0;
      background: transparent;
      border: none;
      color: white;
      font-size: 36px;
      cursor: pointer;
      width: 40px;
      height: 40px;
      z-index: 10001;
    `;
    this.closeButton.addEventListener('click', this.closePlayer.bind(this));
    
    // Create iframe
    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    this.iframe.setAttribute('allowfullscreen', '');
    this.iframe.setAttribute('title', 'YouTube Video Player');
    this.iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background-color: #000;
    `;
    
    // Assemble modal
    modalContent.appendChild(this.closeButton);
    modalContent.appendChild(this.iframe);
    this.modal.appendChild(modalContent);
    
    // Add click outside to close functionality
    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.closePlayer();
      }
    });
    
    // Add to document
    document.body.appendChild(this.modal);
  };

  /**
   * Show an error message in the player
   */
  YouTubePlayer.prototype.showError = function(message) {
    if (!this.modal) {
      this.createModal();
    }
    
    // Clear iframe
    this.iframe.src = '';
    
    // Show error message
    this.iframe.style.display = 'none';
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      color: white;
      font-size: 18px;
      text-align: center;
      background-color: #333;
    `;
    
    // Replace iframe with error message
    this.iframe.parentNode.insertBefore(errorDiv, this.iframe);
    this.errorElement = errorDiv;
    
    // Show modal
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    this.modal.setAttribute('aria-hidden', 'false');
  };

  /**
   * Close the YouTube player modal
   */
  YouTubePlayer.prototype.closePlayer = function() {
    if (!this.modal) return;
    
    // Hide modal
    this.modal.style.display = 'none';
    
    // Remove iframe src to stop playback
    if (this.iframe) {
      this.iframe.src = '';
    }
    
    // Remove error message if present
    if (this.errorElement) {
      this.errorElement.remove();
      this.errorElement = null;
      this.iframe.style.display = 'block';
    }
    
    // Restore background scrolling
    document.body.style.overflow = '';
    
    // Set accessibility attributes
    this.modal.setAttribute('aria-hidden', 'true');
    
    // Return focus to the thumbnail that opened the player
    if (this.currentThumbnail) {
      this.currentThumbnail.focus();
    }
  };

  /**
   * Handle keydown events (for Escape key)
   */
  YouTubePlayer.prototype.handleKeydown = function(event) {
    if (event.key === 'Escape' && this.modal && this.modal.style.display === 'flex') {
      this.closePlayer();
    }
  };

  // Initialize the player when the DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      const player = new YouTubePlayer();
      player.init();
    });
  } else {
    const player = new YouTubePlayer();
    player.init();
  }

  // Expose player to global scope for advanced usage
  window.YouTubePlayer = YouTubePlayer;

})();