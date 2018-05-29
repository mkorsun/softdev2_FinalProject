var ns = "http://www.w3.org/2000/svg";
var sign = null; //Sign to multiply focal length by depending on concave or convex
var focus = null; //focal length
var oDist = null; //Distance of object from lens
var oHeight = null; //height of object relative to principal axis
var iDist = null; //Distance of image from lens
var iHeight = null; //height of image relative to principal axis

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

//SVG DIMENSIONS ===============================================================================
var width = 1280;
var height = 720;

//DRAWING FUNCTIONS ===============================================================================

var drawEnvironment = function(){
    clear(); //clear screen for drawing
    drawRect();//draw outline of svg
    drawPrincipal();
    drawMidLine();
    if(sign != null){//if lens type is selected
        if(focus != null && focus != 0){//if the focus isnt null or zero, draw the lens and check the object dimensions
            drawLens(focus*sign);
            if(oDist != null && oDist != 0 && oHeight != null && oHeight != 0){ // if the object dimensions arent null or zero, draw the object, the rays, 
                drawObject();
                drawImage();
                //drawRays(); //UNCOMMENT ONCE LOGIC IS SORTED WITH THE FUNCTION
            }else{
                console.log("Object distance or height is null or zero");
            }
        } else{
            console.log("Focus is null or zero");
        }
    } else{
        console.log("Lens type not selected");
    }
}

var drawRect = function(){
    var rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", 0);
    rect.setAttribute("y", 0);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("style","fill:white;stroke:black;stroke-width:2;fill-opacity:0.1;stroke-opacity:0.5");
    svg.appendChild(rect);
    return rect;
};

var drawPrincipal = function(){
    var line = document.createElementNS(ns, "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", height/2);
    line.setAttribute("x2", width);
    line.setAttribute("y2", height/2);
    line.setAttribute("stroke-dasharray", "5, 5");
    line.setAttribute("style", "stroke:black;strike-wdith:2;");
    svg.appendChild(line);
    return line;
}

var drawMidLine = function(){
    var line = document.createElementNS(ns, "line");
    line.setAttribute("x1", width/2);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", width/2);
    line.setAttribute("y2", height);
    line.setAttribute("stroke-dasharray", "5, 5");
    line.setAttribute("style", "stroke:black;strike-wdith:2;");
    svg.appendChild(line);
    return line;
}

var drawObject = function(){
    //createDefs();
    var line = document.createElementNS(ns, "line");
    line.setAttribute("x1", width/2-oDist);
    line.setAttribute("y1", height/2);
    line.setAttribute("x2", width/2-oDist);
    line.setAttribute("y2", height/2 - oHeight);
    line.setAttribute("style", "stroke:black;strike-wdith:4;");
   // line.setAttribute("marker-end", "url(#arrowhead)");
    svg.appendChild(line);
    return line;
}

var drawImage = function(){
    calculateImageValues();
    var line = document.createElementNS(ns, "line");
    line.setAttribute("x1", width/2+iDist);
    line.setAttribute("y1", height/2);
    line.setAttribute("x2", width/2+iDist);
    line.setAttribute("y2", height/2 - iHeight);
    line.setAttribute("style", "stroke:black;strike-wdith:4;");
   // line.setAttribute("marker-end", "url(#arrowhead)");
    svg.appendChild(line);
    return line;
}

var drawRays = function(){
    //FIRST PART OF RAY
    var parallelRay = document.createElementNS(ns, "line");
    var centerRay = document.createElementNS(ns, "line");
    var focusRay = document.createElementNS(ns, "line");
    
    //set initial point to the object point
    parallelRay.setAttribute("x1", width/2-oDist);
    parallelRay.setAttribute("y1", height/2 - oHeight);
    centerRay.setAttribute("x1", width/2-oDist);
    centerRay.setAttribute("y1", height/2 - oHeight);
    focusRay.setAttribute("x1", width/2-oDist);
    focusRay.setAttribute("y1", height/2 - oHeight);
    
    //For first part of parallel ray, draw horizontally to the center
    parallelRay.setAttribute("x2", width/2);
    parallelRay.setAttribute("y2", height/2 - oHeight);

    //for for first part of center ray, draw the arrow straight to the image
    centerRay.setAttribute("x2", width/2+iDist);
    centerRay.setAttribute("y2", height/2 - iHeight);

    //for first part of focus ray, draw to the intersection of ray with center
    focusRay.setAttribute("x2", );
    focusRay.setAttribute("y2", );

    //set style
    parallelRay.setAttribute("style", "stroke:black;strike-wdith:2;");
    centerRay.setAttribute("style", "stroke:black;strike-wdith:2;");
    focusRay.setAttribute("style", "stroke:black;strike-wdith:2;");

    svg.appendChild(parallelRay);
    svg.appendChild(centerRay);
    svg.appendChild(focusRay);

    //SECOND PART OF RAY
    parallelRay = document.createElementNS(ns, "line");
    centerRay = document.createElementNS(ns, "line");
    focusRay = document.createElementNS(ns, "line");

    //set starting coords to the end points of the last lines

    //for second part of parallel ray, draw through the focus

    //for second part of center ray, continue it out of frame

    //for second part of focus ray, continue parallel to intersection point

    //set style
    parallelRay.setAttribute("style", "stroke:black;strike-wdith:2;");
    centerRay.setAttribute("style", "stroke:black;strike-wdith:2;");
    focusRay.setAttribute("style", "stroke:black;strike-wdith:2;");

    svg.appendChild(parallelRay);
    svg.appendChild(centerRay);
    svg.appendChild(focusRay);
}

