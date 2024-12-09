type Method = "debug" | "log" | "warn" | "error";
function logger(method: Method, badgeName: string, badgeContent: string, ...args: any[]): void {
    const colors = {
        debug: "#808fa3",       // --data-gray-color-emphasis
        log: "#30a147",         // --data-green-color-emphasis
        warn: "#b88700",        // --data-yellow-color-emphasis
        error: "#df0c24",       // --data-red-color-emphasis
    };
    let style1 = [
        "background: #59636e",  // --bgColor-neutral-emphasis
        "color: white",
        "font-weight: bold",
        "padding: 2px 0.5em",
        "border-radius: 3px 0 0 3px",
    ].join(";");
    let style2 = [
        `background: ${colors[method]}`,
        "color: white",
        "font-weight: bold",
        "padding: 2px 0.5em",
        "border-radius: 0 3px 3px 0",
    ].join(";");
    console[method]("%c%s%c%s", style1, badgeName, style2, badgeContent, ...args);
}

export default logger;
