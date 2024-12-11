import { visitParents } from "unist-util-visit-parents";
// @ts-ignore
import octicons from "@primer/octicons";
import { parse } from "parse5";
import { fromParse5 } from "hast-util-from-parse5";

export function octicon(name: string, size: number = 16) {
    if (octicons[name]) {
        const html = octicons[name].toSVG({
            width: size,
        });
        const htmlAst = parse(html, {
            sourceCodeLocationInfo: true,
        });
        return fromParse5(htmlAst, { file: html });
    } else {
        throw new Error(`No Octicon named ${name}!`);
    }
}

export function plugin(matcher: any, visitor: any) {
    return () => {
        return async (tree: any) => {
            const tasks: any[] = [];
            visitParents(tree, matcher, (node: any, ancestors: any) => {
                tasks.push(visitor(node, ancestors));
            });
            await Promise.all(tasks);
        }
    }
}

export { h } from "hastscript";
