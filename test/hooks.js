import config from 'config'
import { movieList } from './movie-list'
import fs from 'fs'

beforeEach('Reset movie File', () => {
  fs.writeFileSync(config.get('fichierJSON'), JSON.stringify(movieList))
});