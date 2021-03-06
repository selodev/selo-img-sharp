import { ImageOptions } from '..';
import { checkSetDefaultOptions } from './check-set-defeault-options';
import { getCalculatedDimensions } from '../dimensions/get-calculated-dimensions';
import { generateGetTransformations } from '../transformations/generate-get-transformations';
import { Build } from '@stencil/core';
import { fetchWriteRemoteImage } from '../remote/fetch-write-remote-image-to-file';
import { generateImageProps } from './generate-image-props';
import { generateImageSources } from './get-image-sources';
import { ImageSources } from '../models';
import { writeImagePropsToFile } from '../image-props-meta-data/write-image-props-to-file';

export const generateImageData = async (options: ImageOptions) => {
  if (!options) throw 'Image options object is required.';

  let {
    sourceOptions: sourceOptionsOriginal,
    sourceOptions: { remoteUrl },
  } = options;

  if (!Build.isBrowser) {
    if (remoteUrl) await fetchWriteRemoteImage(sourceOptionsOriginal);
  }
  
  options = await checkSetDefaultOptions(options);

  let { sourceOptions, resizeOptions } = options;

  const {
    sourceDimensions,
    requestedDimensions,
    layoutDimensions,
  } = await getCalculatedDimensions({ sourceOptions, resizeOptions });

  if (!Build.isBrowser) {
    const { imagesForProccessing } = generateGetTransformations(
      options,
      layoutDimensions,
    );
    const { processTransformations } = await import(
      '../transformations/process-tranformations'
    );
    await processTransformations(imagesForProccessing);
  }
  const imageSources: ImageSources = generateImageSources(options, layoutDimensions);

  const imageProps = await generateImageProps(
    options,
    {
      sourceDimensions,
      requestedDimensions,
    },
    imageSources,
  );

  await writeImagePropsToFile(options, imageProps);

  return imageProps;
};
