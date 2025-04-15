import { Modifier } from "@dnd-kit/core";

const VerticalAxisLockThreshold = 100;

export const restrictVerticalAndRight = (
    listRef: React.RefObject<HTMLElement | null>,
): Modifier => {
    return ({ transform, draggingNodeRect }) => {
        const listRect = listRef.current?.getBoundingClientRect();

        if (!listRect || !draggingNodeRect) return transform;

        const minY = listRect.top - draggingNodeRect.top;
        const maxY = listRect.bottom - draggingNodeRect.bottom;

        const lockVertical =
            Math.abs(transform.x) > VerticalAxisLockThreshold &&
            Math.abs(transform.x) > Math.abs(transform.y);

        return {
            ...transform,
            x: Math.max(0, transform.x),
            y: lockVertical ? 0 : Math.max(minY, Math.min(transform.y, maxY)),
        };
    };
};
