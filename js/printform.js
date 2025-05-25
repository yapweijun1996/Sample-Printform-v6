/****** Setting [start] ******/
const repeat_header = typeof repeat_header !== 'undefined' ? repeat_header : "y";
const repeat_docinfo = typeof repeat_docinfo !== 'undefined' ? repeat_docinfo : "y";
const repeat_rowheader = typeof repeat_rowheader !== 'undefined' ? repeat_rowheader : "y";
const repeat_footer = typeof repeat_footer !== 'undefined' ? repeat_footer : "n";
const repeat_footer_logo = typeof repeat_footer_logo !== 'undefined' ? repeat_footer_logo : "n";
const insert_dummy_row_item_while_format_table = typeof insert_dummy_row_item_while_format_table !== 'undefined' ? insert_dummy_row_item_while_format_table : "y";
const insert_dummy_row_while_format_table = typeof insert_dummy_row_while_format_table !== 'undefined' ? insert_dummy_row_while_format_table : "n";
const insert_footer_spacer_while_format_table_setting = typeof insert_footer_spacer_while_format_table !== 'undefined' ? insert_footer_spacer_while_format_table : "y";
const insert_footer_spacer_with_dummy_row_item_while_format_table = typeof insert_footer_spacer_with_dummy_row_item_while_format_table !== 'undefined' ? insert_footer_spacer_with_dummy_row_item_while_format_table : "y";
const custom_dummy_row_item_content = typeof custom_dummy_row_item_content !== 'undefined' ? custom_dummy_row_item_content : "";

// Assuming vle_temp_paper_width and vle_temp_paper_height are defined somewhere
const papersize_width = typeof papersize_width !== 'undefined' ? papersize_width : 750; // Default to 750px
const papersize_height = typeof papersize_height !== 'undefined' ? papersize_height : 1050; // Default to a standard A4 height (1050px)
const height_of_dummy_row_item = typeof height_of_dummy_row_item !== 'undefined' ? height_of_dummy_row_item : 18; // Default height
/****** Setting [end  ] ******/

/**
 * Adds a dummy row (table) to a target DOM element.
 * @param {HTMLElement} targetElement - The DOM element to which the dummy row will be appended.
 * @param {number} currentPapersizeWidth - The width of the paper/dummy row.
 * @param {number} heightOfDummyRow - The height of the dummy row.
 * @example
 * const myDiv = document.getElementById('content');
 * addDummyRow(myDiv, 750, 20);
 */
function addDummyRow(targetElement, currentPapersizeWidth, heightOfDummyRow){
	
	const dummyRowTable = document.createElement('table');
	dummyRowTable.className = 'dummy_row';
	dummyRowTable.setAttribute('width', currentPapersizeWidth + 'px');
	dummyRowTable.setAttribute('cellspacing', '0');
	dummyRowTable.setAttribute('cellpadding', '0');
	
	const dummyRowInnerHtml = `
	<tr style='height:${heightOfDummyRow}px;'>
		<td style="border:0px solid black;"></td>
	</tr>
	`;
	dummyRowTable.innerHTML = dummyRowInnerHtml;
	targetElement.appendChild(dummyRowTable);
}

/**
 * Adds a dummy row item (table) to a target DOM element.
 * Uses global `papersize_width` and `custom_dummy_row_item_content`.
 * @param {HTMLElement} targetElement - The DOM element to which the dummy row item will be appended.
 * @param {number} currentHeightOfDummyRowItem - The height of the dummy row item.
 * @example
 * const myContainer = document.getElementById('items');
 * addDummyRowItem(myContainer, 18);
 */
