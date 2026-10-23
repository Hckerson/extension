import { z } from 'zod';

export const MESSAGE_TYPES = {
  CONTENT_TO_BACKGROUND: 'content_to_background',
  BACKGROUND_TO_CONTENT: 'background_to_content',
  POPUP_TO_BACKGROUND: 'popup_to_background',
  BACKGROUND_TO_POPUP: 'background_to_popup',
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export const ContentToBackgroundMessageSchema = z.object({
  type: z.literal(MESSAGE_TYPES.CONTENT_TO_BACKGROUND),
  data: z.object({
    url: z.string().url(),
    title: z.string(),
  }),
});

export const BackgroundToContentMessageSchema = z.object({
  type: z.literal(MESSAGE_TYPES.BACKGROUND_TO_CONTENT),
  data: z.object({
    response: z.string(),
  }),
});

export const PopupToBackgroundMessageSchema = z.object({
  type: z.literal(MESSAGE_TYPES.POPUP_TO_BACKGROUND),
  data: z.object({
    action: z.enum(['get_data', 'clear_data']),
  }),
});

export const BackgroundToPopupMessageSchema = z.object({
  type: z.literal(MESSAGE_TYPES.BACKGROUND_TO_POPUP),
  data: z.object({
    result: z.unknown(),
  }),
});

export type ContentToBackgroundMessage = z.infer<typeof ContentToBackgroundMessageSchema>;
export type BackgroundToContentMessage = z.infer<typeof BackgroundToContentMessageSchema>;
export type PopupToBackgroundMessage = z.infer<typeof PopupToBackgroundMessageSchema>;
export type BackgroundToPopupMessage = z.infer<typeof BackgroundToPopupMessageSchema>;
