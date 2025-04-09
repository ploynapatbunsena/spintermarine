<template>
  <PermissionCheck 
    menu-id="0101030600" 
    :required-permissions="{
      IsRead: true,
      IsWrite: true
    }"
  >
    <template #default="{ permissions }">
      <v-app style="background-color: #F7F9FC;">
        <NavigationBar />
        <SpaceBar />
        <v-container fluid class="px-10">
          <div class="title">Member Management</div>
          <!-- Alert สำหรับแจ้งผลการบันทึก -->
          <v-alert
            v-model="showAlert"
            :type="alertType"
            class="mb-4"
            transition="fade-transition"
          >
            {{ alertMessage }}
          </v-alert>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-text class="card-text">
                  <div class="header">
                    <span class="material-symbols-rounded">person_edit</span>
                    <p>Personal Profile and Contact</p>
                  </div>
                  <v-row>
                    <v-col cols="12" sm="12" lg="6">
                      <div class="device-detail">
                        <p class="label">Member Id</p>
                        <v-text-field
                          v-model="profileDetail.MemberId"
                          variant="outlined"
                          density="compact"
                          class="input-field"
                          disabled
                        ></v-text-field>
                      </div>
                      <div class="device-detail">
                        <p class="label">First Name</p>
                        <v-text-field
                          v-model="profileDetail.MemberFirstnameEng"
                          variant="outlined"
                          density="compact"
                          class="input-field"
                          style="font-family: 'Sarabun', sans-serif;"
                        ></v-text-field>
                      </div>
                      <div class="device-detail">
                        <p class="label">Last Name</p>
                        <v-text-field
                          v-model="profileDetail.MemberLastnameEng"
                          variant="outlined"
                          density="compact"
                          class="input-field"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="12" lg="6">
                      <div class="device-detail">
                        <p class="label">Position</p>
                        <v-text-field
                          v-model="profileDetail.Position"
                          variant="outlined"
                          density="compact"
                          class="input-field"
                          style="font-family: 'Sarabun', sans-serif;"
                        ></v-text-field>
                      </div>
                      <div class="device-detail">
                        <p class="label">Email</p>
                        <v-text-field
                          v-model="profileDetail.MemberEmail"
                          variant="outlined"
                          density="compact"
                          class="input-field"
                        ></v-text-field>
                      </div>
                      <div class="device-detail">
                        <p class="label">Phone</p>
                        <v-text-field
                          v-model="profileDetail.MemberPhone"
                          variant="outlined"
                          density="compact"
                          class="input-field"
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-card class="mt-6">
                <v-data-table
                  v-model="selected"
                  :headers="headers"
                  :items="permissionCheck"
                  hide-default-footer
                  :items-per-page="-1"                  
                  class="striped-table custom-table"
                >
                  <template v-slot:[`body.prepend`]>
                    <tr class="select-all-row">
                      <td></td>
                      <td></td>
                      <td><v-checkbox color="primary" v-model="selectAll.IsRead" @update:modelValue="toggleSelectAll('IsRead')" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="selectAll.IsWrite" @update:modelValue="toggleSelectAll('IsWrite')" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="selectAll.IsCheck" @update:modelValue="toggleSelectAll('IsCheck')" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="selectAll.IsApprove" @update:modelValue="toggleSelectAll('IsApprove')" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="selectAll.IsAccept" @update:modelValue="toggleSelectAll('IsAccept')" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="selectAll.IsAcknowledge" @update:modelValue="toggleSelectAll('IsAcknowledge')" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="selectAll.IsPrint" @update:modelValue="toggleSelectAll('IsPrint')" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="selectAll.IsImport" @update:modelValue="toggleSelectAll('IsImport')" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="selectAll.IsExport" @update:modelValue="toggleSelectAll('IsExport')" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="selectAll.IsActive" @update:modelValue="toggleSelectAll('IsActive')" hide-details></v-checkbox></td>
                    </tr>
                  </template>
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>{{ item.MenuId }}</td>
                      <td>{{ item.MenuName }}</td>
                      <td><v-checkbox color="primary" v-model="item.IsRead" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="item.IsWrite" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="item.IsCheck" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="item.IsApprove" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="item.IsAccept" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="item.IsAcknowledge" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="item.IsPrint" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="item.IsImport" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="item.IsExport" hide-details></v-checkbox></td>
                      <td><v-checkbox color="primary" v-model="item.IsActive" hide-details></v-checkbox></td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12" class="button-section">
              <v-btn class="cancel-btn" @click="resetForm" elevation="0">Cancel</v-btn>
              <v-btn class="save-btn" @click="saveRecord" elevation="0" :disabled="!permissions.IsWrite">Save</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-app>
    </template>
  </PermissionCheck>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import PermissionCheck from '@/components/PermissionCheck.vue';
