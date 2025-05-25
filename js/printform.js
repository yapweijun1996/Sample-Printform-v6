/**
 * Retrieves a configuration value from a DOM element's data attribute, with a default fallback.
 * @param {HTMLElement} element - The DOM element.
 * @param {string} keyCamelCase - The camelCase version of the data attribute key (e.g., 'papersizeWidth' for 'data-papersize-width').
 * @param {*} defaultValue - The default value to return if the attribute is not found or is empty.
 * @param {string} type - The expected type: 'string', 'number', 'booleanYN' (for 'y'/'n' strings).
 * @returns {*} The configuration value.
 * @example
 * const width = getConfigValue(myDiv, 'papersizeWidth', 750, 'number');
 * const shouldRepeat = getConfigValue(myDiv, 'repeatHeader', 'y', 'booleanYN');
 */
function getConfigValue(element, keyCamelCase, defaultValue, type = 'string') {
	const value = element.dataset[keyCamelCase];
	if (typeof value === 'undefined' || value === null || value === '') {
		return defaultValue;
	}

	switch (type) {
		case 'number':
			const num = parseFloat(value);
			return isNaN(num) ? defaultValue : num;
		case 'booleanYN':
			return value.toLowerCase() === 'y' ? 'y' : 'n'; // Keeps 'y'/'n' convention
		case 'string':
		default:
			return value;
	}
}

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
 * @param {HTMLElement} targetElement - The DOM element to which the dummy row item will be appended.
 * @param {number} currentHeightOfDummyRowItem - The height of the dummy row item.
 * @param {object} config - The configuration object for the current print form.
 * @example
 * const myContainer = document.getElementById('items');
 * addDummyRowItem(myContainer, 18, currentConfig);
 */
function addDummyRowItem(targetElement, currentHeightOfDummyRowItem, config){
	
	const dummyRowItemTable = document.createElement('table');
	dummyRowItemTable.className = 'dummy_row_item';
	dummyRowItemTable.setAttribute('width', config.papersizeWidth + 'px');
	dummyRowItemTable.setAttribute('cellspacing', '0');
	dummyRowItemTable.setAttribute('cellpadding', '0');
	
	let dummyRowItemInnerHtml = `
	<tr style='height:${currentHeightOfDummyRowItem}px;'>
		<td style="border:0px solid black;"></td>
	</tr>
	`;
	
	if(typeof config.customDummyRowItemContent !== "undefined"){
		if(config.customDummyRowItemContent !== ""){
			dummyRowItemInnerHtml = config.customDummyRowItemContent;
		}
	}
	dummyRowItemTable.innerHTML = dummyRowItemInnerHtml;
	targetElement.appendChild(dummyRowItemTable);
}

/**
 * Inserts multiple dummy row items based on the available height.
 * @param {HTMLElement} targetElement - The DOM element to which dummy items will be appended.
 * @param {number} diffHeightFromPapersize - The total height available to fill with dummy items.
 * @param {number} heightOfSingleDummyItem - The height of a single dummy row item.
 * @param {object} config - The configuration object for the current print form.
 * @example
 * const mySection = document.getElementById('spacer_section');
 * insertDummyRowItems(mySection, 100, 20, currentConfig);
 */
function insertDummyRowItems(targetElement, diffHeightFromPapersize, heightOfSingleDummyItem, config){
	if(diffHeightFromPapersize > 0){
		let numberOfDummyRowItemsToBeInserted = Math.floor(diffHeightFromPapersize / heightOfSingleDummyItem);
		for( let i = 0 ; i < numberOfDummyRowItemsToBeInserted ; i++){
			addDummyRowItem(targetElement, heightOfSingleDummyItem, config);
		}
	}
}

/**
 * Processes and inserts a footer spacer element if the setting is enabled.
 * @param {string} shouldInsertFooterSpacer - Flag ("y" or "n") to control insertion.
 * @param {HTMLElement} pFooterSpacerElement - The footer spacer element to clone and append.
 * @param {number} heightPerPage - The total height available per page.
 * @param {number} currentPageHeight - The current accumulated height on the page.
 * @param {string} currentRepeatFooterLogoConfig - Flag ("y" or "n") from config.repeatFooterLogo.
 * @param {number} pFooterLogoHeight - Height of the footer logo.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @example
 * processInsertFooterSpacer("y", footerSpacerDiv, 1000, 800, currentConfig.repeatFooterLogo, 50, mainFormatDiv);
 */
