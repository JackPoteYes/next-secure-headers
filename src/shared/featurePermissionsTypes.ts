export const supportedDirectiveNames = [
  "accelerometer",
  "ambient-light-sensor",
  "autoplay",
  "battery",
  "camera",
  "display-capture",
  "document-domain",
  "encrypted-media",
  "execution-while-not-rendered",
  "execution-while-out-of-viewport",
  "fullscreen",
  "geolocation",
  "gyroscope",
  "layout-animations",
  "legacy-image-formats",
  "magnetometer",
  "microphone",
  "midi",
  "navigation-override",
  "oversized-images",
  "payment",
  "picture-in-picture",
  "publickey-credentials-get",
  "sync-xhr",
  "usb",
  "vr",
  "wake-lock",
  "screen-wake-lock",
  "web-share",
  "xr-spatial-tracking",
] as const;
export type DirectiveName = typeof supportedDirectiveNames[number];

export type DirectiveParameters = {
  none?: boolean;
  all?: boolean;
  self?: boolean;
  origins?: string[];
};

export type Options = false | Partial<Record<DirectiveName, DirectiveParameters>>;
