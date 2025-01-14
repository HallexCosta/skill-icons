import _ from 'lodash'

const defaultJsonOptions = {
  headers: {
    'content-type': 'application/json;charset=UTF-8'
  }
}

const defaultSvgOptions = { headers: { 'Content-Type': 'image/svg+xml' } }

export const response = {
  svg: (data, options = {}) => {
    return new Response(data, _.merge(defaultSvgOptions, options))
  },
  json: (data, options = {}) => {
    return new Response(
      JSON.stringify(data),
      _.merge(defaultJsonOptions, options)
    )
  }
}
