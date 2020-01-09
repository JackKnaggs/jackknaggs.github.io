var c; // HTML Canvas Object
var ctx; // Canvas Context
var img; // Output Image
var img2; // Input Image
var w; // Canvas Width
var h; // Canvas Height
var mx = 0; // Mouse X position
var my = 0; // Mouse Y position
var cx = 0; // Canvas X position
var cy = 0; // Canvas Y position
var particles = [[]];
var particleRadius = 4;
var particleCount = 4;
var t = 0; // Total Frames Rendered
var pt = 0;
var f = 0; // Frames Rendered since last check
var pu = 0;
var pr = 64; // Target Physrate
var r = 60; // Target Framerate
var plr = 64; // Previous Target Physrate
var lr = 60; // Previous Target Framerate
var tm = 1.0; // Time Multiplier
var pm = 1.0; // Physics Multiplier
var frameTimer; // setInterval Timer Object
var physTimer;

function getElementPosition(el) {
	const rect = el.getBoundingClientRect();
	return rect.left + window.scrollX, rect.top + window.scrollY;
}

function onLoad() {
	console.log("test");
	c = document.getElementById("canvas");
	w = c.width;
	h = c.height;
	cx, cy = getElementPosition(c);
	console.log(cx,cy);
	ctx = c.getContext("2d");
	reader = new FileReader();
	img = ctx.createImageData(w, h);
	for (i = 0; i < particleCount; i++) {
		particles.push([randInt(w),randInt(h),randInt(8)-4,randInt(8)-4]);
	}
	frameTimer = setInterval(drawCanvas, 1000 / r);
	physTimer = setInterval(physUpdate, 1000 / r);
	setInterval(showFramerate, 1000);
}

function randInt(maxVal) {
	return Math.floor(Math.random() * maxVal);
}

//rgb to css colour
function rgb(r, g, b) {
	return "rgb("+r.toString()+","+g.toString()+","+b.toString()+")";
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
	document.getElementById("physrate").innerHTML = pu.toString() + " pps";
	pu = 0;
	pr = parseInt(document.getElementById("physrateSelect").value);
	if (pr != plr) {
		clearInterval(physTimer);
		frameTimer = setInterval(physUpdate, 1000 / pr);
		pm = 64 / pr;
		pu = pu * (pr / plr);
		plr = pr;
	}
}

function physUpdate() {
	for (particle = 0; particle < particles.length; particle++) {
		nx = Math.abs(particles[particle][0] - mx);
		ny = Math.abs(particles[particle][1] - my);
		md = Math.sqrt(nx * nx + ny * ny);
		pd=md;
		for (particle2 = 0; particle2 < particles.length; particle2++) {
			if (particle != particle2) {
				nx = Math.abs(particles[particle][0] - particles[particle2][0]);
				ny = Math.abs(particles[particle][1] - particles[particle2][1]);
				if (nx + ny <= particleRadius * 2) {
					pd = Math.min(Math.sqrt(nx * nx + ny * ny), pd);
				}
			}
		}
		//console.log(pd);
		particles[particle][2] -= (particles[particle][0] - mx)/(md/4) / pr;
		particles[particle][3] -= (particles[particle][1] - my)/(md/4) / pr;
		particles[particle][2] *= 1 - 0.05 * pm;
		particles[particle][3] *= 1 - 0.05 * pm;
		if (pd < particleRadius * 2) {
			particles[particle][2] = -particles[particle][2] * 1.1 + Math.random() - 0.5;
			particles[particle][3] = -particles[particle][3] * 1.1 + Math.random() - 0.5;
		}
		particles[particle][0] += particles[particle][2];
		particles[particle][1] += particles[particle][3];
		if (particles[particle][0] < 0) {
			particles[particle][0] = 0;
			particles[particle][2] = Math.abs(particles[particle][2]);
		}
		if (particles[particle][1] < 0) {
			particles[particle][1] = 0;
			particles[particle][3] = Math.abs(particles[particle][3]);
		}
		if (particles[particle][0] > w-1) {
			particles[particle][0] = w-1;
			particles[particle][2] = -Math.abs(particles[particle][2]);
		}
		if (particles[particle][1] > h-1) {
			particles[particle][1] = h-1;
			particles[particle][3] = -Math.abs(particles[particle][3]);
		}
		//console.log(particles);
	}
	pu++;
	pt++;
}

function drawCanvas() {
	for (x = 0; x < w; x++) {
		for (y = 0; y < h; y++) {
			pixelVal = false;
			for (particle = 0; particle < particles.length; particle++) {
				nx = Math.abs(particles[particle][0] - x);
				ny = Math.abs(particles[particle][1] - y);
				if (nx + ny <= particleRadius * 2) {
					md = Math.sqrt(nx * nx + ny * ny);
					pixelVal = (md < particleRadius) || pixelVal //Math.max(255 - md,0)
				}
			}
			//img.data[Math.floor(x + y * w) * 4 + 0] = 0;
			//img.data[Math.floor(x + y * w) * 4 + 1] = 0;
			//img.data[Math.floor(x + y * w) * 4 + 2] = 0;
			img.data[Math.floor(x + y * w) * 4 + 3] = pixelVal * 255;
		}
	}
	ctx.putImageData(img, 0, 0);
	t++;
	f++;
}

addEventListener('mousemove', (function(e) {
	mx = Math.floor(e.pageX - cx);
	my = Math.floor(e.pageY - cy);
	//console.log(mx,my);
}), false);