/****** Setting [start] ******/
var repeat_header = repeat_header || "y";
var repeat_docinfo = repeat_docinfo || "y";
var repeat_rowheader = repeat_rowheader || "y";
var repeat_footer = repeat_footer || "n";
var repeat_footer_logo = repeat_footer_logo || "n";
var insert_dummy_row_item_while_format_table = insert_dummy_row_item_while_format_table || "y";
var insert_dummy_row_while_format_table = insert_dummy_row_while_format_table || "n";
var insert_footer_spacer_while_format_table = insert_footer_spacer_while_format_table || "y";
var insert_footer_spacer_with_dummy_row_item_while_format_table = insert_footer_spacer_with_dummy_row_item_while_format_table || "y";
var custom_dummy_row_item_content = custom_dummy_row_item_content || "";

// Assuming vle_temp_paper_width and vle_temp_paper_height are defined somewhere
var papersize_width = papersize_width || 750; // Default to 795px (A4 width)
var papersize_height = papersize_height || 1050; // Default to a standard A4 height (1122px)
var height_of_dummy_row_item = height_of_dummy_row_item || 18; // Default height
/****** Setting [end  ] ******/

function formatIntl(num) {
	return parseFloat(Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }).format(num));
}

// [INJECT] Read per-form config from data-* attributes
function getPrintformConfig(formEl) {
	const ds = formEl.dataset;
	// if user provided a <template> override, use its content
	const tmpl = formEl.querySelector('template.custom-dummy-row-item-content');
	const customDummyRowItemContent = tmpl
		? tmpl.innerHTML.trim()
		: ('customDummyRowItemContent' in ds ? ds.customDummyRowItemContent : custom_dummy_row_item_content);
	return {
		papersizeWidth: ds.papersizeWidth ? +ds.papersizeWidth : papersize_width,
		papersizeHeight: ds.papersizeHeight ? +ds.papersizeHeight : papersize_height,
		heightOfDummyRowItem: ds.heightOfDummyRowItem ? +ds.heightOfDummyRowItem : height_of_dummy_row_item,
		repeatHeader: ds.repeatHeader ? ds.repeatHeader === "y" : repeat_header === "y",
		repeatDocinfo: ds.repeatDocinfo ? ds.repeatDocinfo === "y" : repeat_docinfo === "y",
		repeatRowheader: ds.repeatRowheader ? ds.repeatRowheader === "y" : repeat_rowheader === "y",
		repeatFooter: ds.repeatFooter ? ds.repeatFooter === "y" : repeat_footer === "y",
		repeatFooterLogo: ds.repeatFooterLogo ? ds.repeatFooterLogo === "y" : repeat_footer_logo === "y",
		insertDummyRowItemWhileFormatTable: ds.insertDummyRowItemWhileFormatTable
			? ds.insertDummyRowItemWhileFormatTable === "y"
			: insert_dummy_row_item_while_format_table === "y",
		insertDummyRowWhileFormatTable: ds.insertDummyRowWhileFormatTable
			? ds.insertDummyRowWhileFormatTable === "y"
			: insert_dummy_row_while_format_table === "y",
		insertFooterSpacerWhileFormatTable: ds.insertFooterSpacerWhileFormatTable
			? ds.insertFooterSpacerWhileFormatTable === "y"
			: insert_footer_spacer_while_format_table === "y",
		insertFooterSpacerWithDummyRowItemWhileFormatTable: ds.insertFooterSpacerWithDummyRowItemWhileFormatTable
			? ds.insertFooterSpacerWithDummyRowItemWhileFormatTable === "y"
			: insert_footer_spacer_with_dummy_row_item_while_format_table === "y",
		customDummyRowItemContent
	};
}

