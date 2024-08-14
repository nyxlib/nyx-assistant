<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

defineProps({
    defTextVector: {
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

        <label class="col-sm-2">
            <span :class="`text-${COLORS[defTextVector['@state']]}`">
                <i class="bi bi-circle-fill"></i>
            </span>
            {{ defTextVector['@label'] || defTextVector['@name'] }}
        </label>

        <!-- ******************************************************************************************************* -->

        <div :class="{'col-sm-10': defTextVector['@perm'] === 'ro', 'col-sm-9': defTextVector['@perm'] !== 'ro'}">

            <template v-for="defText in defTextVector['children']">

                <div class="input-group input-group-sm mb-1">

                    <span class="input-group-text" style="min-width: 175px;">
                        {{ defText['@label'] || defText['@name'] }}
                    </span>

                    <input class="form-control" type="text" :readonly="defTextVector['@perm'] === 'ro'" v-model="defText['$']" />

                </div>

            </template>

        </div>

        <!-- ******************************************************************************************************* -->

        <div class="col-sm-1 pb-1" v-if="defTextVector['@perm'] !== 'ro'">

            <button class="btn btn-xs btn-outline-primary h-100 w-100">
                Apply
            </button>

        </div>

        <!-- ******************************************************************************************************* -->

    </div>

    <!-- *********************************************************************************************************** -->

</template>
