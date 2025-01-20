export const getSkillIconsDb = async () => {
  const response = await fetch(
    'https://gist.githubusercontent.com/HallexCosta/07cd491e865154f5e3d73e86da6478dc/raw/skill-icons.json'
  )
  const db = await response.json()
  return db
}
