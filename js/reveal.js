
let activeRevealButton = 'reveal-resume';
let toggleIsActive = false;

// Button state management
function setActiveButton(buttonId) {
	// Remove active class from all reveal buttons
	clearActiveButton();
	
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
	document.getElementById('toggle-painting').classList.remove('active');
}

// Section visibility management
function showSection(sectionName) {
	// Hide all sections first
	document.getElementById('resume-home').style.display = 'none';
	document.getElementById('portfolio-home').style.display = 'none';
	document.getElementById('contact-home').style.display = 'none';
	
	// Show the requested section
	switch(sectionName) {
		case 'resume':
			document.getElementById('resume-home').style.display = 'flex';
			break;
		case 'portfolio':
			document.getElementById('portfolio-home').style.display = 'flex';
			break;
		case 'contact':
			document.getElementById('contact-home').style.display = 'flex';
			break;
	}
}

function updateDrawingInstruction(text) {
	const drawingInstruction = document.querySelector('.drawing-instruction');
	if (drawingInstruction) {
		drawingInstruction.textContent = text;
	}
}

// Event handlers
function handleRevealResume() {
	showSection('resume');
	if (toggleIsActive) {
		toggleIsActive = false;
	}
	setActiveButton('reveal-resume');
	updateDrawingInstruction('Draw below to help my resume stand out from the crowd!');
}

function handleRevealPortfolio() {
	showSection('portfolio');
	if (toggleIsActive) {
		toggleIsActive = false;
	}
	setActiveButton('reveal-portfolio');
	updateDrawingInstruction('Draw below to help my portfolio stand out from the crowd!');
}

function handleRevealContact() {
	showSection('contact');
	if (toggleIsActive) {
		toggleIsActive = false;
	}
	setActiveButton('reveal-contact');
	updateDrawingInstruction('Draw below to reveal the contact form!');
}

function handleTogglePainting() {
	if (!toggleIsActive) {
		toggleIsActive = true;
		clearActiveButton();
		document.getElementById('toggle-painting').classList.add('active');
	} else {
		toggleIsActive = false;
		setActiveButton(activeRevealButton);
	}
}

// Setup function to be called from main.js
export function initRevealButtons() {
	document.getElementById('reveal-resume').addEventListener('click', handleRevealResume);
	document.getElementById('reveal-portfolio').addEventListener('click', handleRevealPortfolio);
	document.getElementById('reveal-contact').addEventListener('click', handleRevealContact);
	document.getElementById('toggle-painting').addEventListener('click', handleTogglePainting);
	
	// Show resume section by default
	showSection('resume');
	setActiveButton('reveal-resume');
}