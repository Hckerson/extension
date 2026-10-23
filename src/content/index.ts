import { CONTENT_TO_BACKGROUND } from '@types/messages';
import { ContentToBackgroundMessageSchema } from '@types/messages';

function sendPageDataToBackground() {
  const message = ContentToBackgroundMessageSchema.parse({
    type: CONTENT_TO_BACKGROUND,
    data: {
      url: window.location.href,
      title: document.title,
    },
  });

  chrome.runtime.sendMessage(message);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'background_to_content') {
    alert(message.data.response);
  }
});

if (document.readyState === 'complete') {
  sendPageDataToBackground();
} else {
  window.addEventListener('load', sendPageDataToBackground);
}
