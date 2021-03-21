<template>
  <v-container v-if="USER">
    <v-btn @click="goUser" class="ma-2" text outlined>На главную</v-btn>
    <v-row v-if="USER.type == 'admin'">
      <v-col>
        <template>
          <v-tabs v-model="tab" center-active background-color="blue" dark>
            <v-tab> Бронирования </v-tab>
            <v-tab> Заявки </v-tab>
            <v-tab> Резиденты </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-row v-if="EVENTS">
                <v-col v-if="EVENTS.length > 0">
                  <v-card
                    class="ma-4"
                    v-for="(event, i) in EVENTS"
                    :key="i"
                    @click="openEvent(event)"
                    max-width="500"
                    max-height="300"
                    :class="{ end: compareDate(event.start) }"
                  >
                    <v-list-item three-line>
                      <v-list-item-avatar tile size="100" color="grey">
                        <v-img :src="event.room.image"></v-img
                      ></v-list-item-avatar>
                      <v-list-item-content align="left">
                        <div class="overline">
                          {{ convertDate(event.start) }}
                          <br />
                          {{ convertTime(event.start) }}
                        </div>

                        <v-list-item-title class="headline">
                          {{ event.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ event.room.type }}, {{ event.room.floor }} этаж
                          <br />
                          Организатор: {{ event.owner.name }}
                          <span v-if="event.owner.company"
                            >({{ event.owner.company }})</span
                          >
                          <br />
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
                <v-col v-else class="ma-4" align="center">
                  <h3>Пока нет запланированных переговоров</h3>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col>
                  <table>
                    <tr>
                      <th>ФИО</th>
                      <th>Резидент</th>
                      <th>Должность</th>
                      <th>Почта</th>
                      <th></th>
                    </tr>
                    <tr
                      align="center"
                      v-for="user in filterNoVerify(USERS)"
                      :key="user.id"
                    >
                      <td>{{ user.name }}</td>
                      <td>{{ user.company }}</td>
                      <td>{{ user.position }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <v-btn
                          @click="verifyUser(user.uid)"
                          color="primary"
                          text
                          outlined
                        >
                          Принять
                        </v-btn>
                      </td>
                    </tr>
                  </table>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-btn
                @click="createBool = true"
                class="ma-4"
                color="primary"
                text
                outlined
              >
                <v-icon>mdi-plus</v-icon> Добавить
              </v-btn>
              <v-card class="mx-auto ma-2" max-width="600">
                <v-list-item
                  two-line
                  v-for="(company, i) in COMPANIES"
                  :key="i"
                  @click="openCompany(company)"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ company.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Количество сотрудников: {{ company.users.length }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </template>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="USER.type == 'user'">
      <v-col cols="8" align="center" class="user-info">
        <h2>Вы не являетесь Администратором</h2>
        <h3>Доступ запрещён!</h3>
        <h3>
          <router-link to="/user">На главную страницу</router-link>
        </h3>
      </v-col>
    </v-row>
    <dialog-create-company :dialog="createBool" @close="closeCreate" />
    <dialog-open-company
      v-if="selectCompany"
      :dialog="openCompanyBool"
      :company="selectCompany"
      @close="closeOpenCompany"
    />
    <admin-event
      v-if="selectEvent"
      :event="selectEvent"
      :dialog="eventBool"
      @close="closeEvent"
    />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DialogCreateCompany from "@/components/Dialogs/CreateCompany.vue";
import DialogOpenCompany from "@/components/Dialogs/OpenCompany.vue";
import AdminEvent from "@/components/Dialogs/AdminEvent.vue";

export default {
  data() {
    return {
      tab: 0,
      createBool: false,
      openCompanyBool: false,
      selectCompany: null,
      eventBool: false,
      selectEvent: null,
    };
  },
  components: {
    DialogCreateCompany,
    DialogOpenCompany,
    AdminEvent,
  },
  computed: {
    ...mapGetters(["USER"]),
    ...mapGetters(["USERS"]),
    ...mapGetters(["EVENTS"]),
    ...mapGetters(["COMPANIES"]),
  },
  mounted() {
    if (!this.USER) {
      this.$store.dispatch("GET_USER");
    }
    if (!this.USERS) {
      this.$store.dispatch("GET_USERS");
    }
    if (!this.EVENTS) {
      this.$store.dispatch("GET_EVENTS");
    }
    if (!this.COMPANIES) {
      this.$store.dispatch("GET_COMPANIES");
    }
  },
  methods: {
    openEvent(event) {
      this.selectEvent = event;
      this.eventBool = true;
    },
    closeEvent() {
      this.eventBool = false;
      this.selectEvent = null;
    },
    goUser() {
      this.$router.push("/user");
    },
    closeCreate() {
      this.createBool = false;
    },
    closeOpenCompany() {
      this.openCompanyBool = false;
      this.selectCompany = null;
    },
    filterNoVerify(users) {
      return users.filter((user) => {
        return !user.verify;
      });
    },
    compareDate(timestamp) {
      let date = new Date(timestamp.seconds * 1000);
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();

      let today = new Date();
      let tday = today.getDate();
      let tmonth = today.getMonth();
      let tyear = today.getFullYear();

      if (tyear <= year && tmonth <= month && tday <= day) {
        return false;
      } else {
        return true;
      }
    },
    convertTime(timestamp) {
      let date = new Date(timestamp.seconds * 1000);
      let hh = date.getHours();
      if (String(hh).length == 1) {
        hh = "0" + String(hh);
      }
      let mm = date.getMinutes();
      if (String(mm).length == 1) {
        mm = "0" + String(mm);
      }
      return hh + ":" + mm;
    },
    convertDate(timestamp) {
      let date = new Date(timestamp.seconds * 1000);
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();

      let hh = date.getHours();
      if (String(hh).length == 1) {
        hh = "0" + String(hh);
      }
      let mm = date.getMinutes();
      if (String(mm).length == 1) {
        mm = "0" + String(mm);
      }

      const dayName = [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
      ][date.getDay()];

      if (String(day).length == 1) {
        day = "0" + day;
      }
      month = Number(month) + 1;
      if (String(month).length == 1) {
        month = "0" + month;
      }
      return day + "." + month + "." + year + " (" + dayName + ")";
    },
    verifyUser(uid) {
      this.$store.dispatch("VERIFY_USER", uid);
      this.$store.dispatch("GET_USERS");
    },
    openCompany(company) {
      this.openCompanyBool = true;
      this.selectCompany = company;
    },
  },
};
</script>

<style scoped>
.user-info {
  border: 1px solid grey;
  border-radius: 5px;
}
.user-info a {
  text-decoration: none;
}
.end {
  opacity: 0.3;
}
table {
  border-collapse: collapse;
  border: 1px solid grey;
  table-layout: fixed;
  width: 100%;
}
th,
td {
  border: 1px solid grey;
  width: 2%; /* для safari 6 */
}
</style>