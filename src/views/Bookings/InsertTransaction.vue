<template>
  <BookingForm :allowPastDates="true" :useInsertReservation="true" formTitleKey="InsertTransaction" breadcrumbKey="InsertTransaction" />
 
 </template>
<script setup lang="ts">
import BookingForm from './BookingForm.vue'
</script>
