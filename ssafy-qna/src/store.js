import Vue from "vue";
import Vuex from "vuex";
import FirebaseService from "./services/FirebaseService";
import createPersistedState from "vuex-persistedstate";
import * as Cookies from "js-cookie";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      getState: vuexKey => Cookies.getJSON(vuexKey),
      setState: (vuexKey, state) =>
        Cookies.set(vuexKey, state, { expires: 3, secure: true })
    })
  ],
  state: {
    // QnACard
    cardList: [],
    haveCard: false,
    isLogin: false,
    userData: {
      isAnonymous: null,
      userDisplayName: null,
      userEmailVerified: null,
      userEmail: null
    },
    userData2: FirebaseService.firebase.auth().currentUser
  },
  getters: {
    getIsLogin: state => {
      return state.isLogin;
    },
    getUserData: state => {
      return state.userData;
    }
  },
  mutations: {
    getCardCommit(state, payload) {
      state.haveCard = true;
      state.cardList = payload;
    },
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
    setUserData(state, userData) {
      state.userData = userData;
    }
  },
  actions: {
    getCardMutation(context, payload) {
      context.commit("getCardCommit", payload);
    },
    async setLoginInfo({ commit }) {
      console.log("dads");

      const userData = await FirebaseService.checkUserIsLogin();
      console.log(userData);

      if (userData.isAnonymous != null) {
        commit("setIsLogin", true);
        commit("setUserData", userData);
      }
    },
    setLogout({ commit }) {
      const userData = {
        isAnonymous: null,
        userDisplayName: null,
        userEmailVerified: null,
        userEmail: null
      };
      commit("setIsLogin", false);
      commit("setUserData", userData);
    }
  }
});
