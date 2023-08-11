import { VideoIdentifier } from './video_identifier';

export class AslLexVideoIdentifier extends VideoIdentifier {
  identify(name: string): Promise<string> {
    const id = name.split('.')[0];
    return Promise.resolve(id);
  }
}
