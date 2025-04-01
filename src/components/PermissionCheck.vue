<template>
  <div v-if="hasPermission">
    <slot :permissions="currentPermissions"></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, inject } from 'vue'
import { useRouter } from 'vue-router'

const $api = inject('$api')
const props = defineProps({
  menuId: {
    type: String,
    required: true
  },
  requiredPermissions: {
    type: Object,
    default: () => ({
      IsRead: false,
      IsWrite: false,
      IsCancel: false,
      IsPrint: false,
      IsImport: false,
      IsExport: false,
      IsCheck: false,
      IsApprove: false
    }),
    validator: (value) => {
      const validKeys = ['IsRead', 'IsWrite', 'IsCancel', 'IsPrint','IsImport', 'IsExport', 'IsCheck', 'IsApprove']
      return Object.keys(value).every(key => validKeys.includes(key))
    }
  }
})

const router = useRouter()
const hasPermission = ref(false)
const currentPermissions = ref({
  IsRead: false,
  IsWrite: false,
  IsCancel: false,
  IsPrint: false,
  IsImport: false,
  IsExport: false,
  IsCheck: false,
  IsApprove: false
})

const checkPermission = async () => {
  try {
    const memberData = localStorage.getItem('member')
    if (!memberData) throw new Error('No member data found')

    const member = JSON.parse(memberData)
    if (!member?.MemberId) throw new Error('Invalid member data')

    const response = await $api.get(`/member/permission/${member.MemberId}`)
    
    const targetMenu = response.data.menuPermission?.find(
      menu => menu.MenuId === props.menuId && menu.IsActive
    )

    if (!targetMenu) {
      router.push('/Homepage')
      return
    }

    currentPermissions.value = {
      IsRead: targetMenu.IsRead,
      IsWrite: targetMenu.IsWrite,
      IsCancel: targetMenu.IsCancel,
      IsPrint: targetMenu.IsPrint,
      IsImport: targetMenu.IsImport,
      IsExport: targetMenu.IsExport,
      IsCheck: targetMenu.IsCheck,
      IsApprove: targetMenu.IsApprove
    }

    const requiredPerms = Object.entries(props.requiredPermissions)
      .filter(([, value]) => value)
      .map(([key]) => key)

    hasPermission.value = requiredPerms.length > 0 
      ? requiredPerms.every(perm => targetMenu[perm])
      : !!targetMenu
    
    if (!hasPermission.value) {
      router.push('/Homepage')
    }
  } catch (error) {
    console.error('Permission check failed:', {
      message: error.message,
      status: error.response?.status
    })
    if (error.response?.status !== 401) {
      router.push('/Homepage')
    }
  }
}

onMounted(() => {
  checkPermission()
})
</script>