<!--suppress HtmlUnknownAttribute, JSUnresolvedReference -->
<script setup>

/*--------------------------------------------------------------------------------------------------------------------*/

import {inject, reactive} from 'vue';

/*--------------------------------------------------------------------------------------------------------------------*/

import NodeDescr from '../components/descrs/NodeDescr.vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const dialog = inject('dialog');

/*--------------------------------------------------------------------------------------------------------------------*/

const DEFAULT_GLOBALS = {
    /* NODE */
    nodeName: '',
    nodeTimeout: 1000,
    mode: 'posix-c',
    /* POSIX */
    hardcoded: true,
    static: false,
    /* ARDUINO */
    board: '',
    /* ARDUINO WIFI */
    wifiSSID: '',
    wifiPassword: '',
    /* ARDUINO ETHERNET */
    ethernetController: 'w5500',
    ethernetCSPin: 0,
    /* MQTT */
    enableMQTT: false,
    mqttURL: '',
    mqttUsername: '',
    mqttPassword: '',
    /* REDIS */
    enableNSS: false,
    nssURL: '',
    /* INDI */
    enableINDI: false,
    indiURL: '',
    /* DEVICES */
    devices: {},
};

/*--------------------------------------------------------------------------------------------------------------------*/

const deepClone = (obj) => {

    /**/ if(Object.prototype.toString.call(obj) === '[object Object]')
    {
        return Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, deepClone(val)]));
    }
    else if(Object.prototype.toString.call(obj) === '[object Array]')
    {
        return obj.map(deepClone);
    }

    return obj;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const state = reactive({
    globals: deepClone(DEFAULT_GLOBALS),
    changed: false,
    path: null,
});


/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const confDup = (src, def) => {

    const result = {};

    if(typeof src === 'object'
        &&
        typeof def === 'object'
    ) {
        Object.keys(def).forEach((key) => { result[key] = deepClone((key in src) ? src[key] : def[key]); });
    }

    return result;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const resetDrv = () => {

    dialog.confirm('Loose modifications?').then((ok) => {

        if(ok)
        {
            state.globals = deepClone(DEFAULT_GLOBALS);

            state.path = null;

            dialog.success();
        }
        else
        {
            dialog.error();
        }
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

const importDrv = () => {

    try
    {
        dialog.open('driver.json', 'application/json;charset=utf-8', 'JSON Files', ['json']).catch(dialog.error).then(([json, path]) => {

            state.globals = confDup(JSON.parse(json), DEFAULT_GLOBALS);

            setTimeout(() => {

                state.changed = false;

                state.path = path;

            }, 500);

            dialog.success();
        });
    }
    catch(e)
    {
        dialog.error(e);
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

const exportDrv = () => {

    try
    {
        const config = confDup(state.globals, DEFAULT_GLOBALS);

        dialog.save('driver.json', 'application/json;charset=utf-8', 'JSON Files', ['json'], JSON.stringify(config, null, 2)).catch(dialog.error).then((path) => {

            setTimeout(() => {

                state.changed = false;

                state.path = path;

            }, 500);

            dialog.success();
        });
    }
    catch(e)
    {
        dialog.error(e);
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/
/* INITIALIZATION                                                                                                     */
/*--------------------------------------------------------------------------------------------------------------------*/

/* TODO */

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="overflow-y-auto h-100 w-100 p-3">

        <node-descr :theme="state.theme" :globals="state.globals" :changed="state.changed" :path="state.path" />

    </div>

    <!-- *********************************************************************************************************** -->

    <teleport to="#nyx_toolbar">

        <button class="btn btn-sm btn-outline-warning me-1" type="button" @click="resetDrv">
            <i class="bi bi-recycle"></i> Reset
        </button>

        <button class="btn btn-sm btn-outline-primary me-1" type="button" @click="importDrv">
            <i class="bi bi-upload"></i> Import
        </button>

        <button class="btn btn-sm btn-outline-primary me-0" type="button" @click="exportDrv">
            <i class="bi bi-download"></i> Export
        </button>

    </teleport>

    <!-- *********************************************************************************************************** -->

</template>
