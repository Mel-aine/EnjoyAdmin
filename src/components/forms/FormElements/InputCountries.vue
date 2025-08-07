<template>
    <Select :is-required="true" :lb="$t('country')" v-model="selectedOption" :options="africanCountries" />
</template>
<script lang="ts" setup>
import { computed, ref, watch,defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
const Select = defineAsyncComponent(() => import('@/components/forms/FormElements/Select.vue'))

const { t } = useI18n()
const props = defineProps({
    modelValue: {
        type: String,
    }
})
const selectedOption = ref<string>(props.modelValue??'')
const emits = defineEmits(['update:modelValue', 'select', 'change'])

watch(
    () => props.modelValue,
    (newVal) => {
        selectedOption.value = newVal??''
    }
)
watch(
    () => selectedOption.value,
    (newVal) => {
        emits('update:modelValue', newVal)
    }
)


const africanCountries = computed(() => [
    { value: 'DZ', label: t('countries_list.dz') },
    { value: 'AO', label: t('countries_list.ao') },
    { value: 'BJ', label: t('countries_list.bj') },
    { value: 'BW', label: t('countries_list.bw') },
    { value: 'BF', label: t('countries_list.bf') },
    { value: 'BI', label: t('countries_list.bi') },
    { value: 'CV', label: t('countries_list.cv') },
    { value: 'CM', label: t('countries_list.cm') },
    { value: 'CF', label: t('countries_list.cf') },
    { value: 'TD', label: t('countries_list.td') },
    { value: 'KM', label: t('countries_list.km') },
    { value: 'CD', label: t('countries_list.cd') },
    { value: 'CG', label: t('countries_list.cg') },
    { value: 'CI', label: t('countries_list.ci') },
    { value: 'DJ', label: t('countries_list.dj') },
    { value: 'EG', label: t('countries_list.eg') },
    { value: 'GQ', label: t('countries_list.gq') },
    { value: 'ER', label: t('countries_list.er') },
    { value: 'SZ', label: t('countries_list.sz') },
    { value: 'ET', label: t('countries_list.et') },
    { value: 'GA', label: t('countries_list.ga') },
    { value: 'GM', label: t('countries_list.gm') },
    { value: 'GH', label: t('countries_list.gh') },
    { value: 'GN', label: t('countries_list.gn') },
    { value: 'GW', label: t('countries_list.gw') },
    { value: 'KE', label: t('countries_list.ke') },
    { value: 'LS', label: t('countries_list.ls') },
    { value: 'LR', label: t('countries_list.lr') },
    { value: 'LY', label: t('countries_list.ly') },
    { value: 'MG', label: t('countries_list.mg') },
    { value: 'MW', label: t('countries_list.mw') },
    { value: 'ML', label: t('countries_list.ml') },
    { value: 'MR', label: t('countries_list.mr') },
    { value: 'MU', label: t('countries_list.mu') },
    { value: 'MA', label: t('countries_list.ma') },
    { value: 'MZ', label: t('countries_list.mz') },
    { value: 'NA', label: t('countries_list.na') },
    { value: 'NE', label: t('countries_list.ne') },
    { value: 'NG', label: t('countries_list.ng') },
    { value: 'RW', label: t('countries_list.rw') },
    { value: 'ST', label: t('countries_list.st') },
    { value: 'SN', label: t('countries_list.sn') },
    { value: 'SC', label: t('countries_list.sc') },
    { value: 'SL', label: t('countries_list.sl') },
    { value: 'SO', label: t('countries_list.so') },
    { value: 'ZA', label: t('countries_list.za') },
    { value: 'SS', label: t('countries_list.ss') },
    { value: 'SD', label: t('countries_list.sd') },
    { value: 'TZ', label: t('countries_list.tz') },
    { value: 'TG', label: t('countries_list.tg') },
    { value: 'TN', label: t('countries_list.tn') },
    { value: 'UG', label: t('countries_list.ug') },
    { value: 'ZM', label: t('countries_list.zm') },
    { value: 'ZW', label: t('countries_list.zw') }
]);
</script>