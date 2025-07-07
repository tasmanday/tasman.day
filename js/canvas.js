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

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight - navbarHeight;
		canvas.style.top = `${navbarHeight}px`;
	}
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);

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
		const x = e.clientX || (e.touches && e.touches[0].clientX);
		const y = e.clientY || (e.touches && e.touches[0].clientY);
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
			e.target.textContent = 'Enable Interaction';
			if (activeRevealButton) {
				setActiveButton(activeRevealButton);
			}
		} else {
			disablePaintingMode();
			e.target.textContent = 'Continue Painting';
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
			document.getElementById('toggle-painting').textContent = 'Enable Interaction';
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
			document.getElementById('toggle-painting').textContent = 'Enable Interaction';
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
			drawingInstruction.textContent = 'Draw below to help my contact form stand out from the crowd!';
		}

		setActiveButton('reveal-contact');

		if (!isPaintingMode) {
			enablePaintingMode();
			isPaintingMode = true;
			document.getElementById('toggle-painting').textContent = 'Enable Interaction';
		}
	});

	// Initial setup
	resumeLayer.style.zIndex = 25;
	portfolioLayer.style.zIndex = 10;
	contactLayer.style.zIndex = 11;
	enablePaintingMode();
	isPaintingMode = true;
	document.getElementById('toggle-painting').textContent = 'Enable Interaction';
	setActiveButton('reveal-resume');
}
