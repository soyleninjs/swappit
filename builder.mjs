/* eslint-disable no-control-regex */
import { context } from 'esbuild'

/* ============================================= */
// Configuracion
/* ============================================= */

const bundleConfig = {
  entryPoints: [
    {
      out: 'swappit.min',
      in: 'js/index.js'
    }
  ],
  bundle: true,
  format: 'esm',
  minify: true,
  outdir: 'npm',
}
const bundle = await context(bundleConfig)

bundle.rebuild()
  .then(async (result) => {
    console.log('Build completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
  })
