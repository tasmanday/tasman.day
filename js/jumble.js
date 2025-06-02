const colors = [
	'#f26255', '#63bfb0', '#016273', '#e94f37', '#FFCC7F',
	'#126eb5', '#11cbd7', '#8a3ffc', '#ff6f61', '#013740',
	'#ff8c42', '#501B27', '#e63946', '#6a0572', '#f72585',
	'#ffd166', '#00E5DE', '#118ab2', '#073b4c', '#ef476f'
];

const textFragments = [
	'TASMAN DAY', 'TASMAN', 'DAY', 'HELLO WORLD!', 'SOFTWARE',
	'DEVELOPER', 'JAVASCRIPT', 'C', 'HTML', 'CSS', 'PYTHON',
	'HIRE ME PLEASE', 'EMPLOYABLE', 'GOOD CANDIDATE', 'CYBER SECURITY',
	'WEB DEV', 'LOREM IPSUM', 'sudo rm -fr ./*', 'WORKS ON MY MACHINE',
	'NULL', 'NaN', 'SEGFAULT', '404', ':)', ':P', '¯\\_(ツ)_/¯'
];

export function createJumble() {
	const container = document.getElementById('jumbleLayer');
	const pixelsPerFragment = 1750;
	const screenWidth = window.innerWidth;
	const screenHeight = window.innerHeight;
	const count = Math.floor((screenWidth * screenHeight) / pixelsPerFragment);

	for (let i = 0; i < count; i++) {
		const span = document.createElement('span');
		span.textContent = randomItem(textFragments);
		span.style.color = randomItem(colors);
		span.style.left = `${Math.random() * 120 - 20}vw`;
		span.style.top = `${Math.random() * 100}vh`;
		span.style.fontSize = `${Math.random() * 3.5 + 1.5}rem`;
		span.style.transform = `rotate(${Math.random() * 360}deg)`;
		span.style.opacity = Math.random() * 0.1 + 0.9;

		container.appendChild(span);
	}
}

function randomItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
