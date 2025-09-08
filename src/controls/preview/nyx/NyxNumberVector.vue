<!--suppress JSUnresolvedReference -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {computed} from 'vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const props = defineProps({
    defNumberVector: {
        type: Object,
        default: () => {},
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/

const sortedDefs = computed(() => [...props.defNumberVector.children].sort((x, y) => x['@rank'] - y['@rank']));

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

        <div class="col-lg-2">

            <i :class="['bi', 'bi-circle-fill', `text-${COLORS[defNumberVector['@state']]}`]"></i>

            {{ defNumberVector['@label'] || defNumberVector['@name'] }}

        </div>

        <!-- ******************************************************************************************************* -->

        <div :class="{'col-lg-10': defNumberVector['@perm'] === 'ro', 'col-lg-9': defNumberVector['@perm'] !== 'ro'}">

            <div class="input-group input-group-sm mb-1" v-for="defNumber in sortedDefs" :key="`${defNumber['@name']}-${defNumber['@rank']}`">

                <span class="input-group-text" style="min-width: 175px;">
                    {{ defNumber['@label'] || defNumber['@name'] }}
                </span>

                <input class="form-control" type="number" :min="defNumber['@min']" :max="defNumber['@max']" :step="defNumber['@step']" :readonly="defNumberVector['@perm'] === 'ro'" v-model.number="defNumber['$']" />

            </div>

        </div>

        <!-- ******************************************************************************************************* -->

        <div class="col-lg-1 pb-1" v-if="defNumberVector['@perm'] !== 'ro'">

            <button class="btn btn-xs btn-outline-primary h-100 w-100">
                Apply
            </button>

        </div>

        <!-- ******************************************************************************************************* -->

    </div>

    <!-- *********************************************************************************************************** -->

</template>
