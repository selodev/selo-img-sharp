export const sharpImageOptionsBuilder = async (src: string, alt: string, options) => {
  try {
    const { parse } = (await import('path')).default;
    const { dir: urlSrcPath, base: urLSrcFileName, name: destFileName } = parse(
      src,
    );

    const { sourceOptions, destinationOptions } = options;
    let {
      destinationOptions: { destPath },
      sourceOptions: { remoteUrl, srcPath },
    } = options;

    if (!urlSrcPath.includes(srcPath)) {
      throw new Error(`${urlSrcPath} doesn't match ${srcPath} path.`);
    }

    remoteUrl += src.replace('assets', '');
    const removedSrcPath = urlSrcPath.replace(srcPath, '');
    destPath += removedSrcPath;

    let sharpOptions = {
      ...options,
      sourceOptions: {
        ...sourceOptions,
        src,
        alt,
        srcPath: urlSrcPath,
        srcFileName: urLSrcFileName,
        remoteUrl,
      },
      destinationOptions: {
        ...destinationOptions,
        destPath,
        destFileName,
      },
    };

    console.log(remoteUrl);
    return sharpOptions;
  } catch (error) {
    console.log(error);
  }
};