function processInsertFooterSpacer(shouldInsertFooterSpacer, pFooterSpacerElement, heightPerPage, currentPageHeight, currentRepeatFooterLogoConfig, pFooterLogoHeight, pFormatElement){
	if(shouldInsertFooterSpacer === "y"){
		const clonePfooterSpacer = pFooterSpacerElement.cloneNode(true);
		let remainingHeightPerPage = heightPerPage - currentPageHeight;
		
		if(currentRepeatFooterLogoConfig !== "y"){
			remainingHeightPerPage = remainingHeightPerPage - pFooterLogoHeight;
		}
		if(remainingHeightPerPage > 0){ 
			clonePfooterSpacer.style.height = remainingHeightPerPage + "px";
		} else {
            clonePfooterSpacer.style.height = "0px"; 
        }
		pFormatElement.appendChild(clonePfooterSpacer);
	}
}

/**
 * Processes and inserts dummy row items as a footer spacer if the setting is enabled.
 * This function updates layoutState.insertFooterSpacerWhileFormatTable to "n".
 * @param {string} shouldInsertFooterSpacerWithDummy - Flag ("y" or "n") to control insertion.
 * @param {number} heightPerPage - The total height available per page.
 * @param {number} currentPageHeight - The current accumulated height on the page.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @param {object} config - The configuration object for the current print form.
 * @param {object} layoutState - The mutable layout state for the current print form.
 * @returns {number} The updated current page height.
 * @example
 * let newPageHeight = processInsertFooterSpacerWithDummyRowItems("y", 1000, 800, mainFormatDiv, currentConfig, currentLayoutState);
 */
function processInsertFooterSpacerWithDummyRowItems(shouldInsertFooterSpacerWithDummy, heightPerPage, currentPageHeight, pFormatElement, config, layoutState){
	let updatedCurrentPageHeight = currentPageHeight;
	if(shouldInsertFooterSpacerWithDummy === "y"){
		let remainingHeightPerPage = heightPerPage - updatedCurrentPageHeight;
		if(remainingHeightPerPage > 0){
			insertDummyRowItems(pFormatElement, remainingHeightPerPage, config.heightOfDummyRowItem, config); 
			const remainderForRemainingHeightPerPage = parseFloat((remainingHeightPerPage % config.heightOfDummyRowItem).toFixed(2));
			updatedCurrentPageHeight = heightPerPage - remainderForRemainingHeightPerPage;
		}
		layoutState.insertFooterSpacerWhileFormatTable = "n"; 
	}
	return parseFloat(updatedCurrentPageHeight.toFixed(2));
}

/**
 * Processes and inserts dummy row items to fill remaining page height if the setting is enabled.
 * @param {string} shouldInsertDummyRowItemsFlag - Flag ("y" or "n") from config.insertDummyRowItemWhileFormatTable.
 * @param {number} heightPerPage - The total height available per page.
 * @param {number} currentPageHeight - The current accumulated height on the page.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @param {object} config - The configuration object for the current print form.
 * @returns {number} The updated current page height.
 * @example
 * let newPageHeight = processInsertDummyRowItemsToFillPage(currentConfig.insertDummyRowItemWhileFormatTable, 1000, 700, mainFormatDiv, currentConfig);
 */
function processInsertDummyRowItemsToFillPage(shouldInsertDummyRowItemsFlag, heightPerPage, currentPageHeight, pFormatElement, config){
	let updatedCurrentPageHeight = currentPageHeight;
	if(shouldInsertDummyRowItemsFlag === "y"){
		const remainingHeightPerPage = heightPerPage - updatedCurrentPageHeight;
		if(remainingHeightPerPage > 0){
			insertDummyRowItems(pFormatElement, remainingHeightPerPage, config.heightOfDummyRowItem, config);
			const remainderForRemainingHeightPerPage = parseFloat((remainingHeightPerPage % config.heightOfDummyRowItem).toFixed(2));
			updatedCurrentPageHeight = heightPerPage - remainderForRemainingHeightPerPage;
		}
	}
	return parseFloat(updatedCurrentPageHeight.toFixed(2));
}

