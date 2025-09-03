import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// first run for content input point, then for background input point
export default defineConfig(() => {
	// TODO: build is separated into 3 steps because otherwise build was creating shared files if input points were importing from the same files.
	const inputMaps = {
		background: { background: path.resolve(__dirname, "src/extension/background.ts")},
		content: {content: path.resolve(__dirname, "src/extension/content.tsx")},
		options: {options: path.resolve(__dirname, "src/options/index.tsx")}
	}

    const chosenInput = (process.env.BUILD_TARGET) || "content";
    const input = inputMaps[chosenInput as keyof typeof inputMaps]
    // const format = isBackground ? 'es' as const : 'es' as const;
    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        build: {
            outDir: "dist",
            emptyOutDir: chosenInput === "content",
            // cssCodeSplit: true,
            rollupOptions: {
                input,
                output: {
                    // format,
                    entryFileNames: "assets/[name].js",
                    chunkFileNames: "assets/[name].js",
                    // manualChunks: undefined,
                    // inlineDynamicImports: true,
                    assetFileNames: (assetInfo: { name?: string }) => {
                        // if (assetInfo.name && assetInfo.name.endsWith(".css")) {
                        //     return isBackground ? "assets/[name][extname]" : "assets/content[extname]";
                        // }
                        return "assets/[name][extname]";
                    },
                },
            },
        },
    };
});
