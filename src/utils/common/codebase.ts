/**
 * Interface representing a file or directory in the repository tree
 */
interface TreeItem {
    path: string;
    mode: string;
    type: "blob" | "tree";
    sha: string;
    size?: number;
    url: string;
}

/**
 * Interface representing a nested file structure
 */
interface NestedTreeItem {
    name: string;
    path: string;
    type: "file" | "directory";
    children?: NestedTreeItem[];
    sha: string;
    size?: number;
    url: string;
}

/**
 * Converts a flat repository tree structure into a nested directory structure
 * @param treeItems The flat array of tree items from the repository
 * @returns A nested tree structure representing the file system
 */
export function convertToNestedTree(treeItems: TreeItem[]): NestedTreeItem[] {
    const root: NestedTreeItem[] = [];
    const map: Record<string, NestedTreeItem> = {};

    // First, ensure all directory paths are identified and included
    const allDirectories = new Set<string>();

    // Extract all directory paths including intermediate directories
    treeItems.forEach((item) => {
        // For each item, add all parent directory paths to ensure they exist
        const pathParts = item.path.split("/");
        let currentPath = "";

        for (
            let i = 0;
            i < pathParts.length - (item.type === "blob" ? 1 : 0);
            i++
        ) {
            currentPath = currentPath
                ? `${currentPath}/${pathParts[i]}`
                : pathParts[i];
            allDirectories.add(currentPath);
        }
    });

    // Create all directory nodes first (including those not explicitly in the tree)
    const sortedDirs = Array.from(allDirectories).sort(
        (a, b) => a.split("/").length - b.split("/").length,
    );

    // Create directories in order of depth to ensure parents exist before children
    sortedDirs.forEach((dirPath) => {
        if (!map[dirPath]) {
            const pathParts = dirPath.split("/");
            const name = pathParts[pathParts.length - 1];

            const dirNode: NestedTreeItem = {
                name,
                path: dirPath,
                type: "directory",
                children: [],
                sha: "", // Will be updated if this path has a tree entry
                url: "",
            };

            map[dirPath] = dirNode;

            if (pathParts.length === 1) {
                // Root level directory
                root.push(dirNode);
            } else {
                // Add to parent
                const parentPath = pathParts.slice(0, -1).join("/");
                if (map[parentPath]) {
                    if (!map[parentPath].children) {
                        map[parentPath].children = [];
                    }
                    map[parentPath].children.push(dirNode);
                }
            }
        }
    });

    // Now process the actual items from the repository tree
    treeItems.forEach((item) => {
        const pathParts = item.path.split("/");
        const name = pathParts[pathParts.length - 1];

        if (item.type === "blob") {
            // File item
            const fileNode: NestedTreeItem = {
                name,
                path: item.path,
                type: "file",
                sha: item.sha,
                url: item.url,
            };

            if (item.size !== undefined) {
                fileNode.size = item.size;
            }

            if (pathParts.length === 1) {
                // Root level file
                root.push(fileNode);
            } else {
                // Add to parent directory
                const parentPath = pathParts.slice(0, -1).join("/");
                if (map[parentPath]) {
                    if (!map[parentPath].children) {
                        map[parentPath].children = [];
                    }
                    map[parentPath].children.push(fileNode);
                } else {
                    // Create parent directories that may have been missed
                    let tempPath = "";
                    for (let i = 0; i < pathParts.length - 1; i++) {
                        const part = pathParts[i];
                        tempPath = tempPath ? `${tempPath}/${part}` : part;

                        if (!map[tempPath]) {
                            const dirNode: NestedTreeItem = {
                                name: part,
                                path: tempPath,
                                type: "directory",
                                children: [],
                                sha: "",
                                url: "",
                            };

                            map[tempPath] = dirNode;

                            if (i === 0) {
                                // Root level directory
                                root.push(dirNode);
                            } else {
                                // Add to parent
                                const dirParentPath = pathParts
                                    .slice(0, i)
                                    .join("/");
                                const parentDirNode = map[dirParentPath];
                                if (parentDirNode && parentDirNode.children) {
                                    parentDirNode.children.push(dirNode);
                                }
                            }
                        }
                    }

                    // Now add the file to the parent
                    const parentNode: any = map[parentPath];
                    if (parentNode && parentNode.children) {
                        parentNode.children.push(fileNode);
                    }
                }
            }
        } else if (item.type === "tree") {
            // Update directory info if it exists
            if (map[item.path]) {
                map[item.path].sha = item.sha;
                map[item.path].url = item.url;
            }
        }
    });

    return root;
}

/**
 * Processes repository tree data from API response
 * @param payload The API response containing the tree data
 * @returns A nested tree structure representing the file system
 */
export function processRepositoryTree(payload: any): NestedTreeItem[] {
    if (!payload || !payload.tree || !Array.isArray(payload.tree)) {
        return [];
    }

    return convertToNestedTree(payload.tree);
}
