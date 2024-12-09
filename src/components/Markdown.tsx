import { useState, useEffect } from "react";
import { createProcessor } from "../utils/markdown.ts"

function Page({ children }: { children: string }) {
    const [processedMarkdown, setProcessedMarkdown] = useState<string>("");

    useEffect(() => {
        const processMarkdown = async () => {
            const html = await createProcessor().process(children);
            setProcessedMarkdown(String(html));
        };
        processMarkdown();
    }, [children]);

    return (
        <div
            className="container-lg px-3 my-5 markdown-body"
            dangerouslySetInnerHTML={{
                __html: processedMarkdown,
            }}
        />
    )
}

export default Page;
