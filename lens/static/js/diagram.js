var ns = "http://www.w3.org/2000/svg";
var sign = null; //Sign to multiply focal length by depending on concave or convex
var focus = null; //focal length
var oDist = null; //Distance of object from lens
var oHeight = null; //height of object relative to principal axis
var iDist = null; //Distance of image from lens
var iHeight = null; //height of image relative to principal axis
var height;
var width;
var diagram;
var extension = 10000;

//DOM ELEMENTS ===============================================================================
var svg = document.getElementById("svg_id");
var saveButton = document.getElementById("save");
var downloadButton = document.getElementById("download");
var radioDiv = document.getElementById("radioDiv");
var concave = document.getElementById("concave");
var convex = document.getElementById("convex");
var focusBox = document.getElementById("focus");
var oDistBox = document.getElementById("oDist");
var oHeightBox = document.getElementById("oHeight");
var iDistBox = document.getElementById("iDist");
var iHeightBox = document.getElementById("iHeight");
var svgContainer = document.getElementById("container");
var viewport; //transformation window
var canvas = document.querySelector('canvas'); //used for downloading

//DRAWING FUNCTIONS ===============================================================================

var drawEnvironment = function () {
    clear(); //clear screen for drawing
    drawPrincipal();
    drawMidLine();
    if (sign != null) {//if lens type is selected
        if (focus != null && focus != 0) {//if the focus isnt null or zero, draw the lens and check the object dimensions
            drawLens(focus * sign);
            drawFocusMarks();
            if (oDist != null && oDist != 0 && oHeight != null && oHeight != 0) { // if the object dimensions arent null or zero, draw the object, the rays, 
                drawObject();
                drawImage();
                drawRays();
            } else {
                console.log("Object distance or height is null or zero");
            }
        } else {
            console.log("Focus is null or zero");
        }
    } else {
        console.log("Lens type not selected");
    }
}

var drawPrincipal = function () {
    addLine(-1*extension, height/2, extension, height/2, true, false);
}

var drawMidLine = function () {
    addLine(width/2, -1*extension, width/2, extension, true, false);
}

var drawObject = function () {
    addLine(width / 2 - oDist, height / 2, width / 2 - oDist, height / 2 - oHeight, false, true);
}

var drawFocusMarks = function () {
    var notchHeight = 5; //height above the principal axis
    var textOffset = 20;//scale of text below principal axis
    var notch = document.createElementNS(ns, 'line');
    var text = document.createElementNS(ns, 'text');
    text.setAttribute('x', width / 2 - focus);
    text.setAttribute('y', height / 2 + textOffset);
    text.setAttribute('fill', 'black');
    text.textContent = 'F';
    notch.setAttribute("x1", width / 2 - focus);
    notch.setAttribute("y1", height / 2 + notchHeight);
    notch.setAttribute("x2", width / 2 - focus);
    notch.setAttribute("y2", height / 2 - notchHeight);
    notch.setAttribute("style", "stroke:black;stroke-width:2;");
    viewport.appendChild(notch);
    viewport.appendChild(text);

    notch = document.createElementNS(ns, 'line');
    text = document.createElementNS(ns, 'text');
    text.setAttribute('x', width / 2 + (focus));
    text.setAttribute('y', height / 2 + textOffset);
    text.setAttribute('fill', 'black');
    text.textContent = 'F';
    notch.setAttribute("x1", width / 2 + focus);
    notch.setAttribute("y1", height / 2 + notchHeight);
    notch.setAttribute("x2", width / 2 + focus);
    notch.setAttribute("y2", height / 2 - notchHeight);
    notch.setAttribute("style", "stroke:black;stroke-width:2;");
    viewport.appendChild(notch);
    viewport.appendChild(text);

    notch = document.createElementNS(ns, 'line');
    text = document.createElementNS(ns, 'text');
    text.setAttribute('x', width / 2 - (2 * focus));
    text.setAttribute('y', height / 2 + textOffset);
    text.setAttribute('fill', 'black');
    text.textContent = '2F';
    notch.setAttribute("x1", width / 2 - 2 * focus);
    notch.setAttribute("y1", height / 2 + notchHeight);
    notch.setAttribute("x2", width / 2 - 2 * focus);
    notch.setAttribute("y2", height / 2 - notchHeight);
    notch.setAttribute("style", "stroke:black;stroke-width:2;");
    viewport.appendChild(notch);
    viewport.appendChild(text);

    notch = document.createElementNS(ns, 'line');
    text = document.createElementNS(ns, 'text');
    text.setAttribute('x', width / 2 + (2 * focus));
    text.setAttribute('y', height / 2 + textOffset);
    text.setAttribute('fill', 'black');
    text.textContent = '2F';
    notch.setAttribute("x1", width / 2 + 2 * focus);
    notch.setAttribute("y1", height / 2 + notchHeight);
    notch.setAttribute("x2", width / 2 + 2 * focus);
    notch.setAttribute("y2", height / 2 - notchHeight);
    notch.setAttribute("style", "stroke:black;stroke-width:2;");
    viewport.appendChild(notch);
    viewport.appendChild(text);
}

