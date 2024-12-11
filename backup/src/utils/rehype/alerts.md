import { visitParents } from "unist-util-visit-parents";
import { h } from "hastscript";
import { getOcticonHast } from "./octicon.ts";
function matcher(node: any) {
    return node.type === "element"
        && node.tagName == "blockquote"
}
function visitor(node: any) {
    const pattern = /^\[\!(?<alertType>NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n(?<alertContent>.+)$/ms;
    const [p] = node.children.filter((child: any) => child.type === "element")
    const [text] = p.children;
    const match = text.value.match(pattern);
    if (match) {
        const { alertType, alertContent } = match.groups;

    }
}

export default function () {
    return (tree: any) => visitParents(tree, matcher, visitor);
}
