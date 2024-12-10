import { unified } from "unified";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkRemoveHtmlComments from "remark-remove-comments";

import request from "./request.ts";
import rehypeMermaid from "./rehype/mermaid.ts";
function createProcessor() {
    return unified()
        // Parse Markdown to AST
        .use(remarkParse)

        // Start AST
        .use(remarkRemoveHtmlComments)
        .use(remarkGfm)
        .use(remarkGemoji)

        // Convert AST to HAST
        .use(remarkRehype, { allowDangerousHtml: true })

        // Start HAST
        // https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins
        .use(rehypeRaw)
        .use(rehypeHighlight)
        .use(rehypeSlug)
        .use(rehypeMermaid)

        // Serialize HAST to HTML
        .use(rehypeStringify)
}
async function getContent(url: RequestInfo) {
    const res = await request(url);
    if (res.ok) {
        return res.text();
    } else {
        throw new Error(String(res.status));
    }
}
export async function getMarkdown(url: RequestInfo): Promise<string> {
    const processor = createProcessor();
    const markdown = await getContent(url);
    const { value } = await processor.process(markdown);
    return String(value);
}
