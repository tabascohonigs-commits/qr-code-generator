// Utility functions for QR Code Generator

/**
 * Validates if a string is a valid URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateURL(url) {
    if (!url || url.trim() === '') {
        return false;
    }
    
    try {
        const urlObject = new URL(url);
        return true;
    } catch (error) {
        // Try adding protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            try {
                const urlWithProtocol = 'https://' + url;
                new URL(urlWithProtocol);
                return true;
            } catch (error2) {
                return false;
            }
        }
        return false;
    }
}

/**
 * Shows an error message with animation
 * @param {string} message - The error message to display
 */
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 5000);
}

/**
 * Hides the error message
 */
function hideError() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.classList.remove('show');
}

/**
 * Downloads content as a file
 * @param {string} content - The content to download
 * @param {string} filename - The filename to use
 * @param {string} mimeType - The MIME type of the file
 */
function downloadFile(content, filename, mimeType) {
    const link = document.createElement('a');
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

/**
 * Delays function execution
 * @param {Function} func - The function to execute
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Generates a safe filename from a URL
 * @param {string} url - The URL to convert to filename
 * @param {string} format - The file format (png, svg)
 * @returns {string} - Safe filename
 */
function generateFilename(url, format) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace(/^www\./, '');
        const path = urlObj.pathname.replace(/\/$/, '');
        const cleanPath = path.replace(/[^a-z0-9]/gi, '-');
        
        let filename = hostname + cleanPath;
        if (filename.length > 50) {
            filename = filename.substring(0, 47) + '...';
        }
        
        return filename + '.' + format;
    } catch (error) {
        // Fallback to simple filename
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        return `qr-code-${timestamp}.${format}`;
    }
}

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    if (!input) return '';
    return input.replace(/[<>]/g, '');
}

/**
 * Copy to clipboard functionality
 * @param {string} text - The text to copy
 * @param {Function} success - Success callback
 * @param {Function} error - Error callback
 */
function copyToClipboard(text, success, error) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(success).catch(error);
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            success();
        } catch (err) {
            error(err);
        } finally {
            document.body.removeChild(textarea);
        }
    }
}
