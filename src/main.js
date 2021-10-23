import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Luisa from 'luisa-vue3'
import 'luisa-vue3/dist/luisa-vue3.css'

createApp(App).use(router).use(Luisa).mount('#app')
