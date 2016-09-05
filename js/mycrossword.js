var H5P = H5P || {};

var self;
var total = 0;//cells number
var cells = 0;
var prev_r = -1;//previous row
var prev_c = -1;//previous column
var attemps = 0;//attemps number = number of clicks on "check" button
var ACCENT; var UPPER; var DIFF;
	
function onFocus(ac, dw){
	if(ac != "undefined"){
		(H5P.jQuery("."+ac+" input")).addClass("focused");
		(H5P.jQuery("."+ac)).addClass("focused");
		(H5P.jQuery("."+ac)).select();
	}
	if(dw != "undefined"){
		(H5P.jQuery("."+dw+" input")).addClass("focused");//css("backgroundColor", "blue");//
		(H5P.jQuery("."+dw)).addClass("focused");//css("backgroundColor", "red");//
		(H5P.jQuery("."+dw)).select();
	}
}
function onBlur(ac, dw){
	if(ac != undefined){
		(H5P.jQuery("."+ac+" input")).removeClass("focused");
		(H5P.jQuery("."+ac)).removeClass("focused");//css("backgroundColor", "red");//
	}
	if(dw != undefined){
		(H5P.jQuery("."+dw+" input")).removeClass("focused");
		(H5P.jQuery("."+dw)).removeClass("focused");//css("backgroundColor", "red");//

	}
	//prev_c = -1; prev_r = -1;
}
function onClick(ac, dw, r, c){
	if(ac != "undefined"){
		//(H5P.jQuery("#input_"+r+'_'+c)).val('');//+"."+ac+" input"
		(H5P.jQuery("#input_"+r+'_'+c)).select();
	}
	if(dw != "undefined"){
		//(H5P.jQuery("#input_"+r+'_'+c)).val('');//"."+dw+" input"
		(H5P.jQuery("#input_"+r+'_'+c)).select();
	}
	prev_r = -1; prev_c = -1;
}
function onKey(ac, dw, char, r, c){

	var e = this.event;
	switch(e.keyCode){
		case(8)://back
			if( (H5P.jQuery('#input_'+r+'_'+c)).hasClass("solved")){
				(H5P.jQuery('#input_'+r+'_'+c)).removeClass("solved");
			}
			if(r > prev_r && c <= prev_c){//down word
				if((H5P.jQuery('#input_'+r+'_'+c)).val()==""){
					prev_r = r - 2;
					move(r,c,0,-1,false);
				}
			}
			else if(r <= prev_r && c > prev_c){//across word
				if((H5P.jQuery('#input_'+r+'_'+c)).val()==""){
					prev_c = c - 2;
					move(r,c,-1,0,false);
				}
			}
		break;
		case(37)://left
			prev_c = c - 2;
			move(r, c, -1, 0, false);
		break;
		case(38)://up
			prev_r = r - 2;
			move(r, c, 0, -1, false);
		break;
		case(39)://right
			move(r, c, 1, 0);
		break;
		case(40)://down
			move(r, c, 0, 1);
		break;
		default:
			if((e.keyCode>47 && e.keyCode<112) || (e.keyCode>186 && e.keyCode<222)){
				var value = (H5P.jQuery('#input_'+r+'_'+c)).val();
				if(!ACCENT){char = normalize(char); value = normalize(value);}
				if(!UPPER){char = char.toUpperCase(); value = value.toUpperCase();}
				
				if(char == value){
					if(!(H5P.jQuery('#input_'+r+'_'+c)).hasClass("solved")){
						(H5P.jQuery('#input_'+r+'_'+c)).addClass("solved");
						total--;
					}
				}
				else{
					if( (H5P.jQuery('#input_'+r+'_'+c)).hasClass("solved")){
						(H5P.jQuery('#input_'+r+'_'+c)).removeClass("solved");
						total++;
					}
				}
				if(ac != "undefined" && dw == "undefined") move(r, c, 1, 0);
				else if(ac == "undefined" && dw != "undefined") move(r, c, 0, 1);
				else if(r > prev_r && c <=prev_c) move(r,c, 0, 1);
				else if(r <= prev_r && c > prev_c) move(r, c, 1, 0);
				
			}
		break;
	}
	//check();
}
function move(r, c, ac, dw, replace=true){
	var last = true;
	if(ac!=0){
		var tempc = parseInt(c)+ac;
		if((H5P.jQuery('.'+r+'_'+tempc))!= [] && !((H5P.jQuery('.'+r+'_'+tempc)).hasClass("empty"))){
			(H5P.jQuery('#input_'+r+'_'+tempc)).select();
			(H5P.jQuery('#input_'+r+'_'+tempc)).focus();
			last = false;
		}
	}
	else if(dw!=0){
		var tempr = parseInt(r)+dw;
		if((H5P.jQuery('.'+tempr+'_'+c))!= [] &&!((H5P.jQuery('.'+tempr+'_'+c)).hasClass("empty"))){
			(H5P.jQuery('#input_'+tempr+'_'+c)).select();
			(H5P.jQuery('#input_'+tempr+'_'+c)).focus();
			last = false;
		}
	}
	if(replace && !last) {prev_r = parseInt(r); prev_c = parseInt(c);}
}
function check(){
	if(DIFF == "normal"){(H5P.jQuery(".hide.solved")).removeClass("hide");}
	if (total<1){
		(H5P.jQuery(".hide.solved")).removeClass("hide");
		//alert("Enhorabuena! Has completado el crucigrama");//**cambiar este alert
		self.score(10-(10*total/cells)-(attemps),10, 'completed');
	}
	else {
		self.score(10-(10*total/cells)-(attemps),10, 'completed');
	}

	attemps++;
	(H5P.jQuery("#check_text")).html("Intentos: "+attemps);
}
var normalize = (function() {//funcion obtenida de http://www.etnassoft.com/2011/03/03/eliminar-tildes-con-javascript/
	var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
		to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
		mapping = {};

	for(var i = 0, j = from.length; i < j; i++ )
		mapping[ from.charAt( i ) ] = to.charAt( i );

	return function( str ) {
		var ret = [];
		for( var i = 0, j = str.length; i < j; i++ ) {
			var c = str.charAt( i );
			if( mapping.hasOwnProperty( str.charAt( i ) ) )
				ret.push( mapping[ c ] );
			else
				ret.push( c );
		}      
		return ret.join( '' );
	}
})();

