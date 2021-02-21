// eslint-disable-next-line
import React, { PureComponent, useState } from 'react'
import useSWR from 'swr'
import {debounce} from 'lodash'
import FormField from 'part:@sanity/components/formfields/default'
import SearchableSelect from '@sanity/components/lib/selects/SearchableSelect'
import DefaultTextInput from '@sanity/components/lib/textinputs/DefaultTextInput'


import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'

import styles from './sketchfabInput.css'

function getSrcset(images) {
  return [...images.map((img) => `${img.url} ${img.width}w`)].join(', ')
}

function fetchModels(user, query) {
  if (!user) return []
  const url = `https://api.sketchfab.com/v3/search?type=models&user=${user}${
    query ? '&q=' + encodeURIComponent(query) : ''
  }`
  return fetch(url)
    .then((res) => res.json())
    .then((res) =>
      res.results.map((i) => ({
        uid: i.uid,
        title: i.name,
        user: i.user.username,
        embed: i.embedUrl,
        url: i.viewerUrl,
        image: {
          src: i.thumbnails.images[0].url,
          preview: i.thumbnails.images[0],
          srcset: getSrcset(i.thumbnails.images),
        },
      }))
    )
}

const createPatchFrom = (value) =>
  PatchEvent.from(value === '' ? unset() : set(value))

export default React.forwardRef((props, ref) => {
  const { type, value, onChange } = props

  const { options } = type

  const [
    user = value && value.user ? value.user : options.user,
    setUser,
  ] = useState()
  const [query, setQuery] = useState()

  const { data: models } = useSWR([user, query], fetchModels)

  return (
    <FormField
      label={type.title || '3d Model'}
      collapsible={options.collapsible}
      collapsed={options.collapsed}
      description={
        type.description || options.hideUserSelect
          ? ''
          : 'Enter the Sketchfab user and select a model from the list.'
      }
    >
      {!options.hideUserSelect && (
        <FormField
          labelFor="sketchfab-input-user-search"
          label="Enter Sketchfab user"
        >
          <DefaultTextInput
            inputId="sketchfab-input-user-search"
            value={user || ''}
            onChange={(e) => setUser(e.target.value)}
          />
        </FormField>
      )}

      <FormField
        label={options.hideUserSelect ? 'Search models' : 'Search user’s models'}
        description={
          options.warning || options.hideUserSelect
            ? ''
            : 'Note: Results are limited to 24 items, search everything by typing a query.'
        }
      >
        <SearchableSelect
          ref={ref}
          value={(models || []).find((item) => item.uid === value)}
          items={models || []}
          inputValue={
            (models || []).find((item) => item.uid === value) ? (models || []).find((item) => item.uid === value).title : value
              ? value.title
              : ''
          }
          onChange={(selectedItem) => onChange(createPatchFrom(selectedItem))}
          onSearch={debounce(setQuery, 500)}
          renderItem={(item) => (
            <div className={styles.item}>
              <span>{item.title}</span>
            </div>
          )}
        />
      </FormField>
      {value && value.image && (
        <a href={value.url || ''} target="_blank" rel="noopener">
          <img
            className={styles.image}
            src={value.image.preview.url || null}
            width={value.image.preview.width || 1980}
            height={value.image.preview.height || 1080}
          />
        </a>
      )}
    </FormField>
  )
})