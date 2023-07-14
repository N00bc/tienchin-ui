<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="18">
        <el-row>
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>客户资料/{{ businessDetail.customerName }}</span>
              </div>
            </template>
            <div>
              <el-row :gutter="36">
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">客户姓名</div>
                  <el-input :disabled="isFieldDisabledEdit" v-model="businessDetail.customerName"></el-input>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">手机号码</div>
                  <el-input :disabled="isFieldDisabledEdit" v-model="businessDetail.phoneNumber"></el-input>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">职业</div>
                  <el-select v-model="businessDetail.occupation" style="width:100%" placeholder="请选择"
                             :disabled="isFieldDisabledEdit">
                    <el-option
                        v-for="dict in business_occupation"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.label"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="36">
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">学历</div>
                  <el-select v-model="businessDetail.education" style="width:100%" placeholder="请选择"
                             :disabled="isFieldDisabledEdit">
                    <el-option
                        v-for="dict in business_education"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.label"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">所在地区</div>
                  <el-cascader
                      :disabled="isFieldDisabledEdit"
                      style="width:100%"
                      :options="pcaTextArr"
                      v-model="businessDetail.address">
                  </el-cascader>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">微信号码</div>
                  <el-input :disabled="isFieldDisabledEdit" v-model="businessDetail.wechat"></el-input>
                </el-col>
              </el-row>
              <el-row :gutter=36>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">年龄</div>
                  <el-input-number :disabled="isFieldDisabledEdit" style="width:100%" v-model="businessDetail.age"
                                   :min="6"
                                   :max="99"/>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">QQ</div>
                  <el-input :disabled="isFieldDisabledEdit" v-model="businessDetail.qq"></el-input>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">性别</div>
                  <el-select v-model="businessDetail.gender" style="width:100%" placeholder="请选择"
                             :disabled="isFieldDisabledEdit">
                    <el-option
                        v-for="dict in sys_user_sex"
                        :key="dict.value"
                        :label="dict.label"
                        :value="parseInt(dict.value)"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="36">
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">身高</div>
                  <el-input-number :disabled="isFieldDisabledEdit" style="width:100%" v-model="businessDetail.height"
                                   :precision="2" :min="60" :max="250"/>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">体重</div>
                  <el-input-number :disabled="isFieldDisabledEdit" style="width:100%" v-model="businessDetail.weight"
                                   :precision="2" :min="30" :max="250"/>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">备注</div>
                  <el-input :disabled="isFieldDisabledEdit" v-model="businessDetail.remark"></el-input>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>客户意向</span>
              </div>
            </template>
            <div>
              <el-row :gutter="36">
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">意向类型</div>
                  <div>
                    <el-select
                        v-model="businessDetail.type"
                        placeholder="课程分类"
                        clearable
                        @change="courseTypeChange"
                        :disabled="isFieldDisabledEdit"
                        style="width: 100%"
                    >
                      <el-option
                          v-for="type in course_type"
                          :key="type.value"
                          :label="type.label"
                          :value="type.value"
                      />
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">意向课程</div>
                  <div>
                    <el-select v-model="businessDetail.courseId" style="width: 100%" placeholder="请选择"
                               :disabled="isFieldDisabledEdit">
                      <el-option
                          v-for="course in courseList"
                          :key="course.courseId"
                          :label="course.name"
                          :value="course.courseId"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">健身原因</div>
                  <div>
                    <el-input :disabled="isFieldDisabledEdit" v-model="businessDetail.reason"></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="36">
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">每周健身时间</div>
                  <div>
                    <el-input-number :disabled="isFieldDisabledEdit" style="width:100%" v-model="businessDetail.hours"
                                     :min="6" :max="99"/>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">意向金额</div>
                  <div>
                    <el-input-number :disabled="isFieldDisabledEdit" style="width:100%" v-model="businessDetail.money"
                                     :precision="2" :min="0" :max="99999999"/>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">其他意向</div>
                  <div>
                    <el-input :disabled="isFieldDisabledEdit" v-model="businessDetail.otherIntention"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>沟通记录</span>
              </div>
            </template>
            <div>
              <el-row :gutter="36">
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">跟进状态</div>
                  <div>
                    <el-select v-model="businessDetail.status" style="width: 100%" placeholder="请选择"
                               :disabled="isFieldDisabledEdit">
                      <el-option
                          v-for="dict in business_status"
                          :key="dict.value"
                          :label="dict.label"
                          :disabled="isFieldDisabledEdit"
                          :value="parseInt(dict.value)"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">下次跟进时间</div>
                  <div>
                    <el-date-picker
                        style="width:100%"
                        v-model="businessDetail.nextTime"
                        type="datetime"
                        :disabled="isFieldDisabledEdit"
                        placeholder="请选择时间"
                        format="YYYY/MM/DD HH:mm:ss"
                    />
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="font-style: italic;font-weight: bold">沟通重点</div>
                  <div>
                    <el-select v-model="businessDetail.record1" style="width: 100%" placeholder="请选择"
                               :disabled="isFieldDisabledEdit">
                      <el-option
                          v-for="dict in business_focus"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.label"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="36">
                <el-col :span="24">
                  <div style="font-style: italic;font-weight: bold">沟通纪要</div>
                  <div>
                    <el-input :disabled="isFieldDisabledEdit" v-model="businessDetail.record2"></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div style="display: flex;justify-content: flex-end">
                    <el-button @click="back2index">返回</el-button>
                    <el-button :disabled="isFieldDisabledEdit" type="primary" @click="handleBusinessDetailSubmit">保存
                    </el-button>
                    <el-button @click="back2index" type="success" :disabled="isFieldDisabledEdit">转为成交客户</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>商机跟进记录</span>
            </div>
          </template>
          <div>
            <div v-for="(record,index) in recordList" :key="index" style="margin-bottom: 20px">
              <div>
                <span style="font-weight: bold;font-style: italic">{{ record.createBy }}：</span>
                <span>{{ record.info }}</span>
              </div>
              <span style="font-size: 12px;color: #8392a6">{{ parseTime(record.createTime) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="BusinessDetails">
import {pcaTextArr} from "element-china-area-data";
import {
  getBusinessDetailsById,
  getCourseByCourseType,
  getFollowRecordByBusinessId,
  updateBusinessDetails
} from "@/api/tienchin/business"
import {getCurrentInstance, onMounted, reactive} from "vue";

const router = useRouter()
const {proxy} = getCurrentInstance()
const {
  sys_user_sex,
  business_level,
  course_type,
  business_invalidate,
  business_occupation,
  business_status,
  business_focus,
  business_education,
} = proxy.useDict("sys_user_sex", "business_level", "course_type", "business_invalidate", "business_occupation", "business_status", "business_focus", "business_education");
// 商机详情对象
const data = reactive({
  invalidateBusinessForm: {},
  invalidateBusinessFormRules: {
    reason: [{required: true, message: "失效原因不能为空", trigger: "blur"}],
    remark: [{required: true, message: "备注不能为空", trigger: "blur"}]
  }
})

const type = ref("")
const businessDetail = ref({})
const recordList = ref([])
const courseList = ref([])
const isFieldDisabledEdit = ref(false);

onMounted(() => {
  const businessId = proxy.$route.params && proxy.$route.params.businessId
  type.value = proxy.$route.params && proxy.$route.params.type
  isFieldDisabledEdit.value = type.value == 'view'
  // 根据商机Id获取跟进记录
  initFollowRecordByBusinessId(businessId)
  // 根据商机Id获取商机详情
  initBusinessDetail(businessId)
})

/** 获取商机id的详细信息 */
function initBusinessDetail(businessId) {
  getBusinessDetailsById(businessId).then(response => {
    businessDetail.value = response.data;
    businessDetail.value.address = [];
    businessDetail.value.address[0] = response.data.province
    businessDetail.value.address[1] = response.data.city
    businessDetail.value.address[2] = response.data.area
    // 如果是'view'或4 那么无法编辑
    isFieldDisabledEdit.value = isFieldDisabledEdit.value || businessDetail.value.status == 4;
  })
}

/** 返回index视图 */
function back2index() {
  // 回到上一个页面
  router.go(-1);
}

/**
 * 课程类型下拉框发生变化时触发，根据课程类型id查找对应的课程
 * @param type
 */
function courseTypeChange(type) {
  getCourseByCourseType(type).then(response => {
    courseList.value = response.data;
  })
}

/** 提交更改后的商机详情 */
function handleBusinessDetailSubmit() {
  if (businessDetail.value.record1 && businessDetail.value.record2) {
    businessDetail.value.info = "[" + businessDetail.value.record1 + "]" + businessDetail.value.record2;
  }
  businessDetail.value.province = businessDetail.value.address[0]
  businessDetail.value.city = businessDetail.value.address[1]
  businessDetail.value.area = businessDetail.value.address[2]
  updateBusinessDetails(businessDetail.value).then(response => {
    router.go(-1)
  })
}

/** 根据businessId获取跟进信息 */
function initFollowRecordByBusinessId(businessId) {
  getFollowRecordByBusinessId(businessId).then(response => {
    recordList.value = response.data
  })
}


</script>

<style scoped>
.box-card {
  margin-top: 10px;
  width: 100%;
}

.el-row {
  margin-bottom: 30px;
}

.el-row:last-child {
  margin-bottom: 10px;
}
</style>
