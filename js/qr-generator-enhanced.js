// Enhanced QR Code Generator - Advanced Features

// Global variables
let qrcode = null;
let currentURL = null;
let currentOptions = {
    size: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: 'H'
};

// DOM elements
const urlInput = document.getElementById('urlInput');
const qrDisplay = document.getElementById('qrDisplay');
const qrContainer = document.getElementById('qrContainer');
const placeholder = document.getElementById('placeholder');
const downloadPng = document.getElementById('downloadPng');
const downloadSvg = document.getElementById('downloadSvg');
const errorMessage = document.getElementById('errorMessage');

// New elements for enhancements
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');
const correctLevelSelect = document.getElementById('correctLevelSelect');
const historyList = document.getElementById('historyList');
const scanButton = document.getElementById('scanButton');
const sharingPanel = document.getElementById('sharingPanel');
const loadingSpinner = document.getElementById('loadingSpinner');

// Initialize the application
function init() {
    setupEventListeners();
    loadHistory();
    console.log('Enhanced QR Code Generator initialized');
}

// Setup event listeners
function setupEventListeners() {
    // URL input with real-time generation
    urlInput.addEventListener('input', (event) => {
        hideError();
        const url = event.target.value.trim();
        debouncedGenerateQR(url);
    });

    // Download buttons
    downloadPng.addEventListener('click', () => downloadQRAsPNG(currentURL));
    downloadSvg.addEventListener('click', () => downloadQRAsSVG(currentURL));

    // Color picker
    colorPicker.addEventListener('change', (event) => {
        currentOptions.colorDark = event.target.value;
        if (currentURL) generateQR(currentURL);
    });

    // Size slider
    sizeSlider.addEventListener('input', (event) => {
        currentOptions.size = parseInt(event.target.value);
        if (currentURL) generateQR(currentURL);
    });

    // Error correction level
    correctLevelSelect.addEventListener('change', (event) => {
        const levels = { 'L': QRCode.CorrectLevel.L, 'M': QRCode.CorrectLevel.M, 'Q': QRCode.CorrectLevel.Q, 'H': QRCode.CorrectLevel.H };
        currentOptions.correctLevel = levels[event.target.value];
        if (currentURL) generateQR(currentURL);
    });

    // Scan button
    scanButton.addEventListener('click', handleScanQR);

    // Share button
    document.getElementById('shareButton').addEventListener('click', handleShareQR);

    // Clear history
    document.getElementById('clearHistoryButton').addEventListener('click', clearHistory);
}

// Debounced QR generation for performance
const debouncedGenerateQR = debounce(generateQR, 300);

// Generate QR code with enhanced features
function generateQR(url) {
    if (!url) {
        showPlaceholder();
        hideError();
        return;
    }

    const sanitizedURL = sanitizeInput(url);
    
    if (!validateURL(sanitizedURL)) {
        showError('Please enter a valid URL (e.g., https://example.com)');
        showPlaceholder();
        return;
    }

    try {
        showLoading();
        currentURL = sanitizedURL;
        showQRContainer();
        
        // Clear previous QR code
        qrContainer.innerHTML = '';
        
        // Create new QR code with enhanced options
        qrcode = new QRCode(qrContainer, {
            text: sanitizedURL,
            width: currentOptions.size,
            height: currentOptions.size,
            colorDark: currentOptions.colorDark,
            colorLight: currentOptions.colorLight,
            correctLevel: currentOptions.correctLevel
        });

        // Add to history
        addToHistory(sanitizedURL);
        
        // Hide loading
        hideLoading();
        
    } catch (error) {
        console.error('Error generating QR code:', error);
        showError('Failed to generate QR code. Please try again.');
        showPlaceholder();
        hideLoading();
    }
}

// Enhanced UI functions
function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showQRContainer() {
    qrDisplay.style.display = 'block';
    placeholder.style.display = 'none';
}

function showPlaceholder() {
    qrDisplay.style.display = 'none';
    placeholder.style.display = 'block';
}

// Enhanced download functions
function downloadQRAsPNG(url) {
    try {
        const canvas = qrContainer.querySelector('canvas');
        if (!canvas) {
            showError('No QR code available to download');
            return;
        }

        // Create enhanced download with metadata
        const link = document.createElement('a');
        link.download = generateFilename(url, 'png');
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Track download
        trackDownload('PNG', url);
        
    } catch (error) {
        console.error('Error downloading PNG:', error);
        showError('Failed to download PNG. Please try again.');
    }
}

function downloadQRAsSVG(url) {
    try {
        const svgData = createSVGFromQR(url);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const urlObject = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = generateFilename(url, 'svg');
        link.href = urlObject;
        link.click();
        
        URL.revokeObjectURL(urlObject);
        
        // Track download
        trackDownload('SVG', url);
        
    } catch (error) {
        console.error('Error downloading SVG:', error);
        showError('Failed to download SVG. Please try again.');
    }
}

