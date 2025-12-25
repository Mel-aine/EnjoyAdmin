<template>
  <BookingForm :allowPastDates="true" :useInsertReservation="true" formTitleKey="InsertTransaction" breadcrumbKey="InsertTransaction" :hideCheckInButton="true" />

 </template>
<script setup lang="ts">
import BookingForm from './BookingForm.vue'
</script>
