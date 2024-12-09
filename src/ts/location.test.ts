import { expect, test } from "vitest";
import { route } from "./source.js";

let { route } = new Location();
test("/", () => {
    const result = route("/");
    expect(result).toEqual({ user: undefined, repo: undefined, path: undefined });
});

test("/user", () => {
    const result = route("/user");
    expect(result).toEqual({ user: "user", repo: undefined, path: undefined });
});

test("/user/", () => {
    const result = route("/user/");
    expect(result).toEqual({ user: "user", repo: undefined, path: undefined });
});

test("/user/repo", () => {
    const result = route("/user/repo");
    expect(result).toEqual({ user: "user", repo: "repo", path: undefined });
});

test("/user/repo/", () => {
    const result = route("/user/repo/");
    expect(result).toEqual({ user: "user", repo: "repo", path: undefined });
});

test("/user/repo/path", () => {
    const result = route("/user/repo/path");
    expect(result).toEqual({ user: "user", repo: "repo", path: "path" });
});

test("/user/repo/path/", () => {
    const result = route("/user/repo/path/");
    expect(result).toEqual({ user: "user", repo: "repo", path: "path/" });
});

test("/user/repo/path/to", () => {
    const result = route("/user/repo/path/to");
    expect(result).toEqual({ user: "user", repo: "repo", path: "path/to" });
});

test("/user/repo/path/to/", () => {
    const result = route("/user/repo/path/to/");
    expect(result).toEqual({ user: "user", repo: "repo", path: "path/to/" });
});

test("/user/repo/path/to/the", () => {
    const result = route("/user/repo/path/to/the");
    expect(result).toEqual({ user: "user", repo: "repo", path: "path/to/the" });
});

test("/user/repo/path/to/the/", () => {
    const result = route("/user/repo/path/to/the/");
    expect(result).toEqual({ user: "user", repo: "repo", path: "path/to/the/" });
});

test("/user/repo/path/to/the/file.md", () => {
    const result = route("/user/repo/path/to/the/file.md");
    expect(result).toEqual({ user: "user", repo: "repo", path: "path/to/the/file.md" });
});
