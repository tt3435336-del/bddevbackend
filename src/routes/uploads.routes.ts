import { Hono } from 'hono';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { configureCloudinary } from '../config/cloudinary';
import { adminMiddleware, authMiddleware } from '../middlewares/auth.middleware';

const router = new Hono();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const ALLOWED_IMAGE_FORMATS = 'gif,jpeg,jpg,png,webp';

const getFolder = (type: 'products' | 'personalizations') => {
  const rootFolder = process.env.CLOUDINARY_FOLDER?.trim() || 'safetypro-senegal';
  return `${rootFolder}/${type}`;
};

const isUploadedFile = (
  value: string | File,
): value is File => typeof value !== 'string' && typeof value.arrayBuffer === 'function';

router.use('/admin/uploads/product-signature', authMiddleware, adminMiddleware);

router.post('/admin/uploads/product-signature', (c) => {
  try {
    const { cloudinary, cloudName, apiKey, apiSecret } = configureCloudinary();
    const uploadParams = {
      allowed_formats: ALLOWED_IMAGE_FORMATS,
      folder: getFolder('products'),
      timestamp: Math.floor(Date.now() / 1000),
    };

    const signature = cloudinary.utils.api_sign_request(uploadParams, apiSecret);

    return c.json({
      success: true,
      data: {
        apiKey,
        cloudName,
        signature,
        uploadParams,
      },
    });
  } catch (error) {
    console.error('Erreur signature Cloudinary:', error);
    return c.json({ success: false, error: 'Cloudinary non configuré' }, 500);
  }
});

router.post('/uploads/personalization-logo', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body.file;

    if (!file || !isUploadedFile(file)) {
      return c.json({ success: false, error: 'Logo requis' }, 400);
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return c.json({ success: false, error: 'Le logo dépasse 5 Mo' }, 400);
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return c.json({ success: false, error: 'Format de logo invalide' }, 400);
    }

    const { cloudinary } = configureCloudinary();
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          allowed_formats: ALLOWED_IMAGE_FORMATS.split(','),
          folder: getFolder('personalizations'),
          resource_type: 'image',
        },
        (error: UploadApiErrorResponse | undefined, uploadedImage: UploadApiResponse | undefined) => {
          if (error || !uploadedImage) {
            reject(error || new Error('Réponse Cloudinary invalide'));
            return;
          }

          resolve(uploadedImage);
        },
      );

      uploadStream.end(buffer);
    });

    return c.json({
      success: true,
      data: {
        url: result.secure_url,
      },
    });
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error);
    return c.json({ success: false, error: 'Impossible d’envoyer le logo' }, 500);
  }
});

export { router as uploadsRoutes };