function addDummyRowItem(targetElement, currentHeightOfDummyRowItem){
	
	const dummyRowItemTable = document.createElement('table');
	dummyRowItemTable.className = 'dummy_row_item';
	dummyRowItemTable.setAttribute('width', papersize_width + 'px');
	dummyRowItemTable.setAttribute('cellspacing', '0');
	dummyRowItemTable.setAttribute('cellpadding', '0');
	
	let dummyRowItemInnerHtml = `
	<tr style='height:${currentHeightOfDummyRowItem}px;'>
		<td style="border:0px solid black;"></td>
	</tr>
	`;
	
	if(typeof custom_dummy_row_item_content !== "undefined"){
		if(custom_dummy_row_item_content !== ""){
			dummyRowItemInnerHtml = custom_dummy_row_item_content;
		}
	}
	dummyRowItemTable.innerHTML = dummyRowItemInnerHtml;
	targetElement.appendChild(dummyRowItemTable);
}

/**
 * Inserts multiple dummy row items based on the available height.
 * @param {HTMLElement} targetElement - The DOM element to which dummy items will be appended.
 * @param {number} diffHeightFromPapersize - The total height available to fill with dummy items.
 * @param {number} heightOfDummyRow - The height of a single dummy row item.
 * @example
 * const mySection = document.getElementById('spacer_section');
 * insertDummyRowItems(mySection, 100, 20); // Adds 5 dummy items
 */
function insertDummyRowItems(targetElement, diffHeightFromPapersize, heightOfDummyRow){
	// Add spacer [start] insert dummy row item
	if(diffHeightFromPapersize > 0){
		let numberOfDummyRowItemsToBeInserted = 0;
		numberOfDummyRowItemsToBeInserted = Math.floor(diffHeightFromPapersize / heightOfDummyRow);
		for( let i = 0 ; i < numberOfDummyRowItemsToBeInserted ; i++){
			addDummyRowItem(targetElement, heightOfDummyRow);
		}
	}
	// Add spacer [end  ] insert dummy row item
}

/**
 * Processes and inserts a footer spacer element if the setting is enabled.
 * @param {string} shouldInsertFooterSpacer - Flag ("y" or "n") to control insertion.
 * @param {HTMLElement} pFooterSpacerElement - The footer spacer element to clone and append.
 * @param {number} heightPerPage - The total height available per page.
 * @param {number} currentPageHeight - The current accumulated height on the page.
 * @param {string} currentRepeatFooterLogo - Flag ("y" or "n") if footer logo is repeated.
 * @param {number} pFooterLogoHeight - Height of the footer logo.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @example
 * processInsertFooterSpacer("y", footerSpacerDiv, 1000, 800, "y", 50, mainFormatDiv);
 */
function processInsertFooterSpacer(shouldInsertFooterSpacer, pFooterSpacerElement, heightPerPage, currentPageHeight, currentRepeatFooterLogo, pFooterLogoHeight, pFormatElement){
	// console.log("processInsertFooterSpacer : start");
	/***** insert_footer_spacer_while_format_table [start] *****/
	if(shouldInsertFooterSpacer === "y"){
		const clonePfooterSpacer = pFooterSpacerElement.cloneNode(true);
		
		let remainingHeightPerPage = heightPerPage - currentPageHeight;
		
		if(currentRepeatFooterLogo !== "y"){
			remainingHeightPerPage = remainingHeightPerPage - pFooterLogoHeight;
		}
		if(remainingHeightPerPage > 0){
			clonePfooterSpacer.style.height = remainingHeightPerPage + "px";
		} else {
			clonePfooterSpacer.style.height = "0px";
		}
		pFormatElement.appendChild(clonePfooterSpacer);
	}
	/***** insert_footer_spacer_while_format_table [end  ] *****/
}

/**
 * Processes and inserts dummy row items as a footer spacer if the setting is enabled.
 * This function also updates a global-like variable `insert_footer_spacer_while_format_table` to "n".
 * @param {string} shouldInsertFooterSpacerWithDummy - Flag ("y" or "n") to control insertion.
 * @param {number} heightPerPage - The total height available per page.
 * @param {number} currentPageHeight - The current accumulated height on the page.
 * @param {string} currentRepeatFooterLogo - Flag ("y" or "n") if footer logo is repeated (currently unused in logic here).
 * @param {number} pFooterLogoHeight - Height of the footer logo (currently unused in logic here).
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @returns {number} The updated current page height.
 * @example
 * let newPageHeight = processInsertFooterSpacerWithDummyRowItems("y", 1000, 800, "y", 50, mainFormatDiv);
 */
