<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { globeScene } from '../libs/three-globe';
import type { world } from '../libs/three-globe';
import GlobeControls from "./dumbs/button.vue";
import DataView from "./dumbs/dataview.vue";
import { coords } from '../models/models'

var v3 = ref(new coords())
var worldData = reactive({ position: v3, francePos: ref(new coords()) })
var viewScene: globeScene

function updateCameraPos(position: THREE.Vector3) {
    v3.value = { x: position.x, y: position.y, z: position.z }
}
function computeTest() {
    viewScene.compute()
}

onMounted(async () => {
    const globeDiv = document.getElementById('globe') || undefined
    if (!globeDiv) throw new Error("Div 'globeDiv' not found")
    viewScene = new globeScene(globeDiv)
    await viewScene.initScene()
    viewScene.setTbChangedHandler(updateCameraPos)
    worldData.francePos = viewScene.staticData()
    viewScene.animate()
})
</script>

<template>
    <div id="controls">
        <div>
            <div>Data</div>
            <DataView v-bind:camera-pos="worldData.position" v-bind:francepos="worldData.francePos" />
        </div>
        <div>
            <GlobeControls @compute="computeTest()" />
        </div>
    </div>
    <div id="globe"></div>
</template>

<style>
#globe {
    width: 800px;
    height: 800px;
}
</style>
