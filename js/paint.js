let paintCanvas;
let ctx;
let homeContainer;
const navbar = document.querySelector('.custom-navbar');
const navbarHeight = navbar.offsetHeight;
let isPaintingMode = true
let painting = false;
let brushColor = '#01262b';
let brushSize = 80;
let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;

function onResize() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	if (width !== lastWidth || Math.abs(height - lastHeight) > 100) {
		lastWidth = width;
		lastHeight = height;
		resizeCanvas();
	}
}

function resizeCanvas() {
	paintCanvas.width = window.innerWidth;
	paintCanvas.height = window.innerHeight - navbarHeight;
	paintCanvas.style.top = `${navbarHeight}px`;
	paintCanvas.style.left = '0px';
}

function setupEventListeners() {
	document.getElementById('toggle-painting').addEventListener('click', handleTogglePainting);
	document.getElementById('clear-painting').addEventListener('click', handleClearPainting);
	document.getElementById('reveal-resume').addEventListener('click', handleRevealResume);
	document.getElementById('reveal-portfolio').addEventListener('click', handleRevealPortfolio);
	document.getElementById('reveal-contact').addEventListener('click', handleRevealContact);
	window.addEventListener('resize', onResize);
}

// Drawing functions
function startPosition(e) {
	painting = true;
	draw(e);
}

function endPosition() {
	painting = false;
	ctx.beginPath(); // Reset path
}

function draw(e) {
	if (!painting) return;
	
	// Calculate coordinates relative to canvas
	const x = e.clientX || (e.touches && e.touches[0].clientX);
	const y = (e.clientY || (e.touches && e.touches[0].clientY)) - navbarHeight;
	
	ctx.fillStyle = brushColor;
	ctx.beginPath();
	ctx.arc(x, y, brushSize, 0, Math.PI * 2);
	ctx.fill();
}

// Toggle button text management
function updateToggleButtonText(text, altText) {
	const toggleButton = document.getElementById('toggle-painting');
	const textSpan = toggleButton.querySelector('.nav-text');
	const icon = toggleButton.querySelector('.nav-icon');
	
	if (textSpan) textSpan.textContent = text;
	if (icon) icon.alt = altText;
}

function preventScroll(e) {
    if (isPaintingMode) {
        e.preventDefault();
    }
}

function enablePaintingMode() {
	isPaintingMode = true;

	paintCanvas.style.pointerEvents = 'auto';
	homeContainer.style.pointerEvents = 'none';

	paintCanvas.addEventListener('mousedown', startPosition);
	paintCanvas.addEventListener('mouseup', endPosition);
	paintCanvas.addEventListener('mousemove', draw);

	paintCanvas.addEventListener('touchstart', startPosition);
	paintCanvas.addEventListener('touchend', endPosition);
	paintCanvas.addEventListener('touchmove', draw);

	// Prevent default touch scrolling when painting mode is on
    paintCanvas.addEventListener('touchstart', preventScroll, { passive: false });
    paintCanvas.addEventListener('touchmove', preventScroll, { passive: false });

	updateToggleButtonText('Enable Interaction', 'Enable Interaction');
}

function disablePaintingMode() {
	isPaintingMode = false;

	paintCanvas.style.pointerEvents = 'none';
	homeContainer.style.pointerEvents = 'auto';

	paintCanvas.removeEventListener('mousedown', startPosition);
	paintCanvas.removeEventListener('mouseup', endPosition);
	paintCanvas.removeEventListener('mousemove', draw);

	paintCanvas.removeEventListener('touchstart', startPosition);
	paintCanvas.removeEventListener('touchend', endPosition);
	paintCanvas.removeEventListener('touchmove', draw);

	// Prevent default touch scrolling when painting mode is on
    paintCanvas.removeEventListener('touchstart', preventScroll, { passive: false });
    paintCanvas.removeEventListener('touchmove', preventScroll, { passive: false });

	updateToggleButtonText('Continue Painting', 'Continue Painting');
}

// Event handlers
function handleTogglePainting() {
	if (isPaintingMode === false) {
		enablePaintingMode();
	} else {
		disablePaintingMode();
	}
}

function handleClearPainting() {
	ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
}

function handleRevealResume() {
	brushColor = '#01262b'; // Teal
	handleClearPainting();
	if (isPaintingMode === false) {
		enablePaintingMode();
	}
}

function handleRevealPortfolio() {
	brushColor = '#501B27'; // Burgundy red
	handleClearPainting();
	if (isPaintingMode === false) {
		enablePaintingMode();
	}
}

function handleRevealContact() {
	brushColor = '#663100'; // Dark orange
	handleClearPainting();
	if (isPaintingMode === false) {
		enablePaintingMode();
	}
}

export function initCanvas() {
	paintCanvas = document.getElementById('paint-canvas');
	ctx = paintCanvas.getContext('2d');

	homeContainer = document.querySelector('.home-container');

	resizeCanvas();
	setupEventListeners();

	enablePaintingMode();
}
