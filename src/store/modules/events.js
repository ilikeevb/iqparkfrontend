import firebase from "firebase";

const state = {
    firebaseEvents: null,
    googleEvents: null,
    outlookEvents: null,
    events: null
};

const getters = {
    EVENTS: state => {
        return state.events;
    },
    EVENT_BY_ID: state => id => {
        if (state.events) {
            return state.events.find((event) => event.eventId == id)
        }
    },
    GOOGLE_EVENTS: state => {
        return state.googleEvents;
    },
};

const mutations = {
    SET_GOOGLE_EVENTS: (state, payload) => {
        state.googleEvents = payload;
    },
    SET_EVENTS: (state, payload) => {
        state.events = payload;
    }
};

const actions = {
    SET_ROOM_EVENTS: (state, payload) => {
        let batch = firebase.firestore().batch();
        let sf = firebase.firestore().collection('meetingrooms').doc(payload.roomId);
        batch.update(sf, { "events": payload.events });
        batch.commit();
    },
    SET_USER_EVENTS: (state, payload) => {
        let batch = firebase.firestore().batch();
        let sf = firebase.firestore().collection('user').doc(payload.uid);
        batch.update(sf, { "events": payload.events });
        batch.commit();
    },
    CREATE_EVENT: (state, payload) => {
        firebase.firestore().collection('event').add(payload);
    },
    GET_EVENTS: async (context) => {
        let events = [];
        const citiesRef = firebase.firestore().collection('event');
        const snapshot = await citiesRef.get();
        snapshot.forEach(function (doc) {
            let temp = doc.data();
            temp.id = doc.id;
            events.push(temp);
        });
        context.commit('SET_EVENTS', events);
    },
    SEND_MESSAGE: async (context, payload) => {
        let batch = firebase.firestore().batch();
        let sf = firebase.firestore().collection('event').doc(payload.id);
        batch.update(sf, { "messages": payload.messages });
        batch.commit();
    },
};

export default {
    state,
    getters,
    mutations,
    actions,

};