function add_dummy_row(target_element, papersize_width, height_of_dummy_row){
	
	var dummy_row_item_table = document.createElement('table');
	dummy_row_item_table.className = 'dummy_row';
	dummy_row_item_table.setAttribute('width', papersize_width + 'px');
	dummy_row_item_table.setAttribute('cellspacing', '0');
	dummy_row_item_table.setAttribute('cellpadding', '0');
	
	var dummy_row_item_inner_html = `
	<tr style='height:`+height_of_dummy_row+`px;'>
		<td style="border:0px solid black;"></td>
	</tr>
	`;
	dummy_row_item_table.innerHTML = dummy_row_item_inner_html;
	//target_element.insertAdjacentElement('beforebegin', dummy_row_item_table)
	target_element.appendChild(dummy_row_item_table);
}
function add_dummy_row_item(target_element, height_of_dummy_row_item){
	
	var dummy_row_item_table = document.createElement('table');
	dummy_row_item_table.className = 'dummy_row_item';
	dummy_row_item_table.setAttribute('width', papersize_width + 'px');
	dummy_row_item_table.setAttribute('cellspacing', '0');
	dummy_row_item_table.setAttribute('cellpadding', '0');
	
	var dummy_row_item_inner_html = `
	<tr style='height:`+height_of_dummy_row_item+`px;'>
		<td style="border:0px solid black;"></td>
	</tr>
	`;
	
	if(typeof custom_dummy_row_item_content !== "undefined"){
		if(custom_dummy_row_item_content != ""){
			dummy_row_item_inner_html = custom_dummy_row_item_content;
		}
	}
	dummy_row_item_table.innerHTML = dummy_row_item_inner_html;
	//target_element.insertAdjacentElement('beforebegin', dummy_row_item_table)
	target_element.appendChild(dummy_row_item_table);
}
function insert_dummy_row_item(target_element, diff_height_from_papersize, height_of_dummy_row){
	
	cl("pformat : insert_dummy_row_item diff_height_from_papersize: "+ diff_height_from_papersize);
	cl("pformat : insert_dummy_row_item height_of_dummy_row: "+ height_of_dummy_row);
	// Add spacer [start] insert dummy row item
	if(diff_height_from_papersize > 0){
		var number_of_dummy_row_item_will_be_insert = 0;
		number_of_dummy_row_item_will_be_insert = Math.floor(diff_height_from_papersize / height_of_dummy_row);
		cl("pformat : insert_dummy_row_item number_of_dummy_row_item_will_be_insert: "+ number_of_dummy_row_item_will_be_insert);
		for( var i = 0 ; i < number_of_dummy_row_item_will_be_insert ; i++){
			add_dummy_row_item(target_element, height_of_dummy_row);
		}
	}
	// Add spacer [end  ] insert dummy row item
}

function process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat){
	cl("process_to_insert_footer_spacer_while_format_table : start");
	/***** insert_footer_spacer_while_format_table [start] *****/
	if(insert_footer_spacer_while_format_table == "y"){
		clone_pfooter_spacer = pfooter_spacer.cloneNode(true);
		
		remaining_height_per_page = height_per_page - current_page_height;
		
		if(repeat_footer_logo != "y"){
			remaining_height_per_page = remaining_height_per_page - pfl_height;
		}
		if(remaining_height_per_page){
			clone_pfooter_spacer.style.height = remaining_height_per_page + "px";
		}
		pformat.appendChild(clone_pfooter_spacer);
	}
	/***** insert_footer_spacer_while_format_table [end  ] *****/
}

function process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat){
	cl("process_to_insert_footer_spacer_with_dummy_row_item_while_format_table : start");
	/***** insert_footer_spacer_with_dummy_row_item_while_format_table [start] *****/
	if(insert_footer_spacer_with_dummy_row_item_while_format_table == "y"){
		remaining_height_per_page = height_per_page - current_page_height;
		cl("pformat : height_per_page : "+ height_per_page);
		cl("pformat : current_page_height : "+ current_page_height);
		cl("pformat : remaining_height_per_page : "+ remaining_height_per_page);
			
		if(repeat_footer_logo != "y"){
			//remaining_height_per_page = remaining_height_per_page - pfl_height;
		}
		cl("pformat : current_page_height : "+ current_page_height);
		cl("pformat : remaining_height_per_page : "+ remaining_height_per_page);
		if(remaining_height_per_page > 0){
			insert_dummy_row_item(pformat, remaining_height_per_page, height_of_dummy_row_item);
			remainder_for_remaining_height_per_page = (formatIntl((remaining_height_per_page % height_of_dummy_row_item)));
			current_page_height = height_per_page - remainder_for_remaining_height_per_page;
		}
		
		insert_footer_spacer_while_format_table = "n";
	}
	/***** insert_footer_spacer_with_dummy_row_item_while_format_table [end  ] *****/
	var temp_value = (formatIntl((current_page_height)));
	return temp_value;
}

