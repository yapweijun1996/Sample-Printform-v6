export class PrintFormFormatter {
  constructor(options = {}) {
    const {
      repeatHeader = true,
      repeatDocInfo = true,
      repeatRowHeader = true,
      repeatFooter = false,
      repeatFooterLogo = false,
      insertDummyRowItem = true,
      insertDummyRow = false,
      insertFooterSpacer = true,
      insertFooterSpacerWithDummy = true,
      customDummyContent = '',
      pageWidth = 750,
      pageHeight = 1050,
      dummyRowHeight = 18,
      debug = false,
    } = options;
    this.repeatHeader = repeatHeader;
    this.repeatDocInfo = repeatDocInfo;
    this.repeatRowHeader = repeatRowHeader;
    this.repeatFooter = repeatFooter;
    this.repeatFooterLogo = repeatFooterLogo;
    this.insertDummyRowItem = insertDummyRowItem;
    this.insertDummyRow = insertDummyRow;
    this.insertFooterSpacer = insertFooterSpacer;
    this.insertFooterSpacerWithDummy = insertFooterSpacerWithDummy;
    this.customDummyContent = customDummyContent;
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
    this.dummyRowHeight = dummyRowHeight;
    this.debug = debug;
  }

  log(...args) {
    if (this.debug) console.log(...args);
  }

  formatAll() {
    this.printForms = document.querySelectorAll('.printform');
    this.printForms.forEach(form => this.format(form));
  }

  format(printFormElement) {
    this.createFormatterContainer(printFormElement);
    this.measureSections(printFormElement);
    this.paginate(printFormElement);
  }

  createFormatterContainer(printFormElement) {
    this.originalPrintForm = printFormElement;
    const container = document.createElement('div');
    container.classList.add('printform_formatter');
    printFormElement.parentNode.insertBefore(container, printFormElement);
    this.formatterContainer = container;
  }

  measureSections(printFormElement) {
    this.headerElem = printFormElement.querySelector('.pheader');
    this.docInfoElem = printFormElement.querySelector('.pdocinfo');
    this.rowHeaderElem = printFormElement.querySelector('.prowheader');
    this.footerElem = printFormElement.querySelector('.pfooter');
    this.footerLogoElem = printFormElement.querySelector('.pfooter_logo');
    this.rowItems = Array.from(printFormElement.querySelectorAll('.prowitem'));

    this.headerHeight = this.headerElem?.getBoundingClientRect().height || 0;
    this.docInfoHeight = this.docInfoElem?.getBoundingClientRect().height || 0;
    this.rowHeaderHeight = this.rowHeaderElem?.getBoundingClientRect().height || 0;
    this.footerHeight = this.footerElem?.getBoundingClientRect().height || 0;
    this.footerLogoHeight = this.footerLogoElem?.getBoundingClientRect().height || 0;
  }

  paginate(printFormElement) {
    const container = this.formatterContainer;
    let currentPageHeight = 0;
    let heightPerPage = this.pageHeight;
    if (this.repeatHeader)     heightPerPage -= this.headerHeight;
    if (this.repeatDocInfo)    heightPerPage -= this.docInfoHeight;
    if (this.repeatRowHeader)  heightPerPage -= this.rowHeaderHeight;
    if (this.repeatFooter)     heightPerPage -= this.footerHeight;
    if (this.repeatFooterLogo) heightPerPage -= this.footerLogoHeight;
    const items = this.rowItems;
    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      const rowHeight = row.getBoundingClientRect().height;
      // force page break before this row?
      if (row.classList.contains('tb_page_break_before') && currentPageHeight > 0) {
        this.finishPage(heightPerPage - currentPageHeight);
        this.insertPageBreak();
        currentPageHeight = 0;
      }
      // new page header block
      if (currentPageHeight === 0) {
        this.renderHeader();
        if (!this.repeatHeader)     currentPageHeight += this.headerHeight;
        this.renderDocInfo();
        if (!this.repeatDocInfo)    currentPageHeight += this.docInfoHeight;
        this.renderRowHeader();
        if (!this.repeatRowHeader)  currentPageHeight += this.rowHeaderHeight;
      }
      // render row or paginate
      if (currentPageHeight + rowHeight <= heightPerPage) {
        this.renderRow(row);
        currentPageHeight += rowHeight;
      } else {
        this.finishPage(heightPerPage - currentPageHeight);
        this.insertPageBreak();
        currentPageHeight = 0;
        i--; // retry this row on next page
      }
    }
    // finish last page
    this.finishPage(heightPerPage - currentPageHeight);
    // remove original container
    this.originalPrintForm.remove();
  }

  fillRemainingSpace(container, remainingHeight, type) {
    switch (type) {
      case 'dummyRowItem': {
        const itemCount = Math.floor(remainingHeight / this.dummyRowHeight);
        for (let i = 0; i < itemCount; i++) {
          const tbl = document.createElement('table');
          tbl.classList.add('dummy_row_item');
          tbl.style.width = this.pageWidth + 'px';
          tbl.innerHTML = this.customDummyContent || `<tr style="height:${this.dummyRowHeight}px;"><td></td></tr>`;
          container.appendChild(tbl);
        }
        break;
      }
      case 'dummyRow': {
        const row = document.createElement('div');
        row.style.width = this.pageWidth + 'px';
        row.style.height = remainingHeight + 'px';
        container.appendChild(row);
        break;
      }
      case 'footerSpacer': {
        const spacer = document.createElement('div');
        spacer.style.width = this.pageWidth + 'px';
        spacer.style.height = remainingHeight + 'px';
        container.appendChild(spacer);
        break;
      }
      default:
        this.log('Unknown fill type:', type);
    }
  }

  renderHeader() {
    const clone = this.headerElem.cloneNode(true);
    this.formatterContainer.appendChild(clone);
    this.log('Header rendered');
  }

  renderDocInfo() {
    const clone = this.docInfoElem.cloneNode(true);
    this.formatterContainer.appendChild(clone);
    this.log('Doc info rendered');
  }

  renderRowHeader() {
    const clone = this.rowHeaderElem.cloneNode(true);
    this.formatterContainer.appendChild(clone);
    this.log('Row header rendered');
  }

  renderRow(rowElem) {
    const clone = rowElem.cloneNode(true);
    this.formatterContainer.appendChild(clone);
    this.log('Row rendered');
  }

  renderFooter() {
    const clone = this.footerElem.cloneNode(true);
    this.formatterContainer.appendChild(clone);
    this.log('Footer rendered');
  }

  renderFooterLogo() {
    const clone = this.footerLogoElem.cloneNode(true);
    this.formatterContainer.appendChild(clone);
    this.log('Footer logo rendered');
  }

  insertPageBreak() {
    const br = document.createElement('div');
    // force page break before and after for reliable pagination
    br.style.display = 'block';
    br.style.height = '0px';
    br.style.pageBreakBefore = 'always';   // legacy
    br.style.breakBefore = 'always';       // modern spec
    br.style.pageBreakAfter = 'always';    // legacy
    br.style.breakAfter = 'always';        // modern spec
    this.formatterContainer.appendChild(br);
    this.log('Page break inserted');
  }

  finishPage(remainingHeight) {
    // fill before footer: dummy row items
    if (this.insertDummyRowItem) {
      this.fillRemainingSpace(this.formatterContainer, remainingHeight, 'dummyRowItem');
    }
    // fill before footer: full dummy rows
    if (this.insertDummyRow) {
      this.fillRemainingSpace(this.formatterContainer, remainingHeight, 'dummyRow');
    }
    // footer spacer or dummy fill
    if (this.insertFooterSpacerWithDummy) {
      this.fillRemainingSpace(this.formatterContainer, remainingHeight, 'dummyRowItem');
    } else if (this.insertFooterSpacer) {
      this.fillRemainingSpace(this.formatterContainer, remainingHeight, 'footerSpacer');
    }
    // render footer and logo
    if (this.repeatFooter || true)     this.renderFooter();
    if (this.repeatFooterLogo || true) this.renderFooterLogo();
  }

  // additional helper methods...
}

// Initialize on window load
window.addEventListener('load', () => {
  const formatter = new PrintFormFormatter({ debug: false });
  formatter.formatAll();
}); 