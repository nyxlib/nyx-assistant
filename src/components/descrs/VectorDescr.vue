<!--suppress HtmlUnknownTag, HtmlUnknownAttribute, JSUnresolvedReference, VueUnrecognizedDirective -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {MdEditor} from 'md-editor-v3';

/*--------------------------------------------------------------------------------------------------------------------*/

import PropTable from '../tables/PropTable.vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

defineProps({
    theme: {
        type: String,
        default: 'light',
    },
    vector: {
        type: Object,
        required: true,
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/

const TOOLBARS = [
    'bold',
    'underline',
    'italic',
    '-',
    'title',
    'strikeThrough',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    '=',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'previewOnly',
    'catalog',
];

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="row">
        <div class="col-md-4">

            <!-- *************************************************************************************************** -->

            <div class="card shadow-sm mb-3">
                <div class="card-header px-3 py-2">
                    Vector <i class="bi bi-info-circle-fill" :title="`Id: ${vector.id}`" v-tooltip></i>
                </div>
                <div class="card-body px-3 py-2">

                    <!-- ******************************************************************************************* -->

                    <div class="row">
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="F7166B34">Label<sup class="text-secondary">opt</sup></label>
                                <input class="form-control form-control-sm" type="text" placeholder="Label" id="F7166B34" v-model.trim="vector.label" />
                            </div>

                        </div>
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="F09714F1">Group<sup class="text-secondary">opt</sup></label>
                                <input class="form-control form-control-sm" type="text" placeholder="Group" id="F09714F1" v-model.trim="vector.group" />
                            </div>

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="row">
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="CB4E3E4D">Timeout<sup class="text-secondary">opt</sup> [ms]</label>
                                <input class="form-control form-control-sm" type="number" min="0" step="1" placeholder="Timeout" :disabled="['light', 'stream'].includes(vector.type)" id="CB4E3E4D" v-model.number="vector.timeout" />
                            </div>

                        </div>
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="DB1F21AD">Message<sup class="text-secondary">opt</sup></label>
                                <input class="form-control form-control-sm" type="text" placeholder="Message" :disabled="['stream'].includes(vector.type)" id="DB1F21AD" v-model.trim="vector.message" />
                            </div>

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="row">
                        <div class="col-md-6">

                            <div class="mb-3">
                                <label class="form-label" for="B318D314">State</label>
                                <select class="form-select form-select-sm" id="B318D314" v-model="vector.state">
                                    <option value="NYX_STATE_IDLE">Idle</option>
                                    <option value="NYX_STATE_OK">Ok</option>
                                    <option value="NYX_STATE_BUSY">Busy</option>
                                    <option value="NYX_STATE_ALERT">Alert</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="C3E07382">Permission</label>
                                <select class="form-select form-select-sm" :disabled="['light', 'stream'].includes(vector.type)" id="C3E07382" v-model="vector.perm">
                                    <option value="NYX_PERM_RO">RO</option>
                                    <option value="NYX_PERM_WO">WO</option>
                                    <option value="NYX_PERM_RW">RW</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="E9BE4567">Rule</label>
                                <select class="form-select form-select-sm" :disabled="!['switch'].includes(vector.type)" id="E9BE4567" v-model="vector.rule">
                                    <option value="NYX_RULE_ONE_OF_MANY">One of many</option>
                                    <option value="NYX_RULE_AT_MOST_ONE">At most one</option>
                                    <option value="NYX_RULE_ANY_OF_MANY">Any of many</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" role="switch" :disabled="[].includes(vector.type)" :true-value="true" :false-value="false" id="C29560FE" v-model="vector.disabled" />
                        <label class="form-check-label" for="C29560FE">Disabled</label>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="form-check form-switch mb-0">
                        <input class="form-check-input" type="checkbox" role="switch" :disabled="['stream'].includes(vector.type)" :true-value="true" :false-value="false" id="B8C30ADF" v-model="vector.callback" />
                        <label class="form-check-label" for="B8C30ADF">Implement callback</label>
                    </div>

                    <!-- ******************************************************************************************* -->

                </div>
            </div>

            <!-- *************************************************************************************************** -->

        </div>
        <div class="col-md-8">

            <!-- *************************************************************************************************** -->

            <nav-tabs margin="mb-4">

                <!-- *********************************************************************************************** -->

                <tab-pane title="Vectors">

                    <PropTable :type="vector.type" :defs="vector.defs" />

                </tab-pane>

                <!-- *********************************************************************************************** -->

                <tab-pane title="Hints">

                    <md-editor class="shadow-sm" language="en-US" :theme="theme" :toolbars="TOOLBARS" style="border-radius: 0.5rem; height: 590px;" v-model.trim="vector.hints" />

                </tab-pane>

                <!-- *********************************************************************************************** -->

            </nav-tabs>

            <!-- *************************************************************************************************** -->

        </div>
    </div>

    <!-- *********************************************************************************************************** -->

</template>

<style>
/*--------------------------------------------------------------------------------------------------------------------*/

@import url("md-editor-v3/lib/style.css");

/*--------------------------------------------------------------------------------------------------------------------*/
</style>
