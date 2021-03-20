import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user.js';
import meetingrooms from './modules/meetingrooms.js';
import events from './modules/events.js';
import company from './modules/company.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        user,
        meetingrooms,
        events,
        company
    },
});