// Enhanced SVG generation with styling
function createSVGFromQR(url) {
    const size = currentOptions.size;
    const moduleCount = 25;
    const moduleSize = size / moduleCount;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${size}" height="${size}">
  <rect x="0" y="0" width="${size}" height="${size}" fill="${currentOptions.colorLight}"/>
  <g fill="${currentOptions.colorDark}">
    <!-- QR Code pattern would go here - simplified for demo -->
    <rect x="0" y="0" width="${moduleSize * 7}" height="${moduleSize * 7}"/>
    <rect x="${size - moduleSize * 7}" y="0" width="${moduleSize * 7}" height="${moduleSize * 7}"/>
    <rect x="0" y="${size - moduleSize * 7}" width="${moduleSize * 7}" height="${moduleSize * 7}"/>
    <rect x="${size/2 - moduleSize*2}" y="${size/2 - moduleSize*2}" width="${moduleSize * 4}" height="${moduleSize * 4}"/>
  </g>
  <text x="${size/2}" y="${size - 10}" text-anchor="middle" font-size="10" fill="#666">${url.length > 30 ? url.substring(0, 27) + '...' : url}</text>
</svg>`;
}

// History management
function addToHistory(url) {
    let history = JSON.parse(localStorage.getItem('qrHistory') || '[]');
    
    // Remove if already exists
    history = history.filter(item => item.url !== url);
    
    // Add to beginning
    history.unshift({
        url: url,
        timestamp: new Date().toISOString(),
        options: {...currentOptions}
    });
    
    // Keep only last 10 items
    history = history.slice(0, 10);
    
    localStorage.setItem('qrHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

function loadHistory() {
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const history = JSON.parse(localStorage.getItem('qrHistory') || '[]');
    historyList.innerHTML = '';
    
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-url" onclick="generateQR('${item.url}')">${item.url}</div>
            <div class="history-time">${formatTime(item.timestamp)}</div>
            <button class="history-delete" onclick="deleteHistoryItem(${index})">Delete</button>
        `;
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    localStorage.removeItem('qrHistory');
    updateHistoryDisplay();
}

function deleteHistoryItem(index) {
    let history = JSON.parse(localStorage.getItem('qrHistory') || '[]');
    history.splice(index, 1);
    localStorage.setItem('qrHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

// Scan QR code functionality
function handleScanQR() {
    if ('BarcodeDetector' in window) {
        // Modern API
        scanQRCodeModern();
    } else {
        // Fallback - show file input
        scanQRCodeFallback();
    }
}

async function scanQRCodeModern() {
    try {
        const barcodeDetector = new BarcodeDetector();
        const video = document.createElement('video');
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        
        video.srcObject = stream;
        video.play();
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        const scan = async () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                const barcodes = await barcodeDetector.detect(canvas);
                if (barcodes.length > 0) {
                    stream.getTracks().forEach(track => track.stop());
                    urlInput.value = barcodes[0].rawValue;
                    generateQR(barcodes[0].rawValue);
                    return;
                }
            }
            requestAnimationFrame(scan);
        };
        
        scan();
        
    } catch (error) {
        console.error('Error scanning QR code:', error);
        showError('Unable to scan QR code. Please try again.');
    }
}

function scanQRCodeFallback() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const barcodeDetector = new BarcodeDetector();
            const barcodes = await barcodeDetector.detect(file);
            
            if (barcodes.length > 0) {
                urlInput.value = barcodes[0].rawValue;
                generateQR(barcodes[0].rawValue);
            } else {
                showError('No QR code found in the image.');
            }
        } catch (error) {
            console.error('Error scanning QR code:', error);
            showError('Unable to scan QR code. Please try a different image.');
        }
    });
    
    input.click();
}

// Sharing functionality
function handleShareQR() {
    if (!currentURL) {
        showError('Generate a QR code first before sharing.');
        return;
    }
    
    sharingPanel.style.display = sharingPanel.style.display === 'none' ? 'block' : 'none';
}

function shareQRCode() {
    if (navigator.share) {
        navigator.share({
            title: 'QR Code',
            text: `QR code for ${currentURL}`,
            url: currentURL
        });
    } else {
        // Fallback - copy to clipboard
        copyToClipboard(currentURL, () => {
            alert('URL copied to clipboard!');
        }, (error) => {
            console.error('Error copying to clipboard:', error);
            showError('Failed to copy URL to clipboard.');
        });
    }
}

// Analytics and tracking
function trackDownload(format, url) {
    const analytics = JSON.parse(localStorage.getItem('qrAnalytics') || '{}');
    const today = new Date().toDateString();
    
    if (!analytics[today]) {
        analytics[today] = { downloads: 0, urls: {} };
    }
    
    analytics[today].downloads++;
    analytics[today].urls[url] = (analytics[today].urls[url] || 0) + 1;
    
    localStorage.setItem('qrAnalytics', JSON.stringify(analytics));
}

// Utility functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);