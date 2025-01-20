async function fetchSkillIconsDb(url: string) {
  const response = await fetch(url)
  return response
}

export const iconProvider = {
  fetchSkillIconsDb
}
