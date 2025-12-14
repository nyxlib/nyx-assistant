<!--suppress HtmlUnknownTag, HtmlUnknownAttribute, JSUnresolvedReference, VueUnrecognizedDirective -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {inject, reactive, onMounted} from 'vue';

import Multiselect from '@vueform/multiselect';

/*--------------------------------------------------------------------------------------------------------------------*/

import DeviceTable from '../tables/DeviceTable.vue';
import DeviceDescr from '../descrs/DeviceDescr.vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const HAS_TAURI = window['__TAURI__'] !== undefined;

/*--------------------------------------------------------------------------------------------------------------------*/

const dialog = inject('dialog');
const std = inject('std');

/*--------------------------------------------------------------------------------------------------------------------*/

const props = defineProps({
    theme: {
        type: String,
        default: 'light',
    },
    globals: {
        type: Object,
        required: true,
    },
    changed: {
        type: Boolean,
        required: true,
    },
    path: {
        type: String,
        default: '',
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

const state = reactive({
    boards: [],
});

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const getPath = (filename) => {

    const lastSlashIndex = filename.lastIndexOf('/');

    return lastSlashIndex > 0 ? filename.substring(0, lastSlashIndex) : lastSlashIndex === 0 ? '/' : '.';
};

/*--------------------------------------------------------------------------------------------------------------------*/

const generate = (override = null) => {

    if(props.path)
    {
        /*------------------------------------------------------------------------------------------------------------*/

        const args = ['--output', getPath(props.path), props.path];

        if(override === 'override-cmake') {
            args.push('--override-cmake');
        }

        if(override === 'override-main') {
            args.push('--override-main');
        }

        if(override === 'override-device') {
            args.push('--override-device');
        }

        if(override === 'override-project') {
            args.push('--override-project');
        }

        /*------------------------------------------------------------------------------------------------------------*/

        dialog.lock();

        std.exec('nyx-gen', args).then((output) => {

            if(output.code === 0)
            {
                dialog.success(output.stdout);

                dialog.unlock();
            }
            else
            {
                dialog.error(output.stderr);

                dialog.unlock();
            }

        }).catch((e) => {

            dialog.error(/**/e/**/);

            dialog.unlock();
        });

        /*------------------------------------------------------------------------------------------------------------*/
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/
/* INITIALIZATION                                                                                                     */
/*--------------------------------------------------------------------------------------------------------------------*/

onMounted(() => {

    /*----------------------------------------------------------------------------------------------------------------*/

    dialog.lock();

    std.fetch('https://addons.nyxlib.org/api/platformio/boards/', {method: 'GET'}).then((response) => {

        response.json().then((result) => {

            state.boards = result.map((board) => ({
                value: `${board.platform}|${board.id}|${board.ram}`,
                label: board.name,
            }));

            dialog.unlock();

        }).catch((e) => {

            state.boards = [];

            dialog.error(e);
        });

    }).catch((e) => {

        state.boards = [];

        dialog.error(e);
    });

    /*----------------------------------------------------------------------------------------------------------------*/
});

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <nav-tabs margin="mb-3">

        <!-- ******************************************************************************************************* -->

        <tab-pane title="Node" icon="hdd-network">

            <div class="row">
                <div class="col-md-6">

                    <!-- ******************************************************************************************* -->

                    <div class="card shadow-sm mb-3">
                        <select class="card-header form-select border-0 border-bottom px-3 py-2" v-model="globals.mode">
                            <option value="posix-c">Node in C for POSIX systems</option>
                            <option value="posix-c++">Node in C++ for POSIX systems</option>
                            <option value="gnuradio">Node for Python or GNU Radio</option>
                            <option value="arduino-wifi">Node for Arduino board - WiFi version</option>
                            <option value="arduino-ethernet">Node for Arduino board - Ethernet version</option>
                        </select>
                        <div class="card-body px-3 py-2">

                            <!-- *********************************************************************************** -->

                            <div class="row">
                                <div class="col-md-6">

                                    <div class="mb-3">
                                        <label class="form-label" for="F7F2361C">Node name</label>
                                        <input class="form-control form-control-sm" type="text" placeholder="Node name" pattern="[a-zA-Z_][a-zA-Z0-9_]*" required="required" id="F7F2361C" v-model.trim="globals.nodeName" />
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="mb-3">
                                        <label class="form-label" for="A75F14A0">Node timeout [ms]</label>
                                        <input class="form-control form-control-sm" type="number" min="1" step="1" placeholder="Node timeout" required="required" id="A75F14A0" v-model.number="globals.nodeTimeout" />
                                    </div>

                                </div>
                            </div>

                            <!-- *********************************************************************************** -->

                            <div class="row">
                                <div class="col-md-6">

                                    <div class="form-check form-switch mb-3" :hidden="!['posix-c', 'posix-c++', 'gnuradio'].includes(globals.mode)">
                                        <input class="form-check-input" type="checkbox" role="switch" :true-value="true" :false-value="false" id="A313C013" v-model="globals.hardcoded" />
                                        <label class="form-check-label" for="A313C013">Hardcoded configuration</label>
                                    </div>

                                    <div class="mb-3" :hidden="globals.mode !== 'arduino-wifi'">
                                        <label class="form-label" for="EFCECA87">WiFi SSID</label>
                                        <input class="form-control form-control-sm" type="text" placeholder="WiFi SSID" required="required" autocomplete="username" id="EFCECA87" v-model.trim="globals.wifiSSID" />
                                    </div>

                                    <div class="mb-3" :hidden="globals.mode !== 'arduino-ethernet'">
                                        <label class="form-label" for="F6C2CDF9">Ethernet controller</label>
                                        <select class="form-select form-select-sm" id="F6C2CDF9" v-model="globals.ethernetController">
                                            <option value="w5500">W5500</option>
                                        </select>
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="form-check form-switch mb-3" :hidden="!['posix-c', 'posix-c++', 'gnuradio'].includes(globals.mode)">
                                        <input class="form-check-input" type="checkbox" role="switch" :true-value="true" :false-value="false" id="FAD1B43F" v-model="globals.static" />
                                        <label class="form-check-label" for="FAD1B43F">Statically-linked executable</label>
                                    </div>

                                    <div class="mb-3" :hidden="globals.mode !== 'arduino-wifi'">
                                        <label class="form-label" for="E87BBCE3">WiFi password</label>
                                        <input class="form-control form-control-sm" type="text" placeholder="WiFi password" required="required" v-password-toggle id="E87BBCE3" v-model.trim="globals.wifiPassword" />
                                    </div>

                                    <div class="mb-3" :hidden="globals.mode !== 'arduino-ethernet'">
                                        <label class="form-label" for="EAEEA67C">Ethernet CS pin</label>
                                        <input class="form-control form-control-sm" type="number" min="0" placeholder="Ethernet CS pin" required="required" id="EAEEA67C" v-model.number="globals.ethernetCSPin" />
                                    </div>

                                </div>
                            </div>

                            <!-- *********************************************************************************** -->

                            <div class="row">
                                <div class="col-md-6">

                                    <div class="mb-0" :hidden="!['arduino-wifi', 'arduino-ethernet'].includes(globals.mode)">
                                        <label class="form-label" for="F0C0396D">PlatformIO board</label>
                                        <multiselect
                                            mode="single"
                                            :can-clear="true"
                                            :searchable="true"
                                            :create-option="true"
                                            :close-on-select="true"
                                            :options="state.boards"
                                            id="F0C0396D"
                                            v-model="globals.board"
                                        />
                                    </div>

                                </div>
                                <div class="col-md-6">

                                    <div class="mb-0">

                                        <label class="form-label" for="B6BD1084">Generate</label>

                                        <div class="input-group input-group-sm w-100" v-if="HAS_TAURI">

                                            <!-- ******************************************************************* -->

                                            <input class="form-control" type="text" :value="path" placeholder="-- untitled --" readonly="readonly" id="B6BD1084" />

                                            <!-- ******************************************************************* -->

                                            <button class="btn btn-success" type="button" :disabled="!globals.nodeName || changed || !path" @click="generate()">
                                                <i class="bi bi-tornado"></i> Generate
                                            </button>

                                            <button class="btn btn-success dropdown-toggle dropdown-toggle-split border-start" type="button" data-bs-toggle="dropdown">
                                                <span class="visually-hidden">Toggle Dropdown</span>
                                            </button>

                                            <!-- ******************************************************************* -->

                                            <ul class="dropdown-menu">
                                                <li>
                                                    <button class="dropdown-item" type="button" :disabled="!globals.nodeName || changed || !path" @click="generate('override-cmake')">
                                                        <i class="bi bi-exclamation-triangle text-danger"></i> Override CMake
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="dropdown-item" type="button" :disabled="!globals.nodeName || changed || !path" @click="generate('override-main')">
                                                        <i class="bi bi-exclamation-triangle text-danger"></i> Override main.c
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="dropdown-item" type="button" :disabled="!globals.nodeName || changed || !path" @click="generate('override-device')">
                                                        <i class="bi bi-exclamation-triangle text-danger"></i> Override devices
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="dropdown-item" type="button" :disabled="!globals.nodeName || changed || !path" @click="generate('override-project')">
                                                        <i class="bi bi-exclamation-triangle text-danger"></i> Override project
                                                    </button>
                                                </li>
                                            </ul>

                                            <!-- ******************************************************************* -->

                                        </div>

                                        <div class="form-text" v-else>
                                            <i class="bi bi-laptop"></i> <a href="https://nyxlib.org/installing/" target="_blank">Download the desktop application</a>
                                        </div>

                                    </div>

                                </div>
                            </div>

                            <!-- *********************************************************************************** -->

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                    <div class="card shadow-sm mb-3">
                        <div class="card-header px-3 py-2">
                            Connectivity
                        </div>
                        <div class="card-body px-3 py-2">

                            <!-- *********************************************************************************** -->

                            <div class="row">
                                <div class="col-md-4">

                                    <div class="form-check form-switch mb-3">
                                        <input class="form-check-input" type="checkbox" role="switch" :true-value="true" :false-value="false" id="DE177D55" v-model="globals.enableMQTT" />
                                        <label class="form-check-label" for="DE177D55">Enable MQTT</label>
                                    </div>

                                </div>
                                <div class="col-md-8">

                                    <div class="mb-3">
                                        <label class="form-label" for="F23468E8">URL</label>
                                        <input class="form-control form-control-sm" type="text" placeholder="e.g. mqtt://localhost:1883" required="required" :disabled="!globals.enableMQTT" id="F23468E8" v-model.trim="globals.mqttURL" />
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-0">
                                                <label class="form-label" for="C8A2E5EB">Username<sup class="text-secondary">opt</sup></label>
                                                <input class="form-control form-control-sm" type="text" placeholder="Username" :disabled="!globals.enableMQTT" autocomplete="username" id="C8A2E5EB" v-model.trim="globals.mqttUsername" />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-0">
                                                <label class="form-label" for="CC00EA1C">Password<sup class="text-secondary">opt</sup></label>
                                                <input class="form-control form-control-sm" type="text" placeholder="Password" :disabled="!globals.enableMQTT" v-password-toggle id="CC00EA1C" v-model.trim="globals.mqttPassword" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- *********************************************************************************** -->

                            <hr />

                            <!-- *********************************************************************************** -->

                            <div class="row">
                                <div class="col-md-4">

                                    <div class="form-check form-switch mb-3">
                                        <input class="form-check-input" type="checkbox" role="switch" :true-value="true" :false-value="false" id="D7EAB517" v-model="globals.enableNSS" />
                                        <label class="form-check-label" for="D7EAB517">Enable Streaming</label>
                                    </div>

                                </div>
                                <div class="col-md-8">

                                    <div class="mb-3">
                                        <label class="form-label" for="D197DB2C">URL</label>
                                        <input class="form-control form-control-sm" type="text" placeholder="e.g. tcp://localhost:8888" required="required" :disabled="!globals.enableNSS" id="D197DB2C" v-model.trim="globals.nssURL" />
                                    </div>

                                </div>
                            </div>

                            <!-- *********************************************************************************** -->

                            <hr />

                            <!-- *********************************************************************************** -->

                            <div class="row">
                                <div class="col-md-4">

                                    <div class="form-check form-switch mb-3">
                                        <input class="form-check-input" type="checkbox" role="switch" :true-value="true" :false-value="false" id="A925CE04" v-model="globals.enableINDI" />
                                        <label class="form-check-label" for="A925CE04">Enable INDI compat.</label>
                                    </div>

                                </div>
                                <div class="col-md-8">

                                    <div class="mb-0">
                                        <label class="form-label" for="B6FB4EA2">URL</label>
                                        <input class="form-control form-control-sm" type="text" placeholder="e.g. tcp://0.0.0.0:7625" required="required" :disabled="!globals.enableINDI" id="B6FB4EA2" v-model.trim="globals.indiURL" />
                                    </div>

                                </div>
                            </div>

                            <!-- *********************************************************************************** -->

                        </div>
                    </div>

                    <!-- ******************************************************************************************* -->

                </div>
                <div class="col-md-6">

                    <!-- ******************************************************************************************* -->

                    <device-table :devices="globals.devices" />

                    <!-- ******************************************************************************************* -->

                </div>
            </div>

        </tab-pane>

        <!-- ******************************************************************************************************* -->

        <tab-pane :title="device.name || 'noname'" icon="cpu" :rank="device.rank" v-for="device in Object.values(props.globals.devices)" :key="`${device.id}-${device.rank}`">

            <device-descr :theme="theme" :mode="globals.mode" :device="device" />

        </tab-pane>

        <!-- ******************************************************************************************************* -->

    </nav-tabs>

    <!-- *********************************************************************************************************** -->

</template>
