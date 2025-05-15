<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Member Management</div>
      <v-card class="mt-4">
        <v-card-text class="mx-6 my-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                density="compact"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="solo-filled"
                flat
                hide-details
                single-line
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="mx-6">
          <v-data-table
            v-model:search="search"
            :filter-keys="['memberId', 'username', 'position', 'email', 'phoneNumber']"
            :headers="headers"
            :items="filteredItems"
            class="elevation-1 mb-12 striped-table custom-table"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.memberId }}</td>
                <td>{{ item.companyName }}</td>
                <td>{{ item.username }}</td>
                <td>{{ item.position }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.phoneNumber }}</td>
                <td>{{ item.createDateTime }}</td>
                <td class="action" :class="{ 'text-green': item.IsActive, 'text-red': !item.IsActive }">
                  {{ item.IsActive ? 'Active' : 'Inactive' }}
                </td>
                <td class="d-flex justify-center align-center">
                  <v-icon icon="mdi-pencil" class="edit" @click="editProfile(item.memberId)"></v-icon>
                  <v-icon icon="mdi-delete" class="delete" @click="confirmDelete(item.memberId)"></v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card rounded="xl" class="pa-5">
        <v-card-actions class="justify-end">
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="deleteDialog"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
          
          <div style="display: flex; flex-direction: column; align-items: center;">
            <span class="material-symbols-rounded" style="font-size: 6vh; color: #CBD0DC;" >inventory_2</span>
            <v-card-title style="font-family: 'Sarabun', sans-serif;" class="headline">คุณกำลังดำเนินการลบบัญชีผู้ใช้</v-card-title>
          </div>
        </v-card-text>
        
        <v-card-text>
          <v-text-field
            v-model="cancelReason"
            placeholder="กรุณาระบุเหตุผล"
            style="font-family: 'Sarabun', sans-serif;"
            class="tetx-field "
            clearable
            variant="outlined"
            required
          />
          <div class="text-medium-emphasis" style="font-family: 'Sarabun', sans-serif;">
            เมื่อบัญชีผู้ใช้นี้ถูกลบ ท่านไม่สามารถกู้คืนได้
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn class="cancel-btn text-none" @click="deleteDialog = false"> Cancel </v-btn>
          <v-btn class="delete-btn text-none" @click="deleteMember"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import { ref, onMounted, inject } from 'vue';
import router from '@/router';

const $api = inject('$api');
const search = ref('');
const deleteDialog = ref(false);
const memberToDelete = ref('');
const cancelReason = ref('');
const filteredItems = ref([]);

const headers = ref([
  { title: 'Member Id', key: 'memberId', align: 'start' },
  { title: 'Company Name', key: 'companyName', align: 'start' },
  { title: 'Username', key: 'username', align: 'start' },
  { title: 'Position', key: 'position', align: 'start' },
  { title: 'Email', key: 'email', align: 'start' },
  { title: 'Phone Number', key: 'phoneNumber', align: 'start' },
  { title: 'Create Date Time', key: 'createDateTime', align: 'start' },
  { title: 'Action', key: 'isActive', align: 'center', sortable: false },
  { title: 'Edit', key: 'edit', align: 'center', sortable: false },
]);

const fetchDeviceList = async () => {
  try {
    const response = await $api.put('/member/list/all', {
      CustomerId: '00000002'
    });

    const mappedItems = response.data.map(item => ({
      memberId: item.MemberId,
      customerId: item.CustomerId,
      companyName: item.Department,
      username: `${item.MemberFirstnameEng} ${item.MemberLastnameEng}`,
      position: item.Position,
      email: item.MemberEmail,
      phoneNumber: item.MemberPhone,
      createDateTime: item.CreatedDatetime,
      IsActive: item.IsActive
    }));

    filteredItems.value = mappedItems.filter(item => item.IsActive);
    // filteredItems.value = mappedItems;
  } catch (error) {
    console.error('Failed to fetch Profile list:', error);
  }
};

const editProfile = (memberId) => {
  router.push({ name: "MemberManagementForm", params: { memberId }})
}

const confirmDelete = (memberId) => {
  memberToDelete.value = memberId;
  deleteDialog.value = true;
};

const deleteMember = async () => {
  if (!cancelReason.value) {
    alert('Please provide a reason for deleting.');
    return;
  }
  try {
    const member = JSON.parse(localStorage.getItem("member"));
    let cancelByMemberId = member?.MemberId;

    // หา CustomerId ของ member ที่ต้องการลบ
    const memberItem = filteredItems.value.find(item => item.memberId === memberToDelete.value);
    if (!memberItem) {
      alert('Member not found.');
      return;
    }

    const requestBody = {
      MemberId: memberToDelete.value,
      CustomerId: memberItem.customerId, // ถ้าไม่มี customerId ใน item ก็ fallback ไปยังค่าเดิม
      CancelBy: cancelByMemberId,
      CancelReason: cancelReason.value.toString()
    };

    await $api.put('/Member/Delete', requestBody);

    const index = filteredItems.value.findIndex(item => item.memberId === memberToDelete.value);
    if (index !== -1) {
      filteredItems.value[index].IsActive = false;
    }
    filteredItems.value = filteredItems.value.filter(item => item.IsActive);
    // alert('Member deleted successfully!');

    deleteDialog.value = false;
    memberToDelete.value = '';
    cancelReason.value = '';
  } catch (error) {
    console.error('Failed to delete member:', error);
    let errorMessage = 'Failed to delete member';
    if (error.response) {
      errorMessage = error.response.data.message || error.response.data || 'Bad request';
    } else if (error.request) {
      errorMessage = 'No response from server';
    } else {
      errorMessage = error.message;
    }
    alert(`Error: ${errorMessage}`);
    deleteDialog.value = false;
  }
};

onMounted(() => {
  fetchDeviceList();
});
</script>

<style scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
}

.search-btn {
  background-color: #223368;
  color: #ffffff;
  border-radius: 10px;
}

.custom-table :deep(thead th) {
  color: #000000;
  font-weight: bold;
  font-size: 16px;
}

.custom-table :deep(tbody td) {
  color: #4B4B4B;
  font-size: 16px;
}

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: #F9F9FA;
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #ffffff;
}

td.action {
  text-align: center;
}

.text-green {
  color: #14CA74 !important;
}

.text-red {
  color: #DC2B2B !important;
}

td.description {
  font-family: 'Sarabun', sans-serif;
}

.edit {
  cursor: pointer;
  width: 34px;
  height: 24px;
  border-radius: 24px;
  font-size: 20px;
  /* color: #1570EF; */
}

.delete {
  cursor: pointer;
  width: 34px;
  height: 24px;
  border-radius: 24px;
  font-size: 20px;
  /* color: #E62020; */
}

.tetx-field {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  color: #000000;
}

.cancel-btn {
  color: #000000;
  border-radius: 24px;
  border: 1px solid #E3E3E3;
  font-family: 'Inter', sans-serif;
  width: 5vw;
}

.delete-btn {
  background-color: #E62020;
  color: #ffffff;
  border-radius: 24px;
  font-family: 'Inter', sans-serif;
  width: 5vw;
}

</style>