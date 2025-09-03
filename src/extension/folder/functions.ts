import { useState } from "react";

export type WikiNode = {
	title: string;
	link: string;
	children?: WikiNode[];
};

export function getProjectURL(url: string): string | null {
	/*
		input:  https://redmine.acme.dev/projects/project-name/wiki/index
		input:  https://redmine.acme.dev/projects/project-name/<anything-that-comes-after-slash>
		output: https://redmine.acme.dev/projects/project-name
		---
		input: https://www.redmine.org/projects/project-name/wiki
		output: https://www.redmine.org/projects/project-name
	*/
	const match = url.match(/(https?:\/\/[^/]+\/projects\/[^/]+)/);
	return match ? match[0] : null;
}


export async function fetchWikiTree(url: string): Promise<WikiNode[]> {
	try {
		// const response = await fetch(url, { credentials: "include" });
		const response = await fetch(url);
		const htmlText = await response.text();

		// parse html text
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlText, "text/html");

		const result: WikiNode[] = [];

		function returnTreeFromLi(li: Element): WikiNode {
			const a = li.querySelector("& > a") as HTMLAnchorElement | null;

			const md: WikiNode = {
				title: a?.textContent || "",
				link: a?.href || "#",
			};

			const childrenTree = li.querySelector("& > ul.pages-hierarchy");

			if (childrenTree) {
				md.children = [];
				Array.from(childrenTree.querySelectorAll("& > li")).forEach((child_li) => {
					md.children!.push(returnTreeFromLi(child_li));
				});
			}
			return md;
		}

		const wikiTreeDom = doc.querySelector("div#content > ul.pages-hierarchy");

		if (!wikiTreeDom) return [];

		Array.from(wikiTreeDom.querySelectorAll("& > li")).forEach((li) => {
			result.push(returnTreeFromLi(li));
		});

		return result;
	} catch (error) {
		console.error("Failed to fetch wiki tree:", error);
		return [];
	}
}

export function flattenWikiTree(nodes: WikiNode[]): { title: string; link: string }[] {
	const out: { title: string; link: string }[] = [];
	const walk = (arr: WikiNode[]) => {
		arr.forEach((node) => {
			out.push({ title: node.title, link: node.link });
			if (node.children?.length) {
				walk(node.children);
			}
		});
	};
	walk(nodes);
	return out;
}


export function useLocalStorage<T>({ key, initialValue, escapeChromeStorage = false }: { key: string; initialValue: T, escapeChromeStorage?: boolean }) {
	const [value, setStateValue] = useState<T>(() => {
	  try {
		const stored = localStorage.getItem(key);
		return stored ? (JSON.parse(stored) as T) : initialValue;
	  } catch {
		return initialValue;
	  }
	});
  
	const setValue = (newValue: T) => {
	  setStateValue(newValue);
	  try {
		localStorage.setItem(key, JSON.stringify(newValue));
		if(!escapeChromeStorage){
			chrome.storage.local.set({ [key]: newValue });
		}
	  } catch {
		// ...
	  }
	};
  
	return [value, setValue] as const;
  }


export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }


export function triggerRemoteLinkOutsideShadow({ href, attrs }: { href: string; attrs: Record<string, string> }) {
	const tempId = "brws-temp-remote-link";
	const existing = document.getElementById(tempId) as HTMLAnchorElement | null;
	if (existing) existing.remove();

	const a = document.createElement("a");
	a.id = tempId;

	// set attributes
	for (const [key, value] of Object.entries(attrs)) {
		a.setAttribute(key, value);
	}
	// href
	a.href = href;

	// position off-screen so it doesn't flash
	a.style.position = "fixed";
	a.style.left = "-9999px";
	a.style.top = "-9999px";

	document.body.appendChild(a);
	a.click();

	setTimeout(() => {
		a.remove();
	}, 0);
}