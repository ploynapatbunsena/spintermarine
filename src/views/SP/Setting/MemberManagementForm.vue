<template>
  <v-app style="background-color: #F7F9FC;">
    <NavigationBar />
    <SpaceBar />
    <v-container fluid class="px-10">
      <div class="title">Member Management</div>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text class="card-text">
              <v-row>
                <v-col cols="12" class="d-flex justify-start align-center ga-4">
                  <span class="material-symbols-rounded">person_edit</span>
                  <p style="font-size: 2vh; font-weight: bold;">Personal Profile and Contact</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <p class="detail" style="color: #C0C0C0;">หมายเหตุ: หากท่านต้องการเปลี่ยนรหัสผ่านบัญชีโปรดติดต่อ MFEC</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" lg="6">
                  <div class="device-detail">
                    <p class="label">Member Id</p>
                    <v-text-field
                      v-model="profileDetail.MemberId"
                      variant="outlined"
                      density="compact"
                      class="input-field"
                      readonly
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
                      readonly
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
                      readonly
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
          <v-card>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="permissionCheck"
              hide-default-footer
              :items-per-page="-1"
              class="striped-table custom-table"
            >
              <!-- Custom column headers with tooltips -->
              <template v-slot:[`header.IsRead`]="{ column }">
                <div class="d-flex align-center justify-center">
                  <span>{{ column.title }}</span>
                  <v-tooltip bottom max-width="400px">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div class="tooltip-content">
                      <div class="font-weight-bold mb-1">Read</div>
                      <div class="text-body-2 detail mb-1">ยังไม่เปิดให้ใช้งาน</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:[`header.IsWrite`]="{ column }">
                <div class="d-flex align-center justify-center">
                  <span>{{ column.title }}</span>
                  <v-tooltip bottom max-width="400px">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div class="tooltip-content">
                      <div class="font-weight-bold mb-1">Write</div>
                      <div class="text-body-2 detail mb-1">ผู้ใช้สามารถ แก้ไขหรือลงข้อมูล ในแบบฟอร์มหรือตารางที่กำหนดได้</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:[`header.IsCheck`]="{ column }">
                <div class="d-flex align-center justify-center">
                  <span>{{ column.title }}</span>
                  <v-tooltip bottom max-width="400px">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div class="tooltip-content">
                      <div class="font-weight-bold mb-1">Check</div>
                      <div class="text-body-2 detail mb-1">ยังไม่เปิดให้ใช้งาน</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:[`header.IsApprove`]="{ column }">
                <div class="d-flex align-center justify-center">
                  <span>{{ column.title }}</span>
                  <v-tooltip bottom max-width="400px">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div class="tooltip-content">
                      <div class="font-weight-bold mb-1">Approve</div>
                      <div class="text-body-2 detail mb-1">ยังไม่เปิดให้ใช้งาน</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:[`header.IsAccept`]="{ column }">
                <div class="d-flex align-center justify-center">
                  <span>{{ column.title }}</span>
                  <v-tooltip bottom max-width="400px">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div class="tooltip-content">
                      <div class="font-weight-bold mb-1">Accept</div>
                      <div class="text-body-2 detail mb-1">ผู้ใช้สามารถ บันทึกข้อมูล (Save) ที่กรอกหรือแก้ไขไว้ในระบบได้</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:[`header.IsAcknowledge`]="{ column }">
                <div class="d-flex align-center justify-center">
                  <span>{{ column.title }}</span>
                  <v-tooltip bottom max-width="400px">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div class="tooltip-content">
                      <div class="font-weight-bold mb-1">Acknowledge</div>
                      <div class="text-body-2 detail mb-1">ยังไม่เปิดให้ใช้งาน</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:[`header.IsPrint`]="{ column }">
                <div class="d-flex align-center justify-center">
                  <span>{{ column.title }}</span>
                  <v-tooltip bottom max-width="400px">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div class="tooltip-content">
                      <div class="font-weight-bold mb-1">Print</div>
                      <div class="text-body-2 detail mb-1">ยังไม่เปิดให้ใช้งาน</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:[`header.IsImport`]="{ column }">
                <div class="d-flex align-center justify-center">
                  <span>{{ column.title }}</span>
                  <v-tooltip bottom max-width="400px">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div class="tooltip-content">
                      <div class="font-weight-bold mb-1">Import</div>
                      <div class="text-body-2 detail mb-1">ผู้ใช้สามารถ นำเข้าข้อมูลจากแหล่งภายนอกเข้าสู่ระบบได้</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:[`header.IsExport`]="{ column }">
                <div class="d-flex align-center justify-center">
                  <span>{{ column.title }}</span>
                  <v-tooltip bottom max-width="400px">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div class="tooltip-content">
                      <div class="font-weight-bold mb-1">Export</div>
                      <div class="text-body-2 detail mb-1">ผู้ใช้สามารถ ส่งออกหรือดาวน์โหลดข้อมูล จากระบบ เช่น เป็นไฟล์ Excel, JPG หรือ CSV</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:[`header.IsActive`]="{ column }">
                <div class="d-flex align-center justify-center">
                  <span>{{ column.title }}</span>
                  <v-tooltip bottom max-width="400px">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" size="16" color="primary" class="ml-1">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div class="tooltip-content">
                      <div class="font-weight-bold mb-1">Active</div>
                      <div class="text-body-2 detail mb-1">ผู้ใช้สามารถ เข้าถึงและใช้งานหน้าเมนูหรือหน้าจอ ฟังก์ชันนั้น ๆ ได้ในระบบ</div>
                    </div>
                  </v-tooltip>
                </div>
              </template>

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
          <v-btn class="cancel-btn text-none" @click="resetForm" elevation="0">Cancel</v-btn>
          <v-btn class="save-btn text-none" @click="saveRecord" elevation="0">Save</v-btn>
        </v-col>
      </v-row>
    </v-container>
    
    <v-snackbar
      v-model="showAlert"
      :color="alertType"
      :timeout="3000"
      location="top right"
      class="alert-banner"
      rounded="lg"
    >
      <div class="pa-5" style="font-family: 'Inter', sans-serif; font-size: 1.5vh;">
        <v-icon class="ma-2" size="20">
          {{ alertIcon }}
        </v-icon>
        {{ alertMessage }}
      </div>
    </v-snackbar>

  </v-app>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue';