/**
 * Processes and inserts a single dummy row to fill remaining page height if the setting is enabled.
 * @param {string} shouldInsertDummyRowFlag - Flag ("y" or "n") from config.insertDummyRowWhileFormatTable.
 * @param {number} heightPerPage - The total height available per page.
 * @param {number} currentPageHeight - The current accumulated height on the page.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 * @param {object} config - The configuration object for the current print form.
 * @returns {number} The updated current page height.
 * @example
 * let newPageHeight = processInsertSingleDummyRowToFillPage(currentConfig.insertDummyRowWhileFormatTable, 1000, 900, mainFormatDiv, currentConfig);
 */
function processInsertSingleDummyRowToFillPage(shouldInsertDummyRowFlag, heightPerPage, currentPageHeight, pFormatElement, config){
	let updatedCurrentPageHeight = currentPageHeight;
	if(shouldInsertDummyRowFlag === "y"){
		const remainingHeightPerPage = heightPerPage - updatedCurrentPageHeight;
		if(remainingHeightPerPage > 0){
			addDummyRow(pFormatElement, config.papersizeWidth, remainingHeightPerPage); 
			updatedCurrentPageHeight += remainingHeightPerPage;
		}
	}
	return parseFloat(updatedCurrentPageHeight.toFixed(2));
}

/**
 * Clones and appends a row header element to the formatting container.
 * @param {HTMLElement} pRowHeaderElement - The row header element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 */
function addRowHeaderElement(pRowHeaderElement, pFormatElement){
	if (!pRowHeaderElement) return; // Guard clause
	const cloneProwheader = pRowHeaderElement.cloneNode(true);
	pFormatElement.appendChild(cloneProwheader);
}

/**
 * Clones and appends a header element to the formatting container.
 * @param {HTMLElement} pHeaderElement - The header element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 */
function addHeaderElement(pHeaderElement, pFormatElement){
	if (!pHeaderElement) return; // Guard clause
	const clonePheader = pHeaderElement.cloneNode(true);
	pFormatElement.appendChild(clonePheader);
}

/**
 * Clones and appends a footer element to the formatting container.
 * @param {HTMLElement} pFooterElement - The footer element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 */
function addFooterElement(pFooterElement, pFormatElement){
	if (!pFooterElement) return; // Guard clause
	const clonePfooter = pFooterElement.cloneNode(true);
	pFormatElement.appendChild(clonePfooter);
}

/**
 * Clones and appends a footer logo element to the formatting container.
 * @param {HTMLElement} pFooterLogoElement - The footer logo element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 */
function addFooterLogoElement(pFooterLogoElement, pFormatElement){
	if (!pFooterLogoElement) return; // Guard clause
	const clonePfooterLogo = pFooterLogoElement.cloneNode(true);
	pFormatElement.appendChild(clonePfooterLogo);
}

/**
 * Clones and appends a document info element to the formatting container.
 * @param {HTMLElement} pDocInfoElement - The document info element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 */
function addDocInfoElement(pDocInfoElement, pFormatElement){
	if (!pDocInfoElement) return; // Guard clause
	const clonePdocinfo = pDocInfoElement.cloneNode(true);
	pFormatElement.appendChild(clonePdocinfo);
}

/**
 * Clones and appends a page break element to the formatting container.
 * @param {HTMLElement} divPageBreakBeforeElement - The page break element to clone.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 */
function addPageBreakElement(divPageBreakBeforeElement, pFormatElement){
	if (!divPageBreakBeforeElement) return; // Guard clause
	const cloneDivPageBreakBefore = divPageBreakBeforeElement.cloneNode(true);
	pFormatElement.appendChild(cloneDivPageBreakBefore);
}

/**
 * Clones and appends a specific row item element to the formatting container.
 * @param {NodeListOf<HTMLElement>} pRowItemElements - A NodeList of all row item elements.
 * @param {number} itemIndex - The index of the row item to clone and append.
 * @param {HTMLElement} pFormatElement - The main formatting container element.
 */
