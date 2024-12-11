import { visitParents } from "unist-util-visit-parents";
import { h } from "hastscript";
import { getOcticonHast } from "./octicon.ts";
function matcher(node: any) {
    return node.type === "element"
        && node.tagName == "blockquote"
}
function visitor(node: any) {
    const pattern = /^\[\!(?<alertType>NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n(?<alertContent>.+)$/ms;
    let [p] = node.children.filter((child: any) => child.type === "element")
    let [text] = p.children;
    let match = text.value.match(pattern);
    if (match) {
        const { alertType, alertContent } = match.groups;

    }
}

export default function () {
    return (tree: any) => visitParents(tree, matcher, visitor);
}