function process_to_insert_dummy_row_item_while_format_table(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item){
	cl("process_to_insert_dummy_row_item_while_format_table : start");
	/***** insert_dummy_row_item_while_format_table [start] *****/
	if(insert_dummy_row_item_while_format_table == "y"){
		remaining_height_per_page = height_per_page - current_page_height;
		if(remaining_height_per_page > 0){
			insert_dummy_row_item(pformat, remaining_height_per_page, height_of_dummy_row_item);
			remainder_for_remaining_height_per_page = (formatIntl((remaining_height_per_page % height_of_dummy_row_item)));
			current_page_height = height_per_page - remainder_for_remaining_height_per_page;
			cl("current_page_height");
			cl(current_page_height);
		}
	}
	/***** insert_dummy_row_item_while_format_table [end  ] *****/
	var temp_value = (formatIntl((current_page_height)));
	return temp_value;
}

function process_to_insert_dummy_row_while_format_table(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width){
	cl("process_to_insert_dummy_row_item_while_format_table : start");
	/***** insert_dummy_row_while_format_table [start] *****/
	if(insert_dummy_row_while_format_table == "y"){
		remaining_height_per_page = height_per_page - current_page_height;
		
		if(remaining_height_per_page > 0){
			add_dummy_row(pformat, papersize_width, remaining_height_per_page);
			cl("pformat : add_dummy_row : "+ remaining_height_per_page);
			current_page_height += remaining_height_per_page;
		}
	}
	/***** insert_dummy_row_while_format_table [end  ] *****/
	var temp_value = (formatIntl((current_page_height)));
	return temp_value;
}

function addRowHeader(prowheader, pformat){
	clone_prowheader = prowheader.cloneNode(true);
	pformat.appendChild(clone_prowheader);
	cl("pformat : prowheader");
}

function addHeader(pheader, pformat){
	clone_pheader = pheader.cloneNode(true);
	pformat.appendChild(clone_pheader);
	cl("pformat : pheader");
}

function addFooter(pfooter, pformat){
	clone_pfooter = pfooter.cloneNode(true);
	pformat.appendChild(clone_pfooter);
	cl("pformat : pfooter");
}

function addFooterLogo(pfooter_logo, pformat){
	clone_pfooter_logo = pfooter_logo.cloneNode(true);
	pformat.appendChild(clone_pfooter_logo);
	cl("pformat : pfooter_logo");
}

function addDocInfo(pdocinfo, pformat){
	clone_pdocinfo = pdocinfo.cloneNode(true);
	pformat.appendChild(clone_pdocinfo);
	cl("pformat : pdocinfo");
}

function addDivPageBreakBefore(div_page_break_before, pformat){
	clone_div_page_break_before = div_page_break_before.cloneNode(true);
	pformat.appendChild(clone_div_page_break_before);
	cl("pformat : div_page_break_before");
}

function addRowItem(prowitem, temp_no, pformat){
	clone_prowitem = prowitem[temp_no].cloneNode(true);
	pformat.appendChild(clone_prowitem);
	cl("pformat : prowitem " + temp_no);
}

function addProcessedInClassName(input_ele, input_classname){
	var temp_class_name = input_classname;
	var temp_class_name_new = input_classname + "_processed";
	
	input_ele.classList.remove(temp_class_name);
	input_ele.classList.add(temp_class_name_new);
}

