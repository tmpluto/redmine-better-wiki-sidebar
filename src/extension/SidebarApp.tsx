import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Frown, Plus, Search, Settings2 } from "lucide-react";
import {
	fetchWikiTree,
	getProjectURL,
	triggerRemoteLinkOutsideShadow,
	useLocalStorage,
	type WikiNode,
} from "./folder/functions";
import { SAMPLE_DATA } from "./folder/sample data";
import { flattenWikiTree } from "./folder/functions";
import {  MyConstants, smallerImgSheet, toggleStylesInDom, zenSheet } from "./folder/constants and styles";
import AutoSizer from "react-virtualized-auto-sizer";
import { Spinner } from "@/components/shadcn dot io/spinner";
import { ResizeHandle } from "./components/ResizeHandle";
import { WikiItem } from "./components/WikiItem";
import { Settings } from "./components/Settings";
import { useSidebarStore, useSmallerImgStore, useZenModeStore } from "./store";

export function SidebarApp({ useSampleData }: { useSampleData: boolean }) {
	const [view, setView] = useState<"tree" | "settings" | "search">("tree");
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);

	const applyZen = useZenModeStore(state => state.applyZen)
	const applySidebarLocation = useSidebarStore(state => state.applySidebarLocation)
	const sidebarLocation = useSidebarStore(state => state.sidebarLocation)
	const applySmallerImg = useSmallerImgStore(state => state.applySmallerImg)

	const projectWikiIndex = useMemo(() => (getProjectURL(window.location.href) || "") + "/wiki/index", []);
	const [nodes, setNodes] = useLocalStorage<WikiNode[]>({
		key: "brws-wikiTree::" + projectWikiIndex,
		initialValue: [],
		escapeChromeStorage: true,
	});

	const flatData = useMemo(() => flattenWikiTree(nodes), [nodes]);
	const searchResults = useMemo(
		() => flatData.filter((i) => i.title.toLowerCase().includes(query.toLowerCase())),
		[flatData, query]
	);

	useEffect(() => {
		(async () => {
			setLoading(nodes.length === 0);
			try {
				const data = await fetchWikiTree(projectWikiIndex);
				if (useSampleData) {
					setNodes(SAMPLE_DATA);
				} else {
					setNodes(data);
				}
			} finally {
				setLoading(false);
			}
		})();
	}, [projectWikiIndex]);

	useEffect(() => {
		// Delegate styling from background service to extension
		applyZen()
		applySidebarLocation()
		applySmallerImg()

		// add full screen mode to images
		function handleDblClick(event: MouseEvent) {
			const target = event.target as HTMLElement;

			if (target.tagName.toLowerCase() === "img") {
				if (!document.fullscreenElement) {
					target.requestFullscreen().catch((err) => {
						console.error(`Error entering fullscreen: ${err.message}`);
					});
				}
			}
		}

		function handleExitFullScreen(event: KeyboardEvent) {
			if (event.key === "Escape" && document.fullscreenElement) {
				document.exitFullscreen();
			}
		}

		document.addEventListener("dblclick", handleDblClick);
		document.addEventListener("keydown", handleExitFullScreen);

		return () => {
			document.removeEventListener("dblclick", handleDblClick);
			document.removeEventListener("keydown", handleExitFullScreen);
		};
	}, []);


	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const val = e.target.value
		setQuery(val)
		if (val.trim().length === 0) {
			setView("tree")
		}else {
			setView("search")
		}
	}
	
	return (
		<div className="dark bg-background flex h-full">
			{sidebarLocation == "right" && <ResizeHandle/>}
			<div className="p-4 w-full flex flex-col" style={{ maxWidth: "calc(100% - 10px)" }}>
				{/* done Top bar */}
				<div className="flex items-center gap-2">
					<div className="relative flex items-center flex-grow">
						<Search className="absolute left-2 size-4 text-muted-foreground" />
						<Input
							placeholder="search wikis ..."
							className="pl-7 text-foreground"
							value={query}
							onChange={handleInputChange}
						/>
					</div>
					<Button
						title="add new wiki page at top level"
						size="icon"
						variant="default"
						onClick={() =>
							triggerRemoteLinkOutsideShadow({
								href: getProjectURL(window.location.href) + "/wiki/new",
								attrs: { "data-remote": "true" },
							})
						}
					>
						<Plus className="size-4" />
					</Button>
					<Button
						variant="secondary"
						size="icon"
						onClick={() => setView((v) => (v === "settings" ? "tree" : "settings"))}
					>
						<Settings2 className="size-4" />
					</Button>
				</div>
				<Separator className="my-3" />

				{/* Content area */}
				<div className="mt-1 flex-1">
					{view === "tree" && (
						<AutoSizer disableWidth>
							{({ height }) => (
								<ScrollArea style={{ height }}>
									{loading ? (
										<div
											className="flex justify-center items-center"
											style={{ height: height - 8 }}
										>
											<Spinner className="text-muted-foreground" size={38} variant="circle" />;
										</div>
									) : (
										<div>
											<ul className="list-none w-full">
												{nodes.map((n) => (
													<WikiItem key={n.link} node={n} level={0} />
												))}
											</ul>
										</div>
									)}
								</ScrollArea>
							)}
						</AutoSizer>
					)}

					{view === "settings" && (
						<Settings />
					)}

					{view === "search" && searchResults.length > 0 && (
						<div className="pt-1">
							<ul className="list-none w-full">
								{searchResults.map((r) => (
									<WikiItem key={r.link} node={r} level={0} hideChildren={true} />
								))}
							</ul>
						</div>
					)}

					{((view === "search" && searchResults.length === 0) || (view === "tree" && nodes.length === 0)) && (
						<div className="w-full p-6 flex flex-col items-center justify-center text-sm text-muted-foreground gap-2">
							<Frown className="h-7 w-7" />
							<p>no wikis found</p>
						</div>
					)}
				</div>
			</div>
			{sidebarLocation == "left" && <ResizeHandle/>}
		</div>
	);
}
