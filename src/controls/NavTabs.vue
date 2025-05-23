<!--suppress JSUnresolvedReference -->
<script setup>
/*--------------------------------------------------------------------------------------------------------------------*/

import {ref, provide, nextTick, computed} from 'vue';

import {Tab} from 'bootstrap';

/*--------------------------------------------------------------------------------------------------------------------*/
/* VARIABLES                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

defineProps({
    margin: {
        type: String,
        default: 'mb-4',
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/

const tabs = ref({});

const tabListRef = ref(null);

/*--------------------------------------------------------------------------------------------------------------------*/

const sortedTabs = computed(() => [...Object.values(tabs.value)].sort((x, y) => x.tabRank - y.tabRank));

/*--------------------------------------------------------------------------------------------------------------------*/
/* FUNCTIONS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

provide('addTab', (tabId, tabRank, tabTitle, tabIcon, onShow, onShown, onHide, onHidden) => {

    tabs.value[tabId] = {
        tabId: tabId,
        tabRank: tabRank,
        tabTitle: tabTitle,
        tabIcon: tabIcon,
    };

    nextTick(() => {

        const el = tabListRef.value.querySelector(`button[data-bs-target="#${tabId}"]`);

        if(el)
        {
            Tab.getOrCreateInstance(el);

            el.addEventListener('show.bs.tab', onShow);
            el.addEventListener('shown.bs.tab', onShown);
            el.addEventListener('hide.bs.tab', onHide);
            el.addEventListener('hidden.bs.tab', onHidden);
        }
    });

    return Object.keys(tabs.value).length === 1;
});

/*--------------------------------------------------------------------------------------------------------------------*/

provide('delTab', (tabId) => {

    delete tabs.value[tabId];
});

/*--------------------------------------------------------------------------------------------------------------------*/

provide('updateTitle', (tabId, tabTitle) => {

    tabs.value[tabId].tabTitle = tabTitle;
});

/*--------------------------------------------------------------------------------------------------------------------*/

provide('updateIcon', (tabId, tabIcon) => {

    tabs.value[tabId].tabIcon = tabIcon;
});

/*--------------------------------------------------------------------------------------------------------------------*/
</script>

<template>

    <!-- *********************************************************************************************************** -->
    <!-- NAV TABS                                                                                                    -->
    <!-- *********************************************************************************************************** -->

    <div :class="['nav', 'nav-tabs', margin]" role="tablist" ref="tabListRef">

        <!-- ******************************************************************************************************* -->

        <button :class="['nav-link', 'px-3', 'py-2', {'active': idx === 0}]" type="button" data-bs-toggle="tab" :data-bs-target="`#${tab.tabId}`" role="tab" v-for="(tab, idx) in sortedTabs" :key="tab.tabId">

            <i :class="['bi', `bi-${tab.tabIcon}`]" v-if="tab.tabIcon"></i>

            {{ tab.tabTitle }}

        </button>

        <!-- ******************************************************************************************************* -->

        <div class="ms-auto pb-2">

            <slot name="button"></slot>

        </div>

        <!-- ******************************************************************************************************* -->

    </div>

    <!-- *********************************************************************************************************** -->
    <!-- TABS CONTENT                                                                                                -->
    <!-- *********************************************************************************************************** -->

    <div class="tab-content flex-grow-1">

        <slot></slot>

    </div>

    <!-- *********************************************************************************************************** -->

</template>