function processInsertFooterSpacerWithDummyRowItems(shouldInsertFooterSpacerWithDummy, heightPerPage, currentPageHeight, currentRepeatFooterLogo, pFooterLogoHeight, pFormatElement){
	// console.log("processInsertFooterSpacerWithDummyRowItems : start");
	let updatedCurrentPageHeight = currentPageHeight;
	/***** insert_footer_spacer_with_dummy_row_item_while_format_table [start] *****/
	if(shouldInsertFooterSpacerWithDummy === "y"){
		let remainingHeightPerPage = heightPerPage - updatedCurrentPageHeight;
		// console.log("pFormatElement : heightPerPage : "+ heightPerPage);
		// console.log("pFormatElement : updatedCurrentPageHeight : "+ updatedCurrentPageHeight);
		// console.log("pFormatElement : remainingHeightPerPage : "+ remainingHeightPerPage);
		
		// if(currentRepeatFooterLogo !== "y"){ // This logic seems to be commented out or handled elsewhere
		//remainingHeightPerPage = remainingHeightPerPage - pFooterLogoHeight;
		// }
		// console.log("pFormatElement : updatedCurrentPageHeight : "+ updatedCurrentPageHeight);
		// console.log("pFormatElement : remainingHeightPerPage : "+ remainingHeightPerPage);
		if(remainingHeightPerPage > 0){
			insertDummyRowItems(pFormatElement, remainingHeightPerPage, height_of_dummy_row_item);
			// console.log("pFormatElement : insertDummyRowItems : "+ remainingHeightPerPage);
			const remainderForRemainingHeightPerPage = parseFloat((remainingHeightPerPage % height_of_dummy_row_item).toFixed(2));
			updatedCurrentPageHeight = heightPerPage - remainderForRemainingHeightPerPage;
		}
		
		// insert_footer_spacer_while_format_table = "n"; // CAUTION: Modifies a broader scope variable. Consider returning this state.
	}
	/***** insert_footer_spacer_with_dummy_row_item_while_format_table [end  ] *****/
	const tempValue = parseFloat(updatedCurrentPageHeight.toFixed(2));
	return tempValue;
}

/**
 * Processes and inserts dummy row items to fill remaining page height if the setting is enabled.
 * @param {string} shouldInsertDummyRowItems - Flag ("y" or "n") to control insertion.
 * @param {number} heightPerPage - The total height available per page.
 * @param {number} currentPageHeight - The current accumulated height on the page.
 * @param {string} currentRepeatFooterLogo - Flag ("y" or "n") if footer logo is repeated (currently unused in logic here).
 * @param {number} pFooterLogoHeight - Height of the footer logo (currently unused in logic here).
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @param {number} currentHeightOfDummyRowItem - The height of a single dummy row item.
 * @returns {number} The updated current page height.
 * @example
 * let newPageHeight = processInsertDummyRowItemsToFillPage("y", 1000, 700, "y", 50, mainFormatDiv, 18);
 */
function processInsertDummyRowItemsToFillPage(shouldInsertDummyRowItems, heightPerPage, currentPageHeight, currentRepeatFooterLogo, pFooterLogoHeight, pFormatElement, currentHeightOfDummyRowItem){
	// console.log("processInsertDummyRowItemsToFillPage : start");
	let updatedCurrentPageHeight = currentPageHeight;
	/***** insert_dummy_row_item_while_format_table [start] *****/
	if(shouldInsertDummyRowItems === "y"){
		const remainingHeightPerPage = heightPerPage - updatedCurrentPageHeight;
		if(remainingHeightPerPage > 0){
			insertDummyRowItems(pFormatElement, remainingHeightPerPage, currentHeightOfDummyRowItem);
			// console.log("pFormatElement : insertDummyRowItems : "+ remainingHeightPerPage);
			const remainderForRemainingHeightPerPage = parseFloat((remainingHeightPerPage % currentHeightOfDummyRowItem).toFixed(2));
			updatedCurrentPageHeight = heightPerPage - remainderForRemainingHeightPerPage;
			// cl("updatedCurrentPageHeight");
			// cl(updatedCurrentPageHeight);
		}
	}
	/***** insert_dummy_row_item_while_format_table [end  ] *****/
	const tempValue = parseFloat(updatedCurrentPageHeight.toFixed(2));
	return tempValue;
}

