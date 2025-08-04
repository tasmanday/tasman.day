// Canvas state management
let painting = false;
let brushColor = '#013740';
const brushSize = 80;
let activeRevealButton = 'reveal-resume';
let isPaintingMode = false;

// DOM elements
let canvas, ctx;
let resumeLayer, portfolioLayer, contactLayer;
let contentLayers;

// Canvas sizing functions
function resizeCanvas() {
	const navbar = document.querySelector('.custom-navbar');
	const navbarHeight = navbar.offsetHeight;

	// Use document.documentElement dimensions to account for scroll bars
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight - navbarHeight;
	canvas.style.top = `${navbarHeight}px`;
	canvas.style.left = '0px';
}

function resizeHomeContainer() {
	const navbar = document.querySelector('.custom-navbar');
	const navbarHeight = navbar.offsetHeight;

	const homeContainer = document.querySelector('.home-container');
	if (homeContainer) {
		homeContainer.style.height = `calc(100dvh - ${navbarHeight}px)`;
		homeContainer.style.maxHeight = `calc(100dvh - ${navbarHeight}px)`;
		homeContainer.style.marginTop = `${navbarHeight}px`;
	}
}

function handleResize() {
	resizeCanvas();
	resizeHomeContainer();
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
	
	// Get the navbar height to account for canvas offset
	const navbar = document.querySelector('.custom-navbar');
	const navbarHeight = navbar.offsetHeight;
	
	// Calculate coordinates relative to canvas
	const x = e.clientX || (e.touches && e.touches[0].clientX);
	const y = (e.clientY || (e.touches && e.touches[0].clientY)) - navbarHeight;
	
	ctx.fillStyle = brushColor;
	ctx.beginPath();
	ctx.arc(x, y, brushSize, 0, Math.PI * 2);
	ctx.fill();
}

// Function to prevent default touch scrolling unless using 2+ fingers
function preventScroll(e) {
	if (e.touches.length === 1) {
		e.preventDefault();
	}
	// Allow default behavior for 2+ finger touches (pinch-to-zoom, etc.)
}

// Button state management
function setActiveButton(buttonId) {
	// Remove active class from all reveal buttons
	document.getElementById('reveal-resume').classList.remove('active');
	document.getElementById('reveal-portfolio').classList.remove('active');
	document.getElementById('reveal-contact').classList.remove('active');
	
	// Add active class to the specified button
	if (buttonId) {
		document.getElementById(buttonId).classList.add('active');
		activeRevealButton = buttonId;
	}
}

function clearActiveButton() {
	document.getElementById('reveal-resume').classList.remove('active');
	document.getElementById('reveal-portfolio').classList.remove('active');
	document.getElementById('reveal-contact').classList.remove('active');
}

// Painting mode management
function enablePaintingMode() {
	canvas.style.pointerEvents = 'auto';
	canvas.style.backgroundColor = 'transparent';

	contentLayers.forEach(layer => {
		if (layer) {
			console.log('Disabling pointer-events on:', layer);
			layer.style.pointerEvents = 'none';
		}
	});

	canvas.addEventListener('mousedown', startPosition);
	canvas.addEventListener('mouseup', endPosition);
	canvas.addEventListener('mousemove', draw);
	canvas.addEventListener('mouseleave', endPosition);
	canvas.addEventListener('touchstart', startPosition);
	canvas.addEventListener('touchend', endPosition);
	canvas.addEventListener('touchmove', draw);
	
	// Prevent default touch scrolling (single finger)
	canvas.addEventListener('touchstart', preventScroll, { passive: false });
	canvas.addEventListener('touchmove', preventScroll, { passive: false });
}

function disablePaintingMode() {
	canvas.style.pointerEvents = 'none';

	let maxZIndex = -Infinity;
	let topLayer = null;

	contentLayers.forEach(layer => {
		if (layer) {
			const zIndex = parseInt(window.getComputedStyle(layer).zIndex) || 0;
			if (zIndex > maxZIndex) {
				maxZIndex = zIndex;
				topLayer = layer;
			}
		}
	});

	if (topLayer) {
		topLayer.style.pointerEvents = 'auto';
	}

	canvas.removeEventListener('mousedown', startPosition);
	canvas.removeEventListener('mouseup', endPosition);
	canvas.removeEventListener('mousemove', draw);
	canvas.removeEventListener('mouseleave', endPosition);
	canvas.removeEventListener('touchstart', startPosition);
	canvas.removeEventListener('touchend', endPosition);
	canvas.removeEventListener('touchmove', draw);
	
	// Remove scroll prevention
	canvas.removeEventListener('touchstart', preventScroll, { passive: false });
	canvas.removeEventListener('touchmove', preventScroll, { passive: false });
}

