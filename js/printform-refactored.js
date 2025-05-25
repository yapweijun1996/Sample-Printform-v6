class PrintFormFormatter {
  constructor(rootSelector, config = {}) {
    this.root = document.querySelector(rootSelector);
    if (!this.root) throw new Error(`Element ${rootSelector} not found`);

    // Default config from globals or fallbacks
    this.cfg = Object.assign({
      paperWidth:     window.papersize_width || 396,
      paperHeight:    window.papersize_height || 550,
      dummyRowHeight: window.height_of_dummy_row_item || 27,
      repeatHeader:   (window.repeat_header || 'y') === 'y',
      repeatDocInfo:  (window.repeat_docinfo || 'y') === 'y',
      repeatRowHeader:(window.repeat_rowheader || 'y') === 'y',
      repeatFooter:   (window.repeat_footer || 'n') === 'y',
      repeatFooterLogo:(window.repeat_footer_logo || 'n') === 'y',
      insertDummyRowItemWhileFormatTable:      (window.insert_dummy_row_item_while_format_table || 'y') === 'y',
      insertDummyRowWhileFormatTable:          (window.insert_dummy_row_while_format_table || 'n') === 'y',
      insertFooterSpacerWhileFormatTable:      (window.insert_footer_spacer_while_format_table || 'y') === 'y',
      insertFooterSpacerWithDummyRowItem:      (window.insert_footer_spacer_with_dummy_row_item_while_format_table || 'y') === 'y',
      customDummyRowItemContent: window.custom_dummy_row_item_content || ''
    }, config);

    // Temp containers
    this.formatContainer = null;
    this.sections = {};
  }

  getHeight(el) {
    return parseFloat(el.getBoundingClientRect().height.toFixed(2));
  }

  cloneSection(el) {
    return el.cloneNode(true);
  }

  addElement(node) {
    this.formatContainer.appendChild(node);
  }

  insertDummyRows(parent, totalHeight) {
    const count = Math.floor(totalHeight / this.cfg.dummyRowHeight);
    for (let i = 0; i < count; i++) {
      const tbl = document.createElement('table');
      tbl.className = 'dummy_row_item';
      tbl.width = this.cfg.paperWidth + 'px';
      tbl.cellPadding = tbl.cellSpacing = 0;
      tbl.innerHTML = this.cfg.customDummyRowItemContent ||
        `<tr style='height:${this.cfg.dummyRowHeight}px'><td></td></tr>`;
      parent.appendChild(tbl);
    }
  }

  insertSpacer(parent, height) {
    const div = document.createElement('div');
    div.style.height = `${height}px`;
    parent.appendChild(div);
  }

  async paginate() {
    // Create formatter container
    this.formatContainer = document.createElement('div');
    this.formatContainer.className = 'printform_formatter';
    this.root.parentNode.insertBefore(this.formatContainer, this.root);

    // Collect original sections
    const q = sel => this.root.querySelector(sel);
    const qAll = sel => Array.from(this.root.querySelectorAll(sel));
    this.sections.header    = q('.pheader');
    this.sections.docinfo   = q('.pdocinfo');
    this.sections.rowHeader = q('.prowheader');
    this.sections.footer    = q('.pfooter');
    this.sections.footerLogo= q('.pfooter_logo');
    this.sections.items     = qAll('.prowitem');

    // Pre-calc heights
    const h = {};
    ['header','docinfo','rowHeader','footer','footerLogo'].forEach(key => {
      h[key] = this.sections[key] ? this.getHeight(this.sections[key]) : 0;
    });

    // Effective content height per page
    let pageLimit = this.cfg.paperHeight;
    if (this.cfg.repeatHeader)    pageLimit -= h.header;
    if (this.cfg.repeatDocInfo)   pageLimit -= h.docinfo;
    if (this.cfg.repeatRowHeader) pageLimit -= h.rowHeader;
    if (this.cfg.repeatFooter)    pageLimit -= h.footer;
    if (this.cfg.repeatFooterLogo)pageLimit -= h.footerLogo;

    let currentHeight = 0;

    const flushFooter = () => {
      const rem = pageLimit - currentHeight;
      if (rem > 0) {
        if (this.cfg.insertDummyRowItemWhileFormatTable)
          this.insertDummyRows(this.formatContainer, rem);
        if (this.cfg.insertDummyRowWhileFormatTable)
          this.insertSpacer(this.formatContainer, rem);
      }
      if (this.cfg.insertFooterSpacerWhileFormatTable)
        this.insertSpacer(this.formatContainer, rem);
      if (this.cfg.repeatFooter)    this.addElement(this.cloneSection(this.sections.footer));
      if (this.cfg.repeatFooterLogo)this.addElement(this.cloneSection(this.sections.footerLogo));
    };

    const newPage = () => {
      // manual page-break wrapper
      const br = document.createElement('div');
      br.style.pageBreakBefore = 'always';
      this.addElement(br);
      currentHeight = 0;
      // add repeating sections
      if (this.cfg.repeatHeader)    this.addElement(this.cloneSection(this.sections.header));
      if (this.cfg.repeatDocInfo)   this.addElement(this.cloneSection(this.sections.docinfo));
      if (this.cfg.repeatRowHeader) this.addElement(this.cloneSection(this.sections.rowHeader));
      currentHeight = 0; // reset after header group
    };

    // Start first page
    this.addElement(this.cloneSection(this.sections.header));
    this.addElement(this.cloneSection(this.sections.docinfo));
    this.addElement(this.cloneSection(this.sections.rowHeader));
    if (!this.cfg.repeatHeader)    currentHeight += h.header;
    if (!this.cfg.repeatDocInfo)   currentHeight += h.docinfo;
    if (!this.cfg.repeatRowHeader) currentHeight += h.rowHeader;

    for (let item of this.sections.items) {
      const itemHeight = this.getHeight(item);
      const manualBreak = item.classList.contains('tb_page_break_before');
      if (manualBreak || currentHeight + itemHeight > pageLimit) {
        // flush footers and start new page
        flushFooter();
        newPage();
      }
      this.addElement(this.cloneSection(item));
      currentHeight += itemHeight;
    }
    // final flush
    flushFooter();
  }
}

// Auto-run after DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new PrintFormFormatter('.printform').paginate();
}); 