/**
 * Processes and inserts a single dummy row to fill remaining page height if the setting is enabled.
 * @param {string} shouldInsertDummyRow - Flag ("y" or "n") to control insertion.
 * @param {number} heightPerPage - The total height available per page.
 * @param {number} currentPageHeight - The current accumulated height on the page.
 * @param {string} currentRepeatFooterLogo - Flag ("y" or "n") if footer logo is repeated (currently unused in logic here).
 * @param {number} pFooterLogoHeight - Height of the footer logo (currently unused in logic here).
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @param {number} currentHeightOfDummyRowItem - The height of a single dummy row item (actually used as height of the single dummy row).
 * @param {number} currentPapersizeWidth - The width of the paper/dummy row.
 * @returns {number} The updated current page height.
 * @example
 * let newPageHeight = processInsertSingleDummyRowToFillPage("y", 1000, 900, "y", 50, mainFormatDiv, 100, 750);
 */
function processInsertSingleDummyRowToFillPage(shouldInsertDummyRow, heightPerPage, currentPageHeight, currentRepeatFooterLogo, pFooterLogoHeight, pFormatElement, currentHeightOfDummyRowItem, currentPapersizeWidth){
	// console.log("processInsertSingleDummyRowToFillPage : start");
	let updatedCurrentPageHeight = currentPageHeight;
	/***** insert_dummy_row_while_format_table [start] *****/
	if(shouldInsertDummyRow === "y"){
		const remainingHeightPerPage = heightPerPage - updatedCurrentPageHeight;
		
		if(remainingHeightPerPage > 0){
			addDummyRow(pFormatElement, currentPapersizeWidth, remainingHeightPerPage);
			// console.log("pFormatElement : addDummyRow : "+ remainingHeightPerPage);
			updatedCurrentPageHeight += remainingHeightPerPage;
		}
	}
	/***** insert_dummy_row_while_format_table [end  ] *****/
	const tempValue = parseFloat(updatedCurrentPageHeight.toFixed(2));
	return tempValue;
}

/**
 * Clones and appends a row header element to the formatting container.
 * @param {HTMLElement} pRowHeaderElement - The row header element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @example
 * addRowHeaderElement(rowHeaderDiv, mainFormatDiv);
 */
function addRowHeaderElement(pRowHeaderElement, pFormatElement){
	const cloneProwheader = pRowHeaderElement.cloneNode(true);
	pFormatElement.appendChild(cloneProwheader);
	// console.log("pFormatElement : prowheader");
}

/**
 * Clones and appends a header element to the formatting container.
 * @param {HTMLElement} pHeaderElement - The header element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @example
 * addHeaderElement(headerDiv, mainFormatDiv);
 */
function addHeaderElement(pHeaderElement, pFormatElement){
	const clonePheader = pHeaderElement.cloneNode(true);
	pFormatElement.appendChild(clonePheader);
	// console.log("pFormatElement : pheader");
}

/**
 * Clones and appends a footer element to the formatting container.
 * @param {HTMLElement} pFooterElement - The footer element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @example
 * addFooterElement(footerDiv, mainFormatDiv);
 */
function addFooterElement(pFooterElement, pFormatElement){
	const clonePfooter = pFooterElement.cloneNode(true);
	pFormatElement.appendChild(clonePfooter);
	// console.log("pFormatElement : pfooter");
}

