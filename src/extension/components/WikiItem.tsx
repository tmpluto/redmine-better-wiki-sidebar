import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	ChevronDown,
	ChevronRight,
	Plus,
} from "lucide-react";
import clsx from "clsx";
import AutoSizer from "react-virtualized-auto-sizer";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuShortcut,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { getProjectURL, triggerRemoteLinkOutsideShadow, type WikiNode } from "../folder/functions";
import { useExpandedWikisStore } from "../store";


function isWikiActive(wikiUrl: string){
	// slice(0, -5) -> because end of link might contain "/edit" if you are in edit mode.
	return wikiUrl === window.location.href || window.location.href.slice(0, -5) === wikiUrl
}


export function WikiItem({ node, level, hideChildren }: { node: WikiNode; level: number; hideChildren?: boolean }) {
	const hasChildren = !!node.children?.length;
	const isActive = isWikiActive(node.link);
	
	const projectUrl = useMemo(() => getProjectURL(window.location.href) || "", []);
	
	const expandedWikis = useExpandedWikisStore((s) => s.expandedWikis);
	const addOrRemoveWikiAsExpanded = useExpandedWikisStore((s) => s.addOrRemoveWikiAsExpanded);
	const open = hasChildren && !!expandedWikis[projectUrl]?.includes(node.link);

	// because if context menu portal is defined by radix, it will throw into the normal dom and styles will be applied.
	const portalContainer = document.getElementById("better-redmine-wiki-sidebar-wrapper")?.shadowRoot || null;

	return (
		<li className="" style={{ paddingLeft: level === 0 ? 0 : 14 }}>
			<ContextMenu>
				<ContextMenuTrigger
					asChild
				>
					<div
						className={clsx(
							"group flex items-center rounded-sm",
							hasChildren && "hover:bg-accent data-[state=open]:bg-accent",
							!hideChildren && "px-1"
						)}
					>
						{!hideChildren &&
							(hasChildren ? (
								<Button
									variant="outline"
									size="icon"
									className="size-5 rounded-sm"
									onClick={(e) => {
										e.stopPropagation();
										addOrRemoveWikiAsExpanded(projectUrl, node.link);
									}}
									aria-label={open ? "collapse" : "expand"}
								>
									{open ? (
										<ChevronDown className="size-4 text-foreground" />
									) : (
										<ChevronRight className="size-4 text-foreground" />
									)}
								</Button>
							) : (
								<span className="inline-block size-5" />
							))}
						<AutoSizer disableHeight>
							{({ width }) => {
								return (
									<div
										className="flex justify-between w-full pl-2 pr-1 rounded-sm hover:bg-accent group-data-[state=open]:bg-accent h-7 items-center"
										style={{ width: !hideChildren ? (width - 16) : width }}
									>
										<a
											href={node.link}
											className="text-sm py-0.5 text-foreground hover:underline truncate"
											style={{ color: isActive ? "oklch(0.837 0.128 66.29)" : undefined }}
										>
											{node.title}
										</a>
										<Button
											size="icon"
											className="size-5 rounded-sm hidden group-hover:flex"
											title="add sub wiki"
											onClick={() =>
												triggerRemoteLinkOutsideShadow({
													href: node.link.replace("/wiki/", "/wiki/new?parent="),
													attrs: { "data-remote": "true" },
												})
											}
										>
											<Plus className="size-4 text-foreground hover:text-primary" />
										</Button>
									</div>
								);
							}}
						</AutoSizer>
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent className="w-68 dark" container={portalContainer}>
					<ContextMenuItem
						onClick={() =>
							triggerRemoteLinkOutsideShadow({ href: node.link + ".pdf", attrs: { rel: "nofollow" } })
						}
					>
						export the single page as PDF
						<ContextMenuShortcut>📥</ContextMenuShortcut>
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
			{!hideChildren && hasChildren && (
				<ul className="list-none" style={{ display: open ? "block" : "none" }}>
					{node.children!.map((c) => (
						<WikiItem key={c.link} node={c} level={level + 1} />
					))}
				</ul>
			)}
		</li>
	);
}
