export const MessageError = {
  DEFAULT: (message: MessageName) => `${message}`,
  NOT_FOUND: (content: MessageName) => `${content}_not_found`,
};

export enum MessageName {
  USER = 'user',
}
