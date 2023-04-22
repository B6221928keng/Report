import express, { Request, Response } from 'express';
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('files'), (req: Request, res: Response) => {
  // Handle file uploads here
  res.send('Files uploaded successfully');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});