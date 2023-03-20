<script setup lang="ts">
import { ref, reactive } from 'vue';

const properties = defineProps({
    sliderTitle: {
        type: String,
        required: false,
        default: undefined
    },
    minValue: {
        type: Number,
        default: 0,
        required: false
    },
    range: {
        type: Number,
        default: 10,
        required: false
    },
    initialValue: {
        type: Number,
        default: 0,
        required: false
    },
    step: {
        type: Number,
        default: 1,
        required: false
    },
    showValue: {
        type: Boolean,
        default: false,
        required: false
    }
})
const emits = defineEmits(['valueChanged'])
const slider = ref<HTMLInputElement | null>(null)
const state = reactive({ sliderValue: properties.initialValue })
/**
 * 
 */
function sliderChanged() {
    const curValue = Number(slider.value?.value || "0")
    state.sliderValue = curValue
    emits('valueChanged', curValue)
}
</script>
<template>
    <div class="container">
        <div class="sliderInlineText" v-if="sliderTitle !== undefined">{{ sliderTitle }}</div>
        <input ref="slider" type="range" :step="step" :min="minValue" :max="range"
            @input="sliderChanged()" v-once :value="initialValue" />
        <div class="sliderInlineText">{{ state.sliderValue }}</div>
    </div>
</template>
<style>
div.container {
    display: flex;
    align-items: center;
    min-height: 32px;
}

div.sliderInlineText {
    display: inline-block;
    font-size: 10px;
    margin-left: 8px;
    margin-right: 8px;
}
</style>