// [MODIFY] Refactor printform_process to accept element and config
async function printform_process(formEl, config){
	// Override globals from per-form config
	const {
		papersizeWidth,
		papersizeHeight,
		heightOfDummyRowItem,
		repeatHeader,
		repeatDocinfo,
		repeatRowheader,
		repeatFooter,
		repeatFooterLogo,
		insertDummyRowItemWhileFormatTable,
		insertDummyRowWhileFormatTable,
		insertFooterSpacerWhileFormatTable,
		insertFooterSpacerWithDummyRowItemWhileFormatTable,
		customDummyRowItemContent
	} = config;
	papersize_width = papersizeWidth;
	papersize_height = papersizeHeight;
	height_of_dummy_row_item = heightOfDummyRowItem;
	repeat_header = repeatHeader ? "y" : "n";
	repeat_docinfo = repeatDocinfo ? "y" : "n";
	repeat_rowheader = repeatRowheader ? "y" : "n";
	repeat_footer = repeatFooter ? "y" : "n";
	repeat_footer_logo = repeatFooterLogo ? "y" : "n";
	insert_dummy_row_item_while_format_table = insertDummyRowItemWhileFormatTable ? "y" : "n";
	insert_dummy_row_while_format_table = insertDummyRowWhileFormatTable ? "y" : "n";
	insert_footer_spacer_while_format_table = insertFooterSpacerWhileFormatTable ? "y" : "n";
	insert_footer_spacer_with_dummy_row_item_while_format_table = insertFooterSpacerWithDummyRowItemWhileFormatTable ? "y" : "n";
	custom_dummy_row_item_content = customDummyRowItemContent;
	// Use the passed element
	const printform = formEl;
	var pformat = document.createElement('div');
	pformat.classList.add("printform_formatter");
	printform.parentNode.insertBefore(pformat, printform);
	pformat = document.querySelector(".printform_formatter");
	
	var pheader = printform.querySelector(".pheader");
	var ph_height = pheader.offsetHeight;
	cl("ph_height : " + ph_height);
	
	var pdocinfo = printform.querySelector(".pdocinfo");
	var pdi_height = pdocinfo.offsetHeight;
	cl("pdi_height : " + pdi_height);
	
	var prowheader = printform.querySelector(".prowheader");
	var prh_height = prowheader.offsetHeight;
	cl("prd_height : " + prh_height);
	
	var pfooter = printform.querySelector(".pfooter");
	var pf_height = pfooter.offsetHeight;
	cl("pf_height : " + pf_height);
	
	var pfooter_logo = printform.querySelector(".pfooter_logo");
	var pfl_height = pfooter_logo.offsetHeight;
	cl("pfl_height : " + pfl_height);
	
	var prowitem = printform.querySelectorAll(".prowitem");
	var pr_height = 0;
	var temp;
	for( var i = 0; i < prowitem.length ; i ++){
		temp = prowitem[i].offsetHeight;
		if(temp != 0){
			pr_height += temp;
		}
	}
	cl("pr_height : " + pr_height);
	
	
	var pfooter_spacer = document.createElement('div');
	pfooter_spacer.classList.add("pfooter_spacer");
	pfooter_spacer.classList.add("paper_width");
	pfooter_spacer.style.height = "0px";
	
	var div_page_break_before = document.createElement('div');
	div_page_break_before.classList.add("div_page_break_before");
	div_page_break_before.style.pageBreakBefore = "always";
	div_page_break_before.style.height = '0px';
	
	/***** Generate Page [start] *****/
	var clone_pheader;
	var clone_pdocinfo;
	var clone_prowheader;
	var clone_pfooter;
	var clone_pfooter_logo;
	var clone_prowitem;
	var clone_div_page_break_before;
	var clone_pfooter_spacer;
	var current_page_height = 0;
	var height_per_page = 0;
	var remaining_height_per_page = 0;
	var remainder_for_remaining_height_per_page ;
	var tb_page_break_before_yn = "" ;
	
	cl("papersize_height : " + papersize_height);
	height_per_page = papersize_height;
	if(repeat_header == "y"){
		cl("ph_height : " + ph_height);
		height_per_page -= ph_height;
	}
	if(repeat_docinfo == "y"){
		cl("pdi_height : " + pdi_height);
		height_per_page -= pdi_height;
	}
	if(repeat_rowheader == "y"){
		cl("prh_height : " + prh_height);
		height_per_page -= prh_height;
	}
	if(repeat_footer == "y"){
		cl("pf_height : " + pf_height);
		height_per_page -= pf_height;
	}
	if(repeat_footer_logo == "y"){
		cl("pfl_height : " + pfl_height);
		height_per_page -= pfl_height;
	}
	cl("height_per_page : " + height_per_page);
	
	addProcessedInClassName(pheader, "pheader");
	addProcessedInClassName(pdocinfo, "pdocinfo");
	addProcessedInClassName(prowheader, "prowheader");
	addProcessedInClassName(pfooter, "pfooter");
	addProcessedInClassName(pfooter_logo, "pfooter_logo");
	
	// Loop all row item [start]
	for( var i = 0; i < prowitem.length ; i ++){
		temp = prowitem[i].offsetHeight;
		cl("temp prowitem " + i);
		cl(temp);
		
		if(current_page_height == 0){
			addHeader(pheader, pformat);
			if(repeat_header == "y"){
				
			}else{
				current_page_height += ph_height;
			}
			
			addDocInfo(pdocinfo, pformat);
			
			if(repeat_docinfo == "y"){
				
			}else{
				current_page_height += pdi_height;
			}
			
			addRowHeader(prowheader, pformat);
			if(repeat_rowheader == "y"){
				
			}else{
				current_page_height += prh_height;
			}
		}
		
		current_page_height += temp;
		
		addProcessedInClassName(prowitem[i], "prowitem");
		
		if (prowitem[i].classList.contains('tb_page_break_before')) {
			tb_page_break_before_yn = "y";
		}
		if(tb_page_break_before_yn == "y"){
			
			current_page_height -= temp;
			
			current_page_height = process_to_insert_dummy_row_item_while_format_table(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item);

			current_page_height = process_to_insert_dummy_row_while_format_table(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width);
			
			current_page_height = process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			
			process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			
			if(repeat_footer == "y"){
				addFooter(pfooter, pformat);
			}
			
			if(repeat_footer_logo == "y"){
				addFooterLogo(pfooter_logo, pformat);
			}
			
			addDivPageBreakBefore(div_page_break_before, pformat);
			
			if(repeat_header == "y"){
				addHeader(pheader, pformat);
			}
			
			if(repeat_docinfo == "y"){
				addDocInfo(pdocinfo, pformat);
			}
			
			if(repeat_rowheader == "y"){
				addRowHeader(prowheader, pformat);
			}
			
			addRowItem(prowitem, i, pformat);
			
			current_page_height = temp;
			tb_page_break_before_yn = "n";
		}else{
			if(current_page_height <= height_per_page){
				addRowItem(prowitem, i, pformat);
			}else{
				current_page_height -= temp;
				
				current_page_height = process_to_insert_dummy_row_item_while_format_table(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item);
				
				current_page_height = process_to_insert_dummy_row_while_format_table(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width);
				
				current_page_height = process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				
				process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				
				if(repeat_footer == "y"){
					addFooter(pfooter, pformat);
				}
				
				if(repeat_footer_logo == "y"){
					addFooterLogo(pfooter_logo, pformat);
				}
				
				addDivPageBreakBefore(div_page_break_before, pformat);
				
				if(repeat_header == "y"){
					addHeader(pheader, pformat);
				}
				
				if(repeat_docinfo == "y"){
					addDocInfo(pdocinfo, pformat);
				}
				
				if(repeat_rowheader == "y"){
					addRowHeader(prowheader, pformat);
				}
				
				addRowItem(prowitem, i, pformat);
				
				current_page_height = temp;
			}
		}
		
	}
	// Loop all row item [end  ]
	
	// Last Footer [start]
	current_page_height += pf_height;
	current_page_height += pfl_height;
	if(repeat_footer == "y"){
		current_page_height -= pf_height;
	}
	if(repeat_footer_logo == "y"){
		current_page_height -= pfl_height;
	}

		cl("%%%%%%%%%%%%%%%%%%%%");
		cl("current_page_height");
		cl(current_page_height);
		cl("%%%%%%%%%%%%%%%%%%%%");
		cl("height_per_page");
		cl(height_per_page);
	
	if(current_page_height <= height_per_page){
		// Spacer [start] 
		current_page_height = process_to_insert_dummy_row_item_while_format_table(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item);
		
		current_page_height = process_to_insert_dummy_row_while_format_table(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width);
		
		current_page_height = process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
		
		process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
		// Spacer [end  ] 
		
		addFooter(pfooter, pformat);
		addFooterLogo(pfooter_logo, pformat);
	}else{
		// Last Second Page Footer [start] 
		current_page_height -= pf_height;
		current_page_height -= pfl_height;
		
		if(repeat_footer == "y"){
			current_page_height += pf_height;
		}
		if(repeat_footer_logo == "y"){
			current_page_height += pfl_height;
		}
		
		current_page_height = process_to_insert_dummy_row_item_while_format_table(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item);
		
		current_page_height = process_to_insert_dummy_row_while_format_table(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width);
		
		current_page_height = process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
		
		process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
		
		if(repeat_footer == "y"){
			addFooterLogo(pfooter, pformat);
		}
		if(repeat_footer_logo == "y"){
			addFooterLogo(pfooter_logo, pformat);
		}
				
		// Last Second Page Footer [end  ] 
		addDivPageBreakBefore(div_page_break_before, pformat);
		
		// Last Page Footer [start] 
		current_page_height = 0;
		
		
		if(repeat_header == "y"){
			addHeader(pheader, pformat);
		}else{
			
		}
		
		if(repeat_docinfo == "y"){
			addDocInfo(pdocinfo, pformat);
		}else{
			
		}
		
		if(repeat_rowheader == "y"){
			addRowHeader(prowheader, pformat);
		}else{
			
		}
		
		if(repeat_footer == "y"){
			current_page_height -= pf_height;
		}
		if(repeat_footer_logo == "y"){
			current_page_height -= pfl_height;
		}
		
		current_page_height += pf_height;
		current_page_height += pfl_height;
		
		// Spacer [start] 
		current_page_height = process_to_insert_dummy_row_item_while_format_table(insert_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item);
		
		current_page_height = process_to_insert_dummy_row_while_format_table(insert_dummy_row_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat, height_of_dummy_row_item, papersize_width);
		
		current_page_height = process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
		
		process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
		// Spacer [end  ] 
		
		addFooter(pfooter, pformat);
		addFooterLogo(pfooter_logo, pformat);
		// Last Page Footer [end  ] 
	}
	// Last Footer [end  ]
	
	
	addProcessedInClassName(pformat, "printform_formatter");
	
	printform.remove();
	cl("printform : remove");
	return pformat;
}
/***** Generate Page [end  ] *****/

