import { Octokit } from 'octokit'
import { configExportService } from '../../shared/services/configExportService'

const config = configExportService.all()

const _octokitInstance = new Octokit({
  auth: config.GH_PERSONAL_ACCESS_TOKEN
})

const getOrCreateOctokitInstance = () => _octokitInstance.rest

export { getOrCreateOctokitInstance }
