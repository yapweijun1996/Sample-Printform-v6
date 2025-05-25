/**
 * PrintForm Configuration Examples
 * This file shows how to configure and use the improved PrintForm system
 */

// Example 1: Basic usage with default settings
function useDefaultSettings() {
    // The system will auto-initialize with default settings
    // No additional configuration needed
    console.log('Using default PrintForm settings');
}

// Example 2: Custom configuration
function useCustomSettings() {
    const customConfig = {
        // Page layout settings
        paperWidth: 800,        // Custom paper width in pixels
        paperHeight: 1100,      // Custom paper height in pixels
        dummyRowHeight: 20,     // Height of spacing rows
        
        // Header/Footer repetition settings
        repeatHeader: true,     // Repeat header on every page
        repeatDocInfo: false,   // Don't repeat doc info on subsequent pages
        repeatRowHeader: true,  // Repeat row header on every page
        repeatFooter: true,     // Repeat footer on every page
        repeatFooterLogo: false, // Don't repeat footer logo
        
        // Spacing options
        insertDummyRowItem: true,              // Insert spacing items
        insertDummyRow: false,                 // Don't insert full dummy rows
        insertFooterSpacer: true,              // Insert footer spacing
        insertFooterSpacerWithDummyRow: false, // Don't use dummy rows for footer spacing
        
        // Custom content
        customDummyRowContent: '<tr><td style="height: 20px; background: #f0f0f0;"></td></tr>'
    };
    
    // Process with custom configuration
    processAllPrintForms(customConfig)
        .then(() => console.log('Custom processing completed'))
        .catch(error => console.error('Custom processing failed:', error));
}

// Example 3: Minimal spacing configuration
function useMinimalSpacing() {
    const minimalConfig = {
        insertDummyRowItem: false,
        insertDummyRow: false,
        insertFooterSpacer: false,
        insertFooterSpacerWithDummyRow: false
    };
    
    processAllPrintForms(minimalConfig);
}

// Example 4: A4 Paper configuration
function useA4Configuration() {
    const a4Config = {
        paperWidth: 794,   // A4 width at 96 DPI
        paperHeight: 1123, // A4 height at 96 DPI
        repeatHeader: true,
        repeatFooter: true,
        insertDummyRowItem: true
    };
    
    processAllPrintForms(a4Config);
}

// Example 5: Letter Paper configuration
function useLetterConfiguration() {
    const letterConfig = {
        paperWidth: 816,   // Letter width at 96 DPI
        paperHeight: 1056, // Letter height at 96 DPI
        repeatHeader: true,
        repeatFooter: true
    };
    
    processAllPrintForms(letterConfig);
}

// Example 6: Manual processing with error handling
async function manualProcessing() {
    try {
        const processor = new PrintFormProcessor({
            paperWidth: 750,
            paperHeight: 1000,
            repeatHeader: true,
            repeatFooter: true
        });
        
        await processor.process();
        console.log('Manual processing completed successfully');
        
    } catch (error) {
        console.error('Manual processing failed:', error);
        
        // Handle specific error cases
        if (error.message.includes('No .printform element found')) {
            console.log('No print forms found on this page');
        } else {
            console.log('Unexpected error occurred during processing');
        }
    }
}

// Example 7: Processing with delays and progress tracking
async function processWithProgress() {
    const printForms = document.querySelectorAll('.printform');
    console.log(`Starting to process ${printForms.length} print forms...`);
    
    for (let i = 0; i < printForms.length; i++) {
        console.log(`Processing form ${i + 1}/${printForms.length}...`);
        
        try {
            const processor = new PrintFormProcessor();
            await processor.process();
            console.log(`✓ Form ${i + 1} completed`);
            
            // Add delay between forms if needed
            if (i < printForms.length - 1) {
                await delay(100); // 100ms delay
            }
            
        } catch (error) {
            console.error(`✗ Form ${i + 1} failed:`, error);
        }
    }
    
    console.log('All forms processing completed');
}

// Example 8: Conditional configuration based on page content
function useConditionalConfiguration() {
    // Check if page has many row items
    const rowItems = document.querySelectorAll('.prowitem');
    const hasLargeContent = rowItems.length > 50;
    
    const config = {
        // Use more aggressive spacing for large content
        insertDummyRowItem: hasLargeContent,
        insertFooterSpacer: hasLargeContent,
        
        // Repeat headers more frequently for large content
        repeatHeader: hasLargeContent,
        repeatRowHeader: hasLargeContent,
        
        // Adjust paper height based on content
        paperHeight: hasLargeContent ? 1200 : 1050
    };
    
    processAllPrintForms(config);
}

// Example 9: Debug configuration with verbose logging
function useDebugConfiguration() {
    const debugConfig = {
        paperWidth: 750,
        paperHeight: 1050,
        repeatHeader: true,
        repeatFooter: true
    };
    
    // Enable verbose console logging
    const originalLog = console.log;
    console.log = function(...args) {
        originalLog.apply(console, ['[PrintForm Debug]', ...args]);
    };
    
    processAllPrintForms(debugConfig)
        .finally(() => {
            // Restore original console.log
            console.log = originalLog;
        });
}

// Example 10: Export configuration for reuse
const PRINT_CONFIGURATIONS = {
    default: {
        paperWidth: 750,
        paperHeight: 1050,
        repeatHeader: true,
        repeatFooter: false
    },
    
    a4: {
        paperWidth: 794,
        paperHeight: 1123,
        repeatHeader: true,
        repeatFooter: true
    },
    
    letter: {
        paperWidth: 816,
        paperHeight: 1056,
        repeatHeader: true,
        repeatFooter: true
    },
    
    compact: {
        paperWidth: 700,
        paperHeight: 900,
        insertDummyRowItem: false,
        insertFooterSpacer: false
    }
};

// Usage: processAllPrintForms(PRINT_CONFIGURATIONS.a4);

// Auto-detect and use appropriate configuration
function autoConfigurePrintForm() {
    // Detect paper size from CSS or other indicators
    const bodyWidth = document.body.offsetWidth;
    let configName = 'default';
    
    if (bodyWidth > 800) {
        configName = 'letter';
    } else if (bodyWidth > 750) {
        configName = 'a4';
    } else if (bodyWidth < 700) {
        configName = 'compact';
    }
    
    console.log(`Auto-detected configuration: ${configName}`);
    processAllPrintForms(PRINT_CONFIGURATIONS[configName]);
}

// Export configurations for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PRINT_CONFIGURATIONS,
        useDefaultSettings,
        useCustomSettings,
        useA4Configuration,
        useLetterConfiguration,
        autoConfigurePrintForm
    };
} 