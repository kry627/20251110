let minSide;
let objs = [];
let colors = ['#ed3441', '#ffd630', '#329fe3', '#08AC7E', '#DED9DF', '#FE4D03'];

function setup() {
	createCanvas(windowWidth, windowHeight);
	minSide = min(width, height);
	rectMode(CENTER);
}

// --- side menu interaction ---
let sideMenuEl;
let menuOpen = false;
let menuHover = false;
let menuListenersAttached = false;

function _ensureSideMenu() {
  if (!sideMenuEl) {
    sideMenuEl = document.getElementById('sideMenu');
  }
}

function openMenu() {
	_ensureSideMenu();
	if (sideMenuEl && !menuOpen) {
		sideMenuEl.classList.add('open');
		menuOpen = true;
		let c = document.querySelector('canvas');
		if (c) c.classList.add('menu-open-block');
	}
}

function closeMenu() {
	_ensureSideMenu();
	// don't close while pointer is hovering over the menu unless forced
	if (sideMenuEl && menuOpen && !menuHover) {
		sideMenuEl.classList.remove('open');
		menuOpen = false;
		let c = document.querySelector('canvas');
		if (c) c.classList.remove('menu-open-block');
	}
}

// pointer/touch fallback: watch window pointer moves so menu opens even when mouse is outside canvas
function _attachMenuListeners() {
	if (!sideMenuEl || menuListenersAttached) return;
	menuListenersAttached = true;

	// keep menu open while pointer is inside the menu
	sideMenuEl.addEventListener('pointerenter', () => {
		menuHover = true;
		openMenu();
	});
	sideMenuEl.addEventListener('pointerleave', () => {
		menuHover = false;
		// close only if pointer is not in the left zone
		// pointermove handler will call closeMenu when appropriate
		setTimeout(() => {
			// small timeout to avoid flicker when moving quickly
			if (!menuHover) closeMenu();
		}, 10);
	});

	// touch inside menu keeps it open
	sideMenuEl.addEventListener('touchstart', () => {
		menuHover = true;
		openMenu();
	});
	sideMenuEl.addEventListener('touchend', () => {
		menuHover = false;
		setTimeout(() => { if (!menuHover) closeMenu(); }, 10);
	});
}

window.addEventListener('pointermove', (e) => {
	// clientX is relative to viewport left edge
	// ensure element and listeners attached
	_ensureSideMenu();
	if (sideMenuEl) _attachMenuListeners();

	if (e.clientX <= 100 || menuHover) {
		openMenu();
	} else {
		closeMenu();
	}
});

// touch support: also open on touchstart near left edge
window.addEventListener('touchstart', (e) => {
	_ensureSideMenu();
	if (sideMenuEl) _attachMenuListeners();
	if (e.touches && e.touches[0]) {
		if (e.touches[0].clientX <= 100) {
			openMenu();
		}
	}
});

// --- iframe open/close for "第一單元作品" ---
let iframeOverlayEl;
let contentFrameEl;

function _ensureIframeEls() {
	if (!iframeOverlayEl) iframeOverlayEl = document.getElementById('iframeOverlay');
	if (!contentFrameEl) contentFrameEl = document.getElementById('contentFrame');
}

function openIframe(url) {
	_ensureIframeEls();
	if (!iframeOverlayEl || !contentFrameEl) return;
	contentFrameEl.src = url;
	iframeOverlayEl.classList.add('open');
	// ensure canvas doesn't intercept clicks while iframe is open
	let c = document.querySelector('canvas');
	if (c) c.classList.add('menu-open-block');
}

function closeIframe() {
	_ensureIframeEls();
	if (!iframeOverlayEl || !contentFrameEl) return;
	iframeOverlayEl.classList.remove('open');
	// clear src to stop playback/scripts in iframe
	contentFrameEl.src = '';
	let c = document.querySelector('canvas');
	if (c) c.classList.remove('menu-open-block');
}

