<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {inject} from 'vue';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const addon = inject('addon');

/*--------------------------------------------------------------------------------------------------------------------*/

const runtime = addon.runtime();

const configStore = addon.configStore();

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <div>

        <!-- *********************************************************************************************************** -->

        <div class="card shadow-sm mx-auto mb-3 w-50">
            <div class="card-header">
                Nyx Gen
            </div>
            <div class="card-body">

                <div class="mb-3">
                    <label for="AD718E97" class="form-label">Nyx Gen path</label>
                    <input class="form-control" type="text" placeholder="/usr/bin/nyx-gen" :disabled="!runtime.isDesktop" id="AD718E97" v-model="configStore.globals.nyx_assistant.nyx_gen_path" />
                </div>

                <div class="alert alert-primary" role="alert">
                    <i class="bi bi-download"></i> <a href="https://github.com/nyxlib/nyx-gen" target="_blank">Download Nyx Gen.</a>
                </div>

            </div>
        </div>

        <!-- *********************************************************************************************************** -->

    </div>

</template>
