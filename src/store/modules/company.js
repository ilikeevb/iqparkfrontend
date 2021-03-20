import firebase from "firebase";

const state = {
    companies: null
};

const getters = {
    COMPANIES: state => {
        return state.companies;
    },
    COMPANY_BY_ID: state => id => {
        if (state.companies) {
            return state.companies.find(company => { return company.id == id });
        }
    }
};

const mutations = {
    SET_COMPANIES: (state, payload) => {
        state.companies = payload;
    }
};

const actions = {
    GET_COMPANIES: async (context) => {
        let companies = [];
        const citiesRef = firebase.firestore().collection('company');
        const snapshot = await citiesRef.get();
        snapshot.forEach(function (doc) {
            let temp = doc.data();
            temp.id = doc.id;
            companies.push(temp);
        });
        context.commit('SET_COMPANIES', companies);
    },
    CREATE_COMPANY: (context, payload) => {
        firebase.firestore().collection('company').add(payload);
        context.dispatch('GET_COMPANIES');
    },
    ADD_USER_IN_COMPANY: async (context, payload) => {
        /* */
        const cityRef = firebase.firestore().collection('company').doc(payload.company);
        const doc = await cityRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            let temp = doc.data();
            let count = temp.users.find((user) => { return user.uid == payload.uid })
            if (!count) {
                temp.users.push({
                    name: payload.name, position: payload.position, uid: payload.uid
                });
                let batch = firebase.firestore().batch();
                let sf = firebase.firestore().collection('company').doc(payload.company);
                batch.update(sf, { "users": temp.users });
                batch.commit();
            }
        }
        /* */
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};