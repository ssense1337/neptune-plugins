import { actions, store } from "@neptune";
import { ReactiveRoot } from "@neptune/components";
import { html } from "@neptune/voby";

import { isElement } from "./lib/isElement";

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
    const { elements } = store.getState().playQueue;
    const isInQueue = elements.some(element => element.mediaItemId === trackId);
    const icon = isInQueue ? "detail-view__trashcan" : "player__queue-add";
    const label = isInQueue ? "Remove from queue" : "Add to queue";

    // Find the original button
    const originalButton = trackRow.querySelector('button[data-test="add-to-playlist-button"]');
    if (!originalButton) return null;

    const buttonAttributes = cloneButtonAttributes(originalButton);
    const svgAttributes = cloneButtonAttributes(originalButton.querySelector('svg'));

    return html`
        <button
            ${Object.entries(buttonAttributes).map(([key, value]) => html`${key}=${value}`)}
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
            <svg ${Object.entries(svgAttributes).map(([key, value]) => html`${key}=${value}`)}>
                <use href=${`#${icon}`}></use>
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
    const button = createButton(trackRow, trackId);
    addButton(trackRow, "quick-queue", 'button[data-test="add-to-playlist-button"]', ReactiveRoot({ children: button }), 'button[data-test="add-to-playlist-button"]');
};
