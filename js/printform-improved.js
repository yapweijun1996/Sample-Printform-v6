/**
 * PrintForm - Advanced Print Formatting System
 * Handles pagination and formatting for printable documents
 * 
 * @version 2.0
 * @author Improved by AI Assistant
 */

class PrintFormConfig {
    constructor(options = {}) {
        // Use boolean values instead of strings for better type safety
        this.repeatHeader = options.repeatHeader ?? true;
        this.repeatDocInfo = options.repeatDocInfo ?? true;
        this.repeatRowHeader = options.repeatRowHeader ?? true;
        this.repeatFooter = options.repeatFooter ?? false;
        this.repeatFooterLogo = options.repeatFooterLogo ?? false;
        
        // Spacing and layout options
        this.insertDummyRowItem = options.insertDummyRowItem ?? true;
        this.insertDummyRow = options.insertDummyRow ?? false;
        this.insertFooterSpacer = options.insertFooterSpacer ?? true;
        this.insertFooterSpacerWithDummyRow = options.insertFooterSpacerWithDummyRow ?? true;
        
        // Paper dimensions (in pixels)
        this.paperWidth = options.paperWidth ?? 750;
        this.paperHeight = options.paperHeight ?? 1050;
        this.dummyRowHeight = options.dummyRowHeight ?? 18;
        
        // Custom content
        this.customDummyRowContent = options.customDummyRowContent ?? "";
    }
}

class PrintFormProcessor {
    constructor(config = {}) {
        this.config = new PrintFormConfig(config);
        this.isProcessed = false;
    }

    /**
     * Creates a dummy row element for spacing
     * @param {HTMLElement} targetElement - Element to append to
     * @param {number} height - Height of the dummy row
     */
    createDummyRow(targetElement, height) {
        if (!targetElement || height <= 0) return;

        const table = document.createElement('table');
        table.className = 'dummy_row';
        table.setAttribute('width', `${this.config.paperWidth}px`);
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '0');
        
        table.innerHTML = `
            <tr style="height: ${height}px;">
                <td style="border: 0px solid black;"></td>
            </tr>
        `;
        
