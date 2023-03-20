<script setup lang="ts">
defineProps({
    label: {
        type: String,
        default: "Button",
        required: false
    }
})
defineEmits(['click'])
</script>
<template>
    <div>
        <button @click="$emit('click')"><div>{{ label }}</div></button>
    </div>
</template>
<style></style>