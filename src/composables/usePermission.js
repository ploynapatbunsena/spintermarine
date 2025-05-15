import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export function usePermission() {
  const router = useRouter();
  const authStore = useAuthStore();
  const error = ref(null);

  // ตรวจสอบสิทธิ์สำหรับ MenuId และ action เฉพาะ
  const checkPermission = (menuId, action = 'IsActive') => {
    try {
      const permissions = authStore.menuPermission;
      if (!permissions || !Array.isArray(permissions)) {
        throw new Error('No permissions found');
      }

      const permission = permissions.find((p) => p.MenuId === menuId);
      if (!permission) {
        return false;
      }

      return permission[action] === true;
    } catch (err) {
      error.value = err.message;
      return false;
    }
  };

  // ตรวจสอบและ redirect ถ้าไม่มีสิทธิ์
  const restrictAccess = (menuId) => {
    if (!checkPermission(menuId, 'IsActive')) {
      router.push('/Homepage');
      return false;
    }
    return true;
  };

  return {
    checkPermission,
    restrictAccess,
    error,
  };
}