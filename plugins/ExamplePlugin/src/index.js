import { store, intercept, currentMediaItem } from "@neptune";
import { getMediaURLFromID } from "@neptune/utils";
import { fetchAndPlayMediaItem } from "@neptune/actions/content";
import { play, pause, seek } from "@neptune/actions/playbackControls";
import { html } from "@neptune/voby";
import { storage } from "@plugin";
import { io } from "socket.io-client";

const unloadables = [];

const socket = io("wss://listen.ssense.eu.org"); // Replace with your server URL

storage.partyId ??= null;
storage.isHost ??= false;

const syncPlayback = (current) => {
  const state = store.getState();
  const { item: currentlyPlaying, type: mediaType } = currentMediaItem;

  // TODO: add video support
  if (mediaType != "track") return;

  const albumArtURL = getMediaURLFromID(currentlyPlaying.album.cover);

  const date = new Date();
  const now = (date.getTime() / 1000) | 0;
  const remaining = date.setSeconds(
    date.getSeconds() + (currentlyPlaying.duration - current)
  );

  const paused = state.playbackControls.playbackState == "NOT_PLAYING";

  socket.emit("syncPlayback", {
    currentTime: current,
    isPaused: paused,
    mediaInfo: {
      id: currentlyPlaying.id,
      title: currentlyPlaying.title,
      artists: currentlyPlaying.artists.map((a) => a.name).join(", "),
      album: currentlyPlaying.album.title,
      albumArtURL: albumArtURL,
    },
    timestamp: now,
    remaining: remaining,
  });
};

const joinParty = (partyId) => {
  storage.partyId = partyId;
  storage.isHost = false;
  socket.emit("joinParty", { partyId });
};

const createParty = () => {
  storage.isHost = true;
  socket.emit("createParty", (partyId) => {
    storage.partyId = partyId;
  });
};

const leaveParty = () => {
  socket.emit("leaveParty", { partyId: storage.partyId });
  storage.partyId = null;
  storage.isHost = false;
};

unloadables.push(
  intercept("playbackControls/TIME_UPDATE", ([current]) => {
    if (storage.partyId) {
      syncPlayback(current);
    }
  })
);

socket.on("playbackUpdate", (data) => {
  if (!storage.isHost) {
    // Sync playback with the host
    const { item: currentlyPlaying } = currentMediaItem;
    
    const trackId = data.mediaInfo.id
    if (currentlyPlaying.id !== trackId) {
      // Change the track if necessary
      fetchAndPlayMediaItem({
        itemId: trackId,
        itemType: "track",
      });
    }
    
    if (data.isPaused) {
      pause();
    } else {
      seek(data.currentTime);
      play();
    }
  }
});

export async function onUnload() {
  unloadables.forEach((u) => u());

  try {
    leaveParty();
  } catch {}
}

export function Settings() {
  let partyIdInput = "";

  return html`
    <div>
      <button onClick=${createParty}>Create Party</button>
      ${storage.partyId && storage.isHost
        ? html`<div>Your Party ID: ${storage.partyId}</div>`
        : ""}
      <div>
        <label for="party-id">Party ID:</label>
        <input id="party-id" type="text" onInput=${(e) => partyIdInput = e.target.value} />
        <button onClick=${() => joinParty(partyIdInput)}>Join Party</button>
      </div>
      <button onClick=${leaveParty} disabled=${!storage.partyId}>Leave Party</button>
    </div>
  `;
}