# QR Code Generator

A simple, fast QR code generator web application. Paste a URL and download QR codes in PNG or SVG format.

## Features

- ✅ **Simple URL Input** - Clean text field with validation
- ✅ **Real-time Generation** - QR codes appear instantly as you type
- ✅ **Multiple Formats** - Download as PNG or SVG
- ✅ **Mobile Responsive** - Works perfectly on all devices
- ✅ **No Dependencies** - Runs entirely in the browser
- ✅ **Modern UI** - Clean, professional design

## How to Use

1. **Open the app** - Open `index.html` in your browser
2. **Enter a URL** - Paste any valid URL in the input field
3. **Generate QR** - QR code appears automatically
4. **Download** - Click "Download PNG" or "Download SVG"

## Technology Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript
- **QR Library:** qrcode.js (CDN)
- **Styling:** CSS Grid/Flexbox
- **Deployment:** Static site hosting

## Local Development

No build tools required! Simply:

```bash
# Install Python for local server (if needed)
python3 -m http.server 3000

# Then visit http://localhost:3000
```

## Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Drag and drop the project folder
2. Deploy automatically

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings

## Files Structure

```
QR-Gen/
├── index.html          # Main application
├── css/styles.css      # Application styles
├── js/
│   ├── qr-generator.js # Main logic
│   └── utils.js        # Utility functions
├── package.json        # NPM config
├── vercel.json         # Vercel config
└── README.md           # This file
```

## Browser Support

- ✅ Chrome
- ✅ Firefox  
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch

## License

MIT License - feel free to use for personal or commercial projects.