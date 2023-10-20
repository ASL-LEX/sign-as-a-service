import { Box, Button, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { FC, ChangeEvent, DragEvent, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { usePredictLazyQuery } from '../../graphql/predict/predict';
import { Lexicon, LexiconEntry } from '../../graphql/graphql';

export interface VideoUploadProps {
  lexicon: Lexicon;
  setSearchResults: Dispatch<SetStateAction<LexiconEntry[]>>;
  width: number;
}

export const VideoUpload: FC<VideoUploadProps> = ({ lexicon, setSearchResults, width }) => {
  const [predictQuery] = usePredictLazyQuery();

  const handleUpload = async (file: File) => {
    // Upload the file
    const form = new FormData();
    form.append('file', file, 'file.webm');
    await axios.post('http://localhost:8000/upload', form);

    // Make the prediciton request
    const results = await predictQuery({ variables: { lexicon: lexicon._id, file: 'here.webm' } });
    if (results.data) {
      setSearchResults(results.data.predict.map((result) => result.entry));
    }
  };

  const handleUploadClick = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length == 0) {
      return;
    }
    handleUpload(files[0]);
  };

  const handleDragDrop = async (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (!event.dataTransfer.files || event.dataTransfer.files.length == 0) {
      return;
    }

    return handleUpload(event.dataTransfer.files[0]);
  };

  return (
    <Box
      sx={{
        border: '2px dashed grey',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
      }}
      onDragEnter={(event) => event.preventDefault()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDragDrop}
    >
      <Button startIcon={<FileUploadIcon />} component="label">
        <input hidden type="file" onChange={handleUploadClick} />
      </Button>
      <Typography>Upload Video Here</Typography>
    </Box>
  );
};
