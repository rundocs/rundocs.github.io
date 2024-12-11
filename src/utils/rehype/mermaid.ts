import { plugin, h } from "./plugin.ts";
import mermaid from "mermaid";
import svgDataURI from "mini-svg-data-uri";

async function getMermaidData(text: string, theme: "default" | "dark") {
    mermaid.initialize({
        startOnLoad: false,
        theme,
        securityLevel: "loose",
    });
    const id = "mermaid-" + Math.random().toString(36).substring(2, 15);
    const { svg } = await mermaid.render(id, text);

    const parser = new DOMParser();
    const root = parser.parseFromString(svg, "text/html");
    const [element] = root.getElementsByTagName("svg");
    const { height, width } = element.viewBox.baseVal;

    return {
        dataURI: svgDataURI.toSrcset(svg),
        width,
        height,
        description: element.getAttribute("aria-roledescription"),
    }
}
function matcher(node: any) {
    return node.type === "element"
        && node.tagName === "code"
        && node.properties.className.includes("language-mermaid")
}
async function visitor(node: any, ancestors: any) {
    try {
        const [code] = node.children;
        const div = ancestors.at(-1);
        const dark = await getMermaidData(code.value, "dark");
        const light = await getMermaidData(code.value, "default");
        div.tagName = "div";
        div.properties = {
            className: [
                "mermaid",
                "p-3",
            ],
        };
        div.children = [
            h("picture", [
                h("source", {
                    media: "(prefers-color-scheme: dark)",
                    type: "image/svg+xml",
                    srcset: dark.dataURI,
                }),
                h("img", {
                    height: light.height,
                    width: light.width,
                    title: code.value,
                    alt: light.description,
                    src: light.dataURI,
                })
            ])
        ];
    } catch (error) {
        console.error("Error rendering Mermaid diagram:", error);
    }
}

export default plugin(matcher, visitor);
