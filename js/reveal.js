
let activeRevealButton = 'reveal-resume';

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

// Event handlers
function handleRevealResume(e) {
	e.preventDefault();
	showSection('resume');
	setActiveButton('reveal-resume');
}

function handleRevealPortfolio(e) {
	e.preventDefault();
	showSection('portfolio');
	setActiveButton('reveal-portfolio');
}

function handleRevealContact(e) {
	e.preventDefault();
	showSection('contact');
	setActiveButton('reveal-contact');
}

// Setup function to be called from main.js
export function initRevealButtons() {
	document.getElementById('reveal-resume').addEventListener('click', handleRevealResume);
	document.getElementById('reveal-portfolio').addEventListener('click', handleRevealPortfolio);
	document.getElementById('reveal-contact').addEventListener('click', handleRevealContact);
	
	// Show resume section by default
	showSection('resume');
	setActiveButton('reveal-resume');
}