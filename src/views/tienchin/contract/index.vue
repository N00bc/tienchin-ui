<template>
  <div class="app-container">
    <!--顶部搜索区-->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="客户名" prop="customerName">
        <el-input
            v-model="queryParams.customerName"
            placeholder="请输入客户名"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="请选择合同状态"
            clearable
            style="width: 200px">
          <el-option
              v-for="status in business_status"
              :key="status.value"
              :label="status.label"
              :value="status.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="客户手机号" prop="phoneNumber">
        <el-input v-model="queryParams.phoneNumber" placeholder="请输入客户手机号" clearable/>
      </el-form-item>
      <el-form-item label="合同归属人" prop="owner">
        <el-select v-model="queryParams.owner"
                   placeholder="请选择合同归属人"
                   clearable
                   style="width: 240px">
          <el-option
              v-for="(owner,index) in ownerList"
              :key="index"
              :value="owner"
              :label="owner"/>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道来源" prop="channelId">
        <el-select v-model="queryParams.channelId"
                   placeholder="请选择渠道来源"
                   clearable
                   style="width: 240px">
          <el-option
              v-for="channel in channelList"
              :key="channel.channelId"
              :value="channel.channelId"
              :label="channel.channelName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="跟进时间">
        <el-date-picker
            v-model="queryParams.dateRange"
            value-format="YYYY-MM-DD hh:mm:ss"
            format="YYYY-MM-DD hh:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['tienchin:constract:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['tienchin:constract:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['tienchin:constract:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['tienchin:constract:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!--合同列表-->
    <el-table v-loading="loading" :data="businessList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="客户姓名" align="center" prop="customerName" width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="客户手机号" align="center" prop="phoneNumber" width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="合同状态" align="center" prop="status" width="120" :show-overflow-tooltip="true">
        <template #default="scope">
          <dict-tag :options="business_status" :value="scope.row.status">
            {{ scope.row }}
          </dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="合同归属人" align="center" prop="owner" width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下次跟进时间" align="center" prop="nextTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.nextTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleBusinessView(scope.row)"
                     v-hasPermi="['tienchin:constract:view']">查看
          </el-button>
          <el-button link v-if="scope.row.status == 1"
                     type="primary" icon="Pointer" @click="handleBusinessAssign(scope.row)"
                     v-hasPermi="['tienchin:constract:edit']">分配
          </el-button>
          <el-button link v-if="scope.row.owner == userStore.name &&(scope.row.status == 1 || scope.row.status == 2)"
                     type="primary" icon="DArrowRight"
                     @click="handleBusinessFollow(scope.row)"
                     v-hasPermi="['tienchin:constract:follow']">跟进
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
    <!-- 分配合同对话框 -->
    <el-dialog title="分配合同" v-model="assignBusinessOpen" width="600px" append-to-body>
      <el-form ref="assignBusinessRef" :model="form" :rules="assignRules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <el-tree-select v-model="form.deptId" :data="deptOptions"
                              :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id"
                              @change="deptChange"
                              placeholder="请选择归属部门" check-strictly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配给" prop="nickName">
              <el-select v-model="form.nickName"
                         placeholder="请选择分配的对象"
                         clearable
                         @change="approveUserChange"
                         style="width: 240px">
                <el-option
                    v-for="user in userList"
                    :key="user.userId"
                    :value="{userId:user.userId,nickName:user.nickName,deptId:user.deptId,userName:user.userName}"
                    :label="user.nickName"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleBusinessFormSubmit">确认分派</el-button>
          <el-button @click="cancelBusinessAssign">取消分派</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加或修改合同对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="contractRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户姓名" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入客户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入用户手机号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="渠道名称">
              <el-select
                  v-model="form.channelName"
                  placeholder="选择渠道"
                  clearable
                  @change="handleChannelChange"
                  style="width: 240px">
                <el-option
                    v-for="channel in channelList"
                    :key="channel.channelId"
                    :label="channel.channelName"
                    :value="{value:channel.channelId,channelName:channel.channelName}"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动名称">
              <el-select
                  v-model="form.activityName"
                  placeholder="选择活动"
                  @change="handleActivityChange"
                  clearable
                  style="width: 240px">
                <el-option
                    v-for="activity in activityList"
                    :key="activity.activityId"
                    :label="activity.activityName"
                    :value="{value:activity.activityId,activityName:activity.activityName,discountType:activity.type}"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程分类">
              <el-select
                  v-model="form.type"
                  placeholder="课程分类"
                  clearable
                  @change="handleCourseListByCourseType"
                  style="width: 240px">
                <el-option
                    v-for="type in course_type"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="购买课程">
              <el-select
                  v-model="form.courseName"
                  placeholder="请选择课程"
                  clearable
                  @change="handleCourseChange"
                  style="width: 240px">
                <el-option
                    v-for="course in courseList"
                    :key="course.courseId"
                    :label="course.courseName"
                    :value="{value:course.courseId,courseName:course.courseName}"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审批部门">
              <el-tree-select v-model="form.approveDeptId" :data="deptOptions"
                              :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id"
                              @change="deptChange"
                              placeholder="请选择审批" check-strictly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批人">
              <el-select v-model="form.nickName"
                         placeholder="请选择审批人"
                         clearable
                         @change="approveUserChange"
                         style="width: 240px">
                <el-option
                    v-for="user in userList"
                    :key="user.userId"
                    :value="{value:user.userId,nickName:user.nickName,userName:user.userName,deptId:user.deptId}"
                    :label="user.nickName"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同价格" prop="contractPrice">
              <el-input-number v-model="form.contractPrice" placeholder="请输入合同价格"
                               :precision="2" :min="0" :step="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传合同">
              <el-upload
                  v-model:file-list="fileList"
                  action="/dev-api/tienchin/contract/upload"
                  :headers="headerObj"
                  :before-remove="handleBeforeRemove"
                  :on-success="handleOnSuccess"
                  :limit="1"
              >
                <el-button type="primary">选择合同原件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Business">
