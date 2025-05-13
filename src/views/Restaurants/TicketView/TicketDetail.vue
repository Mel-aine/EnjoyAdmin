<script setup lang="ts">
    import router from '@/router';
    import { fetchSingleOrder, updateOrder, deleteOrder } from '@/services/database';
    import { defineAsyncComponent, onBeforeMount, ref,computed } from 'vue';
    import Ticket from '@/components/Ticket/Ticket.vue';
    import DefaultCard from '@/components/common/DefaultCard.vue';
    import DefaultCardSkeleton from '@/components/common/DefaultCardSkeleton.vue';
    import PopupModal from '@/components/modal/PopupModal.vue';
    import AdminLayout from '@/components/layout/AdminLayout.vue';
    // import ButtonAction from '@/components/Buttons/ButtonAction.vue';
    // const Spinner = defineAsyncComponent(() => import('@/components/Utilities/Spinner.vue'));
    // const SpinnerOverPage = defineAsyncComponent(() => import('@/components/Utilities/SpinnerOverPage.vue'));
    // import EventBus from '@/EventBus';
    // import type ToastPayload from '@/types/Toast';

    const baseBtnStyle =computed(()=>{
      return `${"text-slate-900 bg-white border border-slate-300 focus:outline-none hover:bg-slate-100 focus:ring-4 focus:ring-slate-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-slate-600 dark:focus:ring-slate-700"}`
    })
    interface Param {
        action: string,
        ticketcode: string
    }
    const ticketCode = ref('');
    const ticketInfo = ref<any>({});
    const plateInfo = ref<any>({});
    const isLoading = ref(true);
    const isModalOpen = ref(false);
    const isDeleting = ref(false);


    const handleDeleteTicket = (e: any) => {
        isModalOpen.value = true;
    }
    const handleKitchen = async (ts: any) => {
        try {
            if(ticketInfo.value.StatusCode != 'DRAFT') {
                isLoading.value = true;
                const result  = await updateOrder({
                    "Code": ticketInfo.value.Code,
                    "StatusCode":"DRAFT"
                });
                console.log('result', result);
                ticketInfo.value.StatusCode = 'DRAFT';
            //     const payload: ToastPayload = {
            //         type: "info",
            //         message: `Order ${ticketInfo.value.Code} sent in kitchen sucessfully`
            //     }
            //     EventBus.emit('showToast', payload);
                console.log('handleKitchen ts', ts);
             }
        } catch (e: any) {
            console.error('Error while handling kitchen:', e);
            //     const payload: ToastPayload = {
            //     type: "warning",
            //     message: `Something went wrong during the process !`
            // }
            // EventBus.emit('showToast', payload);
        } finally {
            isLoading.value = false;
        }
    }
    const handleProgress = async (ts: any) => {
        try {
            if(ticketInfo.value.StatusCode != 'IN PROGRESS') {
                isLoading.value = true;
                const result  = await updateOrder({
                    "Code": ticketInfo.value.Code,
                    "StatusCode":"IN PROGRESS"
                });
                console.log('result', result);
                ticketInfo.value.StatusCode = 'IN PROGRESS'
                // const payload: ToastPayload = {
                //     type: "info",
                //     message: `Order ${ticketInfo.value.Code} sucessfully processed`
                // }
                // EventBus.emit('showToast', payload);
                // console.log('handleKitchen ts', ts);
            }
        } catch (e: any) {
            console.error('Error while handling kitchen:', e);
            // const payload: ToastPayload = {
            //     type: "warning",
            //     message: `Something went wrong during the process !`
            // }
            // EventBus.emit('showToast', payload);
        } finally {
            isLoading.value = false;
        }
    }
    const handleCompleted = async (ts: any) => {
        try {
            if(ticketInfo.value.StatusCode != 'COMPLETED') {
                isLoading.value = true;
                const result  = await updateOrder({
                    "Code": ticketInfo.value.Code,
                    "StatusCode":"COMPLETED"
                });
                console.log('result', result);
                ticketInfo.value.StatusCode = 'COMPLETED';
                // const payload: ToastPayload = {
                //     type: "success",
                //     message: `Order ${ticketInfo.value.Code} completed !`
                // }
                // EventBus.emit('showToast', payload);
                console.log('handleKitchen ts', ts);
            }
        } catch (e: any) {
            console.error('Error while handling kitchen:', e);
            // const payload: ToastPayload = {
            //     type: "warning",
            //     message: `Something went wrong during the process !`
            // }
            // EventBus.emit('showToast', payload);
        } finally {
            isLoading.value = false;
        }
    }
    const handleCloseModal = () => {
        console.log('handleCloseModal')
        isModalOpen.value = false;
    }

    const deleteAction = async () => {
        try {
            if(ticketInfo.value.StatusCode != 'COMPLETED') {
                isLoading.value = true;
                const result = await deleteOrder([
                    {
                        Code: ticketInfo.value.Code
                    }
                ])
                console.log('result', result);
                // const payload: ToastPayload = {
                //     type: "success",
                //     message: `Order ${ticketInfo.value.Code} Deleted succesfully !`
                // }
                // EventBus.emit('showToast', payload);
                // window.location.href = '/';
                window.history.back();
            }
        } catch (e: any) {
            console.error('Error while handling kitchen:', e);
            // const payload: ToastPayload = {
            //     type: "warning",
            //     message: `Something went wrong during the process !`
            // }
            // EventBus.emit('showToast', payload);
        } finally {
            isLoading.value = false;
        }
    }


    const goBack = () => {
         window.location.href = '/order';
        //window.history.back();
    }


    async function getTicket() {
        const params = router.currentRoute.value.params as unknown as Param;
        ticketCode.value = params.ticketcode;

        const result = await fetchSingleOrder(params.ticketcode);

        console.log('*** result', result)

        if(result.length > 0){
            ticketInfo.value = result[0].Order;
            plateInfo.value = result;
        }

        isLoading.value = false;
    }
    onBeforeMount(async () => {
        await getTicket();
    })
