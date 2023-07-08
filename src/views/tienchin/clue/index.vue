<template>
  <div class="app-container">
    <!--顶部搜索区-->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="线索名称" prop="courseName">
        <el-input
            v-model="queryParams.courseName"
            placeholder="请输入线索名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="线索类型" prop="type">
        <el-select
            v-model="queryParams.type"
            placeholder="请选择线索类型"
            clearable
            style="width: 200px">
          <el-option
              v-for="type in course_type"
              :key="type.value"
              :label="type.label"
              :value="type.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="适用人群" prop="apply">
        <el-select
            v-model="queryParams.apply"
            placeholder="请选择适用人群"
            clearable
            style="width: 200px">
          <el-option
              v-for="applyTo in course_apply"
              :key="applyTo.value"
              :label="applyTo.label"
              :value="parseInt(applyTo.value)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="最低价格" prop="minPrice">
        <el-input-number placeholder="最低价格" @keyup.enter="handleQuery" clearable v-model="queryParams.minPrice"
                         :precision="2" :step="100" :min="0"/>
      </el-form-item>
      <el-form-item label="最高价格" prop="maxPrice">
        <el-input-number placeholder="最高价格" @keyup.enter="handleQuery" clearable v-model="queryParams.maxPrice"
                         :precision="2" :step="100" :min="0"/>
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
            v-hasPermi="['tienchin:course:add']"
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
            v-hasPermi="['tienchin:course:edit']"
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
            v-hasPermi="['tienchin:course:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['tienchin:course:export']"
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
      <el-table-column label="线索类型" align="center" prop="type" width="120" :show-overflow-tooltip="true">
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['tienchin:clue:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Pointer" @click="handleUpdate(scope.row)"
                     v-hasPermi="['tienchin:clue:edit']">分配
          </el-button>
          <el-button link type="primary" icon="DArrowRight" @click="handleDelete(scope.row)"
                     v-hasPermi="['tienchin:clue:remove']">跟进
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
                          :label="dict.value">
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
        <el-form-item label="线索简介">
          <el-input v-model="form.info" placeholder="请输入线索简介"></el-input>
        </el-form-item>
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
import {addCourse, deleteCourse, getCourse, listCourse, updateCourse} from "@/api/tienchin/course";
import {listActivities, listChannels, addClue, listClue} from "@/api/tienchin/clue";

const {proxy} = getCurrentInstance();
const {
  sys_user_sex, clue_status
} = proxy.useDict("sys_user_sex", "clue_status");

const clueList = ref([]);
const channelList = ref([]);
const activityList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    courseName: undefined,
    apply: undefined,
    type: undefined,
    minPrice: undefined,
    maxPrice: undefined
  },
  rules: {
    customerName: [{required: true, message: "客户姓名不能为空", trigger: "blur"}],
    phoneNumber: [{required: true, message: "客户手机号不能为空", trigger: "blur"}]
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查线索位列表 */
function getList() {
  loading.value = true;
  listClue(queryParams.value).then(response => {
    clueList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
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
  ids.value = selection.map(item => item.courseId);
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
function handleUpdate(row) {
  reset();
  getChannelList();
  const courseId = row.courseId || ids.value;
  getCourse(courseId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改线索";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["clueRef"].validate(valid => {
    if (valid) {
      if (form.value.courseId != undefined) {
        updateCourse(form.value).then(response => {
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
  const courseIds = row.courseId || ids.value;
  proxy.$modal.confirm('是否确认删除线索id为"' + courseIds + '"的数据项？').then(function () {
    return deleteCourse(courseIds);
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

getList();
</script>
