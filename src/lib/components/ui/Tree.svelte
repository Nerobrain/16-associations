<script lang="ts">
    // Принимаем массив из 31 строки (или можно принимать любой массив, но проверяем длину)
    let {
        nodes = [],
        levelHeight = 90,
        nodeHeight = 36,
        nodeColor = "#4F46E5",
        edgeColor = "#9CA3AF",
        textColor = "#FFFFFF",
        fontSize = 14,
        fontFamily = "sans-serif",
        edgeStrokeWidth = 2,
        showTextOnAllNodes = true,
        nodePaddingX = 12,
        leafGap = 5,
    }: {
        nodes?: string[];
        levelHeight?: number;
        nodeHeight?: number;
        nodeColor?: string;
        edgeColor?: string;
        textColor?: string;
        fontSize?: number;
        fontFamily?: string;
        edgeStrokeWidth?: number;
        showTextOnAllNodes?: boolean;
        nodePaddingX?: number;
        leafGap?: number;
    } = $props();

    const nodeRadius = 10;
    const leafVerticalGap = 8;
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

    // Вычисляем максимальную ширину листа (по тексту)
    let maxLeafNodeWidth = 0;
    for (let i = 0; i < LEVEL_SIZES[0]; i++) {
        const text = nodes[levelStarts[0] + i] || "";
        const textWidth = text.length * fontSize * 0.6;
        const width = Math.max(textWidth + nodePaddingX * 2, 20);
        if (width > maxLeafNodeWidth) maxLeafNodeWidth = width;
    }

    // Расстояние между узлами: либо явно переданное leafWidth, либо вычисленное из самого широкого листа
    const spacing = maxLeafNodeWidth + leafGap;

    const positionedNodes: NodeWithCoords[] = [];

    // Максимальная ширина уровня для центрирования
    const maxLeafCols = Math.ceil(LEVEL_SIZES[0] / 2);
    const maxLevelWidth = (maxLeafCols - 1) * spacing;
    const centerX = maxLevelWidth / 2;

    for (let levelIdx = 0; levelIdx < totalLevels; levelIdx++) {
        const count = LEVEL_SIZES[levelIdx];
        const startIdx = levelStarts[levelIdx];
        const isLeafLevel = levelIdx === 0;

        const cols = isLeafLevel ? Math.ceil(count / 2) : count;
        const levelWidth = (cols - 1) * spacing;
        const startX = centerX - levelWidth / 2;

        for (let j = 0; j < count; j++) {
            const id = startIdx + j;
            const text = nodes[id] || "";
            const textWidth = text.length * fontSize * 0.6;
            const width = Math.max(textWidth + nodePaddingX * 2, 20);
            const halfW = width / 2;

            let x: number;
            let y: number;

            if (isLeafLevel) {
                const col = Math.floor(j / 2);
                const row = j % 2;
                x = startX + col * spacing;
                y = (totalLevels - 1 - levelIdx) * levelHeight + halfH + row * (nodeHeight + leafVerticalGap);
            } else {
                x = startX + j * spacing;
                y = (totalLevels - 1 - levelIdx) * levelHeight + halfH;
            }

            positionedNodes.push({
                id,
                text,
                x,
                y,
                level: levelIdx,
                indexInLevel: j,
                width,
                halfW,
            });
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
    const maxHalfW = positionedNodes.reduce((m, n) => Math.max(m, n.halfW), halfH);
    const maxBottom = Math.max(...positionedNodes.map((n) => n.y + halfH));
    const svgWidth = maxLevelWidth + 2 * maxHalfW;
    const svgHeight = maxBottom;
</script>

<svg
    width="100%"
    viewBox="{-maxHalfW} {0} {svgWidth} {svgHeight}"
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
