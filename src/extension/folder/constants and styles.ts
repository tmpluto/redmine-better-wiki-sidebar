export const MyConstants = {
	storage: {
		zenMode: { key: "brws-zenMode", defaultVal: false },
		sidebarLocation: { key: "brws-sidebarLocation", defaultVal: "left" },
		sidebarWidth: { key: "brws-sidebarWidth", defaultVal: "255px" },
		smallerImg: { key: "brws-smallerImg", defaultVal: false },
		sidebarStore: { key: "brws-sidebarStore" },
		expandedWikis: { key: "brws-expandedWikis", defaultVal: {} },
		customDomainRegexString: { key: "brws-customDomainRegexString", defaultVal: "" },
		useCustomDomainRegex: { key: "brws-useCustomDomainRegex", defaultVal: false }
	},
	selectors: {
		main: "#wrapper #main",
		sidebar: "#wrapper #main > #sidebar"
	}
}

// starts with "https://www.redmine.org/projects/<project-name>/wiki/"
// or starts with "https://redmine.<company-name>.dev/projects/<project-name>/wiki/"
export const TARGET_URL_RE = /^https:\/\/(?:www\.redmine\.org|redmine\.[a-z0-9-]+\.dev)\/projects\/[^/]+\/wiki(\/|$)/i;
// source: '^https:\\/\\/(?:www\\.redmine\\.org|redmine\\.[a-z0-9-]+\\.dev)\\/projects\\/[^/]+\\/wiki(\\/|$)'
export function isTargetUrl(url?: string | null): boolean {
	return !!url && TARGET_URL_RE.test(url);
}

const SUFFIX_FOR_CUSTOM_REGEX = '\\/projects\\/[^/]+\\/wiki(\\/|$)';

export function doesUrlMatchWithCustomDomainRegex(customDomainRegexString: string, url: string | undefined){
    if (!url) return false;

	const normalizedRegexString = customDomainRegexString
		.replace(/\\\\/g, '\\')
		.replace(/\\\//g, '/');

	const customRegex = new RegExp(normalizedRegexString + SUFFIX_FOR_CUSTOM_REGEX, 'i');
	
	return customRegex.test(url);
}


/* ------------------------------------------------------------------------------------------------------------------ */


/*
2. hide path breadcrumb
3. hide Watch button
4. hide last updated info & download options
*/
const styles_zenMode = `
#header,
#top-menu { 
	display: none;
}
p.breadcrumb {
	display: none;
}

div.contextual > a:nth-child(2){
	display: none;
}

#content {
	& > p.wiki-update-info {
		display: none;
	}

	& > p.other-formats {
		display: none;
	}
}
`

/*
1. make sidebar visible in edit mode
2. clean up sidebar padding + make sidebar background the same color as extension background
3. hide other elements in sidebar, only make our extension visible
4. disable editing for wikis that are locked
5. hide footer
6. scroll only wiki content rather than entire screen
*/
export const styles_default = `
#wrapper #main.nosidebar > #sidebar {
	display: block;
}

#wrapper #main > #sidebar {
	padding: 0;
	background: oklch(14.1% .005 285.823);
	min-width: 255px !important;
}

#wrapper #main > #sidebar > *:not(#better-redmine-wiki-sidebar-wrapper) {
	display: none;
}

#wrapper #main > #content:has(span.badge-status-locked) {
  & > .contextual > a.icon-edit {
    pointer-events: none;
    text-decoration: underline dotted red;

    &::after {
      content: " (🚫 Locked)";
    }
  }
}

#footer { 
	display: none;
}

#wrapper {
	height: 100%;

	& #wrapper2 {
		height: 100%;
	}
	& #wrapper3 {
		height: 100%;
	}

	& #main{
		height: calc(100% - 100px);
	}
	& #top-menu {
		min-height: 18px;
	}
}
`

const styles_mdEditPreviewSplitView = `
#ajax-indicator {
	display: none !important;
	height: 0;
	width: 0;
}

.jstEditor {
	display: flex;
	gap: 10px;

	& > hidden {
		display: block !important;
	}
}

.jstBlock .hidden {
	display: block;
}

.jstBlock .jstElements.hidden {
	display: inline-block;
}
`

const styles_smallerImages = `
	div.wiki.wiki-page img { max-height: 300px;}
`


/* ------------------------------------------------------------------------------------------------------------------ */


function returnStyleSheet(sheetId: string, styleString: string){
	const style = (typeof document !== "undefined") ? document.createElement("style") : ({} as HTMLStyleElement);
	if (typeof document !== "undefined") {
		style.id = sheetId;
		style.textContent = styleString;
	}

	return style;
}

export function toggleStylesInDom(shouldAttach: boolean, sheetObject: {id: string; sheet: HTMLStyleElement}){
	if (typeof document === "undefined") return;
	const style = document.getElementById(sheetObject.id);
	if (shouldAttach) {
		if (!style) {
			document.head.appendChild(sheetObject.sheet);
		}
	} else if (style) {
		style.parentElement?.removeChild(style);
	}
}

export const zenSheet = {
	id: "brws-sheet-zen",
	get sheet(){
		return returnStyleSheet(this.id, styles_zenMode)
	}
}

export const mdSplitSheet = {
	id: "brws-sheet-mdSplit",
	get sheet() {
		return returnStyleSheet(this.id, styles_mdEditPreviewSplitView)
	}
}

export const smallerImgSheet = {
	id: "brws-sheet-smallerImg",
	get sheet() {
		return returnStyleSheet(this.id, styles_smallerImages)
	}
}