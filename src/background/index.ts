import { z } from "zod";
import { BACKGROUND_TO_CONTENT, POPUP_TO_BACKGROUND } from "@types/messages";
import {
  BackgroundToContentMessageSchema,
  BackgroundToPopupMessageSchema,
  ContentToBackgroundMessageSchema,
  PopupToBackgroundMessageSchema,
} from "@types/messages";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ extensionInstalled: true });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    const contentMessage = ContentToBackgroundMessageSchema.safeParse(message);
    if (contentMessage.success) {
      handleContentMessage(contentMessage.data, sender.tab?.id).then(sendResponse);
      return true;
    }

    const popupMessage = PopupToBackgroundMessageSchema.safeParse(message);
    if (popupMessage.success) {
      handlePopupMessage(popupMessage.data).then(sendResponse);
      return true;
    }
  } catch (error) {
    sendResponse({ error: "Invalid message format" });
  }
});

async function handleContentMessage(
  message: z.infer<typeof ContentToBackgroundMessageSchema>,
  tabId?: number
) {
  chrome.storage.local.set({ lastPageData: message.data });

  if (tabId) {
    const response = BackgroundToContentMessageSchema.parse({
      type: BACKGROUND_TO_CONTENT,
      data: { response: "Data received" },
    });
    chrome.tabs.sendMessage(tabId, response);
  }

  return { success: true };
}

async function handlePopupMessage(message: z.infer<typeof PopupToBackgroundMessageSchema>) {
  if (message.data.action === "get_data") {
    const data = await chrome.storage.local.get("lastPageData");
    return data;
  }

  if (message.data.action === "clear_data") {
    await chrome.storage.local.clear();
    return { success: true };
  }

  return { error: "Unknown action" };
}
