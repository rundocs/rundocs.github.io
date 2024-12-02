import { ThemeProvider, BaseStyles } from "@primer/react";
import "./globals.scss";
export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <ThemeProvider colorMode="auto">
                    <BaseStyles>
                        {children}
                    </BaseStyles>
                </ThemeProvider>
            </body>
        </html>
    )
}
