<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {computed} from 'vue';

/*--------------------------------------------------------------------------------------------------------------------*/

import NyxTextVector from './nyx/NyxTextVector.vue';
import NyxNumberVector from './nyx/NyxNumberVector.vue';
import NyxSwitchVector from './nyx/NyxSwitchVector.vue';
import NyxLightVector from './nyx/NyxLightVector.vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const props = defineProps({
    groupInfo: {
        type: Object,
        default: () => {},
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/

const sortedVectors = computed(() => Object.values(props.groupInfo)
    .sort((x, y) => y['@rank'] - x['@rank'])
    .map((x) => props.groupInfo[x['@name']])
);

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div v-for="vector in sortedVectors" :key="`${vector['@name']}-${vector['@rank']}`">

        <nyx-text-vector :def-text-vector="vector" v-if="vector['<>'] === 'defTextVector'" />

        <nyx-number-vector :def-number-vector="vector" v-else-if="vector['<>'] === 'defNumberVector'" />

        <nyx-switch-vector :def-switch-vector="vector" v-else-if="vector['<>'] === 'defSwitchVector'" />

        <nyx-light-vector :def-light-vector="vector" v-else-if="vector['<>'] === 'defLightVector'" />

    </div>

    <!-- *********************************************************************************************************** -->

</template>
