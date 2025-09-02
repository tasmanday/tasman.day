import { createJumble } from './jumble.js';
import { initCanvas } from './paint.js';
import { initRevealButtons } from './reveal.js';

document.addEventListener('DOMContentLoaded', () => {
	createJumble();
	initCanvas();
	initRevealButtons();
	document.querySelector('.home-container').style.display = 'flex';
	document.getElementById('loading-message').style.display = 'none';
});
