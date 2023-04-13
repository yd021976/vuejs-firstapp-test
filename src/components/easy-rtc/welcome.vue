<script setup lang="ts">
import { inject, reactive } from 'vue';
import type { Socket } from 'socket.io-client';

const credentials = reactive({
    userid: "",
    password: ""
})
const websocket = inject<Socket>('websocket') as Socket // force Socket type even if 'inject' return undefined (crash of app in this case)

/** IN : login messages */
websocket.on('login', (data) => {
    let a = 0
})

/** OUT : login user */
function connect() {
    websocket.emit('login', { 'email': credentials.userid, 'password': credentials.password })
}
</script>


<template>
    <div id="container">
        <div id="connection">
            <form>
                <input type="text" id="userid" v-model="credentials.userid" />
                <input type="password" id="pwd" v-model="credentials.password" />
                <button type="button" @click="connect()">Connect</button>
            </form>
        </div>
        <div id="audio_video">

        </div>
    </div>
</template>
<style>
#container {
    margin: 16px 16px 16px 16px;
}
</style>