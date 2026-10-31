import { browser } from '$app/environment';
import { readStorage, writeStorage } from '$lib/storage';

export type Theme = 'auto' | 'dark' | 'light';
export type FontSize = 's' | 'm' | 'l';

const THEME_KEY = 'fujilenses-theme';
const FONT_SIZE_KEY = 'fujilenses-font-size';

const fontScaleMap: Record<FontSize, number> = {
	s: 0.875,
	m: 1,
	l: 1.125
};

function loadTheme(): Theme {
	if (!browser) return 'auto';
	const value = readStorage(THEME_KEY);
	return value === 'dark' || value === 'light' ? value : 'auto';
}

function loadFontSize(): FontSize {
	if (!browser) return 'm';
	const value = readStorage(FONT_SIZE_KEY);
	return value === 's' || value === 'l' ? value : 'm';
}

let theme = $state<Theme>(loadTheme());
let fontSize = $state<FontSize>(loadFontSize());

function applyTheme(t: Theme) {
	if (!browser) return;
	if (t === 'auto') {
		document.documentElement.removeAttribute('data-theme');
	} else {
		document.documentElement.setAttribute('data-theme', t);
	}
}

function applyFontSize(size: FontSize) {
	if (!browser) return;
	document.documentElement.style.setProperty('--font-scale', String(fontScaleMap[size]));
}

// Apply on load
if (browser) {
	applyTheme(getTheme());
	applyFontSize(getFontSize());
}

export function getTheme(): Theme {
	return theme;
}

export function setTheme(t: Theme): void {
	theme = t;
	applyTheme(t);
	writeStorage(THEME_KEY, t);
}

export function getFontSize(): FontSize {
	return fontSize;
}

export function setFontSize(size: FontSize): void {
	fontSize = size;
	applyFontSize(size);
	writeStorage(FONT_SIZE_KEY, size);
}

export function getFontScale(): number {
	return fontScaleMap[fontSize];
}