        targetElement.appendChild(table);
    }

    /**
     * Creates dummy row items for precise spacing
     * @param {HTMLElement} targetElement - Element to append to
     * @param {number} height - Height of each dummy row item
     */
    createDummyRowItem(targetElement, height) {
        if (!targetElement || height <= 0) return;

        const table = document.createElement('table');
        table.className = 'dummy_row_item';
        table.setAttribute('width', `${this.config.paperWidth}px`);
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '0');
        
        let innerHTML = `
            <tr style="height: ${height}px;">
                <td style="border: 0px solid black;"></td>
            </tr>
        `;
        
        // Use custom content if provided
        if (this.config.customDummyRowContent) {
            innerHTML = this.config.customDummyRowContent;
        }
        
        table.innerHTML = innerHTML;
        targetElement.appendChild(table);
    }

    /**
     * Inserts multiple dummy row items to fill space
     * @param {HTMLElement} targetElement - Element to append to
     * @param {number} totalHeight - Total height to fill
     */
    insertDummyRowItems(targetElement, totalHeight) {
        if (totalHeight <= 0) return;

        const itemCount = Math.floor(totalHeight / this.config.dummyRowHeight);
        for (let i = 0; i < itemCount; i++) {
            this.createDummyRowItem(targetElement, this.config.dummyRowHeight);
        }
    }

    /**
     * Gets the height of an element safely
     * @param {HTMLElement} element - Element to measure
     * @returns {number} Height in pixels
     */
    getElementHeight(element) {
        if (!element) return 0;
        return parseFloat(element.getBoundingClientRect().height.toFixed(2));
    }

    /**
     * Clones and appends an element
     * @param {HTMLElement} source - Source element to clone
     * @param {HTMLElement} target - Target element to append to
     * @param {string} logName - Name for logging
     */
    appendClonedElement(source, target, logName) {
        if (!source || !target) return;
        
        const clone = source.cloneNode(true);
        target.appendChild(clone);
        console.log(`Added: ${logName}`);
    }

    /**
     * Adds processed class to element
     * @param {HTMLElement} element - Element to modify
     * @param {string} className - Base class name
     */
    markAsProcessed(element, className) {
        if (!element) return;
        
        element.classList.remove(className);
        element.classList.add(`${className}_processed`);
    }

    /**
     * Creates a page break element
     * @returns {HTMLElement} Page break div
     */
    createPageBreak() {
        const div = document.createElement('div');
        div.classList.add('div_page_break_before');
        div.style.pageBreakBefore = 'always';
        div.style.height = '0px';
        return div;
    }

    /**
     * Creates a footer spacer element
     * @returns {HTMLElement} Footer spacer div
     */
    createFooterSpacer() {
        const div = document.createElement('div');
        div.classList.add('pfooter_spacer', 'paper_width');
        div.style.height = '0px';
        return div;
    }

    /**
     * Processes footer spacing
     * @param {HTMLElement} targetElement - Target element
     * @param {number} remainingHeight - Remaining height on page
     */
    processFooterSpacing(targetElement, remainingHeight) {
        if (!this.config.insertFooterSpacer || remainingHeight <= 0) return;

        const spacer = this.createFooterSpacer();
        spacer.style.height = `${remainingHeight}px`;
        targetElement.appendChild(spacer);
    }

    /**
     * Processes footer spacing with dummy row items
     * @param {HTMLElement} targetElement - Target element
     * @param {number} heightPerPage - Height per page
     * @param {number} currentHeight - Current page height
     * @returns {number} Updated current height
     */
    processFooterSpacingWithDummyRows(targetElement, heightPerPage, currentHeight) {
        if (!this.config.insertFooterSpacerWithDummyRow) return currentHeight;

        const remainingHeight = heightPerPage - currentHeight;
        
        if (remainingHeight > 0) {
            this.insertDummyRowItems(targetElement, remainingHeight);
            const remainder = remainingHeight % this.config.dummyRowHeight;
            return heightPerPage - remainder;
        }
        
        return currentHeight;
    }

    /**
     * Main processing function
     * @returns {Promise} Promise that resolves when processing is complete
     */
    async process() {
        return new Promise((resolve, reject) => {
            try {
                const printForm = document.querySelector('.printform');
                if (!printForm) {
                    throw new Error('No .printform element found');
                }

                // Create formatter container
                const formatter = document.createElement('div');
                formatter.classList.add('printform_formatter');
                printForm.parentNode.insertBefore(formatter, printForm);

                // Get all required elements with error checking
                const elements = this.getRequiredElements(printForm);
                const heights = this.calculateHeights(elements);
                
                // Calculate available height per page
                const heightPerPage = this.calculateHeightPerPage(heights);
                
                // Mark elements as processed
                this.markElementsAsProcessed(elements);
                
                // Process pagination
                this.processPagination(formatter, elements, heights, heightPerPage);
                
                // Clean up
                this.markAsProcessed(formatter, 'printform_formatter');
                printForm.remove();
                
                console.log('PrintForm processing completed successfully');
                resolve();
                
            } catch (error) {
                console.error('PrintForm processing failed:', error);
                reject(error);
            }
        });
    }

    /**
     * Gets all required elements from the print form
     * @param {HTMLElement} printForm - The main print form element
     * @returns {Object} Object containing all required elements
     */
    getRequiredElements(printForm) {
        const elements = {
            header: printForm.querySelector('.pheader'),
            docInfo: printForm.querySelector('.pdocinfo'),
            rowHeader: printForm.querySelector('.prowheader'),
            footer: printForm.querySelector('.pfooter'),
            footerLogo: printForm.querySelector('.pfooter_logo'),
            rowItems: printForm.querySelectorAll('.prowitem')
        };

        // Validate required elements exist
        const requiredElements = ['header', 'docInfo', 'rowHeader', 'footer', 'footerLogo'];
        for (const key of requiredElements) {
            if (!elements[key]) {
                console.warn(`Warning: .p${key.toLowerCase()} element not found`);
            }
        }

        return elements;
    }

    /**
     * Calculates heights of all elements
     * @param {Object} elements - Object containing all elements
     * @returns {Object} Object containing all heights
     */
    calculateHeights(elements) {
        const heights = {
            header: this.getElementHeight(elements.header),
            docInfo: this.getElementHeight(elements.docInfo),
            rowHeader: this.getElementHeight(elements.rowHeader),
            footer: this.getElementHeight(elements.footer),
            footerLogo: this.getElementHeight(elements.footerLogo),
            rowItems: []
        };

        // Calculate row item heights
        for (let i = 0; i < elements.rowItems.length; i++) {
            const height = this.getElementHeight(elements.rowItems[i]);
            if (height > 0) {
                heights.rowItems.push(height);
            }
        }

        console.log('Calculated heights:', heights);
        return heights;
    }

    /**
     * Calculates available height per page
     * @param {Object} heights - Object containing all heights
     * @returns {number} Available height per page
     */
    calculateHeightPerPage(heights) {
        let heightPerPage = this.config.paperHeight;

        if (this.config.repeatHeader) heightPerPage -= heights.header;
        if (this.config.repeatDocInfo) heightPerPage -= heights.docInfo;
        if (this.config.repeatRowHeader) heightPerPage -= heights.rowHeader;
        if (this.config.repeatFooter) heightPerPage -= heights.footer;
        if (this.config.repeatFooterLogo) heightPerPage -= heights.footerLogo;

        console.log(`Available height per page: ${heightPerPage}px`);
        return heightPerPage;
    }

    /**
     * Marks all elements as processed
     * @param {Object} elements - Object containing all elements
     */
    markElementsAsProcessed(elements) {
        this.markAsProcessed(elements.header, 'pheader');
        this.markAsProcessed(elements.docInfo, 'pdocinfo');
        this.markAsProcessed(elements.rowHeader, 'prowheader');
        this.markAsProcessed(elements.footer, 'pfooter');
        this.markAsProcessed(elements.footerLogo, 'pfooter_logo');
        
        elements.rowItems.forEach((item, index) => {
            this.markAsProcessed(item, 'prowitem');
        });
    }

    /**
     * Main pagination processing logic
     * @param {HTMLElement} formatter - Formatter container
     * @param {Object} elements - All elements
     * @param {Object} heights - All heights
     * @param {number} heightPerPage - Available height per page
     */
    processPagination(formatter, elements, heights, heightPerPage) {
        let currentPageHeight = 0;
        let isFirstPage = true;

        // Add initial page elements
        this.addPageHeader(formatter, elements, heights, isFirstPage);
        currentPageHeight = this.updateHeightForPageHeader(heights, isFirstPage);

        // Process each row item
        for (let i = 0; i < elements.rowItems.length; i++) {
            const itemHeight = heights.rowItems[i];
            if (!itemHeight) continue;

            // Check if item has page break
            const hasPageBreak = elements.rowItems[i].classList.contains('tb_page_break_before');
            
            // Check if we need a new page
            if (hasPageBreak || (currentPageHeight + itemHeight > heightPerPage)) {
                // Finish current page
                this.finishCurrentPage(formatter, elements, heights, heightPerPage, currentPageHeight);
                
                // Start new page
                formatter.appendChild(this.createPageBreak());
                this.addPageHeader(formatter, elements, heights, false);
                currentPageHeight = this.updateHeightForPageHeader(heights, false);
                isFirstPage = false;
            }

            // Add the row item
            this.appendClonedElement(elements.rowItems[i], formatter, `Row item ${i}`);
            currentPageHeight += itemHeight;
        }

        // Finish the last page
        this.finishLastPage(formatter, elements, heights, heightPerPage, currentPageHeight);
    }

    /**
     * Adds page header elements
     * @param {HTMLElement} formatter - Formatter container
     * @param {Object} elements - All elements
     * @param {Object} heights - All heights
     * @param {boolean} isFirstPage - Whether this is the first page
     */
    addPageHeader(formatter, elements, heights, isFirstPage) {
        if (this.config.repeatHeader || isFirstPage) {
            this.appendClonedElement(elements.header, formatter, 'Header');
        }
        
        if (this.config.repeatDocInfo || isFirstPage) {
            this.appendClonedElement(elements.docInfo, formatter, 'Doc Info');
        }
        
        if (this.config.repeatRowHeader || isFirstPage) {
            this.appendClonedElement(elements.rowHeader, formatter, 'Row Header');
        }
    }

    /**
     * Updates height for page header
     * @param {Object} heights - All heights
     * @param {boolean} isFirstPage - Whether this is the first page
     * @returns {number} Updated height
     */
    updateHeightForPageHeader(heights, isFirstPage) {
        let height = 0;
        
        if (!this.config.repeatHeader && isFirstPage) height += heights.header;
        if (!this.config.repeatDocInfo && isFirstPage) height += heights.docInfo;
        if (!this.config.repeatRowHeader && isFirstPage) height += heights.rowHeader;
        
        return height;
    }

    /**
     * Finishes the current page with spacing and footers
     * @param {HTMLElement} formatter - Formatter container
     * @param {Object} elements - All elements
     * @param {Object} heights - All heights
     * @param {number} heightPerPage - Available height per page
     * @param {number} currentHeight - Current page height
     */
    finishCurrentPage(formatter, elements, heights, heightPerPage, currentHeight) {
        // Add spacing if needed
        if (this.config.insertDummyRowItem) {
            const remainingHeight = heightPerPage - currentHeight;
            if (remainingHeight > 0) {
                this.insertDummyRowItems(formatter, remainingHeight);
            }
        }

        // Add footers
        if (this.config.repeatFooter) {
            this.appendClonedElement(elements.footer, formatter, 'Footer');
        }
        
        if (this.config.repeatFooterLogo) {
            this.appendClonedElement(elements.footerLogo, formatter, 'Footer Logo');
        }
    }

    /**
     * Finishes the last page
     * @param {HTMLElement} formatter - Formatter container
     * @param {Object} elements - All elements
     * @param {Object} heights - All heights
     * @param {number} heightPerPage - Available height per page
     * @param {number} currentHeight - Current page height
     */
    finishLastPage(formatter, elements, heights, heightPerPage, currentHeight) {
        // Calculate final height including footers
        let finalHeight = currentHeight + heights.footer + heights.footerLogo;
        
        if (this.config.repeatFooter) finalHeight -= heights.footer;
        if (this.config.repeatFooterLogo) finalHeight -= heights.footerLogo;

        if (finalHeight <= heightPerPage) {
            // Footers fit on current page
            this.finishCurrentPage(formatter, elements, heights, heightPerPage, currentHeight);
        } else {
            // Need new page for footers
            this.finishCurrentPage(formatter, elements, heights, heightPerPage, currentHeight);
            formatter.appendChild(this.createPageBreak());
            this.addPageHeader(formatter, elements, heights, false);
            
            // Add final footers
            this.appendClonedElement(elements.footer, formatter, 'Final Footer');
            this.appendClonedElement(elements.footerLogo, formatter, 'Final Footer Logo');
        }
    }
}