var drawImage = function () {
    calculateImageValues();
    addLine(width / 2 + iDist, height / 2, width / 2 + iDist, height / 2 - iHeight, false, true);
}

var drawRays = function () {
    var coords;
    var intersection;
    var oX = width / 2 - oDist;
    var oY = height / 2 - oHeight;
    var iX = width / 2 + iDist;
    var iY = height / 2 - iHeight;

    //Center Rays
    intersection = findIntersection(oX, oY, width/2, height/2, extension);//intersection point for line going through center from object
    addLine(oX, oY, intersection[0], intersection[1], false, false);//line extending "infinitely" through center
    intersection = findIntersection(oX, oY, width/2, height/2, -1*extension);//Intersection backtracing
    addLine(oX, oY, intersection[0], intersection[1], true, false);


    //parallel to focus rays
    addLine(oX, oY, width/2, oY, false, false); //line parallel to center
    intersection = findIntersection(width/2, oY, width/2 + focus*sign, height/2, extension);
    addLine(width/2, oY, intersection[0], intersection[1], false, false);//through focus ray
    intersection = findIntersection(width/2, oY, width/2 + focus*sign, height/2, -1*extension);
    addLine(width/2, oY, intersection[0], intersection[1], true, false);//false ray

    //focus to parallel rays
    intersection = findIntersection(oX, oY, width/2 - focus*sign, height/2, width/2);
    addLine(oX, oY, intersection[0], intersection[1], false, false);//through focus to center
    addLine(intersection[0], intersection[1], -1*extension, intersection[1], true, false);//false parallel
    addLine(intersection[0], intersection[1], extension, intersection[1], false, false);//true parallel

}

var drawLen = function (x0, y0, x1, y1, xm, ym) {
    //postive = convex, negative = concave                                      
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", `M${x0} ${y0} Q ${x1} ${y1} ${xm} ${ym}`);
    path.setAttribute("stroke", "black");
    path.setAttribute("fill", "transparent");
    viewport.appendChild(path);
    return path;
};

var connect = function (x0, x1, y0, y1) {
    var top = document.createElementNS(ns, "line");
    top.setAttribute("x1", x0);
    top.setAttribute("x2", x1);
    top.setAttribute("stroke", "black");
    top.setAttribute("y1", y0);
    top.setAttribute("y2", y0);
    var bot = document.createElementNS(ns, "line");
    bot.setAttribute("x1", x0);
    bot.setAttribute("x2", x1);
    bot.setAttribute("stroke", "black");
    bot.setAttribute("y1", y1);
    bot.setAttribute("y2", y1);
    viewport.appendChild(top);
    viewport.appendChild(bot);
};

var drawLens = function (focalLen) {
    let center = width / 2;
    let mid = height / 2;
    let top = 10;
    let bot = height - top;
    if (focalLen > 0) {
        let offset = 15;
        drawLen(center, top, center + offset, mid, center, bot);
        drawLen(center, top, center - offset, mid, center, bot);
    }
    else {
        let outerOffset = 10;
        let innerOffset = -5;
        drawLen(center + outerOffset, top, center + innerOffset, mid, center + outerOffset, bot);
        drawLen(center - outerOffset, top, center - innerOffset, mid, center - outerOffset, bot);
        connect(center + outerOffset, center - outerOffset, top, bot);
    }
};

//EVENT HANDLERS ===============================================================================

//converts svg to png and triggers download event
var download = function (e) {
    var canvas = document.getElementById('canvas');
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    var ctx = canvas.getContext('2d');
    var data = (new XMLSerializer()).serializeToString(svg);
    var DOMURL = window.URL || window.webkitURL || window;

    var img = new Image();
    var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    var url = DOMURL.createObjectURL(svgBlob);

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);

        var imgURI = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');

        triggerDownload(imgURI);
    };

    img.src = url;
}

var swapSign = function (e) {
    if (convex.checked) {
        sign = 1;
    }
    else {
        sign = -1;
    }
    drawEnvironment();
}

