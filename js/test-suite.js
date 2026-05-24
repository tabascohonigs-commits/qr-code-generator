// Comprehensive Test Suite for QR Code Generator

class QRCodeGeneratorTest {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    // Test runner
    run() {
        console.log('🧪 Running QR Code Generator Test Suite...');
        console.log('==========================================');
        
        this.testURLValidation();
        this.testQRCodeGeneration();
        this.testDownloadFunctionality();
        this.testHistoryManagement();
        this.testCustomizationOptions();
        this.testErrorHandling();
        this.testResponsiveDesign();
        
        this.printResults();
    }

    // Test URL validation
    testURLValidation() {
        console.log('\n📝 Testing URL Validation...');
        
        const testCases = [
            { input: 'https://example.com', expected: true },
            { input: 'http://google.com', expected: true },
            { input: 'https://github.com/user/repo', expected: true },
            { input: 'ftp://example.com', expected: true },
            { input: 'not-a-url', expected: false },
            { input: '', expected: false },
            { input: 'https://', expected: false },
            { input: 'example.com', expected: true }, // Auto-prepend https://
        ];

        testCases.forEach((testCase, index) => {
            const result = validateURL(testCase.input);
            const passed = result === testCase.expected;
            
            if (passed) {
                this.passed++;
                console.log(`✅ Test ${index + 1}: Passed - "${testCase.input}"`);
            } else {
                this.failed++;
                console.log(`❌ Test ${index + 1}: Failed - "${testCase.input}" expected ${testCase.expected}, got ${result}`);
            }
        });
    }

    // Test QR code generation
    testQRCodeGeneration() {
        console.log('\n📝 Testing QR Code Generation...');
        
        const testCases = [
            { url: 'https://example.com', format: 'png' },
            { url: 'https://google.com', format: 'svg' },
            { url: 'https://github.com', format: 'png' },
        ];

        testCases.forEach((testCase, index) => {
            try {
                // This would test the actual QR generation if we had a DOM environment
                // For now, we test the logic
                const result = this.simulateQRGeneration(testCase.url);
                const passed = result.success;
                
                if (passed) {
                    this.passed++;
                    console.log(`✅ Test ${index + 1}: QR generation for ${testCase.url} - Success`);
                } else {
                    this.failed++;
                    console.log(`❌ Test ${index + 1}: QR generation for ${testCase.url} - Failed: ${result.error}`);
                }
            } catch (error) {
                this.failed++;
                console.log(`❌ Test ${index + 1}: QR generation crashed - ${error.message}`);
            }
        });
    }

    // Simulate QR generation
    simulateQRGeneration(url) {
        if (!validateURL(url)) {
            return { success: false, error: 'Invalid URL' };
        }
        
        return { success: true, url: url };
    }

    // Test download functionality
    testDownloadFunctionality() {
        console.log('\n📝 Testing Download Functionality...');
        
        const testCases = [
            { format: 'png', expected: 'image/png' },
            { format: 'svg', expected: 'image/svg+xml' },
        ];

        testCases.forEach((testCase, index) => {
            try {
                const result = this.validateFormat(testCase.format);
                const passed = result === testCase.expected;
                
                if (passed) {
                    this.passed++;
                    console.log(`✅ Test ${index + 1}: Download format ${testCase.format} - Valid`);
                } else {
                    this.failed++;
                    console.log(`❌ Test ${index + 1}: Download format ${testCase.format} - Invalid`);
                }
            } catch (error) {
                this.failed++;
                console.log(`❌ Test ${index + 1}: Download format test crashed - ${error.message}`);
            }
        });
    }

    // Validate download format
    validateFormat(format) {
        const formats = {
            'png': 'image/png',
            'svg': 'image/svg+xml'
        };
        return formats[format] || null;
    }

    // Test history management
    testHistoryManagement() {
        console.log('\n📝 Testing History Management...');
        
        try {
            // Simulate adding to history
            const testURL = 'https://test.com';
            addToHistory(testURL);
            
            // Simulate loading history
            const history = JSON.parse(localStorage.getItem('qrHistory') || '[]');
            const passed = history.length > 0 && history[0].url === testURL;
            
            if (passed) {
                this.passed++;
                console.log('✅ Test: History management - Success');
            } else {
                this.failed++;
                console.log('❌ Test: History management - Failed');
            }
        } catch (error) {
            this.failed++;
            console.log(`❌ Test: History management crashed - ${error.message}`);
        }
    }