/**
 * Clones and appends a footer logo element to the formatting container.
 * @param {HTMLElement} pFooterLogoElement - The footer logo element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @example
 * addFooterLogoElement(footerLogoDiv, mainFormatDiv);
 */
function addFooterLogoElement(pFooterLogoElement, pFormatElement){
	const clonePfooterLogo = pFooterLogoElement.cloneNode(true);
	pFormatElement.appendChild(clonePfooterLogo);
	// console.log("pFormatElement : pfooter_logo");
}

/**
 * Clones and appends a document info element to the formatting container.
 * @param {HTMLElement} pDocInfoElement - The document info element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @example
 * addDocInfoElement(docInfoDiv, mainFormatDiv);
 */
function addDocInfoElement(pDocInfoElement, pFormatElement){
	const clonePdocinfo = pDocInfoElement.cloneNode(true);
	pFormatElement.appendChild(clonePdocinfo);
	// console.log("pFormatElement : pdocinfo");
}

/**
 * Clones and appends a page break element to the formatting container.
 * @param {HTMLElement} divPageBreakBeforeElement - The page break element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @example
 * addPageBreakElement(pageBreakDiv, mainFormatDiv);
 */
function addPageBreakElement(divPageBreakBeforeElement, pFormatElement){
	const cloneDivPageBreakBefore = divPageBreakBeforeElement.cloneNode(true);
	pFormatElement.appendChild(cloneDivPageBreakBefore);
	// console.log("pFormatElement : div_page_break_before");
}

/**
 * Clones and appends a specific row item element to the formatting container.
 * @param {NodeListOf<HTMLElement>} pRowItemElements - A NodeList of all row item elements.
 * @param {number} itemIndex - The index of the row item to clone and append.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @example
 * addRowItemElement(allRowItems, 0, mainFormatDiv);
 */
function addRowItemElement(pRowItemElements, itemIndex, pFormatElement){
	const cloneProwitem = pRowItemElements[itemIndex].cloneNode(true);
	pFormatElement.appendChild(cloneProwitem);
	// console.log("pFormatElement : prowitem " + itemIndex);
}

/**
 * Adds a "_processed" suffix to the class name of a given element.
 * @param {HTMLElement} inputElement - The DOM element to modify.
 * @param {string} inputClassName - The original class name.
 * @example
 * addProcessedSuffixToClassName(myElement, "item"); // myElement class becomes "item_processed"
 */
function addProcessedSuffixToClassName(inputElement, inputClassName){
	const tempClassName = inputClassName;
	const tempClassNameNew = inputClassName + "_processed";
	
	inputElement.classList.remove(tempClassName);
	inputElement.classList.add(tempClassNameNew);
}

