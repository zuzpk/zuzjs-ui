"use client"

import { CSSProperties } from "react"
import Box from "../Box"
import { DependencyTreeNode, DependencyTreeProps, DependencyTreeRenderContext } from "./types"

const statusLabels = {
    root: "Root",
    merged: "Merged",
    active: "Active",
    blocked: "Blocked",
} as const

const hasLevels = (nodes: DependencyTreeNode[]) => nodes.some((node) => typeof node.level === "number")

const buildPyramidRows = (nodes: DependencyTreeNode[]) => {
    if (nodes.length === 0) return [] as DependencyTreeNode[][]

    if (hasLevels(nodes)) {
        const levelMap = new Map<number, DependencyTreeNode[]>()

        nodes.forEach((node) => {
            const level = typeof node.level === "number" && node.level >= 0 ? node.level : 0
            const bucket = levelMap.get(level) || []
            bucket.push(node)
            levelMap.set(level, bucket)
        })

        return [...levelMap.entries()]
            .sort((a, b) => a[0] - b[0])
            .map((entry) => entry[1])
    }

    const rows: DependencyTreeNode[][] = []
    let index = 0
    let rowSize = 1

    while (index < nodes.length) {
        rows.push(nodes.slice(index, index + rowSize))
        index += rowSize
        rowSize += 1
    }

    return rows
}

const getNodeStyle = (node: DependencyTreeNode): CSSProperties => ({
    ...(node.color ? { "--dependency-tree-dot": node.color } : {}),
    ...(node.lineColor ? { "--dependency-tree-line": node.lineColor } : {}),
    ...(node.badgeColor ? { "--dependency-tree-badge-bg": node.badgeColor } : {}),
    ...(node.badgeTextColor ? { "--dependency-tree-badge-text": node.badgeTextColor } : {}),
    ...(node.cardColor ? { "--dependency-tree-card-bg": node.cardColor } : {}),
    ...(node.textColor ? { "--dependency-tree-text": node.textColor } : {}),
}) as CSSProperties

const DependencyTree = ({
    currentId,
    nodes,
    mode = "list",
    variant = "md",
    showBadge = true,
    renderNode,
}: DependencyTreeProps) => {
    const renderDefaultCard = (node: DependencyTreeNode) => <Box className={`--dependency-tree-card`}>
        <Box className={`--dependency-tree-head flex aic jcsb`}>
            <Box className={`--dependency-tree-title`}>
                {node.label || node.id}
            </Box>
            {showBadge && <Box className={`--dependency-tree-badge`}>
                {statusLabels[node.status]}
            </Box>}
        </Box>
        <Box className={`--dependency-tree-meta`}>
            <span>{node.id}</span>
        </Box>
    </Box>

    const renderCard = (node: DependencyTreeNode, context: DependencyTreeRenderContext, index: number) => {
        if (renderNode) {
            return renderNode(node, context, index)
        }

        return renderDefaultCard(node)
    }

    if (mode === "pyramid") {
        const rows = buildPyramidRows(nodes)

        return <Box className={`--dependency-tree --mode-pyramid --variant-${variant}`} role="tree" aria-label="Dependency tree">
            {rows.length > 0 ? rows.map((row, rowIndex) => {
                const isTopRow = rowIndex === 0

                return <Box
                    key={`--dependency-tree-row-${rowIndex}`}
                    className={`--dependency-tree-row`}
                    role="group"
                    style={{ "--dependency-tree-row-size": row.length } as CSSProperties}>
                    {!isTopRow && <Box className={`--dependency-tree-row-track`} aria-hidden="true" />}
                    {row.map((node, index) => {
                        const isCurrent = currentId === node.id
                        const context: DependencyTreeRenderContext = {
                            isCurrent,
                            mode,
                            variant,
                            showBadge,
                            index: nodes.findIndex((x) => x.id === node.id),
                            rowIndex,
                        }

                        return <Box
                            key={node.id}
                            role="treeitem"
                            aria-current={isCurrent ? "true" : undefined}
                            style={getNodeStyle(node)}
                            className={`--dependency-tree-pyramid-node --status-${node.status} ${isCurrent ? `--is-current` : ``}`.trim()}>
                            {!isTopRow && <Box className={`--dependency-tree-pyramid-connector`} aria-hidden="true" />}
                            <Box className={`--dependency-tree-pyramid-dot`} aria-hidden="true" />
                            {renderCard(node, context, index)}
                        </Box>
                    })}
                </Box>
            }) : <Box className={`--dependency-tree-empty`}>
                No dependencies to display.
            </Box>}
        </Box>
    }

    return <Box className={`--dependency-tree --variant-${variant}`} role="tree" aria-label="Dependency tree">
        {nodes.length > 0 ? nodes.map((node, index) => {
            const isCurrent = currentId === node.id
            const isLast = index === nodes.length - 1
            const context: DependencyTreeRenderContext = {
                isCurrent,
                mode,
                variant,
                showBadge,
                index,
            }

            return <Box
                key={node.id}
                role="treeitem"
                aria-current={isCurrent ? "true" : undefined}
                style={getNodeStyle(node)}
                className={`--dependency-tree-node --status-${node.status} ${isCurrent ? `--is-current` : ``}`.trim()}>
                <Box className={`--dependency-tree-rail`} aria-hidden="true">
                    <Box className={`--dependency-tree-dot`} />
                    {!isLast && <Box className={`--dependency-tree-line`} />}
                </Box>

                {renderCard(node, context, index)}
            </Box>
        }) : <Box className={`--dependency-tree-empty`}>
            No dependencies to display.
        </Box>}
    </Box>
}

export default DependencyTree