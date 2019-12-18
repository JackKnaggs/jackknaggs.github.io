var c;
var ctx;
var img;
var w;
var h;
var points;

function onLoad() {
	console.log("test");
	c = document.getElementById("canvas");
	w = c.width;
	h = c.height;
	ctx = c.getContext("2d");
	img = ctx.createImageData(w, h);
	generateVoronoi();
}

function randInt(maxVal) {
	return Math.floor(Math.random()*maxVal);
}

function generateVoronoi() {
	points = [];
	pointCount = parseInt(document.getElementById("points").value);
	document.getElementById("pointCount").innerHTML = pointCount;
	for (i = 0; i < pointCount; i++) {
		points.push([randInt(w), randInt(h)]);
	}
	drawCanvas();
}

function drawCanvas() {
	invDist = document.getElementById("invDist").checked;
	for (x = 0; x < w; x++) {
		for (y = 0; y < h; y++) {
			distance = w + h; // make sure that starting distance is greater than maximum possible distance
			point = 0;
			for (i = 0; i < points.length; i++) {
				td = Math.abs(((x - points[i][0]) ** 2 + (y - points[i][1]) ** 2) ** 0.5);
				if (td < distance) {
					distance = td;
					point = i;
				}
			}
			if (invDist) {
				newDist = (256 - distance) * 0.25;
			} else {
				newDist = distance;
			}
			// multiply and modulo to give random effect
			img.data[(x + y * w) * 4 + 0] = (((point + 1 + points.length) * 7398) % 256) * (newDist * 4 / 256);
			img.data[(x + y * w) * 4 + 1] = (((point + 1 + points.length) * 1623) % 256) * (newDist * 4 / 256);
			img.data[(x + y * w) * 4 + 2] = (((point + 1 + points.length) * 9038) % 256) * (newDist * 4 / 256);
			img.data[(x + y * w) * 4 + 3] = 255;
		}
	}
	ctx.putImageData(img,0,0);
}