import { inject, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const $api = inject('$api');
const route = useRoute();
const profileDetail = ref({});
const permissionCheck = ref([]);
const selected = ref([]);
const originalProfile = ref({});
const initialProfile = ref({});
const showAlert = ref(false);
const alertType = ref('success');
const alertMessage = ref('');
const selectAll = ref({
  IsRead: false,
  IsWrite: false,
  IsCheck: false,
  IsApprove: false,
  IsAccept: false,
  IsAcknowledge: false,
  IsPrint: false,
  IsImport: false,
  IsExport: false,
  IsActive: false
});

const headers = ref([
  { title: 'Menu Id', key: 'MenuId', align: 'start' },
  { title: 'Menu Name', key: 'MenuName', align: 'start', width: '25vw' },
  { title: 'Read', value: 'IsRead', align: 'center' },
  { title: 'Write', value: 'IsWrite', align: 'center' },
  { title: 'Check', value: 'IsCheck', align: 'center' },
  { title: 'Approve', value: 'IsApprove', align: 'center' },
  { title: 'Accept', value: 'IsAccept', align: 'center' },
  { title: 'Acknowledge', value: 'IsAcknowledge', align: 'center' },
  { title: 'Print', value: 'IsPrint', align: 'center' },
  { title: 'Import', value: 'IsImport', align: 'center' },
  { title: 'Export', value: 'IsExport', align: 'center' },
  { title: 'Action', value: 'IsActive', align: 'center' },
]);

const fetchProfileDetail = async () => {
  try {
    const memberId = route.params.memberId;
    const response = await $api.get(`/member/permission/${memberId}`);
    
    profileDetail.value = response.data.member;
    originalProfile.value = { ...response.data.member };
    initialProfile.value = {
      MemberId: response.data.member.MemberId,
      MemberFirstnameEng: response.data.member.MemberFirstnameEng,
      MemberLastnameEng: response.data.member.MemberLastnameEng,
      Position: response.data.member.Position,
      MemberEmail: response.data.member.MemberEmail,
      MemberPhone: response.data.member.MemberPhone
    };
    
    permissionCheck.value = response.data.menuPermission.map(permission => ({
      MenuId: permission.MenuId,
      MenuName: permission.MenuName,
      IsRead: permission.IsRead,
      IsWrite: permission.IsWrite,
      IsCheck: permission.IsCheck,
      IsApprove: permission.IsApprove,
      IsAccept: permission.IsAccept,
      IsAcknowledge: permission.IsAcknowledge,
      IsPrint: permission.IsPrint,
      IsImport: permission.IsImport,
      IsExport: permission.IsExport,
      IsActive: permission.IsActive,
      CreatedBy: permission.CreatedBy,
      CreatedDatetime: permission.CreatedDatetime,
      ModifiedBy: permission.ModifiedBy,
      ModifiedDatetime: permission.ModifiedDatetime,
      CancelBy: permission.CancelBy,
      CancelDatetime: permission.CancelDatetime,
      CancelReason: permission.CancelReason
    }));
    
    updateSelectAllState();
  } catch (error) {
    console.error('Failed to fetch profile detail:', error);
    showAlert.value = true;
    alertType.value = 'error';
    alertMessage.value = 'Failed to load member data.';
    setTimeout(() => showAlert.value = false, 1000);
  }
};

const toggleSelectAll = (field) => {
  permissionCheck.value.forEach(item => {
    item[field] = selectAll.value[field];
  });
};

const updateSelectAllState = () => {
  const fields = ['IsRead', 'IsWrite', 'IsCheck', 'IsApprove', 'IsAccept', 'IsAcknowledge', 'IsPrint', 'IsImport', 'IsExport', 'IsActive'];
  fields.forEach(field => {
    selectAll.value[field] = permissionCheck.value.every(item => item[field]);
  });
};

const resetForm = () => {
  profileDetail.value = { ...initialProfile.value };
  fetchProfileDetail();
};

const saveRecord = async () => {
  try {
    const memberData = JSON.parse(localStorage.getItem('member')) || {};
    const memberId = memberData.MemberId || route.params.memberId; // Fallback to route param
    const modifiedDatetime = new Date().toISOString();

    if (!profileDetail.value.MemberId) {
      throw new Error('MemberId is missing');
    }

    const payload = {
      member: {
        ...originalProfile.value,
        MemberId: profileDetail.value.MemberId, // Ensure MemberId is included
        MemberFirstnameEng: profileDetail.value.MemberFirstnameEng,
        MemberLastnameEng: profileDetail.value.MemberLastnameEng,
        Position: profileDetail.value.Position,
        MemberEmail: profileDetail.value.MemberEmail,
        MemberPhone: profileDetail.value.MemberPhone,
        ModifiedBy: memberId,
        ModifiedDatetime: modifiedDatetime
      },
      menuPermission: permissionCheck.value.map(permission => ({
        ...permission,
        ModifiedBy: memberId,
        ModifiedDatetime: modifiedDatetime
      }))
    };

    await $api.put('/member/edit/permission', payload);
    
    showAlert.value = true;
    alertType.value = 'success';
    alertMessage.value = 'Member data saved successfully!';
    setTimeout(() => showAlert.value = false, 1000);

    await fetchProfileDetail();
    resetForm();
  } catch (error) {
    console.error('Failed to save member details:', error);
    showAlert.value = true;
    alertType.value = 'error';
    alertMessage.value = 'Failed to save member data: ' + (error.message || 'Unknown error');
    setTimeout(() => showAlert.value = false, 1000);
  }
};

watch(permissionCheck, () => {
  updateSelectAllState();
}, { deep: true });

onMounted(() => {
  fetchProfileDetail();
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 2vh;
  font-weight: 600;
  margin-bottom: 1vh;
}

.header {
  display: flex;
  justify-content: starrt;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  p {
    font-size: 16px;
    font-weight: 700;
  }
}

.device-detail {
  @media (min-width: 1024px) {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 64px;
  }
}

.device-detail p {
  min-width: 120px;
  margin: 0;
}

.device-detail .label {
  min-width: 120px;
  margin: 0;
  position: relative;
}

.device-detail .label::after {
  content: '*';
  color: #E62020;
  margin-left: 4px;
}


.input-field :deep(.v-field__outline) {
  border-radius: 6px;
  color: #70707B;
}

:deep(.v-text-field input) {
  color: #4B4B4B;
}

.button-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
}

.cancel-btn {
  background-color: #DC2B2B;
  color: #ffffff;
  border-radius: 10px;
}

.save-btn {
  background-color: #1476FF;
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

.upload-img {
  background-color: #9F9F9F;
  width: 100%;
  height: 100%;
}

.edit {
  cursor: pointer;
  width: 34px;
  height: 24px;
  border-radius: 24px;
  font-size: 20px;
  color: #1570EF;
  background-color: #E3F2FD;
}

td.action {
  color: #14CA74 !important; /* บังคับ CSS */
  text-align: center;
}

.card-text {
  @media (min-width: 1024px) {
    margin: 24px 64px;
  }
}

.configuration-col {
  @media (min-width: 1024px) {
    margin-top: 110px;
  }
}
</style>