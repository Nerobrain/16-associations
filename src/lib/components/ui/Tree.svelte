<script lang="ts">
    let {
        nodes = [],
        levelGapX = 150,
        nodeGapY = 2,
        nodeColor = "#4F46E5",
        edgeColor = "#9CA3AF",
        textColor = "#FFFFFF",
        fontSize = 14,
        fontFamily = "sans-serif",
        edgeStrokeWidth = 2,
        showTextOnAllNodes = true,
        nodePaddingX = 12,
    }: {
        nodes?: string[];
        levelGapX?: number;
        nodeGapY?: number;
        nodeColor?: string;
        edgeColor?: string;
        textColor?: string;
        fontSize?: number;
        fontFamily?: string;
        edgeStrokeWidth?: number;
        showTextOnAllNodes?: boolean;
        nodePaddingX?: number;
    } = $props();

    const nodeHeight = 36;
    const nodeRadius = 10;

    type NodeWithCoords = {
        id: number;
        text: string;
        x: number;
        y: number;
        level: number;
        indexInLevel: number;
        width: number;
        halfW: number;
    };
    type Edge = { fromId: number; toId: number };

    function getNodeWidth(text: string, fSize: number, pX: number): number {
        const tw = text.length * fSize * 0.6;
        return Math.max(tw + pX * 2, 20);
    }

    function getEdgePath(from: { x: number; y: number }, to: { x: number; y: number }): string {
        const dx = to.x - from.x;
        const cx = from.x + dx * 0.5;
        return `M ${from.x} ${from.y} C ${cx} ${from.y}, ${cx} ${to.y}, ${to.x} ${to.y}`;
    }

    let svgWidth = $state(100);
    let svgHeight = $state(100);
    let viewBoxX = $state(0);
    let viewBoxY = $state(0);
    let edges = $state<Edge[]>([]);
    let positionedNodes = $state<NodeWithCoords[]>([]);

    $effect(() => {
        const _nodes = nodes;
        const _levelGapX = levelGapX;
        const _nodeGapY = nodeGapY;
        const _fontSize = fontSize;
        const _nodePaddingX = nodePaddingX;

        if (_nodes.length !== 31) {
            console.warn("FullTree: ожидается ровно 31 элемент, получено", _nodes.length);
        }

        const LEVEL_SIZES = [16, 8, 4, 2, 1] as const;
        const totalLevels = LEVEL_SIZES.length;

        const levelStarts: number[] = [];
        let offset = 0;
        for (const size of LEVEL_SIZES) {
            levelStarts.push(offset);
            offset += size;
        }

        const levelNodeWidths = LEVEL_SIZES.map((_, i) => {
            const start = levelStarts[i];
            const end = start + LEVEL_SIZES[i];
            const widths = _nodes.slice(start, end).map((t) => getNodeWidth(t, _fontSize, _nodePaddingX));
            return widths.length ? Math.max(...widths) : 0;
        });

        const verticalSpacing = nodeHeight + _nodeGapY;
        const marginX = 20;
        const _positionedNodes: NodeWithCoords[] = new Array(_nodes.length);

        // Уровень 0
        {
            const startIdx = levelStarts[0];
            const baseY = nodeHeight / 2;
            const w = levelNodeWidths[0];
            const hw = w / 2;
            for (let j = 0; j < LEVEL_SIZES[0]; j++) {
                const id = startIdx + j;
                _positionedNodes[id] = {
                    id,
                    text: _nodes[id] || "",
                    x: marginX,
                    y: baseY + j * verticalSpacing,
                    level: 0,
                    indexInLevel: j,
                    width: w,
                    halfW: hw,
                };
            }
        }

        // Уровни 1–4
        for (let levelIdx = 1; levelIdx < totalLevels; levelIdx++) {
            const count = LEVEL_SIZES[levelIdx];
            const startIdx = levelStarts[levelIdx];
            const childStart = levelStarts[levelIdx - 1];
            const x = marginX + levelIdx * _levelGapX;
            const w = levelNodeWidths[levelIdx];
            const hw = w / 2;

            for (let j = 0; j < count; j++) {
                const id = startIdx + j;
                const text = _nodes[id] || "";

                const leftChild = _positionedNodes[childStart + j * 2];
                const rightChild = _positionedNodes[childStart + j * 2 + 1];

                let y = (leftChild.y + rightChild.y) / 2;
                if (levelIdx === totalLevels - 1 && count === 1) {
                    y -= (nodeHeight + _nodeGapY) / 2;
                }

                _positionedNodes[id] = {
                    id,
                    text,
                    x,
                    y,
                    level: levelIdx,
                    indexInLevel: j,
                    width: w,
                    halfW: hw,
                };
            }
        }

        // Рёбра
        const _edges: Edge[] = [];
        for (let levelIdx = 1; levelIdx < totalLevels; levelIdx++) {
            const parentCount = LEVEL_SIZES[levelIdx];
            const startParent = levelStarts[levelIdx];
            const startChild = levelStarts[levelIdx - 1];

            for (let j = 0; j < parentCount; j++) {
                const parentId = startParent + j;
                const leftChildId = startChild + j * 2;
                const rightChildId = startChild + j * 2 + 1;
                _edges.push({ fromId: leftChildId, toId: parentId });
                _edges.push({ fromId: rightChildId, toId: parentId });
            }
        }

        // Размеры SVG
        const validNodes = _positionedNodes.filter(Boolean);
        const halfH = nodeHeight / 2;
        const minX = validNodes.length ? Math.min(...validNodes.map((n) => n.x - n.halfW)) : 0;
        const minY = validNodes.length ? Math.min(...validNodes.map((n) => n.y - halfH)) : 0;
        const maxX = validNodes.length ? Math.max(...validNodes.map((n) => n.x + n.halfW)) : 100;
        const maxY = validNodes.length ? Math.max(...validNodes.map((n) => n.y + halfH)) : 100;
        const pad = 20;

        edges = _edges;
        positionedNodes = _positionedNodes;
        viewBoxX = minX - pad;
        viewBoxY = minY - pad;
        svgWidth = maxX - minX + pad * 2;
        svgHeight = maxY - minY + pad * 2;
    });
