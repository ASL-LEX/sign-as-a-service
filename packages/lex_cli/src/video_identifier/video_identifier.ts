/**
 * Defines how to get the unique identifier from a file. This is used for
 * uploading videos and determining what video relates to what LexiconEntry
 */
export abstract class VideoIdentifier {
  abstract identify(fileName: string): Promise<string>;
}
