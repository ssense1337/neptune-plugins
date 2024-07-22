import { actions } from "@neptune";

import { isElement } from "./lib/isElement";

const addButton = (trackRow, name, sourceSelector, icon, beforeSelector) => {
	let element = trackRow.querySelector(`button[data-test="${name}"]`);
	if (element !== null) return;

	const sourceElement = trackRow.querySelector(sourceSelector);
	if (sourceElement === null) return;

    element = sourceElement?.cloneNode(true);
	if (isElement(element)) {
		element.setAttribute("data-test", name);
        element.querySelector("use").setAttribute("href", `#${icon}`);
		return sourceElement.parentElement.insertBefore(element, beforeSelector instanceof Element ? beforeSelector : beforeSelector ? trackRow.querySelector(beforeSelector) : sourceElement);
	}
};

export const addQueueButton = (trackRow, trackId) => {
	const queueButton = addButton(trackRow, "Quick Queue", `button[data-test="add-to-playlist-button"]`, "player__queue-add", `button[data-test="add-to-playlist-button"]`);
	queueButton?.style.setProperty("padding", "4px");
    queueButton?.setAttribute("aria-label", "Add to queue");
    queueButton?.setAttribute("title", "Add to queue");
    queueButton?.addEventListener("click", async () => {
        actions.playQueue.addNext({ mediaItemIds: [trackId], context: { type: "user" } });
    });
};
