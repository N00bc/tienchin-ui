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
      <el-form-item label="线索状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="请选择线索状态"
            clearable
            style="width: 200px">
          <el-option
              v-for="status in clue_status"
              :key="status.value"
              :label="status.label"
              :value="status.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="客户手机号" prop="phoneNumber">
        <el-input v-model="queryParams.phoneNumber" placeholder="请输入客户手机号" clearable/>
      </el-form-item>
      <el-form-item label="线索归属人" prop="owner">
        <el-select v-model="queryParams.owner"
                   placeholder="请选择线索归属人"
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
            v-hasPermi="['tienchin:clue:add']"
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
            v-hasPermi="['tienchin:clue:edit']"
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
            v-hasPermi="['tienchin:clue:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['tienchin:clue:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!--线索列表-->
    <el-table v-loading="loading" :data="clueList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="线索编号" align="center" prop="clueId" width="80" :show-overflow-tooltip="true"/>
      <el-table-column label="客户姓名" align="center" prop="customerName" width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="客户手机号" align="center" prop="phoneNumber" width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="线索状态" align="center" prop="status" width="120" :show-overflow-tooltip="true">
        <template #default="scope">
          <dict-tag :options="clue_status" :value="scope.row.status">
            {{ scope.row }}
          </dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="线索归属人" align="center" prop="owner" width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="渠道来源" align="center" prop="channelName" width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="创建人" align="center" prop="createBy" width="120" :show-overflow-tooltip="true"/>
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
          <el-button link type="primary" icon="View" @click="handleClueView(scope.row)"
                     v-hasPermi="['tienchin:clue:view']">查看
          </el-button>
          <el-button link v-if="scope.row.status == 1"
                     type="primary" icon="Pointer" @click="handleClueAssign(scope.row)"
                     v-hasPermi="['tienchin:clue:edit']">分配
          </el-button>
          <el-button link v-if="scope.row.owner == userStore.name &&(scope.row.status == 1 || scope.row.status == 2)"
                     type="primary" icon="DArrowRight"
                     @click="handleClueFollow(scope.row)"
                     v-hasPermi="['tienchin:clue:follow']">跟进
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
    <!-- 分配线索对话框 -->
    <el-dialog title="分配线索" v-model="assignClueOpen" width="600px" append-to-body>
      <el-form ref="assignClueRef" :model="assignForm" :rules="assignRules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <el-tree-select v-model="assignForm.deptId" :data="deptOptions"
                              :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id"
                              @change="deptChange"
                              placeholder="请选择归属部门" check-strictly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配给" prop="nickName">
              <el-select v-model="assignForm.nickName"
                         placeholder="请选择分配的对象"
                         clearable
                         @change="assignUserChange"
                         style="width: 240px">
                <el-option
                    v-for="user in userList"
                    :key="user.userId"
                    :value="{value:user.userId,nickName:user.nickName,deptId:user.deptId,userName:user.userName}"
                    :label="user.nickName"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleClueFormSubmit">确认分派</el-button>
          <el-button @click="cancelClueAssign">取消分派</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加或修改线索对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="clueRef" :model="form" :rules="rules" label-width="80px">
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
                  v-model="form.channelId"
                  placeholder="选择渠道"
                  clearable
                  @change="channelChange(form.channelId)"
                  style="width: 240px">
                <el-option
                    v-for="channel in channelList"
                    :key="channel.channelId"
                    :label="channel.channelName"
                    :value="channel.channelId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动名称">
              <el-select
                  v-model="form.activityId"
                  placeholder="选择活动"
                  clearable
                  style="width: 240px">
                <el-option
                    v-for="activity in activityList"
                    :key="activity.activityId"
                    :label="activity.activityName"
                    :value="activity.activityId"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group v-model="form.gender">
                <el-radio v-for="dict in sys_user_sex"
                          :key="dict.value"
                          :label="parseInt(dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄">
              <el-input-number v-model="form.age" min="0" max="80" placeholder="请输入客户年龄"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信号">
              <el-input v-model="form.wechat" placeholder="请输入客户微信号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="QQ号">
              <el-input v-model="form.qq" placeholder="请输入客户QQ号"/>
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

<script setup name="Clue">
import {
  addClue,
  assignClue,
  deleteClue,
  getClueSummaryById,
  listActivities,
  listChannels,
  listClue,
  listOwnerList,
  listUserList,
  updateClue
} from "@/api/tienchin/clue";
import {deptTreeSelect} from "@/api/system/user";
import useUserStore from "../../../store/modules/user";