function cl(log){ console.log(log); }

function pause_in_milliseconds(time) {
	function pause_the_function(resolve, reject) {
		if (typeof time === 'number' && time > 0) {
			cl("pause for "+ (time/1000)+" seconds");
			setTimeout(resolve, time);
		} else {
			console.error("Error: Invalid time value");
			reject();
		}
	}
	return new Promise(pause_the_function);
}

// Orchestrator: process each .printform with its own config
async function processAllPrintForms() {
	window.run_function_sequentially_processed = window.run_function_sequentially_processed || false;
	if (window.run_function_sequentially_processed) return;
	const forms = Array.from(document.querySelectorAll(".printform"));
	for (let idx = 0; idx < forms.length; idx++) {
		const formEl = forms[idx];
		const cfg = getPrintformConfig(formEl);
		try { await pause_in_milliseconds(1); } catch (error) { console.error("pause_in_milliseconds error"); }
		let pformat;
		try { pformat = await printform_process(formEl, cfg); } catch (error) { console.error("printform_process error"); }
		// insert inter-form page break before each formatted block except the first
		if (idx > 0 && pformat && pformat.parentNode) {
			const breakDiv = document.createElement('div');
			breakDiv.classList.add('div_page_break_before');
			breakDiv.style.pageBreakBefore = 'always';
			breakDiv.style.height = '0px';
			pformat.parentNode.insertBefore(breakDiv, pformat);
		}
	}
	window.run_function_sequentially_processed = true;
}

window.onload = processAllPrintForms;
