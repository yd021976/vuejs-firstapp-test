import { io } from 'socket.io-client'
import { createApp } from 'vue'
import App from './App.vue'
import AppError from './AppError.vue';
import './assets/main.css'

const socket = io('http://localhost:3000')
socket.on('connect_error', (data) => {
    createApp(AppError).mount('#app')
})

socket.on('connect', () => {
    const app = createApp(App)
    app.provide('websocket', socket)
    app.mount('#app')
})

socket.connect()

