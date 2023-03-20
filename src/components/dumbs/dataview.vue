<script lang="ts">

</script>
<script setup lang="ts">
import { coords } from '../../models/models';
import numberView from './3dCoordView.vue';

const props = defineProps({
    cameraPos: coords,
    francepos: coords
})
</script>
<template>
    <div>
        <numberView :data="props.cameraPos" title="Camera position" />
    </div>
    <div>
        <numberView :data="props.francepos" title="France Position" />
    </div>
</template>
<style></style>