import { plugin, h, octicon } from "./plugin.ts";
function matcher(node: any) {
    return node.type === "element"
        && ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)
        && node.properties.id;
}
function visitor(node: any) {
    const children = node.children;
    node.children = [
        ...children,
        h("a.anchor", {
            href: "#" + node.properties.id,
            ariaLabel: "Permalink: " + children[0].value,
        }, [
            octicon("link", 16),
        ]),
    ];
    node.properties.tabIndex = -1;
}

export default plugin(matcher, visitor);
