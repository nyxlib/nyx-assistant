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

    <div class="row mx-0 w-100">

        <!-- ******************************************************************************************************* -->

        <div class="col-lg-3">

            <i :class="['bi', 'bi-circle-fill', `text-${COLORS[defNumberVector['@state']]}`]"></i>

            <span class="ms-1" tabindex="0" ref="popoverRef">{{ defNumberVector['@label'] || defNumberVector['@name'] }}</span>

        </div>

        <!-- ******************************************************************************************************* -->

        <div class="col-lg-7">

            <template v-for="defNumber in sortedDefs" :key="defNumber">

                <div class="input-group input-group-sm mb-1">

                    <span class="input-group-text" style="min-width: 200px;">
                        {{ defNumber['@label'] || defNumber['@name'] }}
                    </span>

                    <sexagesimal :format="defNumber['@format']" v-model="defNumber['$']" :readonly="defNumberVector['@perm'] === 'ro'" v-if="defNumber['@format'].match(/%(\d+)\.(\d+)m/)" />

                    <input class="form-control" :type="defNumberVector['@perm'] === 'ro' ? 'text' : 'number'" :min="defNumber['@min']" :max="defNumber['@max']" :step="defNumber['@step']" :readonly="defNumberVector['@perm'] === 'ro'" v-model="defNumber['$']" v-else />

                </div>

            </template>

        </div>

        <!-- ******************************************************************************************************* -->

        <div class="col-lg-2 pb-1" v-if="defNumberVector['@perm'] !== 'ro'">

            <button class="btn btn-xs btn-outline-primary h-100 w-100" @click="sendMessage">
                Apply
            </button>

        </div>

        <!-- ******************************************************************************************************* -->

    </div>

    <!-- *********************************************************************************************************** -->

</template>
