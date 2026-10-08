import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({ base: "/file-size-visualizer/", build: { sourcemap: false }, plugins: [react()] });
