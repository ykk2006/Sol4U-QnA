<template>
  <v-app>
    <div id="pageTitle">Modify Channel</div>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <h1 class="head">Modify Channel</h1>
      </v-layout>
    </v-container>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <v-flex xs12 ma-5>
          <v-card>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-col cols="12" sm="12">
                <label>Code</label>
                <v-text-field
                  v-model="code"
                  type="number"
                  :counter="10"
                  :rules="codeRules"
                  solo
                  label="Code"
                  required
                  clearable
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12">
                <label>Title</label>
                <v-text-field
                  v-model="title"
                  :counter="20"
                  :rules="titleRules"
                  solo
                  label="수정할 방 제목을 입력하세요."
                  required
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12">
                <label>Description</label>
                <v-textarea
                  v-model="description"
                  :counter="200"
                  :rules="descriptionRules"
                  solo
                  label="수정할 질문방 설명을 적어주세요.(10글자 이상)"
                  required
                  clearable
                ></v-textarea>
              </v-col>
              <v-row style="margin:2px;">
                <v-col cols="12" sm="6">
                  <label>Using time</label>
                  <v-select v-model="end" :items="items" label="현재 시간 기준으로 수정할 시간 정해주세요" solo></v-select>
                </v-col>
                <v-col cols="12" sm="6" style="margin-top:15px;">
                  <div v-if="end==='기타'">
                    <v-text-field
                      v-model="end2"
                      type="number"
                      :counter="5"
                      label="only type number"
                      clearable
                    />
                  </div>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-btn class="ma-2" outlined color="indigo" @click="modifyChannel()">수정</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import Vue from "vue";
import FirebaseService from "../services/FirebaseService";
import { mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      valid: true,
      code: "",
      title: "",
      description: "",
      end: "",
      end2: "",
      docId: "",
      codeRules: [v => !!v || "Code is required"],
      titleRules: [
        v => !!v || "title is required",
        v => (v && v.length >= 4) || "title is too short",
        v => (v && v.length <= 30) || "title is to long"
      ],
      descriptionRules: [
        v => (v && v.length >= 10) || "description is too short"
      ],
      items: ["+ 1hours", "+ 2hours", "+ 3hours", "+ 4hours", "기타"]
    };
  },
  async mounted() {
    this.code = this.$route.params.code;
    this.title = this.$route.params.title;
    this.description = this.$route.params.description;
    this.docId = this.$route.params.docId;
  },
  computed: {
    getIsLogin: function() {
      return this.$store.getters.getIsLogin;
    },
    getUserData: function() {
      return this.$store.getters.getUserData;
    }
  },
  methods: {
    async modifyChannel() {
      let plustime = "";
      let endtime = new Date();
      if (this.end == "+ 1hours") {
        plustime = 1;
      } else if (this.end == "+ 2hours") {
        plustime = 2;
      } else if (this.end == "+ 3hours") {
        plustime = 3;
      } else if (this.end == "+ 4hours") {
        plustime = 4;
      } else {
        plustime = this.end2;
      }

      endtime.setHours(endtime.getHours() + plustime);
      if (this.$refs.form.validate()) {
        await FirebaseService.changChannelDetail(
          this.docId,
          this.title,
          this.description,
          new Date(),
          endtime
        );
        const DocId = await FirebaseService.getDocByChannelCode(this.code);
        await this.$router.push("/dashboard");
      }
    }
  },
  watch: {
    dialog: function() {
      if (this.$refs.form !== undefined) {
        this.$refs.form.reset();
      }
    }
  }
};
</script>

<style>
#pageTitle {
  height: 9%;
  background-color: rgb(51, 150, 244);
  padding: 2%;
  font-size: 1.1em;
}
</style>
