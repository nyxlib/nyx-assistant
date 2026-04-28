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
const addon = inject('addon');

/*--------------------------------------------------------------------------------------------------------------------*/

const runtime = addon.runtime();

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

const newDrv = () => {

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

const openDrv = () => {

    dialog.lock();

    dialog.open('driver.json', 'application/json;charset=utf-8', 'JSON Files', ['json']).then((file) => {

        if(file)
        {
            try
            {
                state.globals = confDup(JSON.parse(file.text), DEFAULT_GLOBALS);

                setTimeout(() => {

                    state.path = file.name;

                    state.changed = false;

                }, 500);

                dialog.success(`File ${file.name} opened successfully.`);
            }
            catch
            {
                dialog.error(`Cannot parse file ${file.name}`);
            }
        }

    }).finally(() => {

        dialog.unlock();
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

const saveDrvAs = () => {

    dialog.lock();

    const config = confDup(state.globals, DEFAULT_GLOBALS);

    dialog.save('driver.json', 'application/json;charset=utf-8', 'JSON Files', ['json'], JSON.stringify(config, null, 2)).then((file) => {

        if(file)
        {
            setTimeout(() => {

                state.path = file.name;

                state.changed = false;

            }, 500);

            dialog.success(`File ${file.name} saved successfully.`);
        }

    }).finally(() => {

        dialog.unlock();
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

const saveDrv = () => {

    if(state.path)
    {
        dialog.lock();

        const config = confDup(state.globals, DEFAULT_GLOBALS);

        runtime.write(state.path, JSON.stringify(config, null, 2)).then(() => {

            dialog.success(`File ${state.path} saved successfully.`);

        }).catch(() => {

            dialog.error(`Cannot write to file ${state.path}`);

        }).finally(() => {

            dialog.unlock();
        });
    }
    else
    {
        saveDrvAs();
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->

    <div class="overflow-y-auto h-100 w-100 p-3">

        <node-descr :theme="state.theme" :globals="state.globals" :changed="state.changed" :path="state.path" />

    </div>

    <!-- *********************************************************************************************************** -->

    <teleport to="#nyx_toolbar">

        <button class="btn btn-sm btn-outline-warning me-2" type="button" @click="newDrv">
            <i class="bi bi-plus-lg"></i> New
        </button>

        <button class="btn btn-sm btn-outline-primary me-2" type="button" @click="openDrv">
            <i class="bi bi-upload"></i> Open
        </button>

        <button class="btn btn-sm btn-outline-primary me-2" type="button" @click="saveDrv">
            <i class="bi bi-download"></i> Save
        </button>

        <button class="btn btn-sm btn-outline-primary me-0" type="button" @click="saveDrvAs">
            <i class="bi bi-download"></i> Save As
        </button>

    </teleport>

    <!-- *********************************************************************************************************** -->

</template>
