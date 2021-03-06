import { ImageOptions } from '..';
import { ImageProps, ImageSources } from '../models';
import { getSizesAttribute, getSrcsetAttribute } from './generate-attributes';

export const generateImageProps = async (
  options: ImageOptions,
  calculatedDimensions,
  imageSources: ImageSources,
) => {
  const { sourceDimensions, requestedDimensions } = calculatedDimensions;
  const {
    resizeOptions: { width, layout, primaryFormat },
    sourceOptions: { alt },
  } = options;

  const sizesAttribute = getSizesAttribute(requestedDimensions.width, layout);

  const fallbackImage = await Promise.all(imageSources[primaryFormat]);
  const src = fallbackImage[fallbackImage.length - 1].src;
  
  const imageProps: ImageProps = {
    layout,
    placeholder: 'undefined',
    //backgroundColor,
    images: {
      fallback: {
        src,
        alt,
        srcset: getSrcsetAttribute(fallbackImage),
        sizes: sizesAttribute,
        type: `image/${primaryFormat}`,
      },
      sources: [],
    },
    presentation: {
      width: 0,
      height: 0,
    },
  };

  for (let key in imageSources) {
    if (key !== primaryFormat) {
      const imageSourcesByFormat = await Promise.all(imageSources[key]);
      imageProps.images.sources.push({
        srcset: getSrcsetAttribute(imageSourcesByFormat),
        sizes: sizesAttribute,
        type: `image/${key}`,
      });
    }
  }

  switch (layout) {
    case `fixed`:
      imageProps.presentation.width = requestedDimensions.width;
      imageProps.presentation.height = requestedDimensions.height;
      break;

    case `fullWidth`:
      imageProps.presentation.width = 1;
      imageProps.presentation.height = 1 / sourceDimensions.aspectRatio;
      break;

    case `constrained`:
      imageProps.presentation.width = width || sourceDimensions.width || 1;
      imageProps.presentation.height = 1 / sourceDimensions.aspectRatio;
  }

  return imageProps;
};
