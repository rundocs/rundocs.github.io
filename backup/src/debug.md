# Page not found
:smiley:

## hljs
```js
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
```

## mermaid

```mermaid
flowchart LR

A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
```
