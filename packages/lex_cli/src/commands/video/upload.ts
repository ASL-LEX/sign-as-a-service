import { Args, Command, Flags } from '@oclif/core';
import  { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { readdir, writeFile } from 'fs/promises';
import { AslLexVideoIdentifier } from '../../video_identifier/asl-lex';

export default class UploadVideos extends Command {
  static LEXICON_TYPES  = {
    'asl-lex': AslLexVideoIdentifier
  };

  static description = 'Upload video files to S3 and producing mapping file';

  static flags = {
    fileType: Flags.string({
      name: 'fileType',
      default: 'video/webm',
      required: false
    }),
    s3Path: Flags.string({
      name: 's3Path',
      default: 'sign-as-a-service',
      requried: false
    })
  };

  static args = {
    bucket: Args.string({
      name: 'bucket',
      required: true,
      description: 'S3 bucket to upload to'
    }),
    lexiconType: Args.string({
      name: 'lexiconType',
      required: true,
      description: 'The type of lexicon entry data, determines how to interpret files',
      options: Object.keys(this.LEXICON_TYPES)
    }),
    fileLocation: Args.directory({
      name: 'fileLocation',
      required: true,
      description: 'Where the video files are stored, directory',
      exists: true
    }),
    outputFile: Args.file({
      name: 'outputFile',
      required: true,
      description: 'Where to store the video file mapping between ID and public URL'
    })
  };


  async run(): Promise<void> {
    const { args, flags } = await this.parse(UploadVideos);
    const videoIdentifier = new UploadVideos.LEXICON_TYPES[args.lexiconType as keyof typeof UploadVideos.LEXICON_TYPES];

    const s3Client = new S3Client();

    // Will store the mapping between unique ID and public URL
    const mapping: { id: string, url: string }[] = [];
    let files = await readdir(args.fileLocation);
    files = [files[0], files[1]];
    console.log(files);

    console.log(files);

    for (const file of files) {
      const id = await videoIdentifier.identify(file);

      const uploadCommand = new PutObjectCommand({
        Bucket: args.bucket,
        Key: `${flags.s3Path}/${file}`,
        ContentType: flags.fileType,
        Tagging: `use=sign-as-a-service`
      });
      await s3Client.send(uploadCommand);

      mapping.push({ id, url: `https://signlab2.s3.amazonaws.com/${flags.s3Path}` });
    }

    await writeFile(args.outputFile, JSON.stringify(mapping));




    /*
    const uploadCommand = new PutObjectCommand({
      Bucket: args.bucket,
      Key: 'test.txt',
      Body: '',
      Tagging: 'use=sign-as-a-service'
    });

    const result = await s3Client.send(uploadCommand);
    console.log(result);
    */
  }
}
