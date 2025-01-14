import { getIconByAlias } from '../../../../db/db'
import * as icons from '../../../../dist/icons.json'

import { requestIconHasTheme } from '../utils/requestIconHasTheme'

const ONE_ICON = 48
const SCALE = ONE_ICON / (300 - 44)

export async function svg(requestIcons, perLine) {
  const iconSvgList = await Promise.all(
    requestIcons.map(async (requestIcon) => {
      const icon = await getIconByAlias(requestIcon)
      if (!icon) return null

      if (!requestIconHasTheme(requestIcon)) {
        console.log('entrei aqui')
        return icons[`${icon.icon.defaultTheme}:${icon.id}`] ?? null
      }
      return icons[requestIcon]
    })
  )
  const length = Math.min(perLine * 300, requestIcons.length * 300) - 44
  const height = Math.ceil(iconSvgList.length / perLine) * 300 - 44
  const scaledHeight = height * SCALE
  const scaledWidth = length * SCALE

  return `
    <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
      ${iconSvgList
        .map(
          (i, index) =>
            `
          <g transform="translate(${(index % perLine) * 300}, ${
            Math.floor(index / perLine) * 300
          })">
            ${i}
          </g>
          `
        )
        .join(' ')}
    </svg>
  `
}

export const generatorService = {
  svg
}