</script>

<template>
  <AdminLayout>
    <div class="h-screen mt-10">
        <DefaultCard :cardTitle="`${ticketInfo.Code}`" v-if="!isLoading">
            <template v-slot:button>
                <button class="flex items-center" @click="goBack">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>&nbsp;&nbsp;
                    <span class="text-nowrap">{{ $t('Goback') }}</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                </button>
            </template>
                <template v-slot:header>
                    <div class="flex items-center justify-center">
                        <button @click='handleKitchen' class="text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-700 font-medium rounded-lg text-sm py-2.5 px-2 text-center me-2 mb-2">{{ $t('INVOICE') }}</button>
                        <button @click="handleDeleteTicket" class="px-2 text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm py-2.5 text-center me-2 mb-2">{{ $t('delete') }}</button>
                    </div>
                </template>
            <div class="py-4.5 px-15">
                <Ticket :createdDate="ticketInfo.CreatedDate" :code="ticketInfo.Code" :plates="plateInfo" :status="ticketInfo.StatusCode" :styled="false">
                    <template v-slot:footer>
                        <div class="flex justify-end mt-10 border-t-2 border-slate-300 pt-5">
                            <button @click='handleKitchen' :class="ticketInfo.StatusCode == 'DRAFT' ? 'text-white bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-100 dark:focus:ring-orange-600 font-medium rounded-lg text-sm py-2.5 text-center me-2 mb-2 px-2' : baseBtnStyle">{{ $t('inkitchen') }}</button>
                            <button @click='handleProgress' :class="ticketInfo.StatusCode == 'IN PROGRESS' ? 'text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-700 font-medium rounded-lg text-sm py-2.5 text-center me-2 mb-2 px-2' : baseBtnStyle">{{ $t('inprogress') }}</button>
                            <button @click='handleCompleted' :class="ticketInfo.StatusCode == 'COMPLETED' ? 'text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-700 font-medium rounded-lg text-sm py-2.5 text-center me-2 mb-2 px-2' : baseBtnStyle">{{ $t('completed') }}</button>
                        </div>
                    </template>
                </Ticket>
            </div>
        </DefaultCard>

        <PopupModal :message="$t('messagedeletion')" :is-open="isModalOpen" v-if="isModalOpen" @close="handleCloseModal" :title="$t('Platedeletion')">
            <template v-slot:footer>
                <div class="bg-slate-50 px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6">
                    <button @click="deleteAction" type="button" class="h-10 text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-5 text-center mb-2 flex justify-center items-center flex-nowrap">{{ $t('delete') }}<span v-if="isDeleting" class="flex items-center justify-center">&nbsp;&nbsp;&nbsp;<spinner/></span></button>
                    <button @click="handleCloseModal" class="h-10 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-slate-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-purple-500 group-hover:from-cyan-500 group-hover:to-purple-500 hover:text-purple dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                        <span class="h-9 relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-slate-900 rounded-md group-hover:bg-opacity-0">
                            {{ $t('Cancel') }}
                        </span>
                    </button>
                </div>
            </template>
        </PopupModal>
        <!-- <SpinnerOverPage v-if="isLoading" /> -->
        <DefaultCardSkeleton v-if="isLoading" />
    </div>
  </AdminLayout>
</template>