import {getToken} from '@/utils/auth'
import {
  assignBusiness,
  listActivities,
  listBusiness,
  listChannels,
  getBusinessSummaryById,
} from "@/api/tienchin/business";
import {
  getCourseByCourseType, removeContractFile, updateContract, addContract, listOwnerList, listUserList
} from "@/api/tienchin/contract";
import {deptTreeSelect} from "@/api/system/user";
import useUserStore from "../../../store/modules/user";

const router = useRouter();
const {proxy} = getCurrentInstance();
const {
  business_status,
  course_type
} = proxy.useDict("business_status", "course_type");


const businessList = ref([]);
const userStore = useUserStore();
const channelList = ref([]);
const courseList = ref([]);
const userList = ref([]);
const ownerList = ref([]);
const activityList = ref([]);
const open = ref(false);
const assignBusinessOpen = ref(false);
const deptOptions = ref(undefined);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const headerObj = ref({
  "Authorization": 'Bearer ' + getToken()
})
const fileList = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerName: undefined,
    status: undefined,
    phoneNumber: undefined,
    owner: undefined,
    channelId: undefined,
    dateRange: undefined
  },
  rules: {
    customerName: [{required: true, message: "客户姓名不能为空", trigger: "blur"}],
    phoneNumber: [{required: true, message: "客户手机号不能为空", trigger: "blur"}],
    contractPrice: [{required: true, message: "合同金额不能为空", trigger: "blur"}]
  },
  assignRules: {
    deptId: [{required: true, message: "部门不能为空", trigger: "blur"}],
    nickName: [{required: true, message: "员工不能为空", trigger: "blur"}]
  }
});
// data中的对象需要到此处声明
const {queryParams, form, rules, assignRules} = toRefs(data);

/**
 * 删除文件
 * @param uploadFile
 * @returns {*}
 */
function handleBeforeRemove(uploadFile) {
  let fullPath = uploadFile.response.data.url;
  return removeContractFile(fullPath);
}

/**
 * 获取课程列表
 * @param type:Integer
 */
function handleCourseListByCourseType(type) {
  form.value.courseId = undefined;
  getCourseByCourseType(type).then(response => {
    courseList.value = response.data;
  })
}

/**
 * 更新表单课程数据
 */
function handleCourseChange(data) {
  form.value.courseId = data.value
  form.value.courseName = data.courseName
}

/**
 * 上传成功回调
 * @param response
 * @param uploadFile
 */
function handleOnSuccess(response, uploadFile) {
  form.value.filePath = response.data.url;
}

