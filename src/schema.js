import inputComponent from './sketchfabInput'

export default {
  name: 'sketchfab',
  title: 'Sketchfab Model',
  type: 'object',
  fields: [
    {
      type: 'string',
      name: 'uid',
    },
    {
      type: 'string',
      name: 'title',
    },
    {
      type: 'string',
      name: 'user',
    },
    {
      type: 'string',
      name: 'embed',
    },
    {
      type: 'string',
      name: 'url',
    },
    {
      type: 'object',
      name: 'image',
      fields: [
        {
          type: 'string',
          name: 'src',
        },
        {
          type: 'string',
          name: 'srcset',
        },
      ],
    },
  ],
  inputComponent,
}
