import React, { CSSProperties, useCallback, useEffect, useMemo, useRef } from "react";
import { Box, BoxProps, useBase } from "../..";

/**
 * A pointer-reactive grid where each cell responds to cursor proximity
 * with scale, rotation, translation, and color shifts. */

export type MagneticGridProps = Omit<BoxProps, "cols" | "rows" | "gap" | "background" | "color"> & {
    rows?: number;
    cols?: number;
    cellSize?: number;
    gap?: number;
    radius?: number;
    maxScale?: number;
    maxRotate?: number;
    maxLift?: number;
    falloff?: "linear" | "exponential" | "smooth";
    mode?: "dots" | "squares" | "bars" | "ascii";
    color?: string;
    accentColor?: string;
    background?: string;
    magnetic?: boolean;
}

const BASE_DRIFT = 18;

const MagneticGrid = (props: MagneticGridProps) => {
    
    const {
        rows = 18,
        cols = 28,
        cellSize = 18,
        gap = 6,
        radius = 180,
        maxScale = 2.4,
        maxRotate = 60,
        maxLift = 24,
        falloff = "smooth",
        mode = "dots",
        color = "#0a0a0a",
        accentColor = "#ff4d2e",
        background = "#f4f1ea",
        magnetic = true,
        ...pops
    } = props

    const {
        className,
        style,
        rest
    } = useBase(pops, undefined)

    const gridWidth = cols * cellSize + (cols - 1) * gap;
    const gridHeight = rows * cellSize + (rows - 1) * gap;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
    const pointerRef = useRef({ x: -9999, y: -9999, active: false });
    const rafRef = useRef(0);

    // Stable cell index list
    const cells = useMemo(() => {
        const arr = [];
        for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) arr.push({ r, c, i: r * cols + c });
        }
        return arr;
    }, [rows, cols]);

    // Falloff function: returns 0..1 where 1 = at center, 0 = beyond radius
    const easeFn = useCallback(
        (d: number) => {
        const t = Math.max(0, 1 - d / radius);
        if (falloff === "linear") return t;
        if (falloff === "exponential") return t * t * t;
        // smooth (smoothstep)
        return t * t * (3 - 2 * t);
        },
        [radius, falloff]
    );

    // Animation loop
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

      const stride = cellSize + gap;

        const tick = () => {
        const rect = wrapper.getBoundingClientRect();
        const { x: px, y: py, active } = pointerRef.current;
        const cx = px - rect.left;
        const cy = py - rect.top;
        const scaleX = rect.width > 0 ? rect.width / gridWidth : 1;
        const scaleY = rect.height > 0 ? rect.height / gridHeight : 1;
        const visualScale = Math.min(scaleX, scaleY);

        for (let idx = 0; idx < cellRefs.current.length; idx++) {
          const el = cellRefs.current[idx];
          if (!el) continue;
          const r = Math.floor(idx / cols);
          const c = idx % cols;

          // Each cell's center in the virtual grid coordinate space.
          const ex = c * stride + cellSize / 2;
          const ey = r * stride + cellSize / 2;

          let strength = 0;
          let dx = 0;
          let dy = 0;
          if (active) {
            dx = cx / scaleX - ex;
            dy = cy / scaleY - ey;
            const dist = Math.hypot(dx, dy);
            strength = easeFn(dist);
          }

          const scale = 1 + (maxScale - 1) * strength;
          const lift = maxLift * strength * visualScale;
          // Rotate based on angle to cursor (creates "flow" pattern)
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const rot = (angle * strength * maxRotate) / 90;
          // Magnetic drift: pull toward cursor
          const drift = magnetic ? strength * BASE_DRIFT * visualScale : 0;
          const tx = (dx === 0 ? 0 : (dx / Math.max(1, Math.hypot(dx, dy)))) * drift;
          const ty = (dy === 0 ? 0 : (dy / Math.max(1, Math.hypot(dx, dy)))) * drift;

          el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
            2
          )}px, ${lift.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          el.style.setProperty("--k-strength", strength.toFixed(3));
            }

        rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [cols, cellSize, gap, easeFn, maxScale, maxRotate, maxLift, magnetic, gridWidth, gridHeight]);

    // Pointer handlers
    const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent) => {
        const point = 'touches' in e ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent<HTMLDivElement>);
        pointerRef.current.x = point.clientX;
        pointerRef.current.y = point.clientY;
        pointerRef.current.active = true;
    }, []);

    const handleLeave = useCallback(() => {
        pointerRef.current.active = false;
        pointerRef.current.x = -9999;
        pointerRef.current.y = -9999;
    }, []);

    // ASCII charset for ASCII mode
    const asciiChars = useMemo(() => "·•◦○◉●◆◈■", []);

    return <Box
      ref={wrapperRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background,
        perspective: 800,
        cursor: "crosshair",
        userSelect: "none",
        ...style,
      }}
      {...rest as BoxProps}
    >
      {cells.map(({ r, c, i }) => (
        <Cell
          key={i}
          ref={(el) => { cellRefs.current[i] = el; }}
          r={r}
          c={c}
          cellSize={cellSize}
          gap={gap}
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          color={color}
          accentColor={accentColor}
          mode={mode}
          asciiChars={asciiChars}
        />
      ))}
    </Box>
}

