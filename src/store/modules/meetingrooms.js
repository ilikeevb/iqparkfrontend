import firebase from "firebase";

const state = {
    rooms: null
};

const getters = {
    ROOMS: state => {
        return state.rooms;
    },
    ROOM_BY_ID: state => id => {
        if (state.rooms) {
            return state.rooms.find(room => { return room.id == id });
        }
    },
    ROOM_EVENT_BY_ID: state => id => {
        if (state.rooms) {
            return state.rooms.find(room => { return room.id == id }).events;
        }
    }
};

const mutations = {
    SET_ROOMS: (state, payload) => {
        state.rooms = payload;
    },
};

const actions = {
    GET_ROOMS: async (context) => {
        const roomsRef = firebase.firestore().collection('meetingrooms');
        const snapshot = await roomsRef.get();
        let data = [];
        snapshot.forEach(doc => {
            let temp = doc.data();
            temp.id = doc.id;
            data.push(temp);
        });
        context.commit('SET_ROOMS', data);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,

};