function _attachIframeControls() {
	_ensureIframeEls();
		const link = document.getElementById('open-projects');
		const handout = document.getElementById('open-handout');
		const test3 = document.getElementById('open-test3');
		const testnote = document.getElementById('open-testnote');
		const tku = document.getElementById('open-tku');
		const midterm = document.getElementById('open-midterm');
		const etdept = document.getElementById('open-et');
		const closeBtn = document.getElementById('iframeClose');
		if (link) {
			link.addEventListener('click', (e) => {
				e.preventDefault();
					openIframe('https://kry627.github.io/20251020/');
				// keep menu open or close depending on preference; we'll close menu to focus on iframe
				closeMenu();
			});
		}
		if (handout) {
			handout.addEventListener('click', (e) => {
				e.preventDefault();
				openIframe('https://hackmd.io/@9AnKkXToQiSXcq7r78pFYQ/S1RJuQRjlx');
				closeMenu();
			});
		}
		if (test3) {
			test3.addEventListener('click', (e) => {
				e.preventDefault();
				openIframe('https://kry627.github.io/20251103/');
				closeMenu();
			});
		}
		if (testnote) {
			testnote.addEventListener('click', (e) => {
				e.preventDefault();
				openIframe('https://hackmd.io/@9AnKkXToQiSXcq7r78pFYQ/SJKDaHAkZg');
				closeMenu();
			});
		}
		if (midterm) {
			midterm.addEventListener('click', (e) => {
				e.preventDefault();
				openIframe('https://hackmd.io/@9AnKkXToQiSXcq7r78pFYQ/BJmJhp01Wl');
				closeMenu();
			});
		}
		if (tku) {
			tku.addEventListener('click', (e) => {
				e.preventDefault();
				openIframe('https://www.tku.edu.tw/');
				closeMenu();
			});
		}
		// 教育科技學系（淡江大學子選單）
		if (etdept) {
			etdept.addEventListener('click', (e) => {
				e.preventDefault();
				openIframe('https://www.et.tku.edu.tw/');
				closeMenu();
			});
		}
	if (closeBtn) {
		closeBtn.addEventListener('click', (e) => {
			e.preventDefault();
			closeIframe();
		});
	}
	if (iframeOverlayEl) {
		// clicking on overlay background (outside .iframe-wrap) closes
		iframeOverlayEl.addEventListener('pointerdown', (e) => {
			if (e.target === iframeOverlayEl) closeIframe();
		});
	}
}

// attach iframe controls immediately (sketch.js is loaded after DOM in index.html)
try { _attachIframeControls(); } catch (err) { /* safe fallback */ }

function draw() {
	background(0);

	// keep p5-based fallback (mouse inside canvas)
	_ensureSideMenu();
	if (sideMenuEl) {
		let inLeftZone = (mouseX <= 100 && mouseX >= 0);
		if (inLeftZone) {
			openMenu();
		} else {
			// don't aggressively close if pointermove already handled it, but safe to call
			closeMenu();
		}
	}
	for (let i of objs) {
		i.run();
	}

	for (let i = 0; i < objs.length; i++) {
		if (objs[i].isDead) {
			objs.splice(i, 1);
		}
	}

	if (frameCount % (random([10, 60, 120])) == 0) {
		addObjs();
	}

	// --- Draw centered title and subtitle on top of the visual effects ---
	push();
	// use the Google font loaded via <link> in index.html
	textFont('Noto Sans TC');
	textAlign(CENTER, CENTER);
	noStroke();
	// font size: 1/10 of the smaller screen dimension
	let fs = min(width, height) / 10;
	// Title (主標題)
	fill('#89c2d9');
	textSize(fs);
	text('淡江大學 教育科技學系', width / 2, height / 2 - fs * 0.18);
	// Subtitle (副標題) — smaller
	fill('#a9d6e5');
	textSize(fs * 0.5);
	text('414730928高O雅', width / 2, height / 2 + fs * 0.6);
	pop();
}

function addObjs() {
	let x = random(-0.1, 1.1) * width;
	let y = random(-0.1, 1.1) * height;
	
	for (let i = 0; i < 20; i++) {
		objs.push(new Orb(x, y));
	}

	for (let i = 0; i < 50; i++) {
		objs.push(new Sparkle(x, y));
	}
	
	for (let i = 0; i < 2; i++) {
		objs.push(new Ripple(x, y));
	}

	for (let i = 0; i < 10; i++) {
		objs.push(new Shapes(x, y));
	}
}

function easeOutCirc(x) {
	return Math.sqrt(1 - Math.pow(x - 1, 2));
}

