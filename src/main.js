import './assets/styles/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from "@/router/index"

export const pinia = createPinia()
const app = createApp(App)


app.use(pinia)
app.use(router)

app.mount('#app')
