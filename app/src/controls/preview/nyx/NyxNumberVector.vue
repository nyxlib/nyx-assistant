<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

defineProps({
    defNumberVector: {
        type: Object,
        default: {},
    },
});

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

        <label class="col-lg-2">
            <span :class="`text-${COLORS[defNumberVector['@state']]}`">
                <i class="bi bi-circle-fill"></i>
            </span>
            {{ defNumberVector['@label'] || defNumberVector['@name'] }}
        </label>

        <!-- ******************************************************************************************************* -->

        <div :class="{'col-lg-10': defNumberVector['@perm'] === 'ro', 'col-lg-9': defNumberVector['@perm'] !== 'ro'}">

            <template v-for="defNumber in defNumberVector['children']" :key="defNumber">

                <div class="input-group input-group-sm mb-1">

                    <span class="input-group-text" style="min-width: 175px;">
                        {{ defNumber['@label'] || defNumber['@name'] }}
                    </span>

                    <input class="form-control" type="number" :min="defNumber['@min']" :max="defNumber['@max']" :step="defNumber['@step']" :readonly="defNumberVector['@perm'] === 'ro'" v-model="defNumber['$']" />

                </div>

            </template>

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
