/*
service worker to inject css at the earliest possible time
it is important to avoid flashing
*/

import { doesUrlMatchWithCustomDomainRegex, isTargetUrl, MyConstants, styles_default } from "./folder/constants and styles.ts";

const storage = MyConstants.storage

async function readStorageValues(url: string | undefined): Promise<{ sidebarLoc: "left" | "right"; sidebarWidth: string; zenMode: boolean; smallerImg: boolean}> {
	return new Promise((resolve) => {
		chrome.storage.local.get(Object.values(storage).map(i => i.key), (items) => {
			const useCustomDomainRegex = (items[storage.useCustomDomainRegex.key] as boolean) || storage.useCustomDomainRegex.defaultVal;
			const customDomainRegexString = (items[storage.customDomainRegexString.key] as string) || storage.customDomainRegexString.defaultVal;
			if(useCustomDomainRegex){
				if(!doesUrlMatchWithCustomDomainRegex(customDomainRegexString, url)){
					return;
				}
			}else {
				if (!isTargetUrl(url)){
					return;
				}
			}

			const sidebarLoc = (items[storage.sidebarLocation.key] as "left" | "right") || storage.sidebarLocation.defaultVal;
			const sidebarWidth = (items[storage.sidebarWidth.key] as string) || storage.sidebarWidth.defaultVal;
			const zenMode = (items[storage.zenMode.key] as boolean) || storage.zenMode.defaultVal;
			const smallerImg = (items[storage.smallerImg.key] as boolean) || storage.smallerImg.defaultVal;
			resolve({ sidebarLoc, sidebarWidth, zenMode, smallerImg });
		});
	});
}

async function injectDynamicAndDefaultCss(tabId: number, url: string | undefined) {
	try {
		const { sidebarLoc, sidebarWidth, zenMode, smallerImg } = await readStorageValues(url);
		const dynamicCSS = `
			#wrapper #main {
				flex-direction: ${sidebarLoc === "left" ? "row" : "row-reverse"} !important;
			}

			#wrapper #main > #sidebar { 
				width: ${sidebarWidth} !important;
			}
		`;

		const combinedCSS = dynamicCSS + styles_default;

		const insertCssPromises = [];

		insertCssPromises.push(
			chrome.scripting.insertCSS({
				target: { tabId },
				css: combinedCSS,
				// origin: "USER", // so powerful, makes overriding from dev console impossible
			})
		)

		// >>> avoid zen/img flashing hack >>>
		// we inject zen styles first with service worker to before page load, then delegate the work to react component afterwards
		// why? cuz it is more straightforward to revert affects of zen styles this way if we just completely delete those styles
		if (zenMode) {
			insertCssPromises.push(
				chrome.scripting.insertCSS({
					target: { tabId },
					files: ['zen.css']
				})
			);
		}
		if (smallerImg) {
			insertCssPromises.push(
				chrome.scripting.insertCSS({
					target: { tabId },
					files: ['smaller-img.css']
				})
			);
		}
		await Promise.all(insertCssPromises);

		// cleanup attached styles so that extension can handle after this point.
		if (zenMode) {
			setTimeout(() => {
				chrome.scripting.removeCSS({
					target: { tabId },
					files: ['zen.css']
				});
			}, 1500);
		}
		if (smallerImg) {
			setTimeout(() => {
				chrome.scripting.removeCSS({
					target: { tabId },
					files: ['smaller-img.css']
				});
			}, 1500);
		}
	} catch {}
}

chrome.webNavigation.onCommitted.addListener(async (details) => {
	if (details.frameId !== 0) return;
	// if (!isTargetUrl(details.url)) return;
	injectDynamicAndDefaultCss(details.tabId, details.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status !== "loading") return;
	// if (!isTargetUrl(tab.url)) return;
	injectDynamicAndDefaultCss(tabId, tab.url);
});

chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
	if (details.reason === "install") {
		try {
			if (chrome.runtime.openOptionsPage) {
				chrome.runtime.openOptionsPage();
			} else {
				chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
			}
		} catch {}
	}
});
