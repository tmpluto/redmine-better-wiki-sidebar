import clsx from "clsx";
import { useSidebarStore } from "../store";


export function ResizeHandle() {
	const {sidebarLocation, setSidebarWidth} = useSidebarStore()

	const sidebarEl: HTMLElement | null = document.getElementById("sidebar");

	let startX = 0;
	let startWidth = 0;

	function handleMouseDown(e: MouseEvent) {
		e.preventDefault();
		startX = e.clientX;
		startWidth = sidebarEl!.offsetWidth;
		document.addEventListener("mousemove", resizeOnMouseMove, false);
		document.addEventListener("mouseup", stopResizeOnMouseUp, false);
	}

	function resizeOnMouseMove(e: MouseEvent) {
		let newWidth: number;
		if (sidebarLocation === "right") {
			newWidth = startWidth - (e.clientX - startX); // - 28; // this was needed when there was still original #sidebar padding
		} else {
			newWidth = startWidth + (e.clientX - startX); // - 28; // this was needed when there was still original #sidebar padding
		}
		const newWidthString = `${newWidth}px`;
		sidebarEl!.style.setProperty("width", newWidthString, "important");
		setSidebarWidth(newWidthString);
	}

	function stopResizeOnMouseUp() {
		document.removeEventListener("mousemove", resizeOnMouseMove, false);
		document.removeEventListener("mouseup", stopResizeOnMouseUp, false);
	}

	return (
		<div
			onMouseDown={handleMouseDown as any}
			className={clsx(
				"text-xs text-muted-foreground w-[10px] flex justify-center items-center text-center",
				"cursor-ew-resize"
			)}
		>
			. . .
		</div>
	);
}