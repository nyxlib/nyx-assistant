<!--suppress JSUnresolvedReference -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {computed} from 'vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const props = defineProps({
    defSwitchVector: {
        type: Object,
        default: () => {},
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/

const sortedDefs = computed(() => [...props.defSwitchVector.children].sort((x, y) => x['@rank'] - y['@rank']));

/*--------------------------------------------------------------------------------------------------------------------*/

const COLORS = {
    'Idle': 'secondary',
    'Ok': 'success',
    'Busy': 'warning',
    'Alert': 'danger',
};

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="row">

        <!-- ******************************************************************************************************* -->

        <div class="col-sm-2 text-start">

            <i :class="['bi', 'bi-circle-fill', `text-${COLORS[defSwitchVector['@state']]}`]"></i>

            {{ defSwitchVector['@label'] || defSwitchVector['@name'] }}

        </div>

        <!-- ******************************************************************************************************* -->

        <div class="col-sm-10 text-center">
            <div class="btn-group btn-group-sm mb-1 w-50" role="group">

                <button class="btn" :class="{'btn-primary': defSwitch['$'] === 'On', 'btn-outline-secondary': defSwitch['$'] === 'Off', 'disabled': defSwitchVector['@perm'] === 'wo'}" :style="{'width': `${100.0 / props.defSwitchVector['children'].length}%`}" v-for="defSwitch in sortedDefs" :key="`${defSwitch['@name']}-${defSwitch['@rank']}`">

                    <i :class="['bi', {'bi-check-square': defSwitch['$'] === 'On', 'bi-square': defSwitch['$'] === 'Off'}]" v-if="defSwitchVector['@rule'] === 'AnyOfMany'"></i>

                    {{ defSwitch['@label'] || defSwitch['@name'] }}

                </button>

            </div>
        </div>

        <!-- ******************************************************************************************************* -->

    </div>

    <!-- *********************************************************************************************************** -->

</template>