</script>

<svg
    width={svgWidth}
    height={svgHeight}
    viewBox="{viewBoxX} {viewBoxY} {svgWidth} {svgHeight}"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width: 100%; height: auto; background: #f9fafb; border-radius: 12px;"
>
    <!-- Рёбра -->
    <g stroke={edgeColor} stroke-width={edgeStrokeWidth} fill="none">
        {#each edges as edge (edge)}
            {const fromNode = positionedNodes.find((n) => n.id === edge.fromId)}
            {const toNode = positionedNodes.find((n) => n.id === edge.toId)}
            {#if fromNode && toNode}
                <path d={getEdgePath(fromNode, toNode)} stroke-linejoin="round" />
            {/if}
        {/each}
    </g>

    <!-- Узлы -->
    <g>
        {#each positionedNodes as node (node.id)}
            <g transform="translate({node.x},{node.y})">
                <rect
                    x={-node.halfW}
                    y={-nodeHeight / 2}
                    width={node.width}
                    height={nodeHeight}
                    rx={nodeRadius}
                    ry={nodeRadius}
                    fill={nodeColor}
                    stroke="#fff"
                    stroke-width="2"
                />
                {#if showTextOnAllNodes || node.level === 0}
                    <text
                        text-anchor="middle"
                        dominant-baseline="central"
                        fill={textColor}
                        font-size={fontSize}
                        font-family={fontFamily}
                        font-weight="500"
                        style="pointer-events: none;"
                    >
                        {node.text}
                    </text>
                {/if}
            </g>
        {/each}
    </g>
</svg>
