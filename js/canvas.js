export function initCanvas() {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	let painting = false;
	let brushColor = '#013740';
	const brushSize = 80;
	let activeRevealButton = 'reveal-resume';

	function resizeCanvas() {
		const navbar = document.querySelector('.custom-navbar');
		const navbarHeight = navbar.offsetHeight;

		// Use document.documentElement dimensions to account for scroll bars
		canvas.width = document.documentElement.clientWidth;
		canvas.height = document.documentElement.clientHeight - navbarHeight;
		canvas.style.top = `${navbarHeight}px`;
		canvas.style.left = '0px';
	}
	resizeCanvas();
	window.addEventListener('resize', () => {
		resizeCanvas();
		
		// Handle painting mode changes on resize
		const isLargeScreen = window.innerWidth > 768;
		const wasLargeScreen = !isPaintingMode && document.body.style.overflow !== 'hidden';
		
		if (isLargeScreen && !wasLargeScreen) {
			// Switched to large screen - enable normal scrolling
			disablePaintingMode();
			isPaintingMode = false;
			const toggleButton = document.getElementById('toggle-painting');
			const textSpan = toggleButton.querySelector('.nav-text');
			const icon = toggleButton.querySelector('.nav-icon');

			if (textSpan) textSpan.textContent = 'Continue Painting';
			if (icon) icon.alt = 'Continue Painting';
			clearActiveButton();
		} else if (!isLargeScreen && wasLargeScreen) {
			// Switched to small screen - enable painting mode
			enablePaintingMode();
			isPaintingMode = true;
			const toggleButton = document.getElementById('toggle-painting');
			const textSpan = toggleButton.querySelector('.nav-text');
			const icon = toggleButton.querySelector('.nav-icon');

			if (textSpan) textSpan.textContent = 'Enable Interaction';
			if (icon) icon.alt = 'Enable Interaction';
			if (activeRevealButton) {
				setActiveButton(activeRevealButton);
			}
		}
	});

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

	let isPaintingMode = false;

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

	// Function to clear active button styling
	function clearActiveButton() {
		document.getElementById('reveal-resume').classList.remove('active');
		document.getElementById('reveal-portfolio').classList.remove('active');
		document.getElementById('reveal-contact').classList.remove('active');
	}

	document.getElementById('toggle-painting').addEventListener('click', (e) => {
		e.preventDefault();
		isPaintingMode = !isPaintingMode;

		if (isPaintingMode) {
			enablePaintingMode();
			// Update both text and icon for small screens
			const toggleButton = e.target.closest('#toggle-painting');
			const textSpan = toggleButton.querySelector('.nav-text');
			const icon = toggleButton.querySelector('.nav-icon');
			
			if (textSpan) textSpan.textContent = 'Enable Interaction';
			if (icon) icon.alt = 'Enable Interaction';
			
			if (activeRevealButton) {
				setActiveButton(activeRevealButton);
			}
		} else {
			disablePaintingMode();
			// Update both text and icon for small screens
			const toggleButton = e.target.closest('#toggle-painting');
			const textSpan = toggleButton.querySelector('.nav-text');
			const icon = toggleButton.querySelector('.nav-icon');
			
			if (textSpan) textSpan.textContent = 'Continue Painting';
			if (icon) icon.alt = 'Continue Painting';
			
			clearActiveButton();
		}
	});

	const resumeLayer = document.getElementById('resume-layer');
	const portfolioLayer = document.getElementById('portfolio-layer');
	const contactLayer = document.getElementById('contact-layer');
	const contentLayers = [resumeLayer, portfolioLayer, contactLayer];

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
		
		// Prevent viewport scrolling to avoid white slivers
		document.body.style.overflow = 'hidden';
		document.documentElement.style.overflow = 'hidden';
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
		canvas.removeEventListener('touchstart', preventScroll);
		canvas.removeEventListener('touchmove', preventScroll);
		
		// Check screen size to determine scroll behavior
		if (window.innerWidth <= 768) {
			// On small screens, keep viewport scrolling disabled but make home-container scrollable
			document.body.style.overflow = 'hidden';
			document.documentElement.style.overflow = 'hidden';
			
			// Make the home-container scrollable
			const homeContainer = document.querySelector('.home-container');
			if (homeContainer) {
				homeContainer.style.overflowY = 'auto';
				homeContainer.style.overflowX = 'hidden';
				homeContainer.style.maxHeight = 'calc(100vh - var(--navbar-height))';
			}
		} else {
			// On large screens, enable normal scrolling
			document.body.style.overflow = '';
			document.documentElement.style.overflow = '';
			
			// Reset home-container scrolling
			const homeContainer = document.querySelector('.home-container');
			if (homeContainer) {
				homeContainer.style.overflowY = '';
				homeContainer.style.overflowX = '';
				homeContainer.style.maxHeight = '';
			}
		}
	}

	// Function to prevent default touch scrolling unless using 2+ fingers
	function preventScroll(e) {
		if (e.touches.length === 1) {
			e.preventDefault();
		}
		// Allow default behavior for 2+ finger touches (pinch-to-zoom, etc.)
	}

	document.getElementById('clear-painting').addEventListener('click', (e) => {
		e.preventDefault();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	});

	document.getElementById('reveal-resume').addEventListener('click', (e) => {
		e.preventDefault();

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		brushColor = '#013740'; // Teal

		resumeLayer.style.zIndex = 25;
		portfolioLayer.style.zIndex = 10;
		contactLayer.style.zIndex = 11;

		const drawingInstruction = document.querySelector('.drawing-instruction');
		if (drawingInstruction) {
			drawingInstruction.textContent = 'Draw below to help my resume stand out from the crowd!';
		}

		setActiveButton('reveal-resume');

		if (!isPaintingMode) {
			enablePaintingMode();
			isPaintingMode = true;
			const toggleButton = document.getElementById('toggle-painting');
			const textSpan = toggleButton.querySelector('.nav-text');
			const icon = toggleButton.querySelector('.nav-icon');
			
			if (textSpan) textSpan.textContent = 'Enable Interaction';
			if (icon) icon.alt = 'Enable Interaction';
		}
	});

	document.getElementById('reveal-portfolio').addEventListener('click', (e) => {
		e.preventDefault();

		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear paint
		brushColor = '#501B27'; // Burgundy red

		portfolioLayer.style.zIndex = 25;
		resumeLayer.style.zIndex = 10;
		contactLayer.style.zIndex = 11;

		const drawingInstruction = document.querySelector('.drawing-instruction');
		if (drawingInstruction) {
			drawingInstruction.textContent = 'Draw below to help my portfolio stand out from the crowd!';
		}

		setActiveButton('reveal-portfolio');

		if (!isPaintingMode) {
			enablePaintingMode();
			isPaintingMode = true;
			const toggleButton = document.getElementById('toggle-painting');
			const textSpan = toggleButton.querySelector('.nav-text');
			const icon = toggleButton.querySelector('.nav-icon');
			
			if (textSpan) textSpan.textContent = 'Enable Interaction';
			if (icon) icon.alt = 'Enable Interaction';
		}
	});

	document.getElementById('reveal-contact').addEventListener('click', (e) => {
		e.preventDefault();

		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear paint
		brushColor = '#916f01'; // Dark yellow

		contactLayer.style.zIndex = 25;
		resumeLayer.style.zIndex = 10;
		portfolioLayer.style.zIndex = 11;

		const drawingInstruction = document.querySelector('.drawing-instruction');
		if (drawingInstruction) {
			drawingInstruction.textContent = 'Draw below to reveal the contact form!';
		}

		setActiveButton('reveal-contact');

		if (!isPaintingMode) {
			enablePaintingMode();
			isPaintingMode = true;
			const toggleButton = document.getElementById('toggle-painting');
			const textSpan = toggleButton.querySelector('.nav-text');
			const icon = toggleButton.querySelector('.nav-icon');
			
			if (textSpan) textSpan.textContent = 'Enable Interaction';
			if (icon) icon.alt = 'Enable Interaction';
		}
	});

	// Initial setup
	resumeLayer.style.zIndex = 25;
	portfolioLayer.style.zIndex = 10;
	contactLayer.style.zIndex = 11;
	
	// Check screen size for initial behavior
	if (window.innerWidth <= 768) {
		// On small screens, start in painting mode
		enablePaintingMode();
		isPaintingMode = true;
		const toggleButton = document.getElementById('toggle-painting');
		const textSpan = toggleButton.querySelector('.nav-text');
		const icon = toggleButton.querySelector('.nav-icon');

		if (textSpan) textSpan.textContent = 'Enable Interaction';
		if (icon) icon.alt = 'Enable Interaction';
	} else {
		// On large screens, start with normal scrolling enabled
		disablePaintingMode();
		isPaintingMode = false;
		const toggleButton = document.getElementById('toggle-painting');
		const textSpan = toggleButton.querySelector('.nav-text');
		const icon = toggleButton.querySelector('.nav-icon');

		if (textSpan) textSpan.textContent = 'Continue Painting';
		if (icon) icon.alt = 'Continue Painting';
	}

	setActiveButton('reveal-resume');
}