function printform_process(){
	
	return new Promise(resolve => {
		
		const printform = document.querySelector(".printform");
		let pformat = document.createElement('div');
		pformat.classList.add("printform_formatter");
		printform.parentNode.insertBefore(pformat, printform);
		pformat = document.querySelector(".printform_formatter");
		
		const pheader = printform.querySelector(".pheader");
		const ph_height = parseFloat(pheader.getBoundingClientRect().height.toFixed(2));
		// console.log("ph_height : " + ph_height);
		
		const pdocinfo = printform.querySelector(".pdocinfo");
		const pdi_height = parseFloat(pdocinfo.getBoundingClientRect().height.toFixed(2));
		// console.log("pdi_height : " + pdi_height);
		
		const prowheader = printform.querySelector(".prowheader");
		const prh_height = parseFloat(prowheader.getBoundingClientRect().height.toFixed(2));
		// console.log("prd_height : " + prh_height);
		
		const pfooter = printform.querySelector(".pfooter");
		const pf_height = parseFloat(pfooter.getBoundingClientRect().height.toFixed(2));
		// console.log("pf_height : " + pf_height);
		
		const pfooter_logo = printform.querySelector(".pfooter_logo");
		const pfl_height = parseFloat(pfooter_logo.getBoundingClientRect().height.toFixed(2));
		// console.log("pfl_height : " + pfl_height);
		
		const prowitem = printform.querySelectorAll(".prowitem");
		let pr_height = 0;
		let temp_item_height;
		for( let i = 0; i < prowitem.length ; i++){
			temp_item_height = parseFloat(prowitem[i].getBoundingClientRect().height.toFixed(2));
			if(temp_item_height !== 0){
				pr_height += temp_item_height;
			}
		}
		// console.log("pr_height : " + pr_height);
		
		
		const pfooter_spacer = document.createElement('div');
		pfooter_spacer.classList.add("pfooter_spacer");
		pfooter_spacer.classList.add("paper_width");
		pfooter_spacer.style.height = "0px";
		
		const div_page_break_before = document.createElement('div');
		div_page_break_before.classList.add("div_page_break_before");
		div_page_break_before.style.pageBreakBefore = "always";
		div_page_break_before.style.height = '0px';
		
		/***** Generate Page [start] *****/
		let current_page_height = 0;
		let height_per_page = 0;
		let tb_page_break_before_yn = "n";
		
		height_per_page = papersize_height;
		if(repeat_header === "y"){
			// console.log("ph_height : " + ph_height);
			height_per_page -= ph_height;
		}
		if(repeat_docinfo === "y"){
			// console.log("pdi_height : " + pdi_height);
			height_per_page -= pdi_height;
		}
		if(repeat_rowheader === "y"){
			// console.log("prh_height : " + prh_height);
			height_per_page -= prh_height;
		}
		if(repeat_footer === "y"){
			// console.log("pf_height : " + pf_height);
			height_per_page -= pf_height;
		}
		if(repeat_footer_logo === "y"){
			// console.log("pfl_height : " + pfl_height);
			height_per_page -= pfl_height;
		}
		// console.log("height_per_page : " + height_per_page);
		
		addProcessedSuffixToClassName(pheader, "pheader");
		addProcessedSuffixToClassName(pdocinfo, "pdocinfo");
		addProcessedSuffixToClassName(prowheader, "prowheader");
		addProcessedSuffixToClassName(pfooter, "pfooter");
		addProcessedSuffixToClassName(pfooter_logo, "pfooter_logo");
		
		// Loop all row item [start]
		for( let i = 0; i < prowitem.length ; i ++){
			temp_item_height = parseFloat(prowitem[i].getBoundingClientRect().height.toFixed(2));
			
			if(current_page_height === 0){
				addHeaderElement(pheader, pformat);
				if(repeat_header === "y"){
					
				}else{
					current_page_height += ph_height;
				}
				
				addDocInfoElement(pdocinfo, pformat);
				
				if(repeat_docinfo === "y"){
					
				}else{
					current_page_height += pdi_height;
				}
				
				addRowHeaderElement(prowheader, pformat);
				if(repeat_rowheader === "y"){
					
				}else{
					current_page_height += prh_height;
				}
			}
			
			current_page_height += temp_item_height;
			
			addProcessedSuffixToClassName(prowitem[i], "prowitem");
			
			if (prowitem[i].classList.contains('tb_page_break_before')) {
				tb_page_break_before_yn = "y";
			}
			if(tb_page_break_before_yn === "y"){
				
				current_page_height -= temp_item_height;
				
				current_page_height = processInsertDummyRowItemsToFillPage(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item);

				current_page_height = processInsertSingleDummyRowToFillPage(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width);
				
				let previous_insert_footer_spacer_while_format_table = insert_footer_spacer_while_format_table_setting;
				current_page_height = processInsertFooterSpacerWithDummyRowItems(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				let useProcessInsertFooterSpacer = true;
				if (insert_footer_spacer_with_dummy_row_item_while_format_table === "y" && previous_insert_footer_spacer_while_format_table === "y") {
					if (insert_footer_spacer_with_dummy_row_item_while_format_table === "y") {
						 useProcessInsertFooterSpacer = false;
					}
				}

				if(useProcessInsertFooterSpacer){
					processInsertFooterSpacer(insert_footer_spacer_while_format_table_setting, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				}
				
				if(repeat_footer === "y"){
					addFooterElement(pfooter, pformat);
				}
				
				if(repeat_footer_logo === "y"){
					addFooterLogoElement(pfooter_logo, pformat);
				}
				
				addPageBreakElement(div_page_break_before, pformat);
				
				if(repeat_header === "y"){
					addHeaderElement(pheader, pformat);
				}
				
				if(repeat_docinfo === "y"){
					addDocInfoElement(pdocinfo, pformat);
				}
				
				if(repeat_rowheader === "y"){
					addRowHeaderElement(prowheader, pformat);
				}
				
				addRowItemElement(prowitem, i, pformat);
				
				current_page_height = temp_item_height;
				tb_page_break_before_yn = "n";
			}else{
				if(current_page_height <= height_per_page){
					addRowItemElement(prowitem, i, pformat);
				}else{
					current_page_height -= temp_item_height;
					
					current_page_height = processInsertDummyRowItemsToFillPage(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item);
					
					current_page_height = processInsertSingleDummyRowToFillPage(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width);
					
					current_page_height = processInsertFooterSpacerWithDummyRowItems(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
					
					processInsertFooterSpacer(insert_footer_spacer_while_format_table_setting, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
					
					if(repeat_footer === "y"){
						addFooterElement(pfooter, pformat);
					}
					
					if(repeat_footer_logo === "y"){
						addFooterLogoElement(pfooter_logo, pformat);
					}
					
					addPageBreakElement(div_page_break_before, pformat);
					
					if(repeat_header === "y"){
						addHeaderElement(pheader, pformat);
					}
					
					if(repeat_docinfo === "y"){
						addDocInfoElement(pdocinfo, pformat);
					}
					
					if(repeat_rowheader === "y"){
						addRowHeaderElement(prowheader, pformat);
					}
					
					addRowItemElement(prowitem, i, pformat);
					
					current_page_height = temp_item_height;
				}
			}
			
		}
		// Loop all row item [end  ]
		
		// Last Footer [start]
		let spaceNeededForLastFooter = 0;
		if (repeat_footer !== "y") spaceNeededForLastFooter += pf_height;
		if (repeat_footer_logo !== "y") spaceNeededForLastFooter += pfl_height;
		
		if((current_page_height + spaceNeededForLastFooter) <= height_per_page){
			current_page_height = processInsertDummyRowItemsToFillPage(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item);
			
			current_page_height = processInsertSingleDummyRowToFillPage(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width);
			
			let previous_insert_footer_spacer_while_format_table_last = insert_footer_spacer_while_format_table_setting;
			current_page_height = processInsertFooterSpacerWithDummyRowItems(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			let useProcessInsertFooterSpacerLast = true;
			if (insert_footer_spacer_with_dummy_row_item_while_format_table === "y" && previous_insert_footer_spacer_while_format_table_last === "y") {
				 if (insert_footer_spacer_with_dummy_row_item_while_format_table === "y") {
					useProcessInsertFooterSpacerLast = false;
				 }
			}
			if(useProcessInsertFooterSpacerLast){
				processInsertFooterSpacer(insert_footer_spacer_while_format_table_setting, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			}
			
			addFooterElement(pfooter, pformat);
			addFooterLogoElement(pfooter_logo, pformat);
		}else{
			current_page_height = processInsertDummyRowItemsToFillPage(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item);
			current_page_height = processInsertSingleDummyRowToFillPage(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width);
			
			let previous_insert_footer_spacer_while_format_table_split = insert_footer_spacer_while_format_table_setting;
			current_page_height = processInsertFooterSpacerWithDummyRowItems(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			let useProcessInsertFooterSpacerSplit = true;
			 if (insert_footer_spacer_with_dummy_row_item_while_format_table === "y" && previous_insert_footer_spacer_while_format_table_split === "y") {
				 if (insert_footer_spacer_with_dummy_row_item_while_format_table === "y") {
					useProcessInsertFooterSpacerSplit = false;
				 }
			}
			if(useProcessInsertFooterSpacerSplit){
				processInsertFooterSpacer(insert_footer_spacer_while_format_table_setting, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			}

			if(repeat_footer === "y"){
				addFooterElement(pfooter, pformat);
			}
			if(repeat_footer_logo === "y"){
				addFooterLogoElement(pfooter_logo, pformat);
			}
					
			addPageBreakElement(div_page_break_before, pformat);
			
			current_page_height = 0;
			
			
			if(repeat_header === "y"){
				addHeaderElement(pheader, pformat);
			}else{
				
			}
			
			if(repeat_docinfo === "y"){
				addDocInfoElement(pdocinfo, pformat);
			}else{
				
			}
			
			if(repeat_rowheader === "y"){
				addRowHeaderElement(prowheader, pformat);
			}else{
				
			}
			
			if(repeat_footer === "y"){
				current_page_height -= pf_height;
			}
			if(repeat_footer_logo === "y"){
				current_page_height -= pfl_height;
			}
			
			current_page_height += pf_height;
			current_page_height += pfl_height;
			
			current_page_height = processInsertDummyRowItemsToFillPage(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item);
			current_page_height = processInsertSingleDummyRowToFillPage(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width);
			
			let previous_insert_footer_spacer_while_format_table_final = insert_footer_spacer_while_format_table_setting;
			current_page_height = processInsertFooterSpacerWithDummyRowItems(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			let useProcessInsertFooterSpacerFinal = true;
			if (insert_footer_spacer_with_dummy_row_item_while_format_table === "y" && previous_insert_footer_spacer_while_format_table_final === "y") {
				if (insert_footer_spacer_with_dummy_row_item_while_format_table === "y") {
					useProcessInsertFooterSpacerFinal = false;
				}
			}
			if(useProcessInsertFooterSpacerFinal){
				processInsertFooterSpacer(insert_footer_spacer_while_format_table_setting, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			}
			
			addFooterElement(pfooter, pformat);
			addFooterLogoElement(pfooter_logo, pformat);
		}
		// Last Footer [end  ]
		
		
		addProcessedSuffixToClassName(pformat, "printform_formatter");
		
		printform.remove();
		// console.log("printform : remove");
		resolve();
	});
}
/***** Generate Page [end  ] *****/

/**
 * Helper function for logging to console.
 * @param {*} logMessage - The message or object to log.
 * @example
 * cl("This is a test log.");
 */
function cl(logMessage){ console.log(logMessage); }

/**
 * Pauses execution for a specified number of milliseconds.
 * @param {number} timeInMilliseconds - The duration to pause in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 * @example
 * await pause(1000); // Pauses for 1 second
 */
function pause(timeInMilliseconds) {
	function pauseTheFunction(resolve, reject) {
		if (typeof timeInMilliseconds === 'number' && timeInMilliseconds > 0) {
			// console.log("pause for "+ (timeInMilliseconds/1000)+" seconds");
			setTimeout(resolve, timeInMilliseconds);
		} else {
			console.error("Error: Invalid time value for pause function.");
			reject(new Error("Invalid time value for pause function."));
		}
	}
	return new Promise(pauseTheFunction);
}

/**
 * Processes all elements with the class "printform" sequentially.
 * @async
 * @example
 * await processAllPrintforms();
 */
async function processAllPrintforms() {
	const printforms = document.querySelectorAll(".printform");
	const numberOfPrintforms =  printforms.length;
	// console.log(numberOfPrintforms);
	for(let i = 0; i < numberOfPrintforms; i++){
		try{
			await pause(1);
		} catch(error){
			console.error("pause error:", error);
		}
		try{
			await printform_process();
		} catch(error){
			console.error("printform_process error:", error);
		}
	}
}

let runFunctionSequentiallyProcessed = false;

window.onload = function() {
    if(runFunctionSequentiallyProcessed === false){
		processAllPrintforms();
		runFunctionSequentiallyProcessed = true;
	}
};
