import React from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { SidebarApp } from "./SidebarApp";
import { doesUrlMatchWithCustomDomainRegex, isTargetUrl, MyConstants } from "./folder/constants and styles";

// Minimal: inject Tailwind @property block to document.head so variables work in shadow
async function injectTailwindPropertiesOnce() {
	try {
		if (document.head.querySelector("style[data-tailwind-properties='true']")) return;
		const cssUrl = chrome.runtime.getURL("assets/content.css");
		const res = await fetch(cssUrl);
		const styles = await res.text();
		const idx = styles.indexOf("@property");
		if (idx === -1) return;
		const atProperties = styles.slice(idx).replaceAll("inherits: false", "inherits: true");
		const style = document.createElement("style");
		style.setAttribute("data-tailwind-properties", "true");
		style.textContent = atProperties;
		document.head.appendChild(style);
	} catch {}
}

// Minimal: just add a <link rel="stylesheet"> to shadow root pointing to built CSS
function ensureShadowStyles(shadowRoot: ShadowRoot) {
	if (shadowRoot.querySelector("link[data-ext-style='true']")) return;
	const linkEl = document.createElement("link");
	linkEl.rel = "stylesheet";
	linkEl.href = chrome.runtime.getURL("assets/content.css");
	linkEl.setAttribute("data-ext-style", "true");
	shadowRoot.appendChild(linkEl);
}

function mountReactApp() {
	const sidebar = document.querySelector("#wrapper #main > #sidebar");
	if (!(sidebar instanceof HTMLElement)) return;

	const hostId = "better-redmine-wiki-sidebar-wrapper";
	let host = document.getElementById(hostId);
	if (!host) {
		host = document.createElement("div");
		host.id = hostId;
		sidebar.appendChild(host);
	}

	const shadowRoot = host.shadowRoot || host.attachShadow({ mode: "open" });
	ensureShadowStyles(shadowRoot);

	let mount = shadowRoot.getElementById("app-root");
	if (!mount) {
		mount = document.createElement("div");
		mount.id = "app-root";
		shadowRoot.appendChild(mount);
	}

	const root = createRoot(mount);
	root.render(<SidebarApp useSampleData={false} />);
}

(async function init() {
	const storage = MyConstants.storage;
	chrome.storage.local.get([MyConstants.storage.customDomainRegexString.key, MyConstants.storage.useCustomDomainRegex.key], async (items) => {
		const useCustomDomainRegex = (items[storage.useCustomDomainRegex.key] as boolean) || storage.useCustomDomainRegex.defaultVal;
		const customDomainRegexString = (items[storage.customDomainRegexString.key] as string) || storage.customDomainRegexString.defaultVal;
		if(useCustomDomainRegex){
			if(!doesUrlMatchWithCustomDomainRegex(customDomainRegexString, window.location.href)){
				return;
			}
		}else {
			if (!isTargetUrl(window.location.href)){
				return;
			}
		}

		await injectTailwindPropertiesOnce();
		mountReactApp();
	});
})();

