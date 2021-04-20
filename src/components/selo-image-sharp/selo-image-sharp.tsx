import { Component, Host, h, Prop, State } from '@stencil/core';
import { generateImageData } from '../../utils/image-data/generate-image-data';
import { ImageOptions, ImageProps } from '../../utils/models';
import { imageOptions } from '../../utils/plugin-options';

@Component({
  tag: 'selo-image-sharp',
  styleUrl: 'selo-image-sharp.css',
  shadow: true,
})
export class SeloImageSharp {
  @State() imageProps: ImageProps;
  @Prop({ mutable: true }) options: ImageOptions | any = imageOptions;

  async componentWillLoad() {
    this.imageProps = await generateImageData(this.options);
  }

  render() {
    const {
      images: {
        fallback: { type, src, srcset, sizes },
        sources,
      },
    } = this.imageProps;

    return (
      <Host>
        <selo-image src={src} srcset={srcset} sizes={sizes} sources={sources} type={type}>
          <slot></slot>
        </selo-image>
      </Host>
    );
  }
}
