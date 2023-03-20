<script setup lang="ts">
import { coords } from '../../models/models';

const props = defineProps({
    title:String,
    data: coords
})
</script>
<template>
    <div class="positions">
        <div><b>{{ title }}</b></div>
        <div>{{ data?.x }}</div>
        <div>{{ data?.y }}</div>
        <div>{{ data?.z }}</div>
    </div>
</template>

<style>
div.positions {
    font-size: 12px;
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>