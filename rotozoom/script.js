var c;
var ctx;
var img;
var w;
var h;
var t = 0;
var f = 0;

function onLoad() {
	console.log("test");
	c = document.getElementById("canvas");
	w = c.width;
	h = c.height;
	ctx = c.getContext("2d");
	generatePattern();
}

function randInt(maxVal) {
	return Math.floor(Math.random()*maxVal);
}

//rgb to css colour
function rgb(r,g,b) {
	return "rgb("+r.toString()+","+g.toString()+","+b.toString()+")";
}

function generatePattern() {
	img = ctx.createImageData(w, h);
	img2 = ctx.createImageData(w, h);
	points = [];
	pointCount = 64;
	for (i = 0; i < pointCount; i++) {
		points.push([randInt(w), randInt(h)]);
	}
	for (x = 0; x < w; x++) {
		for (y = 0; y < h; y++) {
			if (x > 16 && x < w - 16 && y > 16 && y < h - 16) {
				distance = w + h; // make sure that starting distance is greater than maximum possible distance
				point = 0;
				for (i = 0; i < points.length; i++) {
					td = Math.abs(((x - points[i][0]) ** 2 + (y - points[i][1]) ** 2) ** 0.5);
					if (td < distance) {
						distance = td;
						point = i;
					}
				}
				newDist = (256 - distance) * 0.25;
				// multiply and modulo to give random effect
				img2.data[(x + y * w) * 4 + 0] = (((point + 1 + points.length) * 7398) % 256) * (newDist * 4 / 256);
				img2.data[(x + y * w) * 4 + 1] = (((point + 1 + points.length) * 1623) % 256) * (newDist * 4 / 256);
				img2.data[(x + y * w) * 4 + 2] = (((point + 1 + points.length) * 9038) % 256) * (newDist * 4 / 256);
			} else {
				img2.data[(x + y * w) * 4 + 0] = 0;
				img2.data[(x + y * w) * 4 + 1] = 0;
				img2.data[(x + y * w) * 4 + 2] = 0;
			}
			img2.data[(x + y * w) * 4 + 3] = 255;
		}
	}
	//img2 = ctx.getImageData(0,0,w,h);
	setInterval(drawCanvas,16);
	setInterval(showFramerate,1000);
}

function showFramerate() {
	document.getElementById("framerate").innerHTML = f.toString() + " fps";
	f = 0;
}

function drawCanvas() {
	for (x = 0; x < w; x++) {
		for (y = 0; y < h; y++) {
			s = Math.sin(t/100);
			c = Math.cos(t/100);
			nx = Math.floor(((x * c - y * s) * ((Math.sin(t/150)+1)*7+1) + w * 65536) % w);
			ny = Math.floor(((x * s + y * c) * ((Math.sin(t/150)+1)*7+1) + h * 65536) % h);
			img.data[Math.floor(x + y * w) * 4 + 0] = img2.data[Math.floor(nx + ny * w) * 4 + 0];
			img.data[Math.floor(x + y * w) * 4 + 1] = img2.data[Math.floor(nx + ny * w) * 4 + 1];
			img.data[Math.floor(x + y * w) * 4 + 2] = img2.data[Math.floor(nx + ny * w) * 4 + 2];
			img.data[Math.floor(x + y * w) * 4 + 3] = img2.data[Math.floor(nx + ny * w) * 4 + 3];
		}
	}
	ctx.putImageData(img,0,0);
	t++;
	f++;
}
