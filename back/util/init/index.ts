import initDb from './initDb'
import initFile from './initFile'
import initPlan from './initPlan'

export default async () => {
  await initDb()
  await initFile()
  await initPlan()
}
