import mermaid from "mermaid";
import { visit } from "unist-util-visit";
import svgToMiniDataURI from "mini-svg-data-uri";

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
        dataURI: svgToMiniDataURI.toSrcset(svg),
        height,
        width,
        description: element.getAttribute("aria-roledescription"),
    }
}

async function getPicture(text: string) {
    const light = await getMermaidData(text, "default");
    const dark = await getMermaidData(text, "dark");

    return {
        type: "element",
        tagName: "picture",
        children: [{
            type: "element",
            tagName: "source",
            properties: {
                media: "(prefers-color-scheme: dark)",
                type: "image/svg+xml",
                srcset: dark.dataURI,
            },
        }, {
            type: "element",
            tagName: "img",
            properties: {
                height: light.height,
                width: light.width,
                title: text,
                alt: light.description,
                src: light.dataURI,
            },
        }]
    }
}
async function handleMermaid(node: any, parent: any) {
    try {
        const picture = await getPicture(node.children[0].value)
        parent.tagName = "div";
        parent.properties = {
            className: [
                "mermaid",
                "p-3",
            ],
        };
        parent.children = [picture];
    } catch (error) {
        console.error("Error rendering Mermaid diagram:", error);
    }
}

export default function rehypeMermaid() {
    return async function (tree: any) {
        // // 2次?????????
        // console.log("iiiiiii" + Date.now());

        const promises: Promise<void>[] = [];
        visit(tree, "element", function (node, _, parent) {
            if (parent.tagName === "pre" && node.tagName === "code") {
                if (node.properties.className.includes("language-mermaid")) {
                    promises.push(handleMermaid(node, parent));
                }
            }
        });
        await Promise.all(promises);
    };
}