class Orb {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.radius = 0;
		this.maxRadius = minSide * 0.03;
		this.rStep = random(1);
		this.maxCircleD = minSide * 0.005;
		this.circleD = minSide * 0.005;
		this.isDead = false;
		this.ang = random(10);
		this.angStep = random([-1, 1]) * random(0.3, 0.1);
		this.xStep = random([-1, 1]) * minSide * random(0.01) * random(random());
		this.yStep = random([-1, 1]) * minSide * random(0.01) * random(random());
		this.life = 0;
		this.lifeSpan = int(random(50, 180));
		this.col = random(colors);
		this.pos = [];
		this.pos.push(createVector(this.x, this.y));
		this.followers = 10;
	}

	show() {
		this.xx = this.x + this.radius * cos(this.ang);
		this.yy = this.y + this.radius * sin(this.ang);
		push();
		noStroke();
		noFill();
		stroke(this.col);
		strokeWeight(this.circleD);
		beginShape();
		for (let i = 0; i < this.pos.length; i++) {
			vertex(this.pos[i].x, this.pos[i].y);
		}
		endShape();
		pop();
	}

	move() {
		this.ang += this.angStep;
		this.x += this.xStep;
		this.y += this.yStep;
		this.radius += this.rStep;
		this.radius = constrain(this.radius, 0, this.maxRadius);
		this.life++
		if (this.life > this.lifeSpan) {
			this.isDead = true;
		}
		this.circleD = map(this.life, 0, this.lifeSpan, this.maxCircleD, 1);
		this.pos.push(createVector(this.xx, this.yy));
		if (this.pos.length > this.followers) {
			this.pos.splice(0, 1);
		}
	}
	run() {
		this.show();
		this.move();
	}
}

class Sparkle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = minSide * random(0.4);
		this.a = random(10);
		this.x0 = x;
		this.y0 = y;
		this.targetX = x + this.r * cos(this.a);
		this.targetY = y + this.r * sin(this.a);
		this.life = 0;
		this.lifeSpan = int(random(50, 280));
		this.col = random(colors);
		this.sw = minSide * random(0.01)
	}

	show() {
		noFill();
		strokeWeight(this.sw);
		stroke(this.col);
		if (random() < 0.5) {
			point(this.x, this.y);
		}
	}

	move() {
		let nrm = norm(this.life, 0, this.lifeSpan);
		this.x = lerp(this.x0, this.targetX, easeOutCirc(nrm));
		this.y = lerp(this.y0, this.targetY, easeOutCirc(nrm));
		this.life++
		if (this.life > this.lifeSpan) {
			this.isDead = true;
		}
	}

	run() {
		this.show();
		this.move();
	}
}


class Ripple {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.life = 0;
		this.lifeSpan = int(random(50, 150));
		this.col = random(colors);
		this.maxSw = minSide * 0.005;
		this.sw = minSide * 0.005;
		this.d = 0;
		this.maxD = minSide * random(0.1, 0.5);
	}

	show() {
		noFill();
		stroke(this.col);
		strokeWeight(this.sw);
		circle(this.x, this.y, this.d);
	}

	move() {
		this.life++
		if (this.life > this.lifeSpan) {
			this.isDead = true;
		}
		let nrm = norm(this.life, 0, this.lifeSpan);
		this.sw = lerp(this.maxSw, 0.1, easeOutCirc(nrm));
		this.d = lerp(0, this.maxD, easeOutCirc(nrm));
	}

	run() {
		this.show();
		this.move();
	}
}

class Shapes {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.life = 0;
		this.lifeSpan = int(random(50, 222));
		this.col = random(colors);
		this.sw = minSide * 0.005;
		this.maxSw = minSide * 0.005;
		this.w = minSide * random(0.05);
		this.ang = random(10);
		this.angStep = random([-1, 1]) * random(0.05);
		this.shapeType = int(random(3));
		this.r = minSide * random(0.4);
		this.a = random(10);
		this.x0 = x;
		this.y0 = y;
		this.targetX = x + this.r * cos(this.a);
		this.targetY = y + this.r * sin(this.a);
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.ang);
		noFill();
		strokeWeight(this.sw);
		stroke(this.col);
		if (this.shapeType == 0) {
			square(0, 0, this.w);
		} else if (this.shapeType == 1) {
			circle(0, 0, this.w);
		} else if (this.shapeType == 2) {
			line(0, this.w / 2, 0, -this.w / 2);
			line(this.w / 2, 0, -this.w / 2, 0);
		}
		pop();

	}

	move() {
		this.life++
		if (this.life > this.lifeSpan) {
			this.isDead = true;
		}
		let nrm = norm(this.life, 0, this.lifeSpan);
		this.x = lerp(this.x0, this.targetX, easeOutCirc(nrm));
		this.y = lerp(this.y0, this.targetY, easeOutCirc(nrm));
		this.sw = lerp(this.maxSw, 0.1, easeOutCirc(nrm));
		this.ang += this.angStep;
	}

	run() {
		this.show();
		this.move();
	}
}