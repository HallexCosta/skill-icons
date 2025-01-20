import { type ConfigKeys, config } from '../common/config'

function all() {
  return config
}

function get(constantName: ConfigKeys) {
  return config[constantName]
}

export const configExportService = {
  get,
  all,
  config
}