// Toggle button text management
function updateToggleButtonText(text, altText) {
	const toggleButton = document.getElementById('toggle-painting');
	const textSpan = toggleButton.querySelector('.nav-text');
	const icon = toggleButton.querySelector('.nav-icon');
	
	if (textSpan) textSpan.textContent = text;
	if (icon) icon.alt = altText;
}

// Layer management
function setLayerZIndex(resumeZ, portfolioZ, contactZ) {
	resumeLayer.style.zIndex = resumeZ;
	portfolioLayer.style.zIndex = portfolioZ;
	contactLayer.style.zIndex = contactZ;
}

function updateDrawingInstruction(text) {
	const drawingInstruction = document.querySelector('.drawing-instruction');
	if (drawingInstruction) {
		drawingInstruction.textContent = text;
	}
}

// Event handlers
function handleTogglePainting(e) {
	e.preventDefault();
	isPaintingMode = !isPaintingMode;

	if (isPaintingMode) {
		enablePaintingMode();
		updateToggleButtonText('Enable Interaction', 'Enable Interaction');
		
		if (activeRevealButton) {
			setActiveButton(activeRevealButton);
		}
	} else {
		disablePaintingMode();
		updateToggleButtonText('Continue Painting', 'Continue Painting');
		clearActiveButton();
	}
}

function handleClearPainting(e) {
	e.preventDefault();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function handleRevealResume(e) {
	e.preventDefault();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	brushColor = '#013740'; // Teal

	setLayerZIndex(25, 10, 11);
	updateDrawingInstruction('Draw below to help my resume stand out from the crowd!');
	setActiveButton('reveal-resume');

	if (!isPaintingMode) {
		enablePaintingMode();
		isPaintingMode = true;
		updateToggleButtonText('Enable Interaction', 'Enable Interaction');
	}
}

function handleRevealPortfolio(e) {
	e.preventDefault();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	brushColor = '#501B27'; // Burgundy red

	setLayerZIndex(10, 25, 11);
	updateDrawingInstruction('Draw below to help my portfolio stand out from the crowd!');
	setActiveButton('reveal-portfolio');

	if (!isPaintingMode) {
		enablePaintingMode();
		isPaintingMode = true;
		updateToggleButtonText('Enable Interaction', 'Enable Interaction');
	}
}

function handleRevealContact(e) {
	e.preventDefault();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	brushColor = '#916f01'; // Dark yellow

	setLayerZIndex(10, 11, 25);
	updateDrawingInstruction('Draw below to reveal the contact form!');
	setActiveButton('reveal-contact');

	if (!isPaintingMode) {
		enablePaintingMode();
		isPaintingMode = true;
		updateToggleButtonText('Enable Interaction', 'Enable Interaction');
	}
}

// Event listener setup
function setupEventListeners() {
	window.addEventListener('resize', handleResize);
	
	document.getElementById('toggle-painting').addEventListener('click', handleTogglePainting);
	document.getElementById('clear-painting').addEventListener('click', handleClearPainting);
	document.getElementById('reveal-resume').addEventListener('click', handleRevealResume);
	document.getElementById('reveal-portfolio').addEventListener('click', handleRevealPortfolio);
	document.getElementById('reveal-contact').addEventListener('click', handleRevealContact);
}

// Initialization
function initializeCanvas() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	resumeLayer = document.getElementById('resume-layer');
	portfolioLayer = document.getElementById('portfolio-layer');
	contactLayer = document.getElementById('contact-layer');
	contentLayers = [resumeLayer, portfolioLayer, contactLayer];

	handleResize();
	setupEventListeners();

	// Initial setup
	setLayerZIndex(25, 10, 11);
	enablePaintingMode();
	isPaintingMode = true;
	updateToggleButtonText('Enable Interaction', 'Enable Interaction');
	setActiveButton('reveal-resume');
}

export function initCanvas() {
	initializeCanvas();
}
