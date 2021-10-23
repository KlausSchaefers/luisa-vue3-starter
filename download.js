const fs = require('fs');
const fetch = require('node-fetch');
const util = require('util');
const chalk = require('chalk');
const luisa = require('luisa-vue3')


function downloadFigma(){

  console.debug(`\n\n`)
  console.debug(`Luisa - Downlaod figma`)
  console.debug(`\n\n`)
  
  /**
   * Change here the destimation folder. If you change the image folder
   * make sure to also update the conf object.
   */
  const jsonFileTarget = 'src/views/app.json'
  const fileFolderTarget = 'public/img'
  
  /**
   * Get arguments from path
   */
  const figmaAccessKey = process.argv[2]
  const figmaFileId = process.argv[3]
  const figmaPageId = process.argv[4]
  
  /**
   * Check if inout is ok
   */
  if (!figmaAccessKey || !figmaFileId) {
    console.debug(chalk.red('Plesse add the figma access token and file id'))
    console.debug('Example: node download.js <accessToken> <fileKey> <page name>*')
    return
  }
  
  
  /**
   * Enable fetch polyfill
   */
  if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    globalThis.Headers = fetch.Headers
  }
  
  var selectedPages = figmaPageId ? figmaPageId.split(',') : []
  /**
   * Start downloading
   */
  const streamPipeline = util.promisify(require('stream').pipeline);
  luisa.setLogLevel(-5)
  
  const figmaService = new luisa.createFigmaService(figmaAccessKey)
  console.debug(chalk.blue('Download Figma file...'))
  if (figmaPageId) {
    console.debug(chalk.blue('Limit to page...' + selectedPages))
  }
  
  try {
    figmaService.get(figmaFileId, true, false, selectedPages).then(async app => {
      console.debug(chalk.blue('Download images:'))
    
      const widgetsWithImages = Object.values(app.widgets).filter(w => {
        return w.props.figmaImage
      })
      var promisses = widgetsWithImages.map(async w => {
        const imageURL = w.props.figmaImage
        try {
          var imageFileTarget = fileFolderTarget + '/' + w.id +'.png'
          console.debug(chalk.blueBright('  - ' + imageFileTarget) , chalk.gray('(' + imageURL + ')'))
          const response = await fetch(imageURL);
          if (response.ok) {
            w.style.backgroundImage = {
              url: w.id +'.png'
            }
            return streamPipeline(response.body, fs.createWriteStream(imageFileTarget));
          }
        } catch (e) {
          console.debug(chalk.red(' ! Could not download element: ' + w.name + ' url:' + imageURL))
          return new Promise(resolve => resolve())
        }
      })
      await Promise.all(promisses)
      console.debug(chalk.blue('Write app file...'))
      var content = JSON.stringify(app, null, 2)
      fs.writeFileSync(jsonFileTarget, content)
    
      console.debug(`\n\n`)
      console.debug(chalk.green('Done!'), 'Now import the JSON file in', chalk.green('Home.vue'))
    })
  } catch (err) {
    console.debug(err)
  }

  
  

}


downloadFigma()