import { actions, store } from '@neptune'

import { ELEMENT, VOLUME_INTERVAL, VOLUME_INTERVAL_SHIFT } from './constants'

const isVolumeButton = (i) => i.nodeName === 'BUTTON' && i.getAttribute('data-test') === 'volume',
  isVolumeSlider = (i) =>
    i.nodeName === 'DIV' && i.id === 'nativeRange' && i.nextElementSibling && isVolumeButton(i.nextElementSibling),
  clamp = (val) => Math.min(Math.max(0, val), 100)

function wheelListener(e) {
  const path = e.composedPath()
  const hasVolumeElement = path.find(i => i && (isVolumeButton(i) || isVolumeSlider(i)))
  if (!hasVolumeElement) return

  const {
    playbackControls: { volume },
  } = store.getState()

  const volumeInterval = e.shiftKey ? VOLUME_INTERVAL_SHIFT : VOLUME_INTERVAL
  const volumeMult = e.deltaY > 0 ? -1 : 1
  const newVolume = volume + volumeInterval * volumeMult
  actions.playbackControls.setVolume({
    volume: clamp(newVolume),
  })
}

ELEMENT.addEventListener('wheel', wheelListener)

export function onUnload() {
  ELEMENT.removeEventListener('wheel', wheelListener)
}