function addRowItemElement(pRowItemElements, itemIndex, pFormatElement){
	if (!pRowItemElements || !pRowItemElements[itemIndex]) return; // Guard clause
	const cloneProwitem = pRowItemElements[itemIndex].cloneNode(true);
	pFormatElement.appendChild(cloneProwitem);
}

/**
 * Adds a "_processed" suffix to the class name of a given element.
 * @param {HTMLElement} inputElement - The DOM element to modify.
 * @param {string} inputClassName - The original class name.
 */
function addProcessedSuffixToClassName(inputElement, inputClassName){
	if (!inputElement) return; // Guard clause
	const tempClassName = inputClassName;
	const tempClassNameNew = inputClassName + "_processed";
	inputElement.classList.remove(tempClassName);
	inputElement.classList.add(tempClassNameNew);
}

/**
 * Main processing function for a single print form.
 * @param {HTMLElement} printformElement - The specific .printform DOM element to process.
 * @async
 */
async function printform_process(printformElement){
	const config = {
		repeatHeader: getConfigValue(printformElement, 'repeatHeader', "y", 'booleanYN'),
		repeatDocinfo: getConfigValue(printformElement, 'repeatDocinfo', "y", 'booleanYN'),
		repeatRowheader: getConfigValue(printformElement, 'repeatRowheader', "y", 'booleanYN'),
		repeatFooter: getConfigValue(printformElement, 'repeatFooter', "n", 'booleanYN'),
		repeatFooterLogo: getConfigValue(printformElement, 'repeatFooterLogo', "n", 'booleanYN'),
		insertDummyRowItemWhileFormatTable: getConfigValue(printformElement, 'insertDummyRowItemWhileFormatTable', "y", 'booleanYN'),
		insertDummyRowWhileFormatTable: getConfigValue(printformElement, 'insertDummyRowWhileFormatTable', "n", 'booleanYN'),
		insertFooterSpacerWithDummyRowItemWhileFormatTable: getConfigValue(printformElement, 'insertFooterSpacerWithDummyRowItemWhileFormatTable', "y", 'booleanYN'),
		customDummyRowItemContent: getConfigValue(printformElement, 'customDummyRowItemContent', "", 'string'),
		papersizeWidth: getConfigValue(printformElement, 'papersizeWidth', 750, 'number'),
		papersizeHeight: getConfigValue(printformElement, 'papersizeHeight', 1050, 'number'),
		heightOfDummyRowItem: getConfigValue(printformElement, 'heightOfDummyRowItem', 18, 'number')
	};

	let layoutState = {
		insertFooterSpacerWhileFormatTable: getConfigValue(printformElement, 'insertFooterSpacerWhileFormatTable', "y", 'booleanYN')
	};

	return new Promise(resolve => {
		const parentOfPrintform = printformElement.parentNode;
		const pformat = document.createElement('div');
		pformat.classList.add("printform_formatter");
		parentOfPrintform.insertBefore(pformat, printformElement);

		const pheader = printformElement.querySelector(".pheader");
		const ph_height = pheader ? parseFloat(pheader.getBoundingClientRect().height.toFixed(2)) : 0;
		
		const pdocinfo = printformElement.querySelector(".pdocinfo");
		const pdi_height = pdocinfo ? parseFloat(pdocinfo.getBoundingClientRect().height.toFixed(2)) : 0;
		
		const prowheader = printformElement.querySelector(".prowheader");
		const prh_height = prowheader ? parseFloat(prowheader.getBoundingClientRect().height.toFixed(2)) : 0;
		
		const pfooter = printformElement.querySelector(".pfooter");
		const pf_height = pfooter ? parseFloat(pfooter.getBoundingClientRect().height.toFixed(2)) : 0;
		
		const pfooter_logo = printformElement.querySelector(".pfooter_logo");
		const pfl_height = pfooter_logo ? parseFloat(pfooter_logo.getBoundingClientRect().height.toFixed(2)) : 0;
		
		const prowitem = printformElement.querySelectorAll(".prowitem");
		let temp_item_height;

		const pfooter_spacer = document.createElement('div');
		pfooter_spacer.classList.add("pfooter_spacer");
		pfooter_spacer.classList.add("paper_width");
		pfooter_spacer.style.height = "0px";
		
		const div_page_break_before = document.createElement('div');
		div_page_break_before.classList.add("div_page_break_before");
		div_page_break_before.style.pageBreakBefore = "always";
		div_page_break_before.style.height = '0px';
		
		let current_page_height = 0;
		let height_per_page = config.papersizeHeight;
		let tb_page_break_before_yn = "n";
		
		if(config.repeatHeader === "y") height_per_page -= ph_height;
		if(config.repeatDocinfo === "y") height_per_page -= pdi_height;
		if(config.repeatRowheader === "y") height_per_page -= prh_height;
		if(config.repeatFooter === "y") height_per_page -= pf_height;
		if(config.repeatFooterLogo === "y") height_per_page -= pfl_height;
		
		addProcessedSuffixToClassName(pheader, "pheader");
		addProcessedSuffixToClassName(pdocinfo, "pdocinfo");
		addProcessedSuffixToClassName(prowheader, "prowheader");
		addProcessedSuffixToClassName(pfooter, "pfooter");
		addProcessedSuffixToClassName(pfooter_logo, "pfooter_logo");
		
		for( let i = 0; i < prowitem.length ; i ++){
			temp_item_height = parseFloat(prowitem[i].getBoundingClientRect().height.toFixed(2));
			
			if(current_page_height === 0){
				addHeaderElement(pheader, pformat);
				if(config.repeatHeader !== "y") current_page_height += ph_height;
				
				addDocInfoElement(pdocinfo, pformat);
				if(config.repeatDocinfo !== "y") current_page_height += pdi_height;
				
				addRowHeaderElement(prowheader, pformat);
				if(config.repeatRowheader !== "y") current_page_height += prh_height;
			}
			
			current_page_height += temp_item_height;
			addProcessedSuffixToClassName(prowitem[i], "prowitem");
			
			if (prowitem[i].classList.contains('tb_page_break_before')) {
				tb_page_break_before_yn = "y";
			}

			if(tb_page_break_before_yn === "y" || current_page_height > height_per_page){
				current_page_height -= temp_item_height;
				
				current_page_height = processInsertDummyRowItemsToFillPage(config.insertDummyRowItemWhileFormatTable, height_per_page, current_page_height, pformat, config);
				current_page_height = processInsertSingleDummyRowToFillPage(config.insertDummyRowWhileFormatTable, height_per_page, current_page_height, pformat, config);
				
				current_page_height = processInsertFooterSpacerWithDummyRowItems(config.insertFooterSpacerWithDummyRowItemWhileFormatTable, height_per_page, current_page_height, pformat, config, layoutState);
                processInsertFooterSpacer(layoutState.insertFooterSpacerWhileFormatTable, pfooter_spacer, height_per_page, current_page_height, config.repeatFooterLogo, pfl_height, pformat);
				
				if(config.repeatFooter === "y") addFooterElement(pfooter, pformat);
				if(config.repeatFooterLogo === "y") addFooterLogoElement(pfooter_logo, pformat);
				
				addPageBreakElement(div_page_break_before, pformat);
				current_page_height = 0; // Reset for new page

				if(config.repeatHeader === "y") addHeaderElement(pheader, pformat);
				 // else if not repeating, its height is not added to new page's current_page_height yet.

				if(config.repeatDocinfo === "y") addDocInfoElement(pdocinfo, pformat);
				
				if(config.repeatRowheader === "y") addRowHeaderElement(prowheader, pformat);
				
				addRowItemElement(prowitem, i, pformat);
				current_page_height += temp_item_height; 
				tb_page_break_before_yn = "n";
			} else { 
				addRowItemElement(prowitem, i, pformat);
			}
		}
		
		let spaceNeededForLastFooter = 0;
		if (config.repeatFooter !== "y") spaceNeededForLastFooter += pf_height;
		if (config.repeatFooterLogo !== "y") spaceNeededForLastFooter += pfl_height;
		
		if((current_page_height + spaceNeededForLastFooter) <= height_per_page){
			current_page_height = processInsertDummyRowItemsToFillPage(config.insertDummyRowItemWhileFormatTable, height_per_page, current_page_height, pformat, config);
			current_page_height = processInsertSingleDummyRowToFillPage(config.insertDummyRowWhileFormatTable, height_per_page, current_page_height, pformat, config);
			
			current_page_height = processInsertFooterSpacerWithDummyRowItems(config.insertFooterSpacerWithDummyRowItemWhileFormatTable, height_per_page, current_page_height, pformat, config, layoutState);
            processInsertFooterSpacer(layoutState.insertFooterSpacerWhileFormatTable, pfooter_spacer, height_per_page, current_page_height, config.repeatFooterLogo, pfl_height, pformat);
			
			addFooterElement(pfooter, pformat);
			addFooterLogoElement(pfooter_logo, pformat);
		}else{
			current_page_height = processInsertDummyRowItemsToFillPage(config.insertDummyRowItemWhileFormatTable, height_per_page, current_page_height, pformat, config);
			current_page_height = processInsertSingleDummyRowToFillPage(config.insertDummyRowWhileFormatTable, height_per_page, current_page_height, pformat, config);
			
			current_page_height = processInsertFooterSpacerWithDummyRowItems(config.insertFooterSpacerWithDummyRowItemWhileFormatTable, height_per_page, current_page_height, pformat, config, layoutState);
            processInsertFooterSpacer(layoutState.insertFooterSpacerWhileFormatTable, pfooter_spacer, height_per_page, current_page_height, config.repeatFooterLogo, pfl_height, pformat);

			if(config.repeatFooter === "y") addFooterElement(pfooter, pformat);
			if(config.repeatFooterLogo === "y") addFooterLogoElement(pfooter_logo, pformat);
					
			addPageBreakElement(div_page_break_before, pformat);
			current_page_height = 0;
			
			if(config.repeatHeader === "y") addHeaderElement(pheader, pformat);
			if(config.repeatDocinfo === "y") addDocInfoElement(pdocinfo, pformat);
			if(config.repeatRowheader === "y") addRowHeaderElement(prowheader, pformat);
			
			// Add the actual footer elements that were pushed to the new page.
			// Their heights contribute to current_page_height on this new page.
			current_page_height += pf_height;  
			current_page_height += pfl_height; 
			
			current_page_height = processInsertDummyRowItemsToFillPage(config.insertDummyRowItemWhileFormatTable, height_per_page, current_page_height, pformat, config);
			current_page_height = processInsertSingleDummyRowToFillPage(config.insertDummyRowWhileFormatTable, height_per_page, current_page_height, pformat, config);
			
			current_page_height = processInsertFooterSpacerWithDummyRowItems(config.insertFooterSpacerWithDummyRowItemWhileFormatTable, height_per_page, current_page_height, pformat, config, layoutState);
            processInsertFooterSpacer(layoutState.insertFooterSpacerWhileFormatTable, pfooter_spacer, height_per_page, current_page_height, config.repeatFooterLogo, pfl_height, pformat);
			
			addFooterElement(pfooter, pformat);
			addFooterLogoElement(pfooter_logo, pformat);
		}
		
		addProcessedSuffixToClassName(pformat, "printform_formatter");
		printformElement.remove();
		resolve();
	});
}

/**
 * Helper function for logging to console.
 * @param {*} logMessage - The message or object to log.
 */
function cl(logMessage){ console.log(logMessage); }

/**
 * Pauses execution for a specified number of milliseconds.
 * @param {number} timeInMilliseconds - The duration to pause in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
function pause(timeInMilliseconds) { 
	function pauseTheFunction(resolve, reject) { 
		if (typeof timeInMilliseconds === 'number' && timeInMilliseconds > 0) {
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
 */
async function processAllPrintforms() { 
	const printformElements = document.querySelectorAll(".printform");
	for(let i = 0; i < printformElements.length; i++){
        const currentPrintformElement = printformElements[i];
		try{
            await pause(1); 
        } catch(error){
            console.error("pause error:", error); 
        }
		try{
            await printform_process(currentPrintformElement);
        } catch(error){
            console.error("printform_process error for element:", currentPrintformElement, "error:", error); 
        }
	}
}

let hasProcessedOnLoad = false; 

window.onload = function() {
    if(hasProcessedOnLoad === false){ 
		processAllPrintforms(); 
		hasProcessedOnLoad = true;
	}
};
