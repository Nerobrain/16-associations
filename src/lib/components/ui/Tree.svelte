<script lang="ts">
    // Принимаем массив из 31 строки (или можно принимать любой массив, но проверяем длину)
    let {
        nodes = [],
        levelGapX = 150,
        nodeGapY = 2,
        nodeHeight = 36,
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
        nodeHeight?: number;
        nodeColor?: string;
        edgeColor?: string;
        textColor?: string;
        fontSize?: number;
        fontFamily?: string;
        edgeStrokeWidth?: number;
        showTextOnAllNodes?: boolean;
        nodePaddingX?: number;
    } = $props();

    const nodeRadius = 10;
    const halfH = nodeHeight / 2;

    // Проверка
    if (nodes.length !== 31) {
        console.warn("FullTree: ожидается ровно 31 элемент, получено", nodes.length);
    }

    // Размеры уровней
    const LEVEL_SIZES = [16, 8, 4, 2, 1] as const;
    const totalLevels = LEVEL_SIZES.length;

    // Вычисляем начальные индексы каждого уровня
    const levelStarts: number[] = [];
    let offset = 0;
    for (const size of LEVEL_SIZES) {
        levelStarts.push(offset);
        offset += size;
    }

    // Создаём массив узлов с координатами
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

    // Ширина по тексту
    function getNodeWidth(text: string): number {
        const tw = text.length * fontSize * 0.6;
        return Math.max(tw + nodePaddingX * 2, 20);
    }

    // Максимальная ширина каждого уровня
    const levelNodeWidths = LEVEL_SIZES.map((_, i) => {
        const start = levelStarts[i];
        const end = start + LEVEL_SIZES[i];
        return Math.max(...nodes.slice(start, end).map(getNodeWidth));
    });

    const verticalSpacing = nodeHeight + nodeGapY;
    const marginX = 20;

    // Вспомогательный массив для доступа по id
    const positionedNodes: NodeWithCoords[] = new Array(nodes.length);

    // Уровень 0: равномерно по вертикали
    {
        const startIdx = levelStarts[0];
        const baseY = halfH;
        const w = levelNodeWidths[0];
        const hw = w / 2;
        for (let j = 0; j < LEVEL_SIZES[0]; j++) {
            const id = startIdx + j;
            positionedNodes[id] = {
                id,
                text: nodes[id] || "",
                x: marginX,
                y: baseY + j * verticalSpacing,
                level: 0,
                indexInLevel: j,
                width: w,
                halfW: hw,
            };
        }
    }

    // Уровни 1–4: родитель по центру между двумя детьми
    for (let levelIdx = 1; levelIdx < totalLevels; levelIdx++) {
        const count = LEVEL_SIZES[levelIdx];
        const startIdx = levelStarts[levelIdx];
        const childStart = levelStarts[levelIdx - 1];
        const x = marginX + levelIdx * levelGapX;
        const w = levelNodeWidths[levelIdx];
        const hw = w / 2;

        for (let j = 0; j < count; j++) {
            const id = startIdx + j;
            const text = nodes[id] || "";

            const leftChild = positionedNodes[childStart + j * 2];
            const rightChild = positionedNodes[childStart + j * 2 + 1];

            let y = (leftChild.y + rightChild.y) / 2;
            if (levelIdx === totalLevels - 1 && count === 1) {
                y -= (nodeHeight + nodeGapY) / 2;
            }

            positionedNodes[id] = {
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

    // Строим рёбра
    type Edge = { fromId: number; toId: number };
    const edges: Edge[] = [];

    for (let levelIdx = 1; levelIdx < totalLevels; levelIdx++) {
        const parentCount = LEVEL_SIZES[levelIdx];
        const startParent = levelStarts[levelIdx];
        const startChild = levelStarts[levelIdx - 1];

        for (let j = 0; j < parentCount; j++) {
            const parentId = startParent + j;
            const leftChildId = startChild + j * 2;
            const rightChildId = startChild + j * 2 + 1;
            edges.push({ fromId: leftChildId, toId: parentId });
            edges.push({ fromId: rightChildId, toId: parentId });
        }
    }

    // Функция для дуги (кривая Безье)
    function getEdgePath(from: { x: number; y: number }, to: { x: number; y: number }): string {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const cx = from.x + dx * 0.5;
        return `M ${from.x} ${from.y} C ${cx} ${from.y}, ${cx} ${to.y}, ${to.x} ${to.y}`;
    }

    // Получаем размеры SVG
    const svgWidth = Math.max(...positionedNodes.map((n) => n.x + n.halfW)) + marginX;
    const svgHeight = Math.max(...positionedNodes.map((n) => n.y + halfH));
</script>

<svg
    width="100%"
    viewBox="-70 -10 {svgWidth + 70} {svgHeight}"
    xmlns="http://www.w3.org/2000/svg"
    style="background: #f9fafb; border-radius: 12px;"
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
                    y={-halfH}
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
