import { createJumble } from './jumble.js';
import { initCanvas } from './canvas.js';

document.addEventListener('DOMContentLoaded', () => {
	createJumble();
	initCanvas();
	document.querySelector('.home-content-container').style.display = 'block';
	document.getElementById('loading-message').style.display = 'none';
});
