# app-testing-wrapper



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type                          | Default     |
| --------- | --------- | ----------- | ----------------------------- | ----------- |
| `alt`     | `alt`     |             | `string`                      | `undefined` |
| `loading` | `loading` |             | `"auto" \| "eager" \| "lazy"` | `undefined` |
| `src`     | `src`     |             | `string`                      | `undefined` |


## Dependencies

### Used by

 - [app-test](../app-test)

### Depends on

- [selo-img-sharp](../selo-img-sharp)

### Graph
```mermaid
graph TD;
  app-selo-img-sharp-wrapper-2 --> selo-img-sharp
  selo-img-sharp --> selo-img
  selo-img-sharp --> lazy-loader
  app-test --> app-selo-img-sharp-wrapper-2
  style app-selo-img-sharp-wrapper-2 fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
