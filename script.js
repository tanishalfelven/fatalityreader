/**
 * Pull data from https://www.osha.gov/dep/fatcat/FatalitiesFY10.csv
 * and return as array.
 */
var data;
var index = 1;
var set_index = false;
function loadOSHAData() {
	$.ajax({
		url: "FatalitiesFY10.csv",
		async: false,
		success: function(csvd) {
			data = $.csv.toArrays(csvd);
		},
		dataType: "text",
		complete: displayData
	})
}

function parseGETVar(val) {
    var result = undefined,
        tmp = [];
    location.search
    //.replace ( "?", "" ) 
    // this is better, there might be a question mark inside
    .substr(1)
        .split("&")
        .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

function asDateObj(date) {
	var d = date.split("/");
	return new Date(d[2], d[0], d[1]);
};

function displayData() {
	if (!set_index) {
		var get = parseGETVar('date');
		if (get) {
			var begin = asDateObj(get);
			for (var i = 0; i < data.length; i++) {
				if (asDateObj(data[i][2]).getTime() >= begin.getTime()) {
					index = i;
					console.log("!");
					break;
				}
			}
		}
		set_index = true;
	}

	var stop = index + 10;
	if (stop > data.length) stop = data.length;
	for (;index < stop; index++) {
		displayTidbit(data[index]);
	}
}

function displayTidbit(record) {
	var tidbit = "\
<div id='"+index+"' class='tidbit'> \
<div class='desc'>"+record[4]+"</div>\
<div class='company'>"+record[3]+"</div>\
<div class='date'>"+record[2]+"</div></div>";

	$("#tidbits").append(tidbit);
}

$(document).ready(function() {
	$("#datepicker").datepicker();
	$("#datepicker").datepicker("option", "dateFormat", "mm/dd/y");
	var current = "06/09/09";
	if (parseGETVar("date")) {
		current = parseGETVar("date");
	}
	$("#datepicker").datepicker("setDate", current);
	$("#Go").click(function() {
		window.location.replace(document.location.origin + "?date="+$('#datepicker').val());
	});
	loadOSHAData();

	setInterval(function() {
		var totalHeight, currentScroll, visibleHeight;
  
		if (document.documentElement.scrollTop){
			currentScroll = document.documentElement.scrollTop;
		} else { 
			currentScroll = document.body.scrollTop; 
		}

		totalHeight = document.body.offsetHeight;
		visibleHeight = document.documentElement.clientHeight;

		if (totalHeight <= currentScroll + visibleHeight) {
			displayData();
		}
	}, 100)
});