import { Sharp } from 'sharp';
import { ImageOptions } from '../models';
import { getCreateSourceDestinationPaths } from './get-source-destination-paths';
import { getImageCropFocusType, getImageFitType } from './sharp-constants';

export const resizeFormatImageToFile = async ({
  sourceOptions,
  destinationOptions,
  resizeOptions,
  jpgOptions,
  pngOptions,
  webpOptions,
  avifOptions,
}: ImageOptions) => {
  try {
    const sourceDestinationPaths = await getCreateSourceDestinationPaths({
      sourceOptions,
      destinationOptions,
      resizeOptions,
    });

    if (typeof sourceDestinationPaths != 'string') {
      const { absoluteImageSrc, absoluteImageDest } = sourceDestinationPaths;
      const { default: sharp } = await import('sharp');
      const pipeline: Sharp = sharp(absoluteImageSrc);

      let { width, height, fit, format, position, background } = resizeOptions;

      if (fit && typeof fit == 'string') {
        ({ value: fit } = getImageFitType(sharp, fit.toUpperCase()));
      }

      if (position && typeof position == 'string') {
        ({ value: position } = getImageCropFocusType(sharp, position.toUpperCase()));
      }

      if (width || height) {
        pipeline.resize(width, height, { fit, position, background });
      }

      if (format == 'jpg') {
        pipeline.jpeg({ ...jpgOptions });
      } else if (format == 'png') {
        pipeline.png({ ...pngOptions });
      } else if (format == 'avif') {
        pipeline.avif({ ...avifOptions });
      } else if (format == 'webp') {
        pipeline.webp({ ...webpOptions });
      } else {
        throw 'Image format is not supported.';
      }

      return await pipeline.toFile(absoluteImageDest);
    }
  } catch (error) {
    console.error(error);
  }
};