H5P.CrossWord = (function (EventDispatcher, $) {

	function CrossWord(parameters, id){
		self = this;
		EventDispatcher.call(self);
		
		ACCENT = parameters.accent_mark;
		UPPER = parameters.upper;
		DIFF = parameters.difficulty;
		
		var cross = new CrossWord.CrossWord(parameters.words, id);
		
		self.score = function (score, max, label){
			var xAPIEvent = this.createXAPIEventTemplate('answered');
			xAPIEvent.setScoredResult(score, max, label);
			this.trigger(xAPIEvent);
		}
		self.attach = function($container) {
			var show_answers = false;
			grid = cross.getSquareGrid(20);
			if(grid){
				legend = cross.getLegend(grid);
				var html = "";
				html += '<div class="crossword"><table>';
				this.triggerXAPI('attempted');
				var ac = 1;
				var dw = 1;
				var df = "";
				switch(DIFF){
					case("easy"):
						df = "";
					break;
					case("normal"):
						df = " hide ";
					break;
					case("hard"):
						df = " hide ";
					break;
				}	
				
				var hclasses = [];
				var vclasses = [];
				for (var r = 0; r < grid.length; r++){
					html += "<tr>";
					hclasses.push(new Array(grid[r].length));
					vclasses.push(new Array(grid[r].length));
					for (var c = 0; c < grid[r].length; c++){
						var label = 0;
						var cell = grid[r][c];
						var is_start_of_across_word = false;
						var is_start_of_down_word = false;
						if(cell == null){
							var char = '\xa0';
						}
						else {
							total++;
							var char = cell['char'];
							var is_start_of_across_word = (cell['across'] && cell['across']['is_start_of_word']);
							var is_start_of_down_word = (cell['down'] && cell['down']['is_start_of_word']);
						}
						
						if(is_start_of_across_word && !is_start_of_down_word) {
							html += "<td class='no-border h_word"+ac+" "+r+"_"+c+"' id='" + legend.across[ac-1].clue + "'title='" + legend.across[ac-1].clue + "'>";
							hclasses[r][c]="h_word"+ac;
							label = 1;
							ac++;								
						}
						else if(is_start_of_down_word && !is_start_of_across_word){
							html += "<td class='no-border v_word"+dw+" "+r+"_"+c+"' id='" + legend.down[dw-1].clue + "'title='" + legend.down[dw-1].clue + "'>";
							vclasses[r][c]="v_word"+dw;
							label = 2;
							dw++;								
						}
						else if(is_start_of_across_word && is_start_of_down_word){
							html += "<td class='no-border h_word"+ac+" v_word"+dw+" "+r+"_"+c+"' id='" + legend.down[dw-1].clue + "'title='" + legend.down[dw-1].clue + "'>";
							hclasses[r][c]="h_word"+ac;
							vclasses[r][c]="v_word"+dw;
							label = 3;
							ac++;
							dw++;
						}
						else {
							if(cell == null)
								html += "<td class='no-border empty "+r+"_"+c+"'>";
							else{
								html += "<td class='no-border ";
								if(cell['across']) html += hclasses[r][c-1]+" ";hclasses[r][c]=hclasses[r][c-1];
								if(cell['down'])   html += vclasses[r-1][c]+" ";vclasses[r][c]=vclasses[r-1][c];
								html +=  r+"_"+c+"'>";
							}
						}
						if(show_answers  && char != '\xa0') {
							html += ('<input class="solved" id ="input_'+r+'_'+c+'" maxlength="1" value="'+char+'" type="text" tabindex="-1" onfocus="onFocus(\''+ 
							hclasses[r][c]+'\', \''+ vclasses[r][c]+'\')" onblur="onBlur(\''+hclasses[r][c]+'\', \''+ vclasses[r][c]+
							'\')" onkeyup="onKey(\''+hclasses[r][c]+'\', \''+ vclasses[r][c]+'\',\''+cell['char']+'\', \''+r+'\', \''+c+'\')" onclick="onClick(\''+
							hclasses[r][c]+'\', \''+ vclasses[r][c]+'\',\''+r+'\',\''+c+'\')" />');
							total = 0;
						} else if(char != '\xa0'){
							html += ('<input class="'+df+'" id ="input_'+r+'_'+c+'" maxlength="1" value=""         type="text" tabindex="-1" onfocus="onFocus(\''+ 
							hclasses[r][c]+'\', \''+ vclasses[r][c]+'\')"  onblur="onBlur(\''+hclasses[r][c]+'\', \''+ vclasses[r][c]+
							'\')" onkeyup="onKey(\''+hclasses[r][c]+'\', \''+ vclasses[r][c]+'\',\''+cell['char']+'\', \''+r+'\',\''+c+'\')" onclick="onClick(\''+
							hclasses[r][c]+'\', \''+ vclasses[r][c]+'\',\''+r+'\',\''+c+'\')" />');
						}
						switch(label){
							case 1:
								html += ('<span class="word_h">'+(ac-1)+'</span>');
							break;
							case 2:
								html += ('<span class="word_v">'+(dw-1)+'</span>');
							break;
							case 3:
								html += ('<span class="word_h">'+(ac-1)+'</span>');
								html += ('<span class="word_v">'+(dw-1)+'</span>');
							break;
						}
						html+= "</td></div>";
					}
					html += "</tr>";
				}
				cells = total;
				html += "</table></div>";
				html += "<div id = 'legend'>"
				var across = "<div class = across-legend ><h2> HORIZONTALES: </h2>";
				var down = "<div class = down-legend ><h2> VERTICALES: </h2>";
				var n = 1;
				for (var i = 0; i < legend.across.length; i++){
					across += "<span class=\"h_word"+(i+1)+"\">"+n + ".- " + legend.across[i].clue+"</span><br>";
					n++;
				}
				html+=across + '</div>';
				n = 1;
				for (var i = 0; i < legend.down.length; i++){
					down += "<span class=\"v_word"+(i+1)+"\">"+n + ".- " + legend.down[i].clue+"</span><br>";
					n++;
				}
				html+=down + '</div>';
				$(html).appendTo($container);
				$('<div id = checks class=checks><span id=check_text class=check_text>Intentos: 0</span></div>').appendTo($container);
				$('<div class="h5p-question-buttons h5p-question-visible" style="max-height: 3.1875em;">'+
				'<button class="h5p-question-check-answer h5p-joubelui-button" type="button" '+
				'onClick="check()">Check</button></div>').appendTo($container);
			}
			else{
				alert("Por desgracia no se ha podido generar el crucigrama. Por favor, refresque la página.");
			}
		}
	}
		
	CrossWord.prototype = Object.create(EventDispatcher.prototype);
	CrossWord.prototype.constructor = CrossWord;

	return CrossWord;
	
})(H5P.EventDispatcher, H5P.jQuery);