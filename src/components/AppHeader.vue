<template>
  <header class=" bg-base-300">
    <nav class="navbar navbar-end max-w-5xl w-full mx-auto">
        <ul class="menu menu-horizontal p-0">
          <li>  <router-link :to="{name:ROUTE_LIST_TRANSCRIPT}" class="link-accent">My transcripts</router-link></li>
          <li tabindex="0">
            <p> My account</p>
            <ul class="p-2 bg-base-300">
              <li><router-link to="/">Settings</router-link></li>
              <li><p class="link">Log out</p></li>
            </ul>
          </li>
          <li><router-link :to="{name:ROUTE_CREATE_TRANSCRIPT}" class="btn btn-accent btn-square btn-sm text-accent-content"><v-icon name="hi-plus"/></router-link></li>

        </ul>
    </nav>

  </header>
</template>

<script setup lang="ts">
import Btn from "@/components/Btn.vue";
import {ROUTE_LIST_TRANSCRIPT, ROUTE_CREATE_TRANSCRIPT} from "@/router/routes";
</script>

<style scoped>

</style>
