import React from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { MyConstants, TARGET_URL_RE } from "@/extension/folder/constants and styles";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useLocalStorage } from "@/extension/folder/functions";
import { cn } from "@/lib/utils";
import GithubCorner from 'react-github-corner';

export function OptionsApp() {
	const [customRegex, setCustomRegex] = useLocalStorage<string>({
		key: MyConstants.storage.customDomainRegexString.key,
		initialValue: MyConstants.storage.customDomainRegexString.defaultVal
	})

	const [useCustom, setUseCustom] = useLocalStorage<boolean>({
		key: MyConstants.storage.useCustomDomainRegex.key,
		initialValue: MyConstants.storage.useCustomDomainRegex.defaultVal
	})

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setCustomRegex(e.target.value)
		if(e.target.value === ""){
			setUseCustom(false);
		}
	}

	return (
		<div className="dark bg-background flex justify-center h-full">
			<div className="p-6 max-w-3xl flex-1 flex flex-col [&>*]:flex-1 justify-center h-fit">
				<div className="flex justify-center gap-4 items-center mb-12">
					<img src="icons/icon128.png" alt="logo" className="size-16" />
					<div>
						<h1 className="text-xl font-semibold text-foreground">Redmine Better Wiki Sidebar</h1>
						<p className="text-lg text-muted-foreground">Options</p>
					</div>
				</div>

				<GithubCorner
					href="https://github.com/tmpluto/redmine-better-wiki-sidebar"
					direction="left"
					bannerColor="var(--primary)"
					octoColor="var(--background)"
					target="_blank"
				/>

				<div className="flex justify-center mb-8">
					<div className="border-dashed border w-fit rounded-md p-4">
						<h2 className="text-foreground text-lg text-center">thanks for downloading 🙂</h2>
						<p className="text-muted-foreground text-center">if your domain is custom, you can set it up here.</p>
					</div>
				</div>

				<div className={cn("flex flex-col gap-2 p-4 rounded-sm mb-8 border-2", !useCustom && "border-green-500")}>
					<p className="text-foreground">default matching pattern <span className="text-muted-foreground">(flags: "i")</span></p>
					<ScrollArea className="rounded-sm border p-3 whitespace-nowrap">
						<code className=" text-green-600">{TARGET_URL_RE.source.replace(/\\/g, '\\\\')}</code>
						<ScrollBar orientation="horizontal" className="pr-6" />
					</ScrollArea>
					<div className="flex flex-col">
						<p className="text-foreground">matches against:</p>
						<li className="pl-4 text-muted-foreground">
							{'"https://www.redmine.org/projects/'}
							<span className="text-orange-600">{"<project-name>"}</span>
							{'/wiki/"'}
						</li>
						<li className="pl-4 text-muted-foreground">
							{'"https://redmine.'}
							<span className="text-orange-600">{"<company-name>"}</span>
							{".dev/projects/"}
							<span className="text-orange-600">{"<project-name>"}</span>
							{'/wiki/"'}
						</li>
					</div>
				</div>

				<div className={cn("flex flex-col gap-2 p-4 rounded-sm mb-8 border-2", useCustom && "border-green-500")}>
					<div className="flex  justify-between items-center flex-1">
						<p className="text-foreground">use a custom regex for the domain part instead <span className="text-muted-foreground">(flags: "i")</span></p>
						<Switch checked={useCustom} onCheckedChange={setUseCustom} disabled={customRegex.length === 0}/>
					</div>
					<div className="flex items-center border rounded-md gap-1 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
						<Input
							// '^https:\\/\\/(?:www\\.redmine\\.org|redmine\\.[a-z0-9-]+\\.dev)\\/projects\\/[^/]+\\/wiki(\\/|$)'
							placeholder="enter your domain as regex"
							className="font-mono text-foreground rounded-none border-0! ring-0!"
							value={customRegex}
							onChange={handleInputChange}
						/>
						<p className="text-green-600 font-mono p-1">{"\\/projects\\/[^/]+\\/wiki(\\/|$)".replace(/\\/g, '\\\\')}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

const container = document.getElementById("root")!;
createRoot(container).render(<OptionsApp />);
