import { ReactNode, Ref, RefObject } from "react";
import { cssShortKey, dynamicObject, Props } from "../../types"
import { Style } from "util";

export enum EditorMode {
    Select = "SELECT",
    Move = "MOVE",
    Rotate = "ROTATE",
    Scale = "SCALE",

    Animation = "ANIMATION",
    Keyframe = "KEYFRAMING",
    Play = "PLAY"
}

export enum LayerType {
    Meta = "META",    
    Track = "TRACK",    
}

export type LayerProps = {
    index: number,
    meta: TimeLineLayer,
    selected: boolean,
    onSelect: (layer: TimeLineLayer) => void
}

export type TimeLineLayer = {
    src: RefObject<HTMLElement>,
    label?: string
}

export type TimeLineProps = {
    layers: TimeLineLayer[]
}


export type StyleItem = {
    [key in cssShortKey]?: string | number;
} & { unit: string; }

export type PropProps = {
    meta: StyleItem,
    onChange: (v: StyleItem) => void,
    addKeyframe: () => void,
}

export interface KeyFrame {
    stamp: number,
    props: StyleItem[]
}

export interface WithEditorProps {
    withEditor?: boolean;
}

export type EditorProps = Props<`div`> & {
}

export interface EditorHandler {
    show: () => void,
}

export interface BuilderStore {
    mode: EditorMode
}

export type SelectionProps = { 
    x: number, 
    y: number, 
    width: number, 
    height: number 
}