<template>
  <div>
    <el-row gutter="16">
      <el-col :span="18">
        <el-row>
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <h2>{{ clueDetail.customerName }} / {{ clueDetail.clueId }}</h2>
              </div>
            </template>
            <div>
              <el-row>
                <el-col :span="8">
                  <div style="font-weight: bold">线索创建时间</div>
                  <div style="color: #8392a6">{{ clueDetail.createTime }}</div>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold">客户手机号</div>
                  <div style="color: #8392a6">{{ clueDetail.phoneNumber }}</div>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold">渠道来源</div>
                  <div style="color: #8392a6">{{ clueDetail.channelName }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div style="font-weight: bold">线索分配人</div>
                  <div style="color: #8392a6">{{ clueDetail.allocator }}</div>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold">线索归属时间</div>
                  <div style="color: #8392a6">{{ clueDetail.belongTime }}</div>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold">渠道归属人</div>
                  <div style="color: #8392a6">{{ clueDetail.owner }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <div style="font-weight: bold">所属促销活动信息</div>
                  <div style="color: #8392a6">{{ clueDetail.activityName }}/{{ clueDetail.activityInfo }}</div>
                </el-col>
                <el-col :span="8">
                  <el-button type="danger" :disabled="isFieldDisabledEdit" @click="showInvalidateDialog">无效线索
                  </el-button>
                  <el-button type="primary" :disabled="isFieldDisabledEdit">转为商机</el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>线索跟进</span>
              </div>
            </template>
            <div>
              <el-row gutter="24">
                <el-col :span="8">
                  <div style="font-weight: bold;">客户姓名</div>
                  <div>
                    <el-input :disabled="isFieldDisabledEdit" v-model="clueDetail.customerName"></el-input>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold;">客户性别</div>
                  <div>
                    <el-select v-model="clueDetail.gender" :disabled="isFieldDisabledEdit" placeholder="请选择客户性别">
                      <el-option
                          v-for="gender in sys_user_sex"
                          :key="gender.value"
                          :label="gender.label"
                          :value="parseInt(gender.value)"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold;">客户年龄</div>
                  <el-input-number v-model="clueDetail.age" :disabled="isFieldDisabledEdit" placeholder="请输入客户年龄"
                                   :step="1"
                                   :min="6" :max="100"/>
                </el-col>
              </el-row>
              <el-row gutter="24">
                <el-col :span="8">
                  <div style="font-weight: bold">客户微信号</div>
                  <el-input :disabled="isFieldDisabledEdit" v-model="clueDetail.wechat" placeholder="请输入用户微信号"/>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold">客户QQ号</div>
                  <el-input :disabled="isFieldDisabledEdit" v-model="clueDetail.qq" placeholder="请输入用户QQ号"/>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold">客户手机号</div>
                  <el-input :disabled="isFieldDisabledEdit" v-model="clueDetail.phoneNumber" placeholder="请输入用户手机号"/>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="font-weight: bold">意向等级</div>
                  <div>
                    <el-radio-group v-model="clueDetail.level" :disabled="isFieldDisabledEdit">
                      <el-radio :label="parseInt(level.value)" :key="index" v-for="(level,index) in clue_level">{{
                          level.label
                        }}
                      </el-radio>
                    </el-radio-group>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="font-weight: bold">课程分类</div>
                  <div>
                    <el-radio-group v-model="clueDetail.subject" :disabled="isFieldDisabledEdit">
                      <el-radio :label="parseInt(course.value)" :key="index" v-for="(course,index) in course_type">{{
                          course.label
                        }}
                      </el-radio>
                    </el-radio-group>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="font-weight: bold">跟进记录</div>
                  <div>
                    <el-input :disabled="isFieldDisabledEdit" type="textarea" v-model="clueDetail.record" :rows="5"
                              placeholder="请输入跟进记录"/>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="font-weight: bold">下次跟进时间</div>
                  <div>
                    <!-- value format 值的格式 format 展示格式 -->
                    <el-date-picker v-model="clueDetail.nextTime" type="datetime" placeholder="请选择下次跟进时间"
                                    :disabled="isFieldDisabledEdit" clearable value-format="YYYY-MM-DD hh:mm:ss"
                                    format="YYYY-MM-DD hh:mm:ss"/>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div style="display: flex;justify-content: flex-end">
                    <el-button type="primary" :disabled="isFieldDisabledEdit" @click="handleClueDetailSubmit">提交
                    </el-button>
                    <el-button type="danger" @click="back2index">返回</el-button>
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
              <span>线索跟进记录</span>
            </div>
          </template>
          <div v-for="(record,index) in recordList" :key="index" style="margin-bottom: 20px">
            <div>
              <span style="font-weight: bold;">{{ record.createBy }}:</span>
              <span>{{ record.info }}</span>
            </div>
            <span style="font-size:16px;color: #8392a6">{{ record.createTime }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 无效线索弹框   -->
    <el-dialog title="无效线索" v-model="invalidateClueDialog" width="500px" append-to-body>
      <el-form ref="invalidateClueRef" :model="invalidateClueForm" :rules="invalidateClueFormRules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="失效原因" prop="reason">
              <el-select v-model="invalidateClueForm.reason" placeholder="请选择失效原因">
                <el-option
                    v-for="reason in clue_invalidate"
                    :key="reason.value"
                    :label="reason.label"
                    :value="reason.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="invalidateClueForm.remark" :rows="2" type="textarea" placeholder="备注"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleInvalidateClueForm">确 定</el-button>
          <el-button @click="cancelInvalidateClueDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ClueDetails">
import {getClueById, updateClueDetails, getFollowRecordByClueId, invalidClue} from "@/api/tienchin/clue"
import {getCurrentInstance, onMounted, reactive} from "vue";

const router = useRouter()
const {proxy} = getCurrentInstance()
const {
  sys_user_sex,
  clue_level,
  course_type,
  clue_invalidate
} = proxy.useDict("sys_user_sex", "clue_level", "course_type", "clue_invalidate");
// 线索详情对象
const data = reactive({
  invalidateClueForm: {},
  invalidateClueFormRules: {
    reason: [{required: true, message: "失效原因不能为空", trigger: "blur"}],
    remark: [{required: true, message: "备注不能为空", trigger: "blur"}]
  }
})

const {invalidateClueForm, invalidateClueFormRules} = toRefs(data)

const type = ref("")
const clueDetail = ref({})
const recordList = ref([])
const invalidateClueDialog = ref(false);
const isFieldDisabledEdit = ref(false);

onMounted(() => {
  const clueId = proxy.$route.params && proxy.$route.params.clueId
  type.value = proxy.$route.params && proxy.$route.params.type
  isFieldDisabledEdit.value = type.value == 'view'
  // 根据线索Id获取跟进记录
  initFollowRecordByClueId(clueId)
  // 根据线索Id获取线索详情
  initClueDetail(clueId)
})

/** 获取线索id的详细信息 */
function initClueDetail(clueId) {
  getClueById(clueId).then(response => {
    clueDetail.value = response.data;
    // 如果是'view'或4 那么无法编辑
    isFieldDisabledEdit.value = isFieldDisabledEdit.value || clueDetail.value.status == 4;
  })
}

/** 返回index视图 */
function back2index() {
  // 回到上一个页面
  router.go(-1);
}

/** 提交更改后的线索详情 */
function handleClueDetailSubmit() {
  updateClueDetails(clueDetail.value).then(response => {
    router.go(-1)
  })
}

/** 根据clueId获取跟进信息 */
function initFollowRecordByClueId(clueId) {
  getFollowRecordByClueId(clueId).then(response => {
    recordList.value = response.data
  })
}

/** 展示无效线索dialog */
function showInvalidateDialog() {
  invalidateClueDialog.value = true;
  resetInvalidateClueForm();
}

/** 提交`无效线索`原因 */
function handleInvalidateClueForm() {
  proxy.$refs["invalidateClueRef"].validate(valid => {
    if (valid) {
      // 拼接record
      clueDetail.value.record = invalidateClueForm.value.reason + ":" + (invalidateClueForm.value.remark ? invalidateClueForm.value.remark : '')
      invalidClue(clueDetail.value).then(response => {
        invalidateClueDialog.value = false;
        router.go(-1)
      })
    }
  })
}

/** 关闭`无效线索`dialog */
function cancelInvalidateClueDialog() {
  resetInvalidateClueForm();
  invalidateClueDialog.value = false;
}

/** 清除表单数据 */
function resetInvalidateClueForm() {
  invalidateClueForm.value = {
    reason: undefined,
    remark: undefined
  }
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
