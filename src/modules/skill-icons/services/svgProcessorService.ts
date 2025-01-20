import { html } from '../common/html'
import { iconService } from './iconService'

const ONE_ICON = 48
const SCALE = ONE_ICON / (300 - 44)

function createSvgScale(
  requestIcons: string[],
  perLine: number,
  iconSvgList: any
) {
  const length = Math.min(perLine * 300, requestIcons.length * 300) - 44
  const height = Math.ceil(iconSvgList.length / perLine) * 300 - 44
  const scaledHeight = height * SCALE
  const scaledWidth = length * SCALE

  return html`
    <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
      ${iconSvgList
        .map(
          (i: number, index: number) =>
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

export async function generate(requestIcons: string[], perLine: number) {
  const iconSvgList = await iconService.processInParallel(requestIcons)
  return createSvgScale(requestIcons, perLine, iconSvgList)
}

export const svgProcessorService = {
  generate
}