const Cell = React.forwardRef<HTMLDivElement, {
  r: number;
  c: number;
  cellSize: number;
  gap: number;
  gridWidth: number;
  gridHeight: number;
  color: string;
  accentColor: string;
  mode: string;
  asciiChars: string;
}>(function Cell(
  { r, c, cellSize, gap, gridWidth, gridHeight, color, accentColor, mode, asciiChars },
  ref
) {
  const left = (c * (cellSize + gap) / gridWidth) * 100;
  const top = (r * (cellSize + gap) / gridHeight) * 100;
  const width = (cellSize / gridWidth) * 100;
  const height = (cellSize / gridHeight) * 100;
  const barHeight = ((cellSize * 0.18) / gridHeight) * 100;
  const barTop = (((r * (cellSize + gap)) + cellSize * 0.41) / gridHeight) * 100;

  // Use --k-strength CSS var (set per-frame) to blend color and pick glyph
  const baseStyle: CSSProperties = {
    position: "absolute",
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    willChange: "transform",
    transformStyle: "preserve-3d",
    transition: "background-color 120ms linear, color 120ms linear",
  };

  if (mode === "dots") {
    return (
      <div
        ref={ref}
        style={{
          ...baseStyle,
          background: `color-mix(in oklab, ${color} calc((1 - var(--k-strength, 0)) * 100%), ${accentColor})`,
          borderRadius: "50%",
        } as CSSProperties}
      />
    );
  }

  if (mode === "squares") {
    return (
      <div
        ref={ref}
        style={{
          ...baseStyle,
          background: `color-mix(in oklab, ${color} calc((1 - var(--k-strength, 0)) * 100%), ${accentColor})`,
          borderRadius: 2,
        } as CSSProperties}
      />
    );
  }

  if (mode === "bars") {
    return (
      <div
        ref={ref}
        style={{
          ...baseStyle,
          background: `color-mix(in oklab, ${color} calc((1 - var(--k-strength, 0)) * 100%), ${accentColor})`,
          borderRadius: 1,
          top: `${barTop}%`,
          height: `${barHeight}%`,
        } as CSSProperties}
      />
    );
  }

  // ascii — picks glyph from CSS var via inline character mapping
  const idx = (r * 31 + c * 17) % asciiChars.length;
  return (
    <div
      ref={ref}
      style={{
        ...baseStyle,
        color: `color-mix(in oklab, ${color} calc((1 - var(--k-strength, 0)) * 100%), ${accentColor})`,
        fontFamily: "ui-monospace, 'JetBrains Mono', Menlo, monospace",
        fontSize: cellSize * 0.9,
        lineHeight: 1,
      } as CSSProperties}
    >
      {asciiChars[idx]}
    </div>
  );
});

export default MagneticGrid;