const colors = [
	'#f26255', '#63bfb0', '#016273', '#e94f37', '#FFCC7F',
	'#126eb5', '#11cbd7', '#8a3ffc', '#ff6f61', '#013740',
	'#ff8c42', '#501B27', '#e63946', '#6a0572', '#f72585',
	'#ffd166', '#00E5DE', '#118ab2', '#073b4c', '#ef476f',
	'#2ce0ed', '#75e0e8'
];

const textFragments = [
	'TASMAN DAY', 'TASMAN', 'DAY', 'HELLO WORLD!', 'SOFTWARE',
	'DEVELOPER', 'JAVASCRIPT', 'C', 'HTML', 'CSS', 'PYTHON',
	'HIRE ME PLEASE', 'EMPLOYABLE', 'GOOD CANDIDATE', 'CYBER SECURITY',
	'WEB DEV', 'LOREM IPSUM', 'sudo rm -fr ./*', 'WORKS ON MY MACHINE',
	'NULL', 'NaN', 'SEGFAULT', '404', ':)', ':P', '¯\\_(ツ)_/¯'
];

export function createJumble() {
	const container = document.getElementById('jumble');
	const jumbleCanvas = document.createElement('canvas');
	jumbleCanvas.classList.add('jumble_canvas');
	container.appendChild(jumbleCanvas);
	
	const ctx = jumbleCanvas.getContext('2d');
	
	function resizeCanvas() {
		const navbar = document.querySelector('.custom-navbar');
		const navbarHeight = navbar.offsetHeight;
		
		jumbleCanvas.width = window.innerWidth;
		jumbleCanvas.height = window.innerHeight - navbarHeight;
		
		jumbleCanvas.style.top = `${navbarHeight}px`;
		drawJumble();
	}
	
	function drawJumble() {
		ctx.clearRect(0, 0, jumbleCanvas.width, jumbleCanvas.height);
		
		const pixelsPerFragment = 1500; // lower number = more fragments
		const count = Math.floor((jumbleCanvas.width * jumbleCanvas.height) / pixelsPerFragment);
		
		for (let i = 0; i < count; i++) {
			const text = randomItem(textFragments);
			const color = randomItem(colors);
			const x = Math.random() * jumbleCanvas.width;
			const y = Math.random() * jumbleCanvas.height;
			const fontSize = Math.random() * 3.5 + 1.5;
			const rotation = Math.random() * 360;
			const opacity = Math.random() * 0.1 + 0.9;
			
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(rotation * Math.PI / 180);
			ctx.font = `${fontSize}rem sans-serif`;
			ctx.fillStyle = color;
			ctx.globalAlpha = opacity;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(text, 0, 0);
			ctx.restore();
		}
	}
	
	// Initial setup
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);
}

function randomItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
