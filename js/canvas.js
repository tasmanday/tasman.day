export function initCanvas() {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	let painting = false;
	let brushColor = '#013740';
	const brushSize = 80;

	function resizeCanvas() {
		const navbar = document.querySelector('.navbar');
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

	document.getElementById('toggle-painting').addEventListener('click', (e) => {
		e.preventDefault();
		isPaintingMode = !isPaintingMode;

		if (isPaintingMode) {
			enablePaintingMode();
			e.target.textContent = 'Stop Painting';
		} else {
			disablePaintingMode();
			e.target.textContent = 'Start Painting';
		}
	});

	const resumeLayer = document.getElementById('resume-layer');
	const portfolioLayer = document.getElementById('portfolio-layer');
	const contentLayers = [resumeLayer, portfolioLayer];

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

		const resumeZ = parseInt(window.getComputedStyle(resumeLayer).zIndex) || 0;
		const portfolioZ = parseInt(window.getComputedStyle(portfolioLayer).zIndex) || 0;
		
		if (resumeZ >= portfolioZ) {
			resumeLayer.style.pointerEvents = 'auto';
		} else {
			portfolioLayer.style.pointerEvents = 'auto';
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
		brushColor = '#013740'; // Reset to teal
		resumeLayer.style.zIndex = 25;
		portfolioLayer.style.zIndex = 10;

		if (!isPaintingMode) {
			enablePaintingMode();
			isPaintingMode = true;
			document.getElementById('toggle-painting').textContent = 'Stop Painting';
		}
	});

	document.getElementById('reveal-portfolio').addEventListener('click', (e) => {
		e.preventDefault();

		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear paint
		brushColor = '#501B27'; // Burgundy red

		resumeLayer.style.zIndex = 10;
		portfolioLayer.style.zIndex = 25;

		if (!isPaintingMode) {
			enablePaintingMode();
			isPaintingMode = true;
			document.getElementById('toggle-painting').textContent = 'Stop Painting';
		}
	});

	// Initial setup
	resumeLayer.style.zIndex = 25;
	portfolioLayer.style.zIndex = 10;
	enablePaintingMode();
	isPaintingMode = true;
	document.getElementById('toggle-painting').textContent = 'Stop Painting';
}
