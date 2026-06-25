import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { Response } from 'express';

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]);

@Injectable()
export class StorageService {
  private readonly uploadDir: string;
  private readonly publicApiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir =
      this.configService.get<string>('UPLOAD_DIR') ??
      join(process.cwd(), 'uploads');
    this.publicApiUrl =
      this.configService.get<string>('API_PUBLIC_URL') ??
      'http://localhost:3000';

    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  saveFromBuffer(
    projectId: string,
    file: Express.Multer.File,
  ): {
    fileKey: string;
    fileUrl: string;
    mimeType: string;
    fileSizeBytes: number;
  } {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de arquivo não suportado. Use PNG, JPG, GIF, WEBP, SVG ou PDF.',
      );
    }

    const extension = extname(file.originalname) || '';
    const filename = `${randomUUID()}${extension}`;
    const fileKey = `${projectId}/${filename}`;
    const destination = join(this.getProjectUploadDir(projectId), filename);

    writeFileSync(destination, file.buffer);

    return {
      fileKey,
      fileUrl: `${this.publicApiUrl}/files/${fileKey}`,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
    };
  }

  buildFileMetadata(projectId: string, file: Express.Multer.File) {
    return this.saveFromBuffer(projectId, file);
  }

  getProjectUploadDir(projectId: string) {
    const projectDir = join(this.uploadDir, projectId);
    if (!existsSync(projectDir)) {
      mkdirSync(projectDir, { recursive: true });
    }
    return projectDir;
  }

  get uploadRoot() {
    return this.uploadDir;
  }

  getAbsolutePath(fileKey: string): string {
    const normalized = fileKey.replace(/\.\./g, '');
    return join(this.uploadDir, normalized);
  }

  streamFile(fileKey: string, response: Response) {
    const absolutePath = this.getAbsolutePath(fileKey);

    if (!existsSync(absolutePath)) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    return createReadStream(absolutePath).pipe(response);
  }

  deleteFile(fileKey: string) {
    const absolutePath = this.getAbsolutePath(fileKey);
    if (existsSync(absolutePath)) {
      unlinkSync(absolutePath);
    }
  }
}
