<script setup lang="ts">
import { useWebNotification } from '@vueuse/core';

const {
    isSupported,
    notification,
    permissionGranted,
    show,
    close,
    onClick,
    onShow,
    onError,
    onClose,
} = useWebNotification({
    title: 'Hello, World!',
    dir: 'auto',
    lang: 'en',
    renotify: true,
    tag: 'test',
});

const showDelayed = () => {
    setTimeout(() => {
        show();
    }, 5000);
};
</script>

<template>
    <h1>Web Notifications</h1>

    <div>
        Supported: <i>{{ isSupported }}</i>
    </div>

    <div>
        Permission Granted: <i>{{ permissionGranted }}</i>
    </div>

    <template v-if="isSupported && permissionGranted">
        <p>
            <button @click="show()">Show Notification</button>
        </p>

        <p>
            <button @click="showDelayed()">
                Show Delayed (5s) Notification
            </button>
        </p>
    </template>
</template>

<style scoped></style>
