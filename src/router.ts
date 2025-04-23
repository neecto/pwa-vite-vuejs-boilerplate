import { createMemoryHistory, createRouter } from 'vue-router';
import Home from './views/Home.vue';
import Notifications from './views/WebNotifications.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/web-notifications', component: Notifications },
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
});
