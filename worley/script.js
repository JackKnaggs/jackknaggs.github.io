var c;
var ctx;
var img;
var w;
var h;

function onLoad() {
	console.log("test");
	c = document.getElementById("canvas");
	w = c.width;
	h = c.height;
	ctx = c.getContext("2d");
	img = ctx.createImageData(w, h);
	drawCanvas();
}

function randInt(maxVal) {
	return Math.floor(Math.random()*maxVal);
}

function drawCanvas() {
	points = [];
	pointCount = parseInt(document.getElementById("points").value);
	document.getElementById("pointCount").innerHTML = pointCount;
	for (i = 0; i < pointCount; i++) {
		points.push([randInt(w), randInt(h)]);
	}
	for (x = 0; x < w; x++) {
		for (y = 0; y < h; y++) {
			distance = w + h; // make sure that starting distance is greater than maximum possible distance
			for (i = 0; i < points.length; i++) {
				td = Math.abs(((x - points[i][0]) ** 2 + (y - points[i][1]) ** 2) ** 0.5);
				if (td < distance) {
					distance = td;
				}
			}
			img.data[(x + y * w) * 4 + 0] = distance * 2;
			img.data[(x + y * w) * 4 + 1] = distance * 2;
			img.data[(x + y * w) * 4 + 2] = distance * 2;
			img.data[(x + y * w) * 4 + 3] = 255;
		}
	}
	ctx.putImageData(img,0,0);
}