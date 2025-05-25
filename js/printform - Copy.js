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
	// Add spacer [start] insert dummy row item
	if(diff_height_from_papersize > 0){
		var number_of_dummy_row_item_will_be_insert = 0;
		number_of_dummy_row_item_will_be_insert = Math.floor(diff_height_from_papersize / height_of_dummy_row);
		for( var i = 0 ; i < number_of_dummy_row_item_will_be_insert ; i++){
			add_dummy_row_item(target_element, height_of_dummy_row);
		}
	}
	// Add spacer [end  ] insert dummy row item
}

function process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat){
	console.log("process_to_insert_footer_spacer_while_format_table : start");
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
	console.log("process_to_insert_footer_spacer_with_dummy_row_item_while_format_table : start");
	/***** insert_footer_spacer_with_dummy_row_item_while_format_table [start] *****/
	if(insert_footer_spacer_with_dummy_row_item_while_format_table == "y"){
		remaining_height_per_page = height_per_page - current_page_height;
		console.log("pformat : height_per_page : "+ height_per_page);
		console.log("pformat : current_page_height : "+ current_page_height);
		console.log("pformat : remaining_height_per_page : "+ remaining_height_per_page);
			
		if(repeat_footer_logo != "y"){
			//remaining_height_per_page = remaining_height_per_page - pfl_height;
		}
		console.log("pformat : current_page_height : "+ current_page_height);
		console.log("pformat : remaining_height_per_page : "+ remaining_height_per_page);
		if(remaining_height_per_page > 0){
			insert_dummy_row_item(pformat, remaining_height_per_page, height_of_dummy_row_item);
			console.log("pformat : insert_dummy_row_item : "+ remaining_height_per_page);
			remainder_for_remaining_height_per_page = parseFloat((remaining_height_per_page % height_of_dummy_row_item).toFixed(2));
			current_page_height = height_per_page - remainder_for_remaining_height_per_page;
		}
	}
	/***** insert_footer_spacer_with_dummy_row_item_while_format_table [end  ] *****/
}

