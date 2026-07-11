export interface ResizableOptions {
  width: number;
  minWidth?: number;
  maxWidth?: number;
  onResize: (width: number) => void;
}

export function resizable(node: HTMLElement, options: ResizableOptions) {
  let { width, minWidth = 0, maxWidth = Number.POSITIVE_INFINITY, onResize } = options;

  const handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = width;
    const isRtl = getComputedStyle(node).direction === 'rtl';
    const sign = isRtl ? -1 : 1;

    node.setPointerCapture(event.pointerId);
    document.body.classList.add('cursor-col-resize', 'select-none');

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const delta = (moveEvent.clientX - startX) * sign;
      onResize(Math.min(maxWidth, Math.max(minWidth, startWidth + delta)));
    };

    const handlePointerUp = () => {
      node.releasePointerCapture(event.pointerId);
      document.body.classList.remove('cursor-col-resize', 'select-none');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  node.addEventListener('pointerdown', handlePointerDown);

  return {
    update(newOptions: ResizableOptions) {
      ({ width, minWidth = 0, maxWidth = Number.POSITIVE_INFINITY, onResize } = newOptions);
    },
    destroy() {
      node.removeEventListener('pointerdown', handlePointerDown);
    },
  };
}
