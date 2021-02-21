# Sketchfab input for Sanity

Easily search Sketchfab for models by username. Returns the essential information and a responsive image preview.

Currently designed and built for my own uses. Contribution welcome.

## Usage
```
{
  fields: [
    // [...]
    {
      name: 'sketchfab',
      title: 'A Sketchfab Model',
      type: 'sketchfab'
    }
  ]
}
```
## Data Model
```
{
  _type: 'sketchfab',
  uid: string,
  title: string,
  user: string,
  embed: string,
  url: string,
  image: {
    src: string,
    srcset: string,
  },
}
```