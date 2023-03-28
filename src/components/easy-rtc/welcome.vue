<script setup lang="ts">
import { reactive } from 'vue';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000').connect()

const credentials = reactive({
    userid: "",
    password: ""
})

/** IN : login messages */
socket.on('login', (data) => {
    let a = 0
})

/** OUT : login user */
function connect() {
    socket.emit('login', { 'email': credentials.userid, 'password': credentials.password })
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