import SpaceBar from '@/components/SpaceBar.vue';
import { inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $api = inject('$api');
const route = useRoute();
const router = useRouter();
const profileDetail = ref({});
const permissionCheck = ref([]);
const selected = ref([]);
const originalProfile = ref({});
const initialProfile = ref({});
const alertType = ref('success');
const alertIcon = ref('mdi-check-circle') 
const showAlert = ref(false);
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
  { title: 'Active', value: 'IsActive', align: 'center' },
]);


const showSuccessAlert = (message) => {
  showAlert.value = true;
  alertType.value = 'success';
  alertMessage.value = message;
  alertIcon.value = 'mdi-check-circle';
};

const showErrorAlert = (message) => {
  showAlert.value = true;
  alertType.value = 'error';
  alertMessage.value = message;
  alertIcon.value = 'mdi-alert-circle'
};

const initialize = async () => {
  const menuPermission = localStorage.getItem('menuPermission');
  if (!menuPermission) {
    return router.push('/Homepage');
  }

  const permissionList = JSON.parse(menuPermission);
  const permission = permissionList.find(item => item.MenuId === '0101030600');

  if (!permission || !permission.IsActive) {
    return router.push('/Homepage');
  }
};

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
    showErrorAlert('Failed to load member data.');
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
    const memberId = memberData.MemberId || route.params.memberId;
    const modifiedDatetime = new Date().toISOString();

    if (!profileDetail.value.MemberId) {
      throw new Error('MemberId is missing');
    }

    const payload = {
      member: {
        ...originalProfile.value,
        MemberId: profileDetail.value.MemberId,
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
    showSuccessAlert('Member updated successfully!');

    await fetchProfileDetail();
    resetForm();
  } catch (error) {
    console.error('Failed to update member information:', error);
    showErrorAlert('Failed to update member information: ' + (error.message || 'Unknown error'));
  }
};

watch(permissionCheck, () => {
  updateSelectAllState();
}, { deep: true });

onMounted(async() => {
  await initialize();
  await fetchProfileDetail();
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 2vh;
  font-weight: bold;
  margin-bottom: 1vh;
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
  color: #000000;
  border-radius: 24px;
  border: 1px solid #E3E3E3;
  font-family: 'Inter', sans-serif;
  width: 5vw;
}

.save-btn {
  background-color: #1476FF;
  color: #ffffff;
  border-radius: 24px;
  font-family: 'Inter', sans-serif;
  width: 5vw;
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

.detail {
  font-family: 'Sarabun', sans-serif;
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
  color: #14CA74 !important;
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