var updateFocus = function (e) {
    if (isFloat(focusBox.value)) {
        focus = parseFloat(focusBox.value);
    }
    drawEnvironment();
}

var updateODist = function (e) {
    if (isFloat(oDistBox.value)) {
        oDist = parseFloat(oDistBox.value);
    }
    drawEnvironment();
}

var updateOHeight = function (e) {
    if (isFloat(oHeightBox.value)) {
        oHeight = parseFloat(oHeightBox.value);
    }
    drawEnvironment();
}

// HELPER FUNCTIONS ===============================================================================

//deletes everything on the screen
var clear = function () {
    while (viewport.firstChild) {
        viewport.removeChild(viewport.firstChild);
    }
}

//returns true if something is a float
var isFloat = function (input) {
    var val = parseFloat(val);
    if (val = NaN) {
        return false;
    }
    return true;
}

var addLine = function(x1, y1, x2, y2, isDashed, isArrow){
    var line = document.createElementNS(ns, "line");
    line.setAttribute("style", "stroke:black;stroke-width:2;");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    if(isArrow){
        line.setAttribute("marker-end", "url(#arrowhead)");
    }
    if(isDashed){
        line.setAttribute("stroke-dasharray", "3, 3");
    }
    viewport.appendChild(line);
}

var printValues = function () {
    console.log("Sign: " + sign);
    console.log("Focus: " + focus);
    console.log("Object Distance: " + oDist);
    console.log("Object Height: " + oHeight);
}

var setEventListeners = function () {
    if(username){
	saveButton.addEventListener("click", save);
    }
    downloadButton.addEventListener("click", download);
    radioDiv.addEventListener("click", swapSign);
    concave.addEventListener("click", swapSign);
    convex.addEventListener("click", swapSign);
    focusBox.addEventListener("input", updateFocus);
    oDistBox.addEventListener("input", updateODist);
    oHeightBox.addEventListener("input", updateOHeight);
}

var calculateImageValues = function () {
    iDist = ((sign * focus)**-1 - oDist**-1)**-1;
    iHeight = -(iDist / oDist) * oHeight;
    iDistBox.value = iDist;
    iHeightBox.value = iHeight;
}

var createDefs = function () {
    var defs = document.createElementNS(ns, "defs");
    var marker = document.createElementNS(ns, "marker");
    marker.setAttribute("viewBox", "-6 -6 12 12");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "5");
    marker.setAttribute("markerHeight", "5");
    marker.setAttribute("refX", "3");
    marker.setAttribute("refY", "0");
    marker.setAttribute("orient", "auto");
    var polygon = document.createElementNS(ns, "polygon");
    polygon.setAttribute("points", "-2,0 -5,5 5,0 -5,-5");//"0 0, 10 3.5, 0 7"
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);
}

//returns the (x, y) for the intersection of the vertical line y=x and line that passes through (x1, y1) and (x2, y2)
var findIntersection = function (x1, y1, x2, y2, x) {
    var slope = (y2 - y1) / (x2 - x1);
    return [x, slope * (x - x1) + y1];
}

//triggers download event in order to download the svg->png
var triggerDownload = function (imgURI) {
    var evt = new MouseEvent('click', {
        view: window,
        bubbles: false,
        cancelable: true
    });

    var a = document.createElement('a');
    a.setAttribute('download', 'diagram.png');
    a.setAttribute('href', imgURI);
    a.setAttribute('target', '_blank');

    a.dispatchEvent(evt);
}

//CODE ===============================================================================
svg.addEventListener('load', function () {
    diagram = svgPanZoom('#svg_id', { zoomEnabled: true, controlIconsEnabled: true, fit: true, center: true, maxZoom: 100, minZoom: -5 });
    window.addEventListener("resize", function () { diagram.resize(); diagram.fit(); diagram.center(); });
    viewport = document.getElementsByClassName("svg-pan-zoom_viewport")[0];
    createDefs();
    setEventListeners();
    width = diagram.getSizes().width;
    height = diagram.getSizes().height;
    drawEnvironment();
});

$(document).ready(function () {

    $("#sidebar").mCustomScrollbar({
          theme: "minimal"
    });

    $('#sidebarCollapse').on('click', function () {
          // open or close navbar
          $('#sidebar').toggleClass('active');
          // close dropdowns
          $('.collapse.in').toggleClass('in');
          // and also adjust aria-expanded attributes we use for the open/closed arrows
          // in our CSS
          $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

});
