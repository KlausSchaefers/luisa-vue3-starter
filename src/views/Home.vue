<template>
 <Luisa :design="design" :config="config" v-model="viewModel" ref="qux"/>
</template>

<script>
/**
 * Here is the downloaded figma file. To download yours type in the command line
 * node download.js <FigmaToken> <FigmaFileId>  <Page1,Page2> (Optional only the pages you need)
 */
import app from './app.json'

export default {
  name: 'Home',
  data: function() {
    return {
      design: app, // 'a2aa10aAzTPNq2B5yaDMREzIx9s5eeyyFsSqln5vtTft5dGoqy7wYJx9rJYO',
      showViewModel: true,
      viewModel: {
      },
      config: {
      }
    }
  },
  components: {
    
  }
}
</script>
