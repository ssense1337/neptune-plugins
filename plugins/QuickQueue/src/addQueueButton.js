import { actions, store, intercept } from "@neptune";
import { ReactiveRoot } from "@neptune/components";
import { $, html, useMemo } from "@neptune/voby";

import { isElement } from "./lib/isElement";

const isInQueueMap = new Map();

export const setupInterceptors = () => [
    intercept("playQueue/ADD_MEDIA_ITEMS_TO_QUEUE",  ([{ mediaItemIds }]) => {
        mediaItemIds.forEach(trackId => {
            if (isInQueueMap.has(trackId)) {
                isInQueueMap.get(trackId)(true);
            }
        });
    }),
    intercept("playQueue/REMOVE_ELEMENT",  ([{ uid }]) => {
        const playQueue = store.getState().playQueue;
        const currentIndex = playQueue.currentIndex;
        for (let i = currentIndex + 1; i < playQueue.elements.length; i++) {
            if (playQueue.elements[i].priority !== "priority_keep") break;

            if (playQueue.elements[i].uid === uid) {
                const trackId = playQueue.elements[i].mediaItemId;
                if (isInQueueMap.has(trackId)) {
                    isInQueueMap.get(trackId)(false);
                }
                return;
            }
        }
    })
];

const cloneButtonAttributes = (sourceButton) => {
    const attributes = sourceButton.attributes;
    const newAttributes = {};
    for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        newAttributes[attr.name] = attr.value;
    }
    return newAttributes;
};

const createButton = (trackRow, trackId) => {
    const isInQueue = $(false);
    const { elements, currentIndex } = store.getState().playQueue;
    for (let i = currentIndex + 1; i < elements.length; i++) {
        if (elements[i].priority !== "priority_keep") break;

        if (elements[i].mediaItemId === trackId)
            isInQueue(true);
    }
    isInQueueMap.set(trackId, isInQueue);
    const icon = useMemo(() => "#" + (isInQueue() ? "detail-view__trashcan" : "player__queue-add"));
    const label = useMemo(() => isInQueue() ? "Remove from queue" : "Add to queue");

    // Find the original button
    const originalButton = trackRow.querySelector('button[data-test="add-to-playlist-button"]');
    if (!originalButton) return null;

    const buttonAttributes = cloneButtonAttributes(originalButton);
    const svgAttributes = cloneButtonAttributes(originalButton.querySelector('svg'));

    return html`
        <button
            ...${buttonAttributes}
            data-test="quick-queue"
            aria-label=${label}
            title=${label}
            style="padding: 4px;"
            onClick=${async () => {
                const { elements, currentIndex } = store.getState().playQueue;
                for (let i = currentIndex + 1; i < elements.length; i++) {
                    if (elements[i].priority !== "priority_keep") break;

                    if (elements[i].mediaItemId === trackId) {
                        actions.playQueue.removeAtIndex({ index: i });
                        actions.message.messageInfo({ message: "Removed from play queue" });
                        return;
                    }
                }

                actions.playQueue.addLast({ mediaItemIds: [trackId], context: { type: "user" } });
                actions.message.messageInfo({ message: "Added to play queue" });
            }}
        >
            <svg ...${svgAttributes}>
                <use href=${icon}></use>
            </svg>
        </button>
    `;
};

const addButton = (trackRow, name, sourceSelector, newElement, beforeSelector) => {
    let element = trackRow.querySelector(`button[data-test="${name}"]`);
    if (element !== null) return;

    const sourceElement = trackRow.querySelector(sourceSelector);
    if (sourceElement === null) return;

    element = newElement;
    if (isElement(element)) {
        return sourceElement.parentElement.insertBefore(element, beforeSelector instanceof Element ? beforeSelector : beforeSelector ? trackRow.querySelector(beforeSelector) : sourceElement);
    }
};

export const addQueueButton = (trackRow, trackId) => {
    const button = createButton(trackRow, Number(trackId));
    addButton(trackRow, "quick-queue", 'button[data-test="add-to-playlist-button"]', ReactiveRoot({ children: button }), 'button[data-test="add-to-playlist-button"]');
};
