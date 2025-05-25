/**
 * PrintForm Library - Optimized Version
 * A modern JavaScript library for formatting HTML forms for printing with pagination support
 * @version 2.0.0
 * @author Optimized by AI Assistant
 */

/**
 * Configuration object for print formatting options
 * @typedef {Object} PrintFormConfig
 * @property {boolean} repeatHeader - Whether to repeat header on each page
 * @property {boolean} repeatDocInfo - Whether to repeat document info on each page
 * @property {boolean} repeatRowHeader - Whether to repeat row header on each page
 * @property {boolean} repeatFooter - Whether to repeat footer on each page
 * @property {boolean} repeatFooterLogo - Whether to repeat footer logo on each page
 * @property {boolean} insertDummyRowItem - Whether to insert dummy row items for spacing
 * @property {boolean} insertDummyRow - Whether to insert dummy rows for spacing
 * @property {boolean} insertFooterSpacer - Whether to insert footer spacer
 * @property {boolean} insertFooterSpacerWithDummyRow - Whether to insert footer spacer with dummy rows
 * @property {string} customDummyRowContent - Custom content for dummy rows
 * @property {number} paperWidth - Paper width in pixels
 * @property {number} paperHeight - Paper height in pixels
 * @property {number} dummyRowHeight - Height of dummy rows in pixels
 */

/**
 * Default configuration for print formatting
 * @type {PrintFormConfig}
 */
const DEFAULT_CONFIG = {
  repeatHeader: true,
  repeatDocInfo: true,
  repeatRowHeader: true,
  repeatFooter: false,
  repeatFooterLogo: false,
  insertDummyRowItem: true,
  insertDummyRow: false,
  insertFooterSpacer: true,
  insertFooterSpacerWithDummyRow: true,
  customDummyRowContent: '',
  paperWidth: 750,
  paperHeight: 1050,
  dummyRowHeight: 18
};

/**
 * CSS class names used by the library
 * @type {Object}
 */
const CSS_CLASSES = {
  PRINTFORM: 'printform',
  FORMATTER: 'printform_formatter',
  HEADER: 'pheader',
  DOC_INFO: 'pdocinfo',
  ROW_HEADER: 'prowheader',
  FOOTER: 'pfooter',
  FOOTER_LOGO: 'pfooter_logo',
  ROW_ITEM: 'prowitem',
  DUMMY_ROW: 'dummy_row',
  DUMMY_ROW_ITEM: 'dummy_row_item',
  FOOTER_SPACER: 'pfooter_spacer',
  PAGE_BREAK: 'div_page_break_before',
  PAGE_BREAK_BEFORE: 'tb_page_break_before',
  PAPER_WIDTH: 'paper_width',
  PROCESSED_SUFFIX: '_processed'
};

/**
 * PrintForm class for handling form pagination and formatting
 */
