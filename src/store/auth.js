import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const member = ref(null);
  const menuPermission = ref([]);
  const accessToken = ref(null);

  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
  const initializeAuth = () => {
    try {
      const storedMember = localStorage.getItem('member');
      const storedPermissions = localStorage.getItem('menuPermission');
      const storedToken = localStorage.getItem('accessToken');

      if (storedMember) member.value = JSON.parse(storedMember);
      if (storedPermissions) menuPermission.value = JSON.parse(storedPermissions);
      if (storedToken) accessToken.value = storedToken;
    } catch (err) {
      console.error('Failed to initialize auth:', err);
    }
  };

  // อัปเดตข้อมูล auth
  const setAuth = (newMember, permissions, token) => {
    member.value = newMember;
    menuPermission.value = permissions;
    accessToken.value = token;

    localStorage.setItem('member', JSON.stringify(newMember));
    localStorage.setItem('menuPermission', JSON.stringify(permissions));
    localStorage.setItem('accessToken', token);
  };

  // ล้างข้อมูล auth
  const clearAuth = () => {
    member.value = null;
    menuPermission.value = [];
    accessToken.value = null;

    localStorage.removeItem('member');
    localStorage.removeItem('menuPermission');
    localStorage.removeItem('accessToken');
  };

  return {
    member,
    menuPermission,
    accessToken,
    initializeAuth,
    setAuth,
    clearAuth,
  };
});