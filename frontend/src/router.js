
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);


import ApplicationManager from "./components/listers/ApplicationCards"
import ApplicationDetail from "./components/listers/ApplicationDetail"


export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
            {
                path: '/applications',
                name: 'ApplicationManager',
                component: ApplicationManager
            },
            {
                path: '/applications/:id',
                name: 'ApplicationDetail',
                component: ApplicationDetail
            },



    ]
})
