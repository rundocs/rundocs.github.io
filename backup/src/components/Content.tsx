import { useState, useEffect } from "react";
import { getMarkdown } from "../utils/markdown.ts"

function Page() {
    const [htmlContent, setHtmlContent] = useState<string>("");

    useEffect(() => {
        async function getHtmlContent() {
            try {
                const html = await getMarkdown("/test/markdown.md");
                setHtmlContent(html);
            } catch (error) {
                const err = error as Error;
                setHtmlContent("Error processing markdown:" + err.message);
            }
        }
        getHtmlContent();
    }, []);

    return (
        <div
            className="container-lg px-3 my-5 markdown-body"
            dangerouslySetInnerHTML={{
                __html: htmlContent,
            }}
        />
    )
}

export default Page;
