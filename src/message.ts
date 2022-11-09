export const MessageError = {
  DEFAULT: (message: MessageName) => `${message}`,
  NOT_FOUND: (content: MessageName) => `${content} not found`,
  EXISTS: (content: MessageName) => `${content} already exists`,
  INCORRECT: (content: MessageName) => `${content} is incorrect`,
  ACCESS_DENIED: () => `access denied`,
};

export enum MessageName {
  USER = 'user',
}
