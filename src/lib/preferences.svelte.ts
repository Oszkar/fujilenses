import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';
export type FontSize = 's' | 'm' | 'l';

const THEME_KEY = 'fujilenses-theme';
const FONT_SIZE_KEY = 'fujilenses-font-size';

const fontScaleMap: Record<FontSize, number> = {
	s: 0.875,
	m: 1,
	l: 1.125
};

function getSystemTheme(): Theme {
	if (!browser) return 'dark';
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function loadTheme(): Theme {
	if (!browser) return 'dark';
	return (localStorage.getItem(THEME_KEY) as Theme) || getSystemTheme();
}

function loadFontSize(): FontSize {
	if (!browser) return 'm';
	return (localStorage.getItem(FONT_SIZE_KEY) as FontSize) || 'm';
}

let theme = $state<Theme>(loadTheme());
let fontSize = $state<FontSize>(loadFontSize());

function applyTheme(t: Theme) {
	if (!browser) return;
	document.documentElement.setAttribute('data-theme', t);
}

function applyFontSize(size: FontSize) {
	if (!browser) return;
	document.documentElement.style.setProperty('--font-scale', String(fontScaleMap[size]));
}

// Apply on load
if (browser) {
	applyTheme(theme);
	applyFontSize(fontSize);
}

export function getTheme(): Theme {
	return theme;
}

export function setTheme(t: Theme): void {
	theme = t;
	applyTheme(t);
	if (browser) localStorage.setItem(THEME_KEY, t);
}

export function getFontSize(): FontSize {
	return fontSize;
}

export function setFontSize(size: FontSize): void {
	fontSize = size;
	applyFontSize(size);
	if (browser) localStorage.setItem(FONT_SIZE_KEY, size);
}

export function getFontScale(): number {
	return fontScaleMap[fontSize];
}