const router = useRouter();
const {proxy} = getCurrentInstance();
const {sys_user_sex, clue_status} = proxy.useDict("sys_user_sex", "clue_status");


const clueList = ref([]);
const userStore = useUserStore();
const channelList = ref([]);
const userList = ref([]);
const ownerList = ref([]);
const activityList = ref([]);
const open = ref(false);
const assignClueOpen = ref(false);
const deptOptions = ref(undefined);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  assignForm: {},
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
    phoneNumber: [{required: true, message: "客户手机号不能为空", trigger: "blur"}]
  },
  assignRules: {
    deptId: [{required: true, message: "部门不能为空", trigger: "blur"}],
    nickName: [{required: true, message: "员工不能为空", trigger: "blur"}]
  }
});
// data中的对象需要到此处声明
const {queryParams, form, assignForm, rules, assignRules} = toRefs(data);

/** 查线索位列表 */
function getList() {
  loading.value = true;
  listClue(proxy.addDateRange(queryParams.value, queryParams.value.dateRange)).then(response => {
    clueList.value = response.rows;
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
  assignForm.value.nickName = undefined;
  initUserList(deptId)
}

/** 获取用户信息集合 */
function initUserList(deptId) {
  listUserList(deptId).then(response => {
    userList.value = response.data
  })
}

/** 打开表单时赋值操作  */
function assignUserChange(data) {
  assignForm.value.nickName = data.nickName
  assignForm.value.userId = data.value
  assignForm.value.userName = data.userName
  assignForm.value.deptId = data.deptId
}

/** 提交分派记录操作 */
function handleClueFormSubmit() {
  proxy.$refs["assignClueRef"].validate(valid => {
    if (valid) {
      assignForm.value.type = 1;
      assignClue(assignForm.value).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        resetAssignClue();
        assignClueOpen.value = false;
        getList();
      })
    }
  });
}

/** 取消分派操作 */
function cancelClueAssign() {
  assignClueOpen.value = false;
  // 重置分派表单
  resetAssignClue();
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset()
}

/** 重置分派对话框操作 */
function resetAssignClue() {
  assignForm.value = {
    deptId: undefined,
    userId: undefined,
    nickName: undefined,
    userName: undefined
  }
}

/** 表单重置 */
function reset() {
  form.value = {
    customerName: undefined,
    phoneNumber: undefined,
    channelId: undefined,
    activityId: undefined,
    gender: undefined,
    age: undefined,
    wechat: undefined,
    qq: undefined,
    remark: undefined,
    info: undefined
  };
  proxy.resetForm("clueRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.clueId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  // 清空表单
  reset();
  getChannelList();
  open.value = true;
  title.value = "添加线索";
}

/** 修改按钮操作 */
function handleUpdate() {
  reset();
  getChannelList();
  const clueId = ids.value;
  getClueSummaryById(clueId).then(response => {
    form.value = response.data;
    listActivities(response.data.channelId).then(response => {
      activityList.value = response.data;
    })
    open.value = true;
    title.value = "修改线索";
  });
}

/** 查看线索按钮操作 */
function handleClueView(data) {
  router.push("/clue/details/index/" + data.clueId + "/view")
}

/** 查看线索按钮操作 */
function handleClueFollow(data) {
  router.push("/clue/details/index/" + data.clueId + "/follow")
}

/** 分配按钮操作 */
function handleClueAssign(row) {
  // 显示对话框
  assignClueOpen.value = true;
  // 初始化部门信息
  assignForm.value.assignId = row.clueId
  initTreeData();
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["clueRef"].validate(valid => {
    if (valid) {
      if (form.value.clueId != undefined) {
        updateClue(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClue(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const clueIds = ids.value;
  proxy.$modal.confirm('是否确认删除线索id为"' + clueIds + '"的数据项？').then(function () {
    return deleteClue(clueIds);
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

function channelChange(channelId) {
  // 修改channel后讲activityId置空
  form.value.activityId = undefined;
  listActivities(channelId).then(response => {
    activityList.value = response.data;
  });
}

function initOwnerList() {
  listOwnerList().then(response => {
    ownerList.value = response.data;
  })
}

initOwnerList();
getChannelList()
getList();
</script>
