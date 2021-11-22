import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Luisa from 'luisa-vue'

createApp(App)
    .use(router)
    .use(Luisa)
    .mount('#app')