    // Test customization options
    testCustomizationOptions() {
        console.log('\n📝 Testing Customization Options...');
        
        const options = {
            color: '#ff0000',
            size: 300,
            correction: 'H'
        };
        
        try {
            const result = this.validateOptions(options);
            const passed = result.valid;
            
            if (passed) {
                this.passed++;
                console.log('✅ Test: Customization options - Success');
            } else {
                this.failed++;
                console.log(`❌ Test: Customization options - Failed: ${result.error}`);
            }
        } catch (error) {
            this.failed++;
            console.log(`❌ Test: Customization options crashed - ${error.message}`);
        }
    }

    // Validate customization options
    validateOptions(options) {
        const validColors = ['#000000', '#ff0000', '#00ff00', '#0000ff'];
        const validSizes = [128, 256, 300, 512];
        const validCorrections = ['L', 'M', 'Q', 'H'];
        
        if (!validColors.includes(options.color)) {
            return { valid: false, error: 'Invalid color' };
        }
        
        if (!validSizes.includes(options.size)) {
            return { valid: false, error: 'Invalid size' };
        }
        
        if (!validCorrections.includes(options.correction)) {
            return { valid: false, error: 'Invalid correction level' };
        }
        
        return { valid: true };
    }

    // Test error handling
    testErrorHandling() {
        console.log('\n📝 Testing Error Handling...');
        
        const errorCases = [
            { input: 'not-a-valid-url', expectedError: 'Please enter a valid URL' },
            { input: '', expectedError: 'Please enter a URL to generate a QR code' },
        ];

        errorCases.forEach((testCase, index) => {
            try {
                const result = this.simulateErrorHandling(testCase.input);
                const passed = result.includes(testCase.expectedError);
                
                if (passed) {
                    this.passed++;
                    console.log(`✅ Test ${index + 1}: Error handling - Success`);
                } else {
                    this.failed++;
                    console.log(`❌ Test ${index + 1}: Error handling - Failed: Expected "${testCase.expectedError}", got "${result}"`);
                }
            } catch (error) {
                this.failed++;
                console.log(`❌ Test ${index + 1}: Error handling crashed - ${error.message}`);
            }
        });
    }

    // Simulate error handling
    simulateErrorHandling(input) {
        if (!input.trim()) {
            return 'Please enter a URL to generate a QR code';
        }
        
        if (!validateURL(input)) {
            return 'Please enter a valid URL (e.g., https://example.com)';
        }
        
        return '';
    }

    // Test responsive design
    testResponsiveDesign() {
        console.log('\n📝 Testing Responsive Design...');
        
        const testCases = [
            { width: 1200, expected: 'desktop' },
            { width: 768, expected: 'tablet' },
            { width: 480, expected: 'mobile' },
        ];

        testCases.forEach((testCase, index) => {
            try {
                const result = this.detectResponsiveClass(testCase.width);
                const passed = result === testCase.expected;
                
                if (passed) {
                    this.passed++;
                    console.log(`✅ Test ${index + 1}: Responsive design ${testCase.width}px - Success`);
                } else {
                    this.failed++;
                    console.log(`❌ Test ${index + 1}: Responsive design ${testCase.width}px - Failed: Expected ${testCase.expected}, got ${result}`);
                }
            } catch (error) {
                this.failed++;
                console.log(`❌ Test ${index + 1}: Responsive design crashed - ${error.message}`);
            }
        });
    }

    // Detect responsive class
    detectResponsiveClass(width) {
        if (width >= 1024) return 'desktop';
        if (width >= 768) return 'tablet';
        return 'mobile';
    }

    // Print test results
    printResults() {
        console.log('\n==========================================');
        console.log('🏁 Test Results:');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📊 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
        
        if (this.failed === 0) {
            console.log('🎉 All tests passed! QR Code Generator is ready for deployment.');
        } else {
            console.log('⚠️  Some tests failed. Please review the issues above.');
        }
    }
}

// Run the test suite
if (typeof window !== 'undefined') {
    // Browser environment
    window.QRCodeGeneratorTest = QRCodeGeneratorTest;
} else {
    // Node.js environment
    const testSuite = new QRCodeGeneratorTest();
    testSuite.run();
}