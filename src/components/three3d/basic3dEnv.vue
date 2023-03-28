<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { basicTest3dWorld } from '../libs/basic-world-3d';
import SliderCamera from '../components/dumbs/slider.vue';
import ComputeButton from '../components/dumbs/button.vue';

const world = new basicTest3dWorld()
world.camera.position.z = 105
world.camera.fov = 60

/** HTML refs */
const three3dEnv = ref<HTMLElement | null>(null)
const cursor = ref<HTMLDivElement | null>(null)

function onCameraSlider(value, axename: string = "z") {
    world.camera.position[axename] = value
    world.renderScene()
}

function compute() {
    const result = world.compute()
    // add a div to check this is correct
    if (cursor.value && result !== undefined) {
        cursor.value.style.border = "1px"
        cursor.value.style.height = `${result.height}px`
        cursor.value.style.width = `${result.width}px`
        // cursor.value.style.height = `16px`
        // cursor.value.style.width = `16px`
        cursor.value.style.left = `${result.x}px`
        cursor.value.style.top = `${result.y}px`
        cursor.value.style.position = 'absolute'
        cursor.value.style.backgroundColor = 'aqua'
    }
}
/**
 * When component is mounted and DOM element is ready...
 */
onMounted(() => {
    world.init(three3dEnv.value as HTMLElement).then(()=>{
        world.renderScene()
    })
})
</script>
<template>
    <div id="sideView">
        <div>Hello world !</div>
        <SliderCamera :initial-value="world.camera.position.z" :step="0.1" :range="5000" :show-value="true" slider-title="Camera Z"
            @value-changed="$event => onCameraSlider($event, 'z')" />
        <SliderCamera :initial-value="world.camera.position.x" :step="0.01" :minValue="-50" :range="300" :show-value="true"
            slider-title="Camera X" @value-changed="$event => onCameraSlider($event, 'x')" />
        <SliderCamera :initial-value="world.camera.position.y" :step="0.01" :minValue="-50" :range="300" :show-value="true"
            slider-title="Camera Y" @value-changed="$event => onCameraSlider($event, 'y')" />
        <ComputeButton label="Compute" @click="compute()" />
    </div>
    <div id="three3dEnv" ref="three3dEnv" style="z-index: 0;">
        <div style="border-style: solid;border:1px;background-color: aqua;top: 0px;left: 0px;height: 16px;width: 16px;position: absolute;z-index: 100;"
            ref="cursor">
        </div>
    </div>
</template>
<style>
#three3dEnv {
    width: 1200px;
    height: 800px;
}
</style>