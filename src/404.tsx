import { createApp } from "./theme.js";
import Markdown from "./components/Markdown.js";

const content = `
# 404
# Page not found
:smiley:
\`\`\`js
function Page({ children }: { children: string }) {
    return (
        <Markdown
            className="container-lg px-3 my-5 markdown-body"
            rehypePlugins={[
                remarkGfm,
                rehypeHighlight,
            ]}
        >{children}</Markdown>
    )
}
\`\`\`
`;
createApp(
    <>
        <Markdown>
            {content}
        </Markdown>
    </>
);