class PrintForm {
  /**
   * Create a PrintForm instance
   * @param {PrintFormConfig} config - Configuration options
   */
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.isProcessed = false;
  }

  /**
   * Create a dummy row element for spacing
   * @param {number} height - Height of the dummy row
   * @returns {HTMLTableElement} The created dummy row table
   */
  createDummyRow(height) {
    const table = document.createElement('table');
    table.className = CSS_CLASSES.DUMMY_ROW;
    table.setAttribute('width', `${this.config.paperWidth}px`);
    table.setAttribute('cellspacing', '0');
    table.setAttribute('cellpadding', '0');

    const row = document.createElement('tr');
    row.style.height = `${height}px`;
    
    const cell = document.createElement('td');
    cell.style.border = '0px solid black';
    
    row.appendChild(cell);
    table.appendChild(row);
    
    return table;
  }

  /**
   * Create a dummy row item element for spacing
   * @param {number} height - Height of the dummy row item
   * @returns {HTMLTableElement} The created dummy row item table
   */
  createDummyRowItem(height) {
    const table = document.createElement('table');
    table.className = CSS_CLASSES.DUMMY_ROW_ITEM;
    table.setAttribute('width', `${this.config.paperWidth}px`);
    table.setAttribute('cellspacing', '0');
    table.setAttribute('cellpadding', '0');

    if (this.config.customDummyRowContent) {
      table.innerHTML = this.config.customDummyRowContent;
    } else {
      const row = document.createElement('tr');
      row.style.height = `${height}px`;
      
      const cell = document.createElement('td');
      cell.style.border = '0px solid black';
      
      row.appendChild(cell);
      table.appendChild(row);
    }
    
    return table;
  }

  /**
   * Insert multiple dummy row items to fill remaining space
   * @param {HTMLElement} container - Container element to append dummy rows
   * @param {number} remainingHeight - Remaining height to fill
   */
  insertDummyRowItems(container, remainingHeight) {
    if (remainingHeight <= 0) return;

    const numberOfItems = Math.floor(remainingHeight / this.config.dummyRowHeight);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < numberOfItems; i++) {
      fragment.appendChild(this.createDummyRowItem(this.config.dummyRowHeight));
    }

    container.appendChild(fragment);
  }

  /**
   * Create a page break element
   * @returns {HTMLDivElement} The page break element
   */
  createPageBreak() {
    const div = document.createElement('div');
    div.className = CSS_CLASSES.PAGE_BREAK;
    div.style.pageBreakBefore = 'always';
    div.style.height = '0px';
    return div;
  }

  /**
   * Create a footer spacer element
   * @param {number} height - Height of the spacer
   * @returns {HTMLDivElement} The footer spacer element
   */
  createFooterSpacer(height) {
    const div = document.createElement('div');
    div.className = `${CSS_CLASSES.FOOTER_SPACER} ${CSS_CLASSES.PAPER_WIDTH}`;
    div.style.height = `${height}px`;
    return div;
  }

  /**
   * Clone and append an element to the container
   * @param {HTMLElement} element - Element to clone
   * @param {HTMLElement} container - Container to append to
   * @returns {HTMLElement} The cloned element
   */
  cloneAndAppend(element, container) {
    const clone = element.cloneNode(true);
    container.appendChild(clone);
    return clone;
  }

  /**
   * Add processed suffix to element class name
   * @param {HTMLElement} element - Element to modify
   * @param {string} className - Original class name
   */
  markAsProcessed(element, className) {
    element.classList.remove(className);
    element.classList.add(`${className}${CSS_CLASSES.PROCESSED_SUFFIX}`);
  }

  /**
   * Get element height with proper error handling
   * @param {HTMLElement} element - Element to measure
   * @returns {number} Height in pixels
   */
  getElementHeight(element) {
    if (!element) return 0;
    return parseFloat(element.getBoundingClientRect().height.toFixed(2));
  }

  /**
   * Calculate remaining height on current page
   * @param {number} pageHeight - Total page height
   * @param {number} currentHeight - Current used height
   * @param {boolean} includeFooterLogo - Whether to include footer logo height
   * @param {number} footerLogoHeight - Footer logo height
   * @returns {number} Remaining height
   */
  calculateRemainingHeight(pageHeight, currentHeight, includeFooterLogo = false, footerLogoHeight = 0) {
    let remaining = pageHeight - currentHeight;
    if (!includeFooterLogo) {
      remaining -= footerLogoHeight;
    }
    return Math.max(0, remaining);
  }

  /**
   * Process footer spacing with dummy row items
   * @param {HTMLElement} container - Container element
   * @param {number} pageHeight - Total page height
   * @param {number} currentHeight - Current page height
   * @param {number} footerLogoHeight - Footer logo height
   * @returns {number} Updated current height
   */
  processFooterSpacingWithDummyRows(container, pageHeight, currentHeight, footerLogoHeight) {
    if (!this.config.insertFooterSpacerWithDummyRow) {
      return currentHeight;
    }

    const remainingHeight = this.calculateRemainingHeight(
      pageHeight, 
      currentHeight, 
      this.config.repeatFooterLogo, 
      footerLogoHeight
    );

    if (remainingHeight > 0) {
      this.insertDummyRowItems(container, remainingHeight);
      const remainder = remainingHeight % this.config.dummyRowHeight;
      return pageHeight - remainder;
    }

    return currentHeight;
  }

  /**
   * Process footer spacing
   * @param {HTMLElement} container - Container element
   * @param {HTMLElement} footerSpacer - Footer spacer element
   * @param {number} pageHeight - Total page height
   * @param {number} currentHeight - Current page height
   * @param {number} footerLogoHeight - Footer logo height
   */
  processFooterSpacing(container, footerSpacer, pageHeight, currentHeight, footerLogoHeight) {
    if (!this.config.insertFooterSpacer) return;

    const remainingHeight = this.calculateRemainingHeight(
      pageHeight, 
      currentHeight, 
      this.config.repeatFooterLogo, 
      footerLogoHeight
    );

    if (remainingHeight > 0) {
      const spacer = this.createFooterSpacer(remainingHeight);
      container.appendChild(spacer);
    }
  }

  /**
   * Add page elements (header, footer, etc.) to container
   * @param {Object} elements - Object containing page elements
   * @param {HTMLElement} container - Container to add elements to
   * @param {string} type - Type of element to add
   */
  addPageElement(elements, container, type) {
    const elementMap = {
      header: () => this.cloneAndAppend(elements.header, container),
      docInfo: () => this.cloneAndAppend(elements.docInfo, container),
      rowHeader: () => this.cloneAndAppend(elements.rowHeader, container),
      footer: () => this.cloneAndAppend(elements.footer, container),
      footerLogo: () => this.cloneAndAppend(elements.footerLogo, container),
      pageBreak: () => container.appendChild(this.createPageBreak())
    };

    if (elementMap[type]) {
      elementMap[type]();
    }
  }

  /**
   * Process a single printform element
   * @param {HTMLElement} printform - The printform element to process
   * @returns {Promise<void>}
   */
  async processPrintForm(printform) {
    // Create formatter container
    const formatter = document.createElement('div');
    formatter.classList.add(CSS_CLASSES.FORMATTER);
    printform.parentNode.insertBefore(formatter, printform);

    // Get all required elements
    const elements = {
      header: printform.querySelector(`.${CSS_CLASSES.HEADER}`),
      docInfo: printform.querySelector(`.${CSS_CLASSES.DOC_INFO}`),
      rowHeader: printform.querySelector(`.${CSS_CLASSES.ROW_HEADER}`),
      footer: printform.querySelector(`.${CSS_CLASSES.FOOTER}`),
      footerLogo: printform.querySelector(`.${CSS_CLASSES.FOOTER_LOGO}`),
      rowItems: printform.querySelectorAll(`.${CSS_CLASSES.ROW_ITEM}`)
    };

    // Calculate element heights
    const heights = {
      header: this.getElementHeight(elements.header),
      docInfo: this.getElementHeight(elements.docInfo),
      rowHeader: this.getElementHeight(elements.rowHeader),
      footer: this.getElementHeight(elements.footer),
      footerLogo: this.getElementHeight(elements.footerLogo)
    };

    // Calculate available height per page
    let pageHeight = this.config.paperHeight;
    if (this.config.repeatHeader) pageHeight -= heights.header;
    if (this.config.repeatDocInfo) pageHeight -= heights.docInfo;
    if (this.config.repeatRowHeader) pageHeight -= heights.rowHeader;
    if (this.config.repeatFooter) pageHeight -= heights.footer;
    if (this.config.repeatFooterLogo) pageHeight -= heights.footerLogo;

    // Mark elements as processed
    Object.entries(elements).forEach(([key, element]) => {
      if (element && key !== 'rowItems') {
        this.markAsProcessed(element, CSS_CLASSES[key.toUpperCase().replace('HEADER', '_HEADER')]);
      }
    });

    // Process pagination
    let currentPageHeight = 0;
    let isFirstPage = true;

    for (let i = 0; i < elements.rowItems.length; i++) {
      const rowItem = elements.rowItems[i];
      const rowHeight = this.getElementHeight(rowItem);
      const hasPageBreak = rowItem.classList.contains(CSS_CLASSES.PAGE_BREAK_BEFORE);

      // Add page headers if starting new page
      if (isFirstPage || hasPageBreak || currentPageHeight + rowHeight > pageHeight) {
        if (!isFirstPage) {
          // Add footer spacing and elements for previous page
          currentPageHeight = this.processFooterSpacingWithDummyRows(
            formatter, pageHeight, currentPageHeight, heights.footerLogo
          );

          if (this.config.repeatFooter) {
            this.addPageElement(elements, formatter, 'footer');
          }
          if (this.config.repeatFooterLogo) {
            this.addPageElement(elements, formatter, 'footerLogo');
          }

          this.addPageElement(elements, formatter, 'pageBreak');
        }

        // Add headers for new page
        if (this.config.repeatHeader || isFirstPage) {
          this.addPageElement(elements, formatter, 'header');
        }
        if (this.config.repeatDocInfo || isFirstPage) {
          this.addPageElement(elements, formatter, 'docInfo');
        }
        if (this.config.repeatRowHeader || isFirstPage) {
          this.addPageElement(elements, formatter, 'rowHeader');
        }

        currentPageHeight = isFirstPage ? 
          (this.config.repeatHeader ? 0 : heights.header) +
          (this.config.repeatDocInfo ? 0 : heights.docInfo) +
          (this.config.repeatRowHeader ? 0 : heights.rowHeader) : 0;

        isFirstPage = false;
      }

      // Add row item
      this.markAsProcessed(rowItem, CSS_CLASSES.ROW_ITEM);
      this.cloneAndAppend(rowItem, formatter);
      currentPageHeight += rowHeight;
    }

    // Add final footer
    const finalHeight = currentPageHeight + heights.footer + heights.footerLogo;
    if (finalHeight <= pageHeight) {
      // Footer fits on current page
      currentPageHeight = this.processFooterSpacingWithDummyRows(
        formatter, pageHeight, currentPageHeight, heights.footerLogo
      );
    } else {
      // Need new page for footer
      if (this.config.repeatFooter) {
        this.addPageElement(elements, formatter, 'footer');
      }
      if (this.config.repeatFooterLogo) {
        this.addPageElement(elements, formatter, 'footerLogo');
      }

      this.addPageElement(elements, formatter, 'pageBreak');

      if (this.config.repeatHeader) {
        this.addPageElement(elements, formatter, 'header');
      }
      if (this.config.repeatDocInfo) {
        this.addPageElement(elements, formatter, 'docInfo');
      }
      if (this.config.repeatRowHeader) {
        this.addPageElement(elements, formatter, 'rowHeader');
      }

      currentPageHeight = heights.footer + heights.footerLogo;
      currentPageHeight = this.processFooterSpacingWithDummyRows(
        formatter, pageHeight, currentPageHeight, heights.footerLogo
      );
    }

    this.addPageElement(elements, formatter, 'footer');
    this.addPageElement(elements, formatter, 'footerLogo');

    // Mark formatter as processed and remove original
    this.markAsProcessed(formatter, CSS_CLASSES.FORMATTER);
    printform.remove();
  }

  /**
   * Process all printform elements on the page
   * @returns {Promise<void>}
   */
  async processAll() {
    if (this.isProcessed) return;

    const printforms = document.querySelectorAll(`.${CSS_CLASSES.PRINTFORM}`);
    
    for (const printform of printforms) {
      try {
        await this.delay(1); // Small delay for DOM updates
        await this.processPrintForm(printform);
      } catch (error) {
        console.error('Error processing printform:', error);
      }
    }

    this.isProcessed = true;
  }

  /**
   * Utility function to create a delay
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global instance for backward compatibility
let globalPrintForm = null;

/**
 * Initialize the PrintForm library with configuration
 * @param {PrintFormConfig} config - Configuration options
 * @returns {PrintForm} PrintForm instance
 */
function initPrintForm(config = {}) {
  globalPrintForm = new PrintForm(config);
  return globalPrintForm;
}

/**
 * Process all printforms on the page (backward compatibility)
 * @returns {Promise<void>}
 */
async function printform_process() {
  if (!globalPrintForm) {
    globalPrintForm = new PrintForm();
  }
  return globalPrintForm.processAll();
}

/**
 * Auto-initialize when DOM is loaded
 */
if (typeof window !== 'undefined') {
  let autoProcessed = false;

  window.addEventListener('load', async () => {
    if (!autoProcessed) {
      try {
        await printform_process();
        autoProcessed = true;
      } catch (error) {
        console.error('Auto-processing failed:', error);
      }
    }
  });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PrintForm, initPrintForm, printform_process };
}

// Export for ES modules
if (typeof window !== 'undefined') {
  window.PrintForm = PrintForm;
  window.initPrintForm = initPrintForm;
  window.printform_process = printform_process;
} 