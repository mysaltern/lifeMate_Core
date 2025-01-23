declare namespace Express {
    interface Multer {
      File: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
        destination?: string;
        filename?: string;
        path?: string;
      };
    }
  
    interface Request {
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
  
  