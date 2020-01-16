var c; // HTML Canvas Object
var ctx; // Canvas Context
var img; // Output Image
var img2; // Input Image
var w; // Canvas Width
var h; // Canvas Height
var t = 0; // Total Frames Rendered
var f = 0; // Frames Rendered since last check
var r = 60; // Target Framerate
var lr = 60; // Previous Target Framerate
var tm = 1.0; // Time Multiplier
var frameTimer; // setInterval Timer Object
var reader;

function onLoad() {
	console.log("test");
	c = document.getElementById("canvas");
	w = c.width;
	h = c.height;
	ctx = c.getContext("2d");
	reader = new FileReader();
	generatePattern();
}

function randInt(maxVal) {
	return Math.floor(Math.random() * maxVal);
}

//rgb to css colour
function rgb(r, g, b) {
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
				img2.data[(x + y * w) * 4 + 3] = 255;
			} else {
				img2.data[(x + y * w) * 4 + 0] = 0;
				img2.data[(x + y * w) * 4 + 1] = 0;
				img2.data[(x + y * w) * 4 + 2] = 0;
				img2.data[(x + y * w) * 4 + 3] = 0;
			}
		}
	}
	r = parseInt(document.getElementById("framerateSelect").value);
	frameTimer = setInterval(drawCanvas, 1000 / r);
	setInterval(showFramerate, 1000);
}

function generateImage() {
	srcImg = document.getElementById("srcImg").files[0];
	if (!srcImg.type.match('image.*')) {return;}
	clearInterval(frameTimer);
	ctx.clearRect(0, 0, w, h);
	reader.onload = (function(imgFile) {
		return function(e) {
			texture = document.getElementById("texture");
			texture.src = e.target.result;
		};
	})(srcImg);
	reader.readAsDataURL(srcImg);
	ctx.imageSmoothingEnabled = false; //disable interpolation when scaling images
	ctx.drawImage(texture, 0, 0, w, h);
	img2 = ctx.getImageData(0, 0, w, h);
	frameTimer = setInterval(drawCanvas, 1000 / r);
}

function showFramerate() {
	document.getElementById("framerate").innerHTML = f.toString() + " fps";
	f = 0;
	r = parseInt(document.getElementById("framerateSelect").value);
	if (r != lr) {
		clearInterval(frameTimer);
		frameTimer = setInterval(drawCanvas, 1000 / r);
		tm = 60 / r;
		t = t * (r / lr);
		lr = r;
	}
}

function drawCanvas() {
	s = Math.sin(t / 100 * tm);
	c = Math.cos(t / 100 * tm);
	for (x = -w/2; x < w/2; x++) {
		for (y = -h/2; y < h/2; y++) {
			tx = x - w/2;
			ty = y + h/2
			nx = Math.floor((((x * c - y * s) * ((Math.sin(t / 150 * tm) + 1) * 7 + 1) + w * 65536) - w/2) % w);
			ny = Math.floor((((x * s + y * c) * ((Math.sin(t / 150 * tm) + 1) * 7 + 1) + h * 65536) - h/2) % h);
			img.data[Math.floor(tx + ty * w) * 4 + 0] = img2.data[Math.floor(nx + ny * w) * 4 + 0];
			img.data[Math.floor(tx + ty * w) * 4 + 1] = img2.data[Math.floor(nx + ny * w) * 4 + 1];
			img.data[Math.floor(tx + ty * w) * 4 + 2] = img2.data[Math.floor(nx + ny * w) * 4 + 2];
			img.data[Math.floor(tx + ty * w) * 4 + 3] = img2.data[Math.floor(nx + ny * w) * 4 + 3];
		}
	}
	ctx.putImageData(img, 0, 0);
	t++;
	f++;
}
