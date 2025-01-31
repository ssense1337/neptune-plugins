import { store, intercept, currentMediaItem } from "@neptune";
import { getMediaURLFromID } from "@neptune/utils";
import { fetchAndPlayMediaItem } from "@neptune/actions/content";
import { play, pause, seek } from "@neptune/actions/playbackControls";
import { messageInfo } from "@neptune/actions/message";
import { html } from "@neptune/voby";
import { storage } from "@plugin";
import { io } from "socket.io-client";

const unloadables = [];
let socket;

storage.partyId ??= null;
storage.isHost ??= false;
storage.listeners ??= [];

const connectSocket = () => {
  socket = io("wss://listen.ssense.eu.org");

  socket.on("playbackUpdate", (data) => {
    if (!storage.isHost) {
      const { item: currentlyPlaying } = currentMediaItem;

      const trackId = data.mediaInfo.id;
      if (currentlyPlaying.id !== trackId) {
        const unintercept = intercept("playbackControls/MEDIA_PRODUCT_TRANSITION", ([{ playbackContext }]) => {
          if (playbackContext.actualProductId != trackId) return;

          seek(data.currentTime);
          unintercept();
        });
        unloadables.push(unintercept);

        fetchAndPlayMediaItem({
          itemId: trackId,
          itemType: "track",
          sourceContext: { type: "user" },
        });
      } else {
        seek(data.currentTime);
        if (data.isPaused) {
          pause();
        } else {
          play();
        }
      }
    }
  });

  socket.on("updateListeners", (listeners) => {
    storage.listeners = listeners;
  });

  socket.on("partyEnded", () => {
    messageInfo({ message: "The listening party is over!" });
    leaveParty(true);
  });
};

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
  connectSocket();
  socket.emit("joinParty", { partyId });
};

const createParty = () => {
  storage.isHost = true;
  connectSocket();
  socket.emit("createParty", (partyId) => {
    storage.partyId = partyId;
  });
};

const leaveParty = (partyEnded = false) => {
  if (!partyEnded) socket.emit("leaveParty", { partyId: storage.partyId });
  storage.partyId = null;
  storage.isHost = false;
  storage.listeners = [];
  socket.disconnect();
  socket = null;
};

unloadables.push(
  intercept("playbackControls/TIME_UPDATE", ([current]) => {
    if (storage.partyId) {
      syncPlayback(current);
    }
  })
);

export async function onUnload() {
  unloadables.forEach((u) => u());

  try {
    leaveParty();
  } catch {}

  if (socket) {
    socket.disconnect();
  }
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
      ${storage.partyId
        ? html`
          <div>
            <h3>Connected to Party:</h3>
            <div>Party ID: ${storage.partyId}</div>
            <h3>Listeners:</h3>
            <ul>
              ${storage.listeners.map(listener => html`<li>${listener}</li>`)}
            </ul>
          </div>
        `
        : ""}
    </div>
  `;
}
