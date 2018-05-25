var svg = document.getElementById("svg_id");

var width = 500;
var height = 200;

svg.setAttribute("width", width);
svg.setAttribute("height", height);

var drawRect = function(){
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", 0);
    rect.setAttribute("y", 0);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("style","fill:white;stroke:black;stroke-width:2;fill-opacity:0.1;stroke-opacity:0.5");
    svg.appendChild(rect);
    return rect;
};

var border = drawRect();

var drawLen = function(x0, y0, x1, y1, xm, ym){
    //postive = convex, negative = concave                                      
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${x0} ${y0} Q ${x1} ${y1} ${xm} ${ym}`);
    path.setAttribute("stroke", "black");
    path.setAttribute("fill", "transparent");
    svg.appendChild(path);
    return path;     
};

var connect = function( x0, x1, y0, y1 ){
    var top = document.createElementNS("http://www.w3.org/2000/svg", "line");
    top.setAttribute("x1", x0);
    top.setAttribute("x2", x1);
    top.setAttribute("stroke", "black");
    top.setAttribute("y1", y0);
    top.setAttribute("y2", y0);
    var bot = document.createElementNS("http://www.w3.org/2000/svg", "line");
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
    if(focalLen < 0){
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

var clear = function(){
    while(svg.firstChild){
	svg.removeChild(svg.firstChild);
    }
    border = drawRect();
}

var button = document.getElementById("clear");
button.addEventListener("click", clear);

drawLens( 10 );
drawLens( -10 );

var convex = function(){
    drawLens( 10 );
};

var concave = function(){
    drawLens( -10 );
};

document.getElementById("convex").addEventListener("click", convex);
document.getElementById("concave").addEventListener("click", concave);
