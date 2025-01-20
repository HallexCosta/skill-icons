import { type } from 'arktype'
import { response } from '../workers/response'

interface ValidateResponseError {
  error: true
  result: Response
}

interface ValidateResponseSuccess<T> {
  error: false
  result: T
}

// export const iconsQueryParamsType = type({
//   // perLine: '0 <= string.integer.parse <= 50 | null',
//   icons: 'string.lower > 0'
//   // i: 'string.lower == 0 |null'
// })
//   // .or({
//   //   perLine: '0 <= string.integer.parse <= 50 | null',
//   //   i: 'string.lower > 0',
//   //   icons: 'string.lower == 0 | null'
//   // })
//   .pipe(({ i, icons, perLine }) => {
//     // Ensure `perLine` is a number or null
//     // const parsedPerLine = perLine !== null ? Number(perLine) : null

//     // Split `icons` and `i` into arrays if they are not null
//     // const parsedIcons = icons ? icons.split(',') : null
//     const parsedI = i ? i.split(',') : null

//     return {
//       // perLine: parsedPerLine,
//       // icons: parsedIcons,
//       i: parsedI
//     }
//   })

const validateQueryParams = <T = unknown>(
  request: Request,
  defaultIconsPerLine: number
): ValidateResponseError | ValidateResponseSuccess<T> => {
  const { searchParams } = new URL(request.url)

  const iconParam = searchParams.get('i') || searchParams.get('icons')
  if (!iconParam) {
    return {
      error: true,
      result: response.json(
        {
          message: "You didn't specify any icons!"
        },
        {
          status: 400
        }
      )
    }
  }

  const perLine: number =
    Number(searchParams.get('perline')) || defaultIconsPerLine

  if (Number.isNaN(perLine) || perLine < -1 || perLine > 50) {
    return {
      error: true,
      result: response.json(
        {
          message: 'Icons per line must be a number between 1 and 50'
        },
        {
          status: 400
        }
      )
    }
  }

  return {
    error: false,
    result: <T>{
      requestIcons: iconParam,
      perLine
    }
  }
}

const validateMatchPattern = (requestIcons: string) => {
  // create a validation regex pattern to allow users input icons in the format of `icon1,icon2,icon3` and configure the theme as `theme:icon1,theme:icon2,icon3`
  // some other symbols different from `,` and `:` are not allowed
  const pattern = /^([a-z0-9-]+)(?::([a-z0-9-]+))?$/i
  return requestIcons.split(',').every((icon) => pattern.test(icon))
}

export const requestIconsValidator = {
  validateQueryParams,
  validateMatchPattern
}
