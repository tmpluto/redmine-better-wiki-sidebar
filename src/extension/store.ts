import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MyConstants, smallerImgSheet, toggleStylesInDom, zenSheet } from "./folder/constants and styles";

const storage = MyConstants.storage;

interface ZenModeStore {
	zenMode: boolean
	applyZen: () => void
	setZenMode: (zenStatus: boolean) => void
}

export const useZenModeStore = create(
	persist<ZenModeStore>(
		(set, get) => {
			return {
				zenMode: storage.zenMode.defaultVal,
				applyZen: () => {
					toggleStylesInDom(get().zenMode, zenSheet);
				},
				setZenMode: (zenStatus: boolean) => {
					set(() => ({ zenMode: zenStatus }))

					get().applyZen();
					
					try {
						chrome.storage.local.set({ [storage.zenMode.key]: zenStatus });
					}catch {}
				}
					
			};
		},
		{
			name: storage.zenMode.key,
		}
	)
);


interface SidebarStore {
	sidebarLocation: string
	sidebarWidth: string
	applySidebarLocation: () => void
	setSidebarLocation: (newLoc: "left" | "right" | null) => void
	setSidebarWidth: (width: string) => void
}

export const useSidebarStore = create(
	persist<SidebarStore>(
		(set, get) => {
			return {
				sidebarLocation: storage.sidebarLocation.defaultVal,
				sidebarWidth: storage.sidebarWidth.defaultVal,
				applySidebarLocation: () => {
					const main = document.querySelector<HTMLElement>(MyConstants.selectors.main)!;
					if (get().sidebarLocation === "left") {
						main.style.setProperty("flex-direction", "row", "important");
					} else {
						main.style.setProperty("flex-direction", "row-reverse", "important");
					}
				},
				setSidebarLocation: (newLoc: "left" | "right" | null) => {
					if (!newLoc) return;

					set(() => ({ sidebarLocation: newLoc }))

					get().applySidebarLocation()

					try {
						chrome.storage.local.set({ [storage.sidebarLocation.key]: newLoc });
					}catch {}
				},
				setSidebarWidth: (width: string) => {
					set(() => ({ sidebarWidth: width }))
					try {
						chrome.storage.local.set({ [storage.sidebarWidth.key]: width });
					}catch {}
				}
			}
		},
		{
			name: storage.sidebarStore.key
		}
	)
)

interface SmallerImgStore {
	smallerImg: boolean
	applySmallerImg: () => void
	setSmallerImg: (smallerImgStatus: boolean) => void
}

export const useSmallerImgStore = create(
	persist<SmallerImgStore>(
		(set, get) => {
			return {
				smallerImg: storage.smallerImg.defaultVal,
				applySmallerImg: () => {
					toggleStylesInDom(get().smallerImg, smallerImgSheet);
				},
				setSmallerImg: (smallerImgStatus: boolean) => {
					set(() => ({ smallerImg: smallerImgStatus }))

					get().applySmallerImg();
					
					try {
						chrome.storage.local.set({ [storage.smallerImg.key]: smallerImgStatus });
					}catch {}
				}
					
			};
		},
		{
			name: storage.smallerImg.key,
		}
	)
);


interface ExpandedWikisStore {
	expandedWikis: Record<string, string[]>
	addOrRemoveWikiAsExpanded: (projectUrl: string, wikiUrl: string) => void
}

/*
sample data format:
{
	project_url: [wiki1_url, wiki2_url],
	project_2_url: [wiki1_url, wiki2_url],
}
*/

export const useExpandedWikisStore = create(
	persist<ExpandedWikisStore>(
		(set, get) => {
			return {
				expandedWikis: storage.expandedWikis.defaultVal,
				addOrRemoveWikiAsExpanded: (projectUrl: string, wikiUrl: string) => {
					set((state) => {
						const current = state.expandedWikis[projectUrl] || [];
						let next: string[];
						if (current.includes(wikiUrl)) {
							next = current.filter(url => url !== wikiUrl);
						} else {
							next = [...current, wikiUrl];
						}
						return {
							expandedWikis: {
								...state.expandedWikis,
								[projectUrl]: next
							}
						}
					})
				}
			}
		},
		{
			name: storage.expandedWikis.key
		}
	)
)