function printform_process(){
	
	return new Promise(resolve => {
		
		var printform = document.querySelector(".printform");
		var pformat = document.createElement('div');
		pformat.classList.add("printform_formatter");
		printform.parentNode.insertBefore(pformat, printform);
		pformat = document.querySelector(".printform_formatter");
		
		var pheader = printform.querySelector(".pheader");
		var ph_height = parseFloat(pheader.getBoundingClientRect().height.toFixed(2));
		console.log("ph_height : " + ph_height);
		
		var pdocinfo = printform.querySelector(".pdocinfo");
		var pdi_height = parseFloat(pdocinfo.getBoundingClientRect().height.toFixed(2));
		console.log("pdi_height : " + pdi_height);
		
		var prowheader = printform.querySelector(".prowheader");
		var prh_height = parseFloat(prowheader.getBoundingClientRect().height.toFixed(2));
		console.log("prd_height : " + prh_height);
		
		var pfooter = printform.querySelector(".pfooter");
		var pf_height = parseFloat(pfooter.getBoundingClientRect().height.toFixed(2));
		console.log("pf_height : " + pf_height);
		
		var pfooter_logo = printform.querySelector(".pfooter_logo");
		var pfl_height = parseFloat(pfooter_logo.getBoundingClientRect().height.toFixed(2));
		console.log("pfl_height : " + pfl_height);
		
		var prowitem = printform.querySelectorAll(".prowitem");
		var pr_height = 0;
		var temp;
		for( var i = 0; i < prowitem.length ; i ++){
			temp = parseFloat(prowitem[i].getBoundingClientRect().height.toFixed(2));
			if(temp != 0){
				pr_height += temp;
			}
		}
		console.log("pr_height : " + pr_height);
		
		
		var pfooter_spacer = document.createElement('div');
		pfooter_spacer.classList.add("pfooter_spacer");
		pfooter_spacer.classList.add("paper_width");
		pfooter_spacer.style.height = "0px";
		
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
		
		console.log("papersize_height : " + papersize_height);
		height_per_page = papersize_height;
		if(repeat_header == "y"){
			console.log("ph_height : " + ph_height);
			height_per_page -= ph_height;
		}
		if(repeat_docinfo == "y"){
			console.log("pdi_height : " + pdi_height);
			height_per_page -= pdi_height;
		}
		if(repeat_rowheader == "y"){
			console.log("prh_height : " + prh_height);
			height_per_page -= prh_height;
		}
		if(repeat_footer == "y"){
			console.log("pf_height : " + pf_height);
			height_per_page -= pf_height;
		}
		if(repeat_footer_logo == "y"){
			console.log("pfl_height : " + pfl_height);
			height_per_page -= pfl_height;
		}
		console.log("height_per_page : " + height_per_page);
		
		pheader.classList.add("pheader_processed");
		pheader.classList.remove("pheader");
		
		pdocinfo.classList.add("pdocinfo_processed");
		pdocinfo.classList.remove("pdocinfo");
		
		prowheader.classList.add("prowheader_processed");
		prowheader.classList.remove("prowheader");
		
		pfooter.classList.add("pfooter_processed");
		pfooter.classList.remove("pfooter");
		
		pfooter_logo.classList.add("pfooter_logo_processed");
		pfooter_logo.classList.remove("pfooter_logo");
		
		var div_page_break_before = document.createElement('div');
		div_page_break_before.classList.add("div_page_break_before");
		div_page_break_before.style.pageBreakBefore = "always";
		div_page_break_before.style.height = '0px';
		
		for( var i = 0; i < prowitem.length ; i ++){
			temp = parseFloat(prowitem[i].getBoundingClientRect().height.toFixed(2));
			
			if(current_page_height == 0){
				clone_pheader = pheader.cloneNode(true);
				pformat.appendChild(clone_pheader);
				console.log("pformat : pheader");
				
				if(repeat_header == "y"){
					
				}else{
					current_page_height += ph_height;
				}
				
				clone_pdocinfo = pdocinfo.cloneNode(true);
				pformat.appendChild(clone_pdocinfo);
				console.log("pformat : pdocinfo");
				
				if(repeat_docinfo == "y"){
					
				}else{
					current_page_height += pdi_height;
				}
				
				clone_prowheader = prowheader.cloneNode(true);
				pformat.appendChild(clone_prowheader);
				console.log("pformat : prowheader");
				
				if(repeat_rowheader == "y"){
					
				}else{
					current_page_height += prh_height;
				}
			}
			
			current_page_height += temp;
			
			prowitem[i].classList.add("prowitem_processed");
			prowitem[i].classList.remove("prowitem");
			if (prowitem[i].classList.contains('tb_page_break_before')) {
				tb_page_break_before_yn = "y";
			}
			if(tb_page_break_before_yn == "y"){
				
				current_page_height -= temp;
				
				/***** insert_dummy_row_item_while_format_table [start] *****/
				if(insert_dummy_row_item_while_format_table == "y"){
					remaining_height_per_page = height_per_page - current_page_height;
					
					if(remaining_height_per_page > 0){
						insert_dummy_row_item(pformat, remaining_height_per_page, height_of_dummy_row_item);
						console.log("pformat : insert_dummy_row_item : "+ remaining_height_per_page);
						remainder_for_remaining_height_per_page = parseFloat((remaining_height_per_page % height_of_dummy_row_item).toFixed(2));
						current_page_height = height_per_page - remainder_for_remaining_height_per_page;
					}
				}
				/***** insert_dummy_row_item_while_format_table [end  ] *****/
				
				/***** insert_dummy_row_while_format_table [start] *****/
				if(insert_dummy_row_while_format_table == "y"){
					remaining_height_per_page = height_per_page - current_page_height;
					
					if(remaining_height_per_page > 0){
						add_dummy_row(pformat, papersize_width, remaining_height_per_page);
						console.log("pformat : add_dummy_row : "+ remaining_height_per_page);
						current_page_height += remaining_height_per_page;
					}
				}
				/***** insert_dummy_row_while_format_table [end  ] *****/
				
				/***** insert_footer_spacer_with_dummy_row_item_while_format_table [start] *****/
				if(insert_footer_spacer_with_dummy_row_item_while_format_table == "y"){
					process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				}else{
					process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				}
				/***** insert_footer_spacer_with_dummy_row_item_while_format_table [end  ] *****/
				//process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				
				if(repeat_footer == "y"){
					clone_pfooter = pfooter.cloneNode(true);
					pformat.appendChild(clone_pfooter);
					console.log("pformat : pfooter");
				}
				
				if(repeat_footer_logo == "y"){
					clone_pfooter_logo = pfooter_logo.cloneNode(true);
					pformat.appendChild(clone_pfooter_logo);
					console.log("pformat : pfooter_logo");
				}
				
				clone_div_page_break_before = div_page_break_before.cloneNode(true);
				pformat.appendChild(clone_div_page_break_before);
				console.log("pformat : div_page_break_before");
				
				if(repeat_header == "y"){
					clone_pheader = pheader.cloneNode(true);
					pformat.appendChild(clone_pheader);
					console.log("pformat : pheader");
				}
				
				if(repeat_docinfo == "y"){
					clone_pdocinfo = pdocinfo.cloneNode(true);
					pformat.appendChild(clone_pdocinfo);
					console.log("pformat : pdocinfo");
				}
				
				if(repeat_rowheader == "y"){
					clone_prowheader = prowheader.cloneNode(true);
					pformat.appendChild(clone_prowheader);
					console.log("pformat : prowheader");
				}
				
				clone_prowitem = prowitem[i].cloneNode(true);
				pformat.appendChild(clone_prowitem);
				console.log("pformat : prowitem "+i);
				
				current_page_height = temp;
				tb_page_break_before_yn = "n";
			}else{
				if(current_page_height <= height_per_page){
					clone_prowitem = prowitem[i].cloneNode(true);
					pformat.appendChild(clone_prowitem);
					console.log("pformat : prowitem "+i);
				}else{
					current_page_height -= temp;
					
					/***** insert_dummy_row_item_while_format_table [start] *****/
					if(insert_dummy_row_item_while_format_table == "y"){
						remaining_height_per_page = height_per_page - current_page_height;
						
						if(remaining_height_per_page > 0){
							insert_dummy_row_item(pformat, remaining_height_per_page, height_of_dummy_row_item);
							console.log("pformat : insert_dummy_row_item : "+ remaining_height_per_page);
							remainder_for_remaining_height_per_page = parseFloat((remaining_height_per_page % height_of_dummy_row_item).toFixed(2));
							current_page_height = height_per_page - remainder_for_remaining_height_per_page;
						}
					}
					/***** insert_dummy_row_item_while_format_table [end  ] *****/
					
					/***** insert_dummy_row_while_format_table [start] *****/
					if(insert_dummy_row_while_format_table == "y"){
						remaining_height_per_page = height_per_page - current_page_height;
						
						if(remaining_height_per_page > 0){
							add_dummy_row(pformat, papersize_width, remaining_height_per_page);
							console.log("pformat : add_dummy_row : "+ remaining_height_per_page);
							current_page_height += remaining_height_per_page;
						}
					}
					/***** insert_dummy_row_while_format_table [end  ] *****/
					
				
					/***** insert_footer_spacer_with_dummy_row_item_while_format_table [start] *****/
					if(insert_footer_spacer_with_dummy_row_item_while_format_table == "y"){
						process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
					}else{
						process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
					}
					/***** insert_footer_spacer_with_dummy_row_item_while_format_table [end  ] *****/
					//process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
					
					if(repeat_footer == "y"){
						clone_pfooter = pfooter.cloneNode(true);
						pformat.appendChild(clone_pfooter);
						console.log("pformat : pfooter");
					}
					
					if(repeat_footer_logo == "y"){
						clone_pfooter_logo = pfooter_logo.cloneNode(true);
						pformat.appendChild(clone_pfooter_logo);
						console.log("pformat : pfooter_logo");
					}
					
					clone_div_page_break_before = div_page_break_before.cloneNode(true);
					pformat.appendChild(clone_div_page_break_before);
					console.log("pformat : div_page_break_before");
					
					if(repeat_header == "y"){
						clone_pheader = pheader.cloneNode(true);
						pformat.appendChild(clone_pheader);
						console.log("pformat : pheader");
					}
					
					if(repeat_docinfo == "y"){
						clone_pdocinfo = pdocinfo.cloneNode(true);
						pformat.appendChild(clone_pdocinfo);
						console.log("pformat : pdocinfo");
					}
					
					if(repeat_rowheader == "y"){
						clone_prowheader = prowheader.cloneNode(true);
						pformat.appendChild(clone_prowheader);
						console.log("pformat : prowheader");
					}
					
					clone_prowitem = prowitem[i].cloneNode(true);
					pformat.appendChild(clone_prowitem);
					console.log("pformat : prowitem "+i);
					
					current_page_height = temp;
				}
			}
			
		}
		
		
		if(repeat_footer == "y"){
			/***** insert_dummy_row_item_while_format_table [start] *****/
			if(insert_dummy_row_item_while_format_table == "y"){
				remaining_height_per_page = height_per_page - current_page_height;
				if(repeat_footer != "y"){
					remaining_height_per_page = remaining_height_per_page - pf_height;
				}
				if(repeat_footer_logo != "y"){
					remaining_height_per_page = remaining_height_per_page - pfl_height;
				}
				if(remaining_height_per_page > 0){
					insert_dummy_row_item(pformat, remaining_height_per_page, height_of_dummy_row_item);
					console.log("pformat : insert_dummy_row_item : "+ remaining_height_per_page);
					remainder_for_remaining_height_per_page = parseFloat((remaining_height_per_page % height_of_dummy_row_item).toFixed(2));
					current_page_height = height_per_page - remainder_for_remaining_height_per_page;
				}
			}
			/***** insert_dummy_row_item_while_format_table [end  ] *****/
			
			/***** insert_dummy_row_while_format_table [start] *****/
			if(insert_dummy_row_while_format_table == "y"){
				remaining_height_per_page = height_per_page - current_page_height;
				if(repeat_footer != "y"){
					remaining_height_per_page = remaining_height_per_page - pf_height;
				}
				if(repeat_footer_logo != "y"){
					remaining_height_per_page = remaining_height_per_page - pf_height;
				}
				if(remaining_height_per_page > 0){
					add_dummy_row(pformat, papersize_width, remaining_height_per_page);
					console.log("pformat : add_dummy_row : "+ remaining_height_per_page);
					current_page_height += remaining_height_per_page;
				}
			}
			/***** insert_dummy_row_while_format_table [end  ] *****/
			
			/***** insert_footer_spacer_with_dummy_row_item_while_format_table [start] *****/
			if(insert_footer_spacer_with_dummy_row_item_while_format_table == "y"){
				console.log("11111");
				process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			}else{
				process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			}
			/***** insert_footer_spacer_with_dummy_row_item_while_format_table [end  ] *****/
			//process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
			
			clone_pfooter = pfooter.cloneNode(true);
			pformat.appendChild(clone_pfooter);
			console.log("pformat : pfooter");
			
			clone_pfooter_logo = pfooter_logo.cloneNode(true);
			pformat.appendChild(clone_pfooter_logo);
			console.log("pformat : pfooter_logo");
		}else{
			current_page_height += pf_height;
			if(repeat_footer_logo != "y"){
				current_page_height += pfl_height;
			}
			
			if(current_page_height <= height_per_page){
				
				/***** insert_footer_spacer_with_dummy_row_item_while_format_table [start] *****/
				if(insert_footer_spacer_with_dummy_row_item_while_format_table == "y"){
					console.log("22222");
					process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				}else{
					process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				}
				/***** insert_footer_spacer_with_dummy_row_item_while_format_table [end  ] *****/
				//process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat)
				
				clone_pfooter = pfooter.cloneNode(true);
				pformat.appendChild(clone_pfooter);
				console.log("pformat : pfooter");
				
				clone_pfooter_logo = pfooter_logo.cloneNode(true);
				pformat.appendChild(clone_pfooter_logo);
				console.log("pformat : pfooter_logo");
			}else{
				current_page_height -= pf_height;
				if(repeat_footer_logo != "y"){
					current_page_height -= pfl_height;
				}
				
				/***** insert_footer_spacer_with_dummy_row_item_while_format_table [start] *****/
				if(insert_footer_spacer_with_dummy_row_item_while_format_table == "y"){
				
				console.log("%%%%%%%%%%%%%%%%%%%%%%%");
				console.log("height_per_page");
				console.log(height_per_page);
				
				console.log("%%%%%%%%%%%%%%%%%%%%%%%");
				console.log("current_page_height");
				console.log(current_page_height);
				
				console.log("%%%%%%%%%%%%%%%%%%%%%%%");
				console.log("pf_height");
				console.log(pf_height);
				
				console.log("33333");
					process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				}else{
					process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				}
				/***** insert_footer_spacer_with_dummy_row_item_while_format_table [end  ] *****/
				//process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				
				if(repeat_footer_logo == "y"){
					clone_pfooter_logo = pfooter_logo.cloneNode(true);
					pformat.appendChild(clone_pfooter_logo);
					console.log("pformat : pfooter_logo");
				}
				
				clone_div_page_break_before = div_page_break_before.cloneNode(true);
				pformat.appendChild(clone_div_page_break_before);
				console.log("pformat : div_page_break_before");
				
				current_page_height = pf_height;
				
				if(repeat_header == "y"){
					clone_pheader = pheader.cloneNode(true);
					pformat.appendChild(clone_pheader);
					console.log("pformat : pheader");
				}
				
				if(repeat_docinfo == "y"){
					clone_pdocinfo = pdocinfo.cloneNode(true);
					pformat.appendChild(clone_pdocinfo);
					console.log("pformat : pdocinfo");
				}
				
				if(repeat_rowheader == "y"){
					clone_prowheader = prowheader.cloneNode(true);
					pformat.appendChild(clone_prowheader);
					console.log("pformat : prowheader");
				}
				
				/***** insert_footer_spacer_with_dummy_row_item_while_format_table [start] *****/
				if(insert_footer_spacer_with_dummy_row_item_while_format_table == "y"){
					if(repeat_footer_logo != "y"){
						current_page_height += pfl_height;
					}
					console.log("44444");
					process_to_insert_footer_spacer_with_dummy_row_item_while_format_table(insert_footer_spacer_with_dummy_row_item_while_format_table, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				}else{
					process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				}
				/***** insert_footer_spacer_with_dummy_row_item_while_format_table [end  ] *****/
				//process_to_insert_footer_spacer_while_format_table(insert_footer_spacer_while_format_table, pfooter_spacer, height_per_page, current_page_height, repeat_footer_logo, pfl_height, pformat);
				
				clone_pfooter = pfooter.cloneNode(true);
				pformat.appendChild(clone_pfooter);
				console.log("pformat : pfooter");
				
				clone_pfooter_logo = pfooter_logo.cloneNode(true);
				pformat.appendChild(clone_pfooter_logo);
				console.log("pformat : pfooter_logo");
			}
		}
		
		pformat.classList.add("printform_formatter_processed");
		pformat.classList.remove("printform_formatter");
		
		printform.remove();
		console.log("printform : remove");
		resolve();
	});
}
/***** Generate Page [end  ] *****/

function pause_in_milliseconds(time) {
	function pause_the_function(resolve, reject) {
		if (typeof time === 'number' && time > 0) {
			console.log("pause for "+ (time/1000)+" seconds");
			setTimeout(resolve, time);
		} else {
			console.error("Error: Invalid time value");
			reject();
		}
	}
	return new Promise(pause_the_function);
}

async function run_function_sequentially() {
	var printform = document.querySelectorAll(".printform");
	var prinbform_no =  printform.length;
	console.log(prinbform_no);
	for(var i = 0; i < prinbform_no; i ++){
		try{await pause_in_milliseconds(1);}catch(error){console.error("pause_in_milliseconds error");}
		try{await printform_process();}     catch(error){console.error("printform_process error");}
	}
}
if(!run_function_sequentially_processed){
	var run_function_sequentially_processed = false;
}
document.addEventListener("DOMContentLoaded", function(event) {
	if(run_function_sequentially_processed == false){
		
		run_function_sequentially();
		run_function_sequentially_processed = true;
	}
});
