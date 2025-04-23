<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';

// periodic sync is disabled, change the value to enable it, the period is in milliseconds
// You can remove onRegisteredSW callback and registerPeriodicSync function
const period = 5000;

const swStatus = ref<ServiceWorkerState>('installing');
const error = ref<string | null>(null);
const lastUpdateDate = ref<Date>(new Date());

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
    swUrl: string,
    swRegistration: ServiceWorkerRegistration
) {
    if (period <= 0) return;

    setInterval(async () => {
        if ('onLine' in navigator && !navigator.onLine) {
            return;
        }

        const resp = await fetch(swUrl, {
            cache: 'no-store',
            headers: {
                cache: 'no-store',
                'cache-control': 'no-cache',
            },
        });

        if (resp?.status === 200) {
            lastUpdateDate.value = new Date();
            await swRegistration.update();
        }
    }, period);
}

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    immediate: true,

    onRegisteredSW(swScriptUrl, registration) {
        console.log('SW registered:', swScriptUrl);

        if (registration?.active?.state === 'activated') {
            swStatus.value = 'activated';
            registerPeriodicSync(swScriptUrl, registration);
        } else if (registration?.installing) {
            registration.installing.addEventListener('statechange', (e) => {
                const sw = e.target as ServiceWorker;
                swStatus.value = sw.state;

                if (sw.state === 'activated') {
                    registerPeriodicSync(swScriptUrl, registration);
                }
            });
        }
    },
    onRegisterError(error) {
        error.value = error.toString();
    },

    onOfflineReady() {
        console.log('Offline Ready');
    },
});

async function reload() {
    console.log('Reload clicked');
    try {
        await updateServiceWorker(true);
        needRefresh.value = false;
    } catch (e) {
        console.error('Error updating service worker:', e);
    }
}

const isOnline = computed(() => {
    if (typeof navigator === 'undefined') return false;
    return 'onLine' in navigator && navigator.onLine;
});
</script>

<template>
    <div class="status-cards">
        <div class="card">
            <h4>Service Worker</h4>
            <p>
                <b>Satus: </b> <i>{{ swStatus.toString() }}</i>
                <i v-if="error !== null">{{ error }}</i>
            </p>

            <p>
                <b>Offline Ready: </b> <i>{{ offlineReady ? 'Yes' : 'No' }}</i>
            </p>
        </div>

        <div class="card">
            <h4>Network</h4>
            <p>
                <b>Network status: </b>
                <i>{{ isOnline ? 'Online' : 'Offline' }}</i>
            </p>

            <p>
                <b>Last server update: </b>
                <i>{{ lastUpdateDate.toLocaleTimeString() }}</i>
            </p>

            <p v-if="needRefresh">
                <b>New Content Available</b>
                <button @click="reload()">Reload App</button>
            </p>
        </div>
    </div>
</template>

<style scoped>
.status-cards {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    gap: 1rem;
}

.card {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1em;
    width: 20%;
    min-width: 10rem;

    h4 {
        margin: 0;
        font-size: 1.2em;
    }

    p {
        text-align: left;
        margin: 0.5em 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
