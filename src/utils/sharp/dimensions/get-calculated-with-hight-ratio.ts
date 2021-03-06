import { getDimensionsAspectRatio } from './get-dimensions-aspect-ratio';
import { CalculatedDimension, ResizingOptions, SourceMetadata } from '../models';

export const getCalculateWithHieghtRatio = ({
  sourceMetadata,
  sourceMetadata: { width: sourceWidth, height: sourceHeight },
  width,
  height,
  aspectRatio,
  fit,
}: ResizingOptions & { sourceMetadata: SourceMetadata }): CalculatedDimension => {
  // Calculate the eventual width/height of the image.
  aspectRatio = sourceWidth / sourceHeight;
  if (aspectRatio) {
    if (width && height) {
      /* console.warn(
        `Specifying aspectRatio along with both width and height will cause 
            aspectRatio to be ignored.`,
      ); */
    } else {
      aspectRatio = aspectRatio;
    }
  }
  // If both are provided then we need to check the fit
  if (width && height) {
    ({ width, height, aspectRatio } = getDimensionsAspectRatio({
      sourceMetadata,
      width,
      height,
      fit,
    }));
  }
  // If Neither width or height were passed in, use default size
  width ??= height ? Math.round(height * aspectRatio) : sourceWidth;
  height ??= Math.round(width / aspectRatio);

  const isActualImageSmallerThanRequested = sourceWidth < width || sourceHeight < height;
  // If the image is smaller than requested, warn the user that it's being processed as such
  // print out this message with the necessary information before we overwrite it for sizing
  if (isActualImageSmallerThanRequested) {
    const dimensionBy = sourceWidth < width ? `width` : `height`;
    console.warn(`
    The requested ${dimensionBy} "${
      dimensionBy === `width` ? width : height
    }px" for the image ${'src'} was larger than the actual image ${dimensionBy} of ${
      sourceMetadata[dimensionBy]
    }px. If possible, replace the current image with a larger one.`);
    // width and height were passed in, make sure it isn't larger than the actual image
    width = Math.round(Math.min(width, sourceWidth));
    height = Math.round(width / aspectRatio);
  }

  return {
    width,
    height,
    aspectRatio,
  };
};
