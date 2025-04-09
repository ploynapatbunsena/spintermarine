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
                <td class="action">{{ item.IsActive ? 'Active' : 'Inactive' }}</td>
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

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete member {{ memberToDelete }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteMember">Delete</v-btn>
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
const filteredItems = ref([]);
const search = ref('');
const deleteDialog = ref(false);
const memberToDelete = ref(null);

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
      companyName: item.Department,
      username: `${item.MemberFirstnameEng} ${item.MemberLastnameEng}`,
      position: item.Position,
      email: item.MemberEmail,
      phoneNumber: item.MemberPhone,
      createDateTime: item.CreatedDatetime,
      IsActive: item.IsActive
    }));

    filteredItems.value = mappedItems;
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
  // try {
  //   // Assuming there's a DELETE endpoint like this
  //   await $api.delete(`/member/delete/${memberToDelete.value}`);
    
  //   // Remove the deleted member from the list
  //   filteredItems.value = filteredItems.value.filter(
  //     item => item.memberId !== memberToDelete.value
  //   );
    
  //   deleteDialog.value = false;
  //   memberToDelete.value = null;
  // } catch (error) {
  //   console.error('Failed to delete member:', error);
  //   deleteDialog.value = false;
  // }
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

.cancel-btn {
  background-color: #DC2B2B;
  color: #ffffff;
  border-radius: 10px;
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
  color: #14CA74 !important; /* บังคับ CSS */
  text-align: center;
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

</style>