import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { mkdir } from 'fs/promises'
import sharp from 'sharp'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { AdminGuard } from '@/modules/auth/guards/admin.guard'
import type { Request } from 'express'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const multer = require('multer')

const UPLOAD_DIR = join(process.cwd(), 'uploads')
const ALLOWED_MIME = /^image\/(jpeg|png|webp)$/
const MAX_SIZE_BYTES = 5 * 1024 * 1024
const MAX_DIMENSION = 1600

@Controller('uploads')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: MAX_SIZE_BYTES },
      fileFilter: (_req: unknown, file: { mimetype: string }, cb: (err: Error | null, accept: boolean) => void) => {
        if (!ALLOWED_MIME.test(file.mimetype)) {
          return cb(new BadRequestException('Format non supporté. Utilisez JPG, PNG ou WebP.'), false)
        }
        cb(null, true)
      },
    }),
  )
  async upload(
    @UploadedFile() file: { buffer: Buffer } | undefined,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu')
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const filename = `${randomUUID()}.webp`
    await sharp(file.buffer)
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(UPLOAD_DIR, filename))

    const baseUrl = process.env.APP_URL ?? `${req.protocol}://${req.get('host')}`
    return { url: `${baseUrl}/uploads/${filename}` }
  }
}
