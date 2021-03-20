import firebase from "firebase";
import axios from 'axios';

const state = {
    user: null,
    users: null,
    calendars: {
        local: [],
        outlook: [],
        google: []
    }
};

const getters = {
    USER: state => {
        return state.user;
    },
    USERS: state => {
        return state.users;
    },
    CALENDARS: state => {
        return state.calendars
    },
    OUTLOOK_CALENDAR: state => {
        return state.calendars.outlook;
    },
    LOCAL_CALENDAR: state => {
        return state.calendars.local;
    }
};

const mutations = {
    REFRESH_OUTLOOK_TOKEN: async (state, payload) => {
        state, payload;
        /*
        if (state.user) {
            state.user.apps.microsoft.token = payload;
            console.log('user: ', state.user)
            let batch = firebase.firestore().batch();
            let sf = firebase.firestore().collection('players').doc(state.user.uid);
            batch.update(sf, { "apps": state.user.apps });
            batch.commit();
        }
        */
        console.log('new token: ', payload);
    },
    SET_USERS: (state, payload) => {
        state.users = payload;
    },
    SET_USER: async (state, payload) => {
        const cityRef = firebase.firestore().collection('user').doc(payload);
        const doc = await cityRef.get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            state.user = doc.data();
            if (doc.data().apps.microsoft.auth) {
                const token = doc.data().apps.microsoft.token;
                axios
                    .get("http://localhost:3000/user/calendars/", {
                        params: { token: token },
                    })
                    .then((response) => state.calendars.outlook = response);
            }
        }
    },
    USER_OUT: (state) => {
        state.user = null;
        state.calendars = null;
    },
};

const actions = {
    SET_USER_FAVORITES: async (context, payload) => {
        let batch = firebase.firestore().batch();
        let sf = firebase.firestore().collection('user').doc(payload.uid);
        batch.update(sf, { "favorites": payload.favorites });
        batch.commit();
    },
    VERIFY_USER: async (context, payload) => {
        let batch = firebase.firestore().batch();
        let sf = firebase.firestore().collection('user').doc(payload);
        batch.update(sf, { "verify": true });
        batch.commit();
    },
    SAVE_USER_INFO: async (context, payload) => {
        let batch = firebase.firestore().batch();
        let sf = firebase.firestore().collection('user').doc(payload.uid);
        batch.update(sf, { "name": payload.name });
        batch.update(sf, { "position": payload.position });
        batch.update(sf, { "company": payload.company });
        batch.commit();
    },
    SAVE_ROOM: async (context, payload) => {
        firebase.firestore().collection('meetingrooms').add(payload);
    },
    SIGN_OUT: async (context) => {
        firebase.auth().signOut().then(() => {
            context.commit('USER_OUT');
        }).catch((error) => {
            console.log(error)
        });
    },
    GET_USERS: async (context) => {
        let users = [];
        const citiesRef = firebase.firestore().collection('user');
        const snapshot = await citiesRef.get();
        snapshot.forEach(function (doc) {
            let temp = doc.data();
            temp.id = doc.id;
            users.push(temp);
        });
        context.commit('SET_USERS', users);
    },
    GET_USER: async (context) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                context.commit('SET_USER', user.uid);
            }
        });
    },
    UPDATE_OUTLOOK_TOKEN: async () => {
        /*
            console.log(firebase.auth().currentUser)
            const token = firebase.auth().currentUser.refreshToken;
            axios.get("http://localhost:3000/user/token/refresh/", {
                params: { token: token },
            }).then((response) => {
                console.log('response', response)
                context.commit('REFRESH_OUTLOOK_TOKEN', response.token)
            });
        */
    },
    CREATE_ACCOUNT_OUTLOOK: async (context) => {
        var provider = new firebase.auth.OAuthProvider('microsoft.com');
        provider.addScope('Calendars.ReadWrite');
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                var accessToken = result.credential.accessToken;
                var uid = result.user.uid;

                console.log(result)

                let temp = {
                    uid: uid,
                    email: result.user.email || '',
                    name: result.user.displayName || '',
                    company: '',
                    position: '',
                    verify: false,
                    type: 'user',
                    events: [],
                    apps: {
                        google: {
                            auth: false,
                            token: ''
                        },
                        microsoft: {
                            auth: true,
                            token: accessToken
                        },
                    }
                }
                if (result.additionalUserInfo.isNewUser) {
                    console.log('Новый пользователь!')
                    firebase.firestore().collection('user').doc(uid).set(temp);
                }
                context.commit('SET_USER', uid);
            })
            .catch((error) => {
                console.log('Outlook Auth Error', error);
            });
    },
    CREATE_ACCOUNT_EMAIL: async (context, payload) => {
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then((userCredential) => {
            let user = userCredential.user;
            let temp = {
                uid: user.uid,
                email: user.email || '',
                name: '',
                company: '',
                position: '',
                verify: false,
                type: 'user',
                events: [],
                apps: {
                    google: {
                        auth: false,
                        email: '',
                        token: ''
                    },
                    microsoft: {
                        auth: false,
                        email: '',
                        token: ''
                    },
                }
            }
            firebase.firestore().collection('user').doc(user.uid).set(temp);
            context.commit('SET_USER', user.uid);
        })
    },
    LOGIN_ACCOUNT_EMAIL: async (context, payload) => {
        await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then((userCredential) => {
            let user = userCredential.user;
            context.commit('SET_USER', user.uid);
        })
    }
};

export default {
    state,
    getters,
    mutations,
    actions,

};