/**
 * Recursively extracts all children from a Figma document structure
 * @param nodes - Array of Figma nodes to process
 * @returns Array of extracted nodes with their hierarchical structure preserved
 */
export function extractFigmaChildren(nodes: any[]): any[] {
    if (!nodes || !Array.isArray(nodes)) {
        return [];
    }

    return nodes.map((node) => {
        // Create a base object with essential properties
        const extractedNode: any = {
            id: node.id,
            type: node.type,
            name: node.name,
            children: node.children ? extractFigmaChildren(node.children) : [],
        };

        return extractedNode;
    });
}

export function get_figma_file_key(figma_url: string) {
    const matches = figma_url.match(/\/design\/([^\/\?]+)/);
    const fileKey = matches ? matches[1] : figma_url.split("/").pop();

    return fileKey;
}
