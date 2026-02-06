export type CloseHandler = () => void;

class LayerManager {

    private stack: CloseHandler[] = [];
    private readonly SCROLL_CLASS = "--no-scroll";

    private updateScrollLock() {
        if (typeof window === "undefined") return;
        
        if (this.stack.length > 0) {
            document.body.classList.add(this.SCROLL_CLASS);
        } else {
            document.body.classList.remove(this.SCROLL_CLASS);
        }
    }

    isTop(closeFn: CloseHandler): boolean {
        return this.stack[this.stack.length - 1] === closeFn;
    }

    // Register a component and return a function to unregister it
    push(closeFn: CloseHandler) {
        // Prevent duplicate registration of the same instance
        if (!this.stack.includes(closeFn)) {
            this.stack.push(closeFn);
            this.updateScrollLock();
        }
    }

    pop(closeFn: CloseHandler) {
        this.stack = this.stack.filter(fn => fn !== closeFn);
        this.updateScrollLock();
    }

    // Attempt to close the top-most layer
    handleEscape() {
        const top = this.stack[this.stack.length - 1];
        if (top) {
            top();
            return true; // We handled the event
        }
        return false;
    }

    get count() {
        return this.stack.length;
    }
    
}

export const layerManager = new LayerManager();