/**
 * Utility function for delayed execution
 * @param {number} milliseconds - Delay in milliseconds
 * @returns {Promise} Promise that resolves after delay
 */
function delay(milliseconds) {
    return new Promise((resolve, reject) => {
        if (typeof milliseconds === 'number' && milliseconds > 0) {
            console.log(`Pausing for ${milliseconds / 1000} seconds`);
            setTimeout(resolve, milliseconds);
        } else {
            reject(new Error('Invalid delay time'));
        }
    });
}

/**
 * Processes all print forms sequentially
 * @param {Object} config - Configuration options
 * @returns {Promise} Promise that resolves when all forms are processed
 */
async function processAllPrintForms(config = {}) {
    const printForms = document.querySelectorAll('.printform');
    const processor = new PrintFormProcessor(config);
    
    console.log(`Found ${printForms.length} print form(s) to process`);
    
    for (let i = 0; i < printForms.length; i++) {
        try {
            await delay(1); // Small delay between processing
            await processor.process();
            console.log(`Processed print form ${i + 1}/${printForms.length}`);
        } catch (error) {
            console.error(`Error processing print form ${i + 1}:`, error);
        }
    }
    
    console.log('All print forms processed');
}

// Global state management
let isProcessingComplete = false;

// Auto-initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    if (!isProcessingComplete) {
        processAllPrintForms()
            .then(() => {
                isProcessingComplete = true;
                console.log('Print form processing completed successfully');
            })
            .catch(error => {
                console.error('Print form processing failed:', error);
            });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PrintFormProcessor,
        PrintFormConfig,
        processAllPrintForms,
        delay
    };
} 