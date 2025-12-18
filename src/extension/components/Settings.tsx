import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronLeft, ChevronRight, Download, ExternalLink, Github } from "lucide-react";
import {
	getProjectURL,
	triggerRemoteLinkOutsideShadow,
} from "../folder/functions";
import { mdSplitSheet, MyConstants,  toggleStylesInDom } from "../folder/constants and styles";
import { useSidebarStore, useSmallerImgStore, useZenModeStore } from "../store";


export function Settings() {
		const {zenMode, setZenMode} = useZenModeStore()
		const {sidebarLocation, setSidebarLocation} = useSidebarStore()
		const {smallerImg, setSmallerImg} = useSmallerImgStore()
	const [splitView, setSplitView] = useState(false);

	const splitInterval = useRef<NodeJS.Timeout | null>(null);

	function handleMdSplitViewSwitch(val: boolean) {
		setSplitView(val);
		if (splitInterval.current) {
			clearInterval(splitInterval.current);
			splitInterval.current = null;
		}
		toggleStylesInDom(val, mdSplitSheet);

		if (val) {
			splitInterval.current = setInterval(() => {
				const tabPreview = document.querySelector("a.tab-preview");
				if (tabPreview) {
					(tabPreview as HTMLElement).click();
				}
			}, 1000);
		} else {
			(document.querySelector("a.tab-edit") as HTMLElement)?.click();
		}
	}

	function resetSidebarWidth() {
		localStorage.setItem(MyConstants.storage.sidebarWidth.key, "255px");
		const sidebar = document.getElementById("sidebar") as HTMLElement | null;
		if (sidebar) sidebar.style.width = "255px";
	}


	return (
		<div className="flex flex-col gap-4 pt-2 text-foreground">
			<div className="flex items-center justify-between">
				<p className="text-sm">zen mode</p>
				<Switch checked={zenMode} onCheckedChange={setZenMode} />
			</div>
			<div className="flex items-center justify-between">
				<p className="text-sm">sidebar position</p>
				<ToggleGroup type="single" variant="outline" value={sidebarLocation} onValueChange={setSidebarLocation as ((value: string) => void)}>
					<ToggleGroupItem value="left" aria-label="Left">
						<ChevronLeft className="h-4 w-4" />
					</ToggleGroupItem>
					<ToggleGroupItem value="right" aria-label="Right">
						<ChevronRight className="h-4 w-4" />
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<div className="border p-2 rounded-sm bg-accent">
				<div className="flex items-center justify-between mb-1">
					<p className="text-sm">split view</p>
					<Switch checked={splitView} onCheckedChange={handleMdSplitViewSwitch} />
				</div>
				<div className="">
					<p className="text-muted-foreground text-xs">
						see markdown preview while editing. editing might feel little bit slow when you turn this on.
					</p>
				</div>
			</div>
			<div className="border p-2 rounded-sm bg-accent">
				<div className="flex items-center justify-between mb-1">
					<p className="text-sm">show images smaller</p>
					<Switch checked={smallerImg} onCheckedChange={setSmallerImg} />
				</div>
				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground text-xs">
						attached images by default takes up too much space on screen.
					</p>
					<p className="text-muted-foreground text-xs">
						you can double-click an image to enlarge it to full screen, and press Esc to return.
					</p>
				</div>
			</div>
			<Button asChild variant="ghost">
				<a href={`${getProjectURL(window.location.href)}/wiki/date_index`}>
					index by date
					<ExternalLink className="size-4" />
				</a>
			</Button>
			<Button
				title="export the entire project wiki as pdf"
				variant="default"
				className="h-auto"
				onClick={() =>
					triggerRemoteLinkOutsideShadow({
						href: getProjectURL(window.location.href) + "/wiki/export.pdf",
						attrs: { rel: "nofollow" },
					})
				}
			>
				<p className="text-wrap">export the entire project wiki as pdf</p>
				<Download className="size-4" />
			</Button>
			<div>
				<Button variant="secondary" className="w-full" onClick={resetSidebarWidth}>
					reset sidebar size
				</Button>
			</div>
			<Button asChild variant="link" className="mt-8">
				<a href="https://github.com/tmpluto/redmine-better-wiki-sidebar" target="_blank">
					<Github className="size-4" /> source code
				</a>
			</Button>
		</div>
	);
}
