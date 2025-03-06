declare const useSlider: () => {
    push: (key: string) => void;
    goBack: () => void;
    prevKey: string | null;
    direction: "left" | "right";
};
export default useSlider;
