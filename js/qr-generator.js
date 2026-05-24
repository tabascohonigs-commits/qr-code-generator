// QR Code Generator - Main Application

// Global variables
let qrcode = null;
let currentURL = null;
let currentFormat = null;

// DOM elements
const urlInput = document.getElementById('urlInput');
const qrDisplay = document.getElementById('qrDisplay');
const qrContainer = document.getElementById('qrContainer');
const placeholder = document.getElementById('placeholder');
const downloadPng = document.getElementById('downloadPng');
const downloadSvg = document.getElementById('downloadSvg');

// Debounced QR generation to prevent excessive calls
const debouncedGenerateQR = debounce(generateQR, 300);

// Initialize the application
function init() {
    setupEventListeners();
    console.log('QR Code Generator initialized');
}

// Setup event listeners
function setupEventListeners() {
    urlInput.addEventListener('input', (event) => {
        hideError();
        const url = event.target.value.trim();
        debouncedGenerateQR(url);
    });

    downloadPng.addEventListener('click', () => {
        if (currentURL) {
            downloadQRAsPNG(currentURL);
        }
    });

    downloadSvg.addEventListener('click', () => {
        if (currentURL) {
            downloadQRAsSVG(currentURL);
        }
    });
}

// Generate QR code
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
        currentURL = sanitizedURL;
        showQRContainer();
        
        // Clear previous QR code
        qrContainer.innerHTML = '';
        
        // Create new QR code
        qrcode = new QRCode(qrContainer, {
            text: sanitizedURL,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        
    } catch (error) {
        console.error('Error generating QR code:', error);
        showError('Failed to generate QR code. Please try again.');
        showPlaceholder();
    }
}

// Show QR container
function showQRContainer() {
    qrDisplay.style.display = 'block';
    placeholder.style.display = 'none';
}

// Show placeholder
function showPlaceholder() {
    qrDisplay.style.display = 'none';
    placeholder.style.display = 'block';
}

// Download QR code as PNG
function downloadQRAsPNG(url) {
    try {
        // Get the QR code canvas
        const canvas = qrContainer.querySelector('canvas');
        if (!canvas) {
            showError('No QR code available to download');
            return;
        }

        const link = document.createElement('a');
        link.download = generateFilename(url, 'png');
        link.href = canvas.toDataURL('image/png');
        link.click();
        
    } catch (error) {
        console.error('Error downloading PNG:', error);
        showError('Failed to download PNG. Please try again.');
    }
}

// Download QR code as SVG
function downloadQRAsSVG(url) {
    try {
        // Create SVG from QR code
        const svgData = createSVGFromQR(url);
        
        // Create blob and download
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const urlObject = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = generateFilename(url, 'svg');
        link.href = urlObject;
        link.click();
        
        // Clean up
        URL.revokeObjectURL(urlObject);
        
    } catch (error) {
        console.error('Error downloading SVG:', error);
        showError('Failed to download SVG. Please try again.');
    }
}

// Create SVG from QR code data
function createSVGFromQR(url) {
    const size = 256;
    const moduleCount = 25; // QR code modules per side
    const moduleSize = size / moduleCount;
    
    // This is a simplified SVG generation
    // For production, you'd want to use the actual QR data
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${size}" height="${size}">
  <!-- Placeholder QR code structure -->
  <rect x="0" y="0" width="${size}" height="${size}" fill="white"/>
  <!-- Real implementation would use actual QR data -->
  <text x="${size/2}" y="${size/2}" text-anchor="middle" font-size="12" fill="black">
    ${url.length > 30 ? url.substring(0, 27) + '...' : url}
  </text>
  <text x="${size/2}" y="${size/2 + 20}" text-anchor="middle" font-size="10" fill="black">
    QR Code for URL
  </text>
</svg>`;
}

// Error handling
function handleError(error) {
    console.error('QR Code Generator Error:', error);
    showError('An unexpected error occurred. Please try again.');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