var drawLen = function(x0, y0, x1, y1, xm, ym){
    //postive = convex, negative = concave                                      
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", `M${x0} ${y0} Q ${x1} ${y1} ${xm} ${ym}`);
    path.setAttribute("stroke", "black");
    path.setAttribute("fill", "transparent");
    svg.appendChild(path);
    return path;     
};

var connect = function( x0, x1, y0, y1 ){
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
    svg.appendChild(top);
    svg.appendChild(bot);
};

var drawLens = function(focalLen){
    let center = width/2;
    let mid = height/2;
    let top = 10;
    let bot = height - top;
    if(focalLen > 0){
        let offset = 15;
        drawLen( center, top, center + offset, mid, center, bot );
        drawLen( center, top, center - offset, mid, center, bot );
    }
    else{
        let outerOffset = 10;
        let innerOffset = -5;
        drawLen( center + outerOffset, top, center + innerOffset, mid, center + outerOffset, bot);
        drawLen( center - outerOffset, top, center - innerOffset, mid, center - outerOffset, bot);
	connect( center + outerOffset, center - outerOffset, top, bot);
    }
};

//EVENT HANDLERS ===============================================================================

var save = function(e){
    //code for ajax call sending over diagram data
}

var download = function(e){
    //downloads svg
}

var swapSign = function(e){
    if(convex.checked){
        sign = 1;
    }
    else{
        sign = -1;
    }
    drawEnvironment();
}

var updateFocus = function(e){
    console.log(isFloat(focusBox.value));
    if(isFloat(focusBox.value)){
        focus = parseFloat(focusBox.value);
    }
    drawEnvironment();
}

var updateODist = function(e){
    if(isFloat(oDistBox.value)){
        oDist = parseFloat(oDistBox.value);
    }
    drawEnvironment();
}

var updateOHeight = function(e){
    if(isFloat(oHeightBox.value)){
        oHeight = parseFloat(oHeightBox.value);
    }
    drawEnvironment();
}

// HELPER FUNCTIONS ===============================================================================

//deletes everything on the screen
var clear = function(){
    while(svg.firstChild){
	svg.removeChild(svg.firstChild);
    }
}

//returns true if something is a float
var isFloat = function(input){
    var val = parseFloat(val);
    if(val = NaN){
        return false;
    }
    return true;
}

var printValues = function(){
    console.log("Sign: " + sign);
    console.log("Focus: " + focus);
    console.log("Object Distance: " + oDist);
    console.log("Object Height: " + oHeight);
}

var setEventListeners = function(){
    saveButton.addEventListener("click", save);
    downloadButton.addEventListener("click", download);
    radioDiv.addEventListener("click", swapSign);
    focusBox.addEventListener("input", updateFocus);
    oDistBox.addEventListener("input", updateODist);
    oHeightBox.addEventListener("input", updateOHeight);
}

var calculateImageValues = function(){
    iDist = (1/(1/(sign*focus))-(1/oDist));
    iHeight = -(iDist/oDist) * oHeight;
    iDistBox.value = iDist;
    iHeightBox.value = iHeight;
}

var createDefs = function(){
    svg.appendChild(
        document.createElementNS(ns, "defs").appendChild(
            document.createElementNS(ns, "marker").setAttribute("id", "arrowhead").setAttribute("markerWidth", "10").setAttribute("markerHeight", "7").setAttribute("refX", "0").setAttribute("refY", "3.5").setAttribute("orient", "auto").appendChild(
                createElementNS(ns, "polyon").setAttribute("points", "0 0, 10 3.5, 0 7"))));
}

//CODE ===============================================================================

//set width and height of svg
svg.setAttribute("width", width);
svg.setAttribute("height", height);

setEventListeners();
drawEnvironment();