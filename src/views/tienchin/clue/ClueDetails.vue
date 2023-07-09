<template>
  <div>
    <el-row>
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
                  <el-button type="danger" :disabled="type == 'view'">无效线索</el-button>
                  <el-button type="primary" :disabled="type == 'view'">转为商机</el-button>
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
                    <el-input :disabled="type == 'view'" v-model="clueDetail.customerName"></el-input>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold;">客户性别</div>
                  <div>
                    <el-select v-model="clueDetail.gender" :disabled="type == 'view'" placeholder="请选择客户性别">
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
                  <el-input-number v-model="clueDetail.age" :disabled="type == 'view'" placeholder="请输入客户年龄" :step="1"
                                   :min="6" :max="100"/>
                </el-col>
              </el-row>
              <el-row gutter="24">
                <el-col :span="8">
                  <div style="font-weight: bold">客户微信号</div>
                  <el-input :disabled="type == 'view'" v-model="clueDetail.wechat" placeholder="请输入用户微信号"/>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold">客户QQ号</div>
                  <el-input :disabled="type == 'view'" v-model="clueDetail.qq" placeholder="请输入用户QQ号"/>
                </el-col>
                <el-col :span="8">
                  <div style="font-weight: bold">客户手机号</div>
                  <el-input :disabled="type == 'view'" v-model="clueDetail.phoneNumber" placeholder="请输入用户手机号"/>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="font-weight: bold">意向等级</div>
                  <div>
                    <el-radio-group v-model="clueDetail.level" :disabled="type == 'view'">
                      <el-radio :label="level.value" :key="index" v-for="(level,index) in clue_level">{{
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
                    <el-radio-group v-model="clueDetail.subject" :disabled="type == 'view'">
                      <el-radio :label="course.value" :key="index" v-for="(course,index) in course_type">{{
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
                    <el-input :disabled="type == 'view'" type="textarea" v-model="clueDetail.record" :rows="5"
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
                                    :disabled="type == 'view'" clearable value-format="YYYY-MM-DD hh:mm:ss"
                                    format="YYYY-MM-DD hh:mm:ss"/>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div style="display: flex;justify-content: flex-end">
                    <el-button type="primary" :disabled="type == 'view'">提交</el-button>
                    <el-button type="danger" @click="back2index">返回</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </div>
</template>

<script setup name="ClueDetails">
import {getClueById} from "@/api/tienchin/clue"
import {getCurrentInstance, onMounted, reactive} from "vue";

const router = userRouter()
const {proxy} = getCurrentInstance()
const {sys_user_sex, clue_level, course_type} = proxy.useDict("sys_user_sex", "clue_level", "course_type");
// 线索详情对象
const data = reactive({
  clueDetail: {},
  name: '张三'
})

const type = ref("")

onMounted(() => {
  const clueId = proxy.$route.params && proxy.$route.params.clueId
  handleClueDetail(clueId)
  type.value = proxy.$route.params && proxy.$route.params.type
})
/**
 * 跳转到页面的请求格式/clue/details/index/{clueId}/view
 */
const {name, clueDetail} = toRefs(data)

/** 获取线索id的详细信息 */
function handleClueDetail(clueId) {
  getClueById(clueId).then(response => {
    clueDetail.value = response.data;
  })
}

/** 返回index视图 */
function back2index() {
  // 回到上一个页面
  router.go(-1);
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