/**
 * 更新表单活动数据
 * @param data
 */
function handleActivityChange(data) {
  form.value.activityId = data.value
  form.value.activityName = data.activityName
  form.value.discountType = data.discountType;
}

/** 查合同位列表 */
function getList() {
  loading.value = true;
  listBusiness(proxy.addDateRange(queryParams.value, queryParams.value.dateRange)).then(response => {
    businessList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 获取部门数据 */
function initTreeData() {
  if (deptOptions.value == undefined) {
    deptTreeSelect().then(response => {
      deptOptions.value = response.data;
    })
  }
}

/** change事件 */
function deptChange(deptId) {
  form.value.nickName = undefined;
  initUserList(deptId)
}

/** 获取用户信息集合 */
function initUserList(deptId) {
  listUserList(deptId).then(response => {
    userList.value = response.data
  })
}

/** 打开表单时赋值操作  */
function approveUserChange(data) {
  form.value.nickName = data.nickName
  // form.value.approveDeptName = data.deptName
  form.value.approveUserId = data.value
  form.value.approveUserName = data.userName
  form.value.approveDeptId = data.deptId
}

/** 提交分派记录操作 */
function handleBusinessFormSubmit() {
  proxy.$refs["assignBusinessRef"].validate(valid => {
    if (valid) {
      form.value.type = 2;
      assignBusiness(form.value).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        resetAssignBusiness();
        assignBusinessOpen.value = false;
        getList();
      })
    }
  });
}

/** 取消分派操作 */
function cancelBusinessAssign() {
  assignBusinessOpen.value = false;
  // 重置分派表单
  resetAssignBusiness();
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset()
}

/** 重置分派对话框操作 */
function resetAssignBusiness() {
  form.value = {
    deptId: undefined,
    userId: undefined,
    nickName: undefined,
    userName: undefined
  }
}

/** 表单重置 */
function reset() {
  form.value = {
    phoneNumber: undefined,
    customerName: undefined,
    type: undefined,
    activityId: undefined,
    activityName: undefined,
    courseId: undefined,
    courseName: undefined,
    channelName: undefined,
    channelId: undefined,
    filePath: undefined,
    discountType: undefined,
    contractPrice: undefined,
    approveUserId: undefined,
    approveUserName: undefined,
    approveDeptId: undefined,
    nickName: undefined,
    remark: undefined
  };
  proxy.resetForm("contractRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.dateRange = undefined
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.businessId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  // 清空表单
  reset();
  initTreeData()
  getChannelList();
  open.value = true;
  title.value = "添加合同";
}

/** 修改按钮操作 */
function handleUpdate() {
  reset();
  getChannelList();
  const businessId = ids.value;
  getBusinessSummaryById(businessId).then(response => {
    form.value = response.data;
    listActivities(response.data.channelId).then(response => {
      activityList.value = response.data;
    })
    open.value = true;
    title.value = "修改合同";
  });
}

/** 查看合同按钮操作 */
function handleBusinessView(data) {
  router.push("/business/details/index/" + data.businessId + "/view")
}

/** 查看合同按钮操作 */
function handleBusinessFollow(data) {
  router.push("/business/details/index/" + data.businessId + "/follow")
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["contractRef"].validate(valid => {
    if (valid) {
      if (form.value.contractId != undefined) {
        updateContract(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addContract(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete() {
  const businessIds = ids.value;
  proxy.$modal.confirm('是否确认删除合同id为"' + businessIds + '"的数据项？').then(function () {
    return deleteBusiness(businessIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("tienchin/course/export", {
    ...queryParams.value
  }, `course_${new Date().getTime()}.xlsx`);
}

function getChannelList() {
  listChannels().then(response => {
    channelList.value = response.data;
    total.value = response.total;
    loading.value = false;
  });
}

function handleChannelChange(data) {
  // 修改channel后讲activityId置空
  form.value.channelName = data.channelName
  form.value.channelId = data.value
  form.value.activityId = undefined;
  listActivities(data.value).then(response => {
    activityList.value = response.data;
  });
}

/**
 * 顶部搜索栏
 */
function initOwnerList() {
  listOwnerList().then(response => {
    ownerList.value = response.data;
  })
}

initOwnerList();
getChannelList()
getList();
</script>
