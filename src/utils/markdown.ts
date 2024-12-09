
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

export function createProcessor() {
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
        .use(rehypeRaw)
        .use(rehypeHighlight)
        .use(rehypeSlug)
        // Serialize HAST to HTML
        .use(rehypeStringify)
}
