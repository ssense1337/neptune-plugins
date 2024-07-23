import { isElement } from "./lib/isElement";
import { addQueueButton, setupInterceptors } from "./addQueueButton";

const unloadables = [];

const observer = new MutationObserver((mutationsList) => {
	for (const mutation of mutationsList) {
		if (mutation.type === "childList") {
			for (const node of mutation.addedNodes) {
				if (isElement(node)) {
					const trackRows = node.querySelectorAll('div[data-test="tracklist-row"]');
					if (trackRows.length !== 0) updateTrackRows(trackRows);
				}
			}
		}
	}
});
const updateTrackRows = async (trackRows) => {
	for (const trackRow of trackRows) {
		const trackId = trackRow.getAttribute("data-track-id");
		if (trackId == null) return;

		addQueueButton(trackRow, trackId);
	}
};
export const updateObserver = () => {
	observer.disconnect();
  observer.observe(document.body, { childList: true, subtree: true });
};
updateObserver();

unloadables.push(...setupInterceptors);

export const onUnload = () => {
  unloadables.forEach((u) => u());
  observer.disconnect();
};
