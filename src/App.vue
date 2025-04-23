<script setup lang="ts">
import PWABadge from './components/PWABadge.vue';
</script>

<template>
    <header>
        <PWABadge />
    </header>

    <nav>
        <p><RouterLink to="/">Home</RouterLink></p>
        <p>
            <RouterLink to="/web-notifications">Web Notifications</RouterLink>
        </p>
    </nav>

    <main>
        <RouterView />
    </main>
</template>

<style scoped>
header {
    background-color: #282c34;
    padding: 1rem;
    color: white;
    text-align: center;
}

main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
}

nav {
    display: flex;
    justify-content: